import {createRequire} from 'node:module'

import * as $Vpc20160428 from '@alicloud/vpc20160428'
import * as $Util from '@alicloud/tea-util'

import {ClientConfig} from '../client/client.js'

const require = createRequire(import.meta.url)
const Vpc20160428 = require('@alicloud/vpc20160428').default

export class VSwitchManager {
  protected client: any = null
  protected region: string = ''

  constructor() {
    const clientConfig = ClientConfig.getInstance()
    if (!clientConfig.config) {
      console.log('配置文件不存在, 请使用 ali config set 命令生成配置文件。')
      return
    }

    this.region = clientConfig.region
    const config = {
      ...clientConfig.config,
      endpoint: `vpc.${this.region}.aliyuncs.com`,
    }
    this.client = new Vpc20160428(config)
  }

  // 获取交换机详细信息
  async getVSwitchAttributes(vSwitchId: string): Promise<$Vpc20160428.DescribeVSwitchAttributesResponse | null> {
    if (!this.client) return null

    const request = new $Vpc20160428.DescribeVSwitchAttributesRequest({
      regionId: this.region,
      vSwitchId,
    })

    const runtime = new $Util.RuntimeOptions({})

    try {
      return await this.client.describeVSwitchAttributesWithOptions(request, runtime)
    } catch (error: any) {
      console.log(error.message)
      if (error.data?.Recommend) {
        console.log(error.data.Recommend)
      }

      return null
    }
  }

  // 创建交换机
  async createVSwitch(
    vpcId: string,
    zoneId: string,
    cidrBlock: string,
    vSwitchName: string,
  ): Promise<$Vpc20160428.CreateVSwitchResponse | null> {
    if (!this.client) return null

    const request = new $Vpc20160428.CreateVSwitchRequest({
      cidrBlock,
      regionId: this.region,
      vSwitchName,
      vpcId,
      zoneId,
    })

    const runtime = new $Util.RuntimeOptions({})

    try {
      const res = await this.client.createVSwitchWithOptions(request, runtime)
      console.log(`交换机创建成功: 名称=${vSwitchName}, 可用区=${zoneId}, CIDR块=${cidrBlock}`)
      return res
    } catch (error: any) {
      console.log(`交换机创建失败: ${error.message}`)
      if (error.data?.Recommend) {
        console.log(`诊断建议: ${error.data.Recommend}`)
      }

      return null
    }
  }

  // 删除交换机
  async deleteVSwitch(vSwitchId: string): Promise<boolean> {
    if (!this.client) return false

    const request = new $Vpc20160428.DeleteVSwitchRequest({
      regionId: this.region,
      vSwitchId,
    })

    const runtime = new $Util.RuntimeOptions({})

    try {
      await this.client.deleteVSwitchWithOptions(request, runtime)
      console.log(`交换机 ${vSwitchId} 删除成功`)
      return true
    } catch (error: any) {
      console.log(`交换机删除失败: ${error.message}`)
      if (error.data?.Recommend) {
        console.log(`诊断建议: ${error.data.Recommend}`)
      }

      return false
    }
  }

  // 获取指定 VPC 下的交换机列表
  async getVSwitches(vpcId: string): Promise<$Vpc20160428.DescribeVSwitchesResponse | null> {
    if (!this.client) return null

    const request = new $Vpc20160428.DescribeVSwitchesRequest({
      regionId: this.region,
      vpcId,
    })

    const runtime = new $Util.RuntimeOptions({})

    try {
      return await this.client.describeVSwitchesWithOptions(request, runtime)
    } catch (error: any) {
      console.log(error.message)
      if (error.data?.Recommend) {
        console.log(error.data.Recommend)
      }

      return null
    }
  }

  // 列出指定 VPC 下的所有交换机
  async listVSwitches(vpcId: string): Promise<void> {
    if (!this.client) return

    const request = new $Vpc20160428.DescribeVSwitchesRequest({
      regionId: this.region,
      vpcId,
    })

    const runtime = new $Util.RuntimeOptions({})

    try {
      const res = await this.client.describeVSwitchesWithOptions(request, runtime)
      if (!res || !res.body?.vSwitches?.vSwitch) {
        console.log('当前 VPC 没有交换机')
        return
      }

      const vSwitches = res.body.vSwitches.vSwitch
      // 按可用区ID字母顺序排序
      vSwitches.sort((a: any, b: any) => (a.zoneId || '').localeCompare(b.zoneId || ''))

      for (const vsw of vSwitches) {
        console.log(
          `VSwitchId: ${vsw.vSwitchId}, VSwitchName: ${vsw.vSwitchName}, ZoneId: ${vsw.zoneId}, CidrBlock: ${vsw.cidrBlock}, VpcId: ${vsw.vpcId}`,
        )
      }
    } catch (error: any) {
      console.log(`获取交换机列表失败: ${error.message}`)
      if (error.data?.Recommend) {
        console.log(`诊断建议: ${error.data.Recommend}`)
      }
    }
  }
}
