import {
  CreateVSwitchRequest,
  CreateVSwitchResponse,
  DeleteVSwitchRequest,
  DescribeVSwitchAttributesRequest,
  DescribeVSwitchAttributesResponse,
  DescribeVSwitchesRequest,
  DescribeVSwitchesResponse,
} from '@alicloud/vpc20160428'

import {createVpcClient} from '../client/client.js'
import {createRuntime} from '../client/runtime.js'
import {wrap} from '../client/wrap.js'

export class VSwitchManager {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected client: any = null
  protected region: string = ''

  constructor() {
    const c = createVpcClient()
    if (!c) return
    this.client = c.client
    this.region = c.region
  }

  // #region 创建
  async createVSwitch(
    vpcId: string,
    zoneId: string,
    cidrBlock: string,
    vSwitchName: string,
  ): Promise<CreateVSwitchResponse | null> {
    if (!this.client) return null

    const request = new CreateVSwitchRequest({
      cidrBlock,
      regionId: this.region,
      vpcId,
      vSwitchName,
      zoneId,
    })

    return wrap('创建交换机', async () => {
      const res = await this.client.createVSwitchWithOptions(request, createRuntime())
      console.log(`交换机创建成功: 名称=${vSwitchName}, 可用区=${zoneId}, CIDR块=${cidrBlock}`)
      return res as CreateVSwitchResponse
    })
  }
  // #endregion

  // #region 删除
  async deleteVSwitch(vSwitchId: string): Promise<boolean> {
    if (!this.client) return false

    const request = new DeleteVSwitchRequest({regionId: this.region, vSwitchId})
    const ok = await wrap('删除交换机', async () => {
      await this.client.deleteVSwitchWithOptions(request, createRuntime())
      console.log(`交换机 ${vSwitchId} 删除成功`)
      return true
    })
    return ok ?? false
  }
  // #endregion

  // #region 详情
  async getVSwitchAttributes(vSwitchId: string): Promise<DescribeVSwitchAttributesResponse | null> {
    if (!this.client) return null

    const request = new DescribeVSwitchAttributesRequest({regionId: this.region, vSwitchId})

    return wrap('获取交换机详情', async () => {
      const res = await this.client.describeVSwitchAttributesWithOptions(request, createRuntime())
      return res as DescribeVSwitchAttributesResponse
    })
  }
  // #endregion

  // #region 获取列表
  async getVSwitches(vpcId: string): Promise<DescribeVSwitchesResponse | null> {
    if (!this.client) return null

    const request = new DescribeVSwitchesRequest({regionId: this.region, vpcId})

    return wrap('获取交换机列表', async () => {
      const res = await this.client.describeVSwitchesWithOptions(request, createRuntime())
      return res as DescribeVSwitchesResponse
    })
  }
  // #endregion

  // #region 列出
  async listVSwitches(vpcId: string): Promise<void> {
    const res = await this.getVSwitches(vpcId)
    const items = res?.body?.vSwitches?.vSwitch ?? []
    if (items.length === 0) {
      console.log('当前 VPC 没有交换机')
      return
    }

    const sorted = [...items].sort((a, b) => (a.zoneId || '').localeCompare(b.zoneId || ''))
    for (const v of sorted) {
      console.log(
        `VSwitchId: ${v.vSwitchId}, VSwitchName: ${v.vSwitchName}, ZoneId: ${v.zoneId}, CidrBlock: ${v.cidrBlock}, VpcId: ${v.vpcId}`,
      )
    }
  }
  // #endregion
}
