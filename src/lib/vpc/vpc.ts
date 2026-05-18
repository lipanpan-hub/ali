import {
  CreateVpcRequest,
  CreateVpcResponse,
  DeleteVpcRequest,
  DescribeVpcsRequest,
  DescribeVpcsResponse,
} from '@alicloud/vpc20160428'

import {createVpcClient} from '../client/client.js'
import {createRuntime} from '../client/runtime.js'
import {wrap} from '../client/wrap.js'

export class VpcManager {
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
  async createVpc(cidrBlock: string, vpcName: string): Promise<CreateVpcResponse | null> {
    if (!this.client) return null

    const request = new CreateVpcRequest({cidrBlock, regionId: this.region, vpcName})

    return wrap('创建 VPC', async () => {
      const res = await this.client.createVpcWithOptions(request, createRuntime())
      console.log(`VPC 创建成功: 名称=${vpcName}, CIDR块=${cidrBlock}`)
      return res as CreateVpcResponse
    })
  }
  // #endregion

  // #region 删除
  async deleteVpc(vpcId: string): Promise<boolean> {
    if (!this.client) return false

    const request = new DeleteVpcRequest({regionId: this.region, vpcId})
    const ok = await wrap('删除 VPC', async () => {
      await this.client.deleteVpcWithOptions(request, createRuntime())
      console.log(`VPC ${vpcId} 删除成功`)
      return true
    })
    return ok ?? false
  }
  // #endregion

  // #region 获取
  async getVpcs(): Promise<DescribeVpcsResponse | null> {
    if (!this.client) return null

    const request = new DescribeVpcsRequest({regionId: this.region})

    return wrap('获取 VPC 列表', async () => {
      const res = await this.client.describeVpcsWithOptions(request, createRuntime())
      return res as DescribeVpcsResponse
    })
  }
  // #endregion

  // #region 列出
  async listVpcs(): Promise<void> {
    const res = await this.getVpcs()
    const vpcs = res?.body?.vpcs?.vpc ?? []
    if (vpcs.length === 0) {
      console.log('当前区域没有 VPC')
      return
    }

    for (const vpc of vpcs) {
      const vswIds = vpc.vSwitchIds?.vSwitchId || []
      console.log(`VPC ID: ${vpc.vpcId}`)
      console.log(`VPC 名称: ${vpc.vpcName}`)
      console.log(`CIDR 块: ${vpc.cidrBlock}`)
      console.log(`区域 ID: ${vpc.regionId}`)
      console.log(`状态: ${vpc.status}`)
      console.log(`交换机 IDs: ${vswIds.length > 0 ? vswIds.join(', ') : '无'}`)
      console.log('-'.repeat(50))
    }
  }
  // #endregion
}
