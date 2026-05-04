import {createRequire} from 'node:module'

import * as $Vpc20160428 from '@alicloud/vpc20160428'
import * as $Util from '@alicloud/tea-util'

import {ClientConfig} from '../client/client.js'

const require = createRequire(import.meta.url)
const Vpc20160428 = require('@alicloud/vpc20160428').default

export class VpcManager {
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

  // 获取 VPC 列表
  async getVpcs(): Promise<$Vpc20160428.DescribeVpcsResponse | null> {
    if (!this.client) return null

    const request = new $Vpc20160428.DescribeVpcsRequest({
      regionId: this.region,
    })

    const runtime = new $Util.RuntimeOptions({})

    try {
      return await this.client.describeVpcsWithOptions(request, runtime)
    } catch (error: any) {
      console.log(error.message)
      if (error.data?.Recommend) {
        console.log(error.data.Recommend)
      }

      return null
    }
  }

  // 列出 VPC
  async listVpcs(): Promise<void> {
    const res = await this.getVpcs()
    if (!res || !res.body?.vpcs?.vpc) {
      console.log('未找到 VPC')
      return
    }

    const vpcs = res.body.vpcs.vpc
    for (const vpc of vpcs) {
      console.log(`VPC ID: ${vpc.vpcId}`)
      console.log(`VPC 名称: ${vpc.vpcName}`)
      console.log(`CIDR 块: ${vpc.cidrBlock}`)
      console.log(`区域 ID: ${vpc.regionId}`)
      console.log(`状态: ${vpc.status}`)
      const vswitchIds = vpc.vSwitchIds?.vSwitchId || []
      console.log(`交换机 IDs: ${vswitchIds.length > 0 ? vswitchIds.join(', ') : '无'}`)
      console.log('-'.repeat(50))
    }
  }

  // 创建 VPC
  async createVpc(cidrBlock: string, vpcName: string): Promise<$Vpc20160428.CreateVpcResponse | null> {
    if (!this.client) return null

    const request = new $Vpc20160428.CreateVpcRequest({
      cidrBlock,
      regionId: this.region,
      vpcName,
    })

    const runtime = new $Util.RuntimeOptions({})

    try {
      const res = await this.client.createVpcWithOptions(request, runtime)
      console.log(`VPC 创建成功: 名称=${vpcName}, CIDR块=${cidrBlock}`)
      return res
    } catch (error: any) {
      console.log(`VPC 创建失败: ${error.message}`)
      if (error.data?.Recommend) {
        console.log(`诊断建议: ${error.data.Recommend}`)
      }

      return null
    }
  }

  // 删除 VPC
  async deleteVpc(vpcId: string): Promise<boolean> {
    if (!this.client) return false

    const request = new $Vpc20160428.DeleteVpcRequest({
      regionId: this.region,
      vpcId,
    })

    const runtime = new $Util.RuntimeOptions({})

    try {
      await this.client.deleteVpcWithOptions(request, runtime)
      console.log(`VPC ${vpcId} 删除成功`)
      return true
    } catch (error: any) {
      console.log(`VPC 删除失败: ${error.message}`)
      if (error.data?.Recommend) {
        console.log(`诊断建议: ${error.data.Recommend}`)
      }

      return false
    }
  }
}
