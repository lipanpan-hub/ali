import {DescribeInstanceBillRequest, QueryBillOverviewRequest} from '@alicloud/bssopenapi20171214'
import Table from 'cli-table3'
import {writeFileSync} from 'node:fs'
import {join} from 'node:path'

import {createBssClient} from '../client/client.js'
import {createRuntime} from '../client/runtime.js'
import {wrap} from '../client/wrap.js'

export interface OverviewItem {
  currency: string
  outstandingAmount: number
  pretaxAmount: number
  pretaxGrossAmount: number
  productCode: string
  productName: string
  subscriptionType: string
}

export interface InstanceBillItem {
  currency: string
  instanceID: string
  nickName: string
  pretaxAmount: number
  pretaxGrossAmount: number
  productCode: string
  productName: string
  region: string
  subscriptionType: string
}

function fmt(n: number): string {
  return n.toFixed(2)
}

export class BillManager {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private client: any = null

  constructor() {
    const c = createBssClient()
    if (!c) return
    this.client = c.client
  }

  // #region 账单分析
  async analyze(billingCycle: string): Promise<void> {
    // 按产品维度统计应付金额占比与排名
    const items = await this.getOverview(billingCycle)
    if (items.length === 0) {
      console.log(`账期 ${billingCycle} 没有账单数据`)
      return
    }

    const currency = items[0].currency || 'CNY'
    const total = items.reduce((sum, i) => sum + i.pretaxAmount, 0)
    const ranked = [...items].sort((a, b) => b.pretaxAmount - a.pretaxAmount)

    const table = new Table({head: ['排名', '产品', '应付金额', '占比']})
    let rank = 0
    for (const i of ranked) {
      rank += 1
      const percent = total === 0 ? 0 : (i.pretaxAmount / total) * 100
      table.push([String(rank), `${i.productName}(${i.productCode})`, fmt(i.pretaxAmount), `${percent.toFixed(1)}%`])
    }

    console.log(`账期: ${billingCycle} | 币种: ${currency}`)
    console.log(table.toString())
    console.log(`产品总数: ${items.length} | 合计应付金额: ${fmt(total)}`)
    if (ranked[0]) console.log(`最大支出: ${ranked[0].productName} (${fmt(ranked[0].pretaxAmount)})`)
  }
  // #endregion

  // #region 下载明细账单
  async download(billingCycle: string, format: 'csv' | 'json'): Promise<void> {
    // 将实例明细账单导出为 CSV 或 JSON 文件到当前目录
    const items = await this.getInstanceBills(billingCycle)
    if (items.length === 0) {
      console.log(`账期 ${billingCycle} 没有可下载的账单数据`)
      return
    }

    const filePath = join(process.cwd(), `bill-${billingCycle}.${format}`)

    if (format === 'json') {
      writeFileSync(filePath, JSON.stringify(items, null, 2), 'utf8')
    } else {
      const headers = ['实例ID', '昵称', '产品代码', '产品名称', '地域', '订阅类型', '原始金额', '应付金额', '币种']
      const rows = items.map((i) =>
        [i.instanceID, i.nickName, i.productCode, i.productName, i.region, i.subscriptionType, i.pretaxGrossAmount, i.pretaxAmount, i.currency]
          .map((v) => `"${String(v).replaceAll('"', '""')}"`)
          .join(','),
      )
      writeFileSync(filePath, [headers.join(','), ...rows].join('\n'), 'utf8')
    }

    console.log(`已下载 ${items.length} 条账单到: ${filePath}`)
  }
  // #endregion

  // #region 实例明细账单（NextToken 分页拉取全部）
  async getInstanceBills(billingCycle: string): Promise<InstanceBillItem[]> {
    if (!this.client) return []

    const all: InstanceBillItem[] = []
    let nextToken: string | undefined

    const res = await wrap('查询实例账单', async () => {
      do {
        const request = new DescribeInstanceBillRequest({billingCycle, maxResults: 300, nextToken})
         
        const page = await this.client.describeInstanceBillWithOptions(request, createRuntime())
        const items = page.body?.data?.items ?? []
        for (const i of items) {
          all.push({
            currency: i.currency ?? '',
            instanceID: i.instanceID ?? '',
            nickName: i.nickName ?? '',
            pretaxAmount: Number(i.pretaxAmount ?? 0),
            pretaxGrossAmount: Number(i.pretaxGrossAmount ?? 0),
            productCode: i.productCode ?? '',
            productName: i.productName ?? '',
            region: i.region ?? '',
            subscriptionType: i.subscriptionType ?? '',
          })
        }

        nextToken = page.body?.data?.nextToken || undefined
      } while (nextToken)

      return all
    })

    return res ?? []
  }
  // #endregion

  // #region 账单总览（按产品汇总）
  async getOverview(billingCycle: string): Promise<OverviewItem[]> {
    if (!this.client) return []

    const request = new QueryBillOverviewRequest({billingCycle})
    const res = await wrap('查询账单总览', async () =>
      this.client.queryBillOverviewWithOptions(request, createRuntime()),
    )
    if (!res) return []

    const items = res.body?.data?.items?.item ?? []
    return items.map((i: Record<string, unknown>) => ({
      currency: (i.currency as string) ?? '',
      outstandingAmount: Number(i.outstandingAmount ?? 0),
      pretaxAmount: Number(i.pretaxAmount ?? 0),
      pretaxGrossAmount: Number(i.pretaxGrossAmount ?? 0),
      productCode: (i.productCode as string) ?? '',
      productName: (i.productName as string) ?? '',
      subscriptionType: (i.subscriptionType as string) ?? '',
    }))
  }
  // #endregion

  // #region 展示实例明细账单
  async showInstanceBills(billingCycle: string): Promise<void> {
    const items = await this.getInstanceBills(billingCycle)
    if (items.length === 0) {
      console.log(`账期 ${billingCycle} 没有实例账单数据`)
      return
    }

    const table = new Table({head: ['实例ID', '昵称', '产品', '地域', '原始金额', '应付金额', '币种']})
    let totalPay = 0
    for (const i of items) {
      totalPay += i.pretaxAmount
      table.push([
        i.instanceID,
        i.nickName || '-',
        i.productName,
        i.region || '-',
        fmt(i.pretaxGrossAmount),
        fmt(i.pretaxAmount),
        i.currency,
      ])
    }

    console.log(`账期: ${billingCycle}`)
    console.log(table.toString())
    console.log(`共 ${items.length} 条 | 合计应付金额: ${fmt(totalPay)}`)
  }
  // #endregion

  // #region 展示账单总览
  async showOverview(billingCycle: string): Promise<void> {
    const items = await this.getOverview(billingCycle)
    if (items.length === 0) {
      console.log(`账期 ${billingCycle} 没有账单数据`)
      return
    }

    const table = new Table({head: ['产品', '订阅类型', '原始金额', '应付金额', '未结清', '币种']})
    let totalGross = 0
    let totalPay = 0
    for (const i of items) {
      totalGross += i.pretaxGrossAmount
      totalPay += i.pretaxAmount
      table.push([
        `${i.productName}(${i.productCode})`,
        i.subscriptionType,
        fmt(i.pretaxGrossAmount),
        fmt(i.pretaxAmount),
        fmt(i.outstandingAmount),
        i.currency,
      ])
    }

    console.log(`账期: ${billingCycle}`)
    console.log(table.toString())
    console.log(`合计原始金额: ${fmt(totalGross)} | 合计应付金额: ${fmt(totalPay)}`)
  }
  // #endregion
}
