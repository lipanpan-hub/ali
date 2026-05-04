import {createRequire} from 'node:module'

import * as $Ecs20140526 from '@alicloud/ecs20140526'
import * as $Util from '@alicloud/tea-util'

import {ClientConfig} from '../client/client.js'

const require = createRequire(import.meta.url)
const Ecs20140526 = require('@alicloud/ecs20140526').default

export class SecurityGroupManager {
  private client: any = null
  private region: string = ''

  constructor() {
    const clientConfig = ClientConfig.getInstance()
    if (!clientConfig.config) {
      console.log('配置文件不存在, 请使用 ali config set 命令生成配置文件。')
      return
    }

    this.region = clientConfig.region
    const config = {
      ...clientConfig.config,
      endpoint: `ecs.${this.region}.aliyuncs.com`,
    }
    this.client = new Ecs20140526(config)
  }

  // 获取安全组列表
  async getSecurityGroups(): Promise<$Ecs20140526.DescribeSecurityGroupsResponse | null> {
    if (!this.client) return null

    const request = new $Ecs20140526.DescribeSecurityGroupsRequest({
      regionId: this.region,
    })

    const runtime = new $Util.RuntimeOptions({})

    try {
      return await this.client.describeSecurityGroupsWithOptions(request, runtime)
    } catch (error: any) {
      console.log(`获取安全组列表失败: ${error.message}`)
      if (error.data?.Recommend) {
        console.log(`建议: ${error.data.Recommend}`)
      }

      return null
    }
  }

  // 创建安全组
  async createSecurityGroup(vpcId: string, securityGroupName: string, description?: string): Promise<$Ecs20140526.CreateSecurityGroupResponse | null> {
    if (!this.client) return null

    const request = new $Ecs20140526.CreateSecurityGroupRequest({
      description,
      regionId: this.region,
      securityGroupName,
      vpcId,
    })

    const runtime = new $Util.RuntimeOptions({})

    try {
      const res = await this.client.createSecurityGroupWithOptions(request, runtime)
      console.log(`安全组创建成功: ${securityGroupName}`)
      return res
    } catch (error: any) {
      console.log(`创建安全组失败: ${error.message}`)
      if (error.data?.Recommend) {
        console.log(`建议: ${error.data.Recommend}`)
      }

      return null
    }
  }

  // 删除安全组
  async deleteSecurityGroup(securityGroupId: string): Promise<boolean> {
    if (!this.client) return false

    const request = new $Ecs20140526.DeleteSecurityGroupRequest({
      regionId: this.region,
      securityGroupId,
    })

    const runtime = new $Util.RuntimeOptions({})

    try {
      await this.client.deleteSecurityGroupWithOptions(request, runtime)
      console.log(`安全组 ${securityGroupId} 删除成功`)
      return true
    } catch (error: any) {
      console.log(`删除安全组失败: ${error.message}`)
      if (error.data?.Recommend) {
        console.log(`诊断建议: ${error.data.Recommend}`)
      }

      return false
    }
  }

  // 列出安全组
  async listSecurityGroups(block = false): Promise<void> {
    const res = await this.getSecurityGroups()
    if (!res || !res.body?.securityGroups?.securityGroup) {
      console.log('当前区域没有安全组')
      return
    }

    const securityGroups = res.body.securityGroups.securityGroup
    console.log(`\n区域: ${res.body.regionId}  共 ${res.body.totalCount} 个安全组\n`)

    if (!block) {
      // 单行显示模式
      for (const sg of securityGroups) {
        const createTime = sg.creationTime?.replace('T', ' ').replace('Z', '') || ''
        console.log(`${sg.securityGroupId} | ${sg.securityGroupName} | 规则:${sg.ruleCount} | ${createTime} | ${sg.vpcId}`)
      }
    } else {
      // 多行显示模式
      for (const sg of securityGroups) {
        const createTime = sg.creationTime?.replace('T', ' ').replace('Z', '') || ''
        console.log(`安全组ID: ${sg.securityGroupId}`)
        console.log(`名称:     ${sg.securityGroupName}`)
        console.log(`规则数:   ${sg.ruleCount}`)
        console.log(`创建时间: ${createTime}`)
        console.log(`VPC ID:   ${sg.vpcId}`)
        console.log('-'.repeat(50))
      }
    }
  }
}
