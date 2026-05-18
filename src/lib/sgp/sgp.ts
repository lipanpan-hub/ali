import {
  CreateSecurityGroupRequest,
  CreateSecurityGroupResponse,
  DeleteSecurityGroupRequest,
  DescribeSecurityGroupsRequest,
  DescribeSecurityGroupsResponse,
} from '@alicloud/ecs20140526'

import {createEcsClient} from '../client/client.js'
import {createRuntime} from '../client/runtime.js'
import {wrap} from '../client/wrap.js'

export class SecurityGroupManager {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private client: any = null
  private region: string = ''

  constructor() {
    const c = createEcsClient()
    if (!c) return
    this.client = c.client
    this.region = c.region
  }

  // #region 创建
  async createSecurityGroup(
    vpcId: string,
    securityGroupName: string,
    description?: string,
  ): Promise<CreateSecurityGroupResponse | null> {
    if (!this.client) return null

    const request = new CreateSecurityGroupRequest({
      description,
      regionId: this.region,
      securityGroupName,
      vpcId,
    })

    return wrap('创建安全组', async () => {
      const res = await this.client.createSecurityGroupWithOptions(request, createRuntime())
      console.log(`安全组创建成功: ${securityGroupName}`)
      return res as CreateSecurityGroupResponse
    })
  }
  // #endregion

  // #region 删除
  async deleteSecurityGroup(securityGroupId: string): Promise<boolean> {
    if (!this.client) return false

    const request = new DeleteSecurityGroupRequest({regionId: this.region, securityGroupId})
    const ok = await wrap('删除安全组', async () => {
      await this.client.deleteSecurityGroupWithOptions(request, createRuntime())
      console.log(`安全组 ${securityGroupId} 删除成功`)
      return true
    })
    return ok ?? false
  }
  // #endregion

  // #region 获取
  async getSecurityGroups(): Promise<DescribeSecurityGroupsResponse | null> {
    if (!this.client) return null

    const request = new DescribeSecurityGroupsRequest({regionId: this.region})

    return wrap('获取安全组列表', async () => {
      const res = await this.client.describeSecurityGroupsWithOptions(request, createRuntime())
      return res as DescribeSecurityGroupsResponse
    })
  }
  // #endregion

  // #region 列出
  async listSecurityGroups(block = false): Promise<void> {
    const res = await this.getSecurityGroups()
    const sgs = res?.body?.securityGroups?.securityGroup ?? []
    if (sgs.length === 0) {
      console.log('当前区域没有安全组')
      return
    }

    console.log(`\n区域: ${res!.body?.regionId}  共 ${res!.body?.totalCount} 个安全组\n`)

    for (const sg of sgs) {
      const createTime = sg.creationTime?.replace('T', ' ').replace('Z', '') || ''
      if (block) {
        console.log(`安全组ID: ${sg.securityGroupId}`)
        console.log(`名称:     ${sg.securityGroupName}`)
        console.log(`规则数:   ${sg.ruleCount}`)
        console.log(`创建时间: ${createTime}`)
        console.log(`VPC ID:   ${sg.vpcId}`)
        console.log('-'.repeat(50))
      } else {
        console.log(
          `${sg.securityGroupId} | ${sg.securityGroupName} | 规则:${sg.ruleCount} | ${createTime} | ${sg.vpcId}`,
        )
      }
    }
  }
  // #endregion
}
