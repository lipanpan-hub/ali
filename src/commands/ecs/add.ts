/* eslint-disable @typescript-eslint/no-explicit-any, camelcase */
import { Command } from '@oclif/core'

import type { PromptChoice } from '../../lib/types.js'

import { imageChoices } from '../../lib/constants.js'
import {
  createInstance,
  getAvailableSystemDiskTypes,
  listInstanceTypes,
} from '../../lib/ecs/ecs.js'
import {
  checkboxPrompt,
  confirmPrompt,
  fuzzySelectPrompt,
  passwordPrompt,
  selectPrompt,
  textPrompt,
} from '../../lib/prompts.js'
import { listSecurityGroups } from '../../lib/sgp/sgp.js'
import { listVpcs } from '../../lib/vpc/vpc.js'
import { listVSwitches } from '../../lib/vsw/vsw.js'

export default class EcsAdd extends Command {
  static description = '交互式创建ECS实例'
static examples = ['<%= config.bin %> <%= command.id %>']

  async run(): Promise<void> {
    try {
      // 1. 选择 VPC
      const vpcs = await listVpcs()
      if (vpcs.length === 0) {
        this.warn('当前区域没有VPC，请先创建VPC')
        return
      }

      const vpcChoices: PromptChoice[] = vpcs.map((v) => ({
        description: `${v.vpcName} (${v.cidrBlock}) ${v.status}`,
        title: v.vpcId,
        value: v.vpcId,
      }))

      const vpcId = await selectPrompt('请选择VPC:', vpcChoices)
      if (!vpcId) return

      // 2. 选择交换机
      const vswitches = await listVSwitches(vpcId)
      if (vswitches.length === 0) {
        this.warn('当前VPC没有可用的交换机，请先创建交换机')
        return
      }

      const vswChoices: PromptChoice[] = vswitches.map((v) => ({
        description: `名称:${v.vswitchName} 可用区:${v.zoneId} CIDR:${v.cidrBlock}`,
        title: v.vswitchId,
        value: v.vswitchId,
      }))

      const vswitchId = await selectPrompt('请选择交换机:', vswChoices)
      if (!vswitchId) return

      const selectedVswitch = vswitches.find((v) => v.vswitchId === vswitchId)!
      const {zoneId} = selectedVswitch

      // 3. 选择实例规格
      const instanceTypes = await listInstanceTypes(zoneId)
      if (instanceTypes.length === 0) {
        this.warn('未找到可用的实例规格')
        return
      }

      const instanceTypeDict: Record<string, string> = {}
      for (const t of instanceTypes.sort()) {
        instanceTypeDict[t] = t
      }

      const instanceType = await fuzzySelectPrompt('请选择实例规格 (支持模糊搜索):', instanceTypeDict)
      if (!instanceType) return
      this.log(`已选择实例规格: ${instanceType}`)

      // 4. 配置私网IP
      const privateIp = await textPrompt(
        `请输入私网IP地址 (CIDR范围: ${selectedVswitch.cidrBlock}, 留空则自动分配):`,
      )
      if (privateIp === undefined) return

      // 5. 选择安全组
      const allSgs = await listSecurityGroups()
      const sgChoices: PromptChoice[] = allSgs
        .filter((sg) => sg.vpcId === vpcId)
        .map((sg) => ({
          description: `名称:${sg.securityGroupName} 规则数:${sg.ruleCount}`,
          title: sg.securityGroupId,
          value: sg.securityGroupId,
        }))

      if (sgChoices.length === 0) {
        this.warn('当前VPC没有可用的安全组')
        return
      }

      const sgIds = await checkboxPrompt('请选择安全组 (空格选择/取消，回车确认):', sgChoices)
      if (!sgIds || sgIds.length === 0) {
        this.warn('未选择安全组，操作取消')
        return
      }

      // 6. 选择镜像
      const imgChoices: PromptChoice[] = Object.entries(imageChoices).map(([id, desc]) => ({
        description: desc,
        title: id,
        value: id,
      }))

      const imageId = await selectPrompt('请选择镜像:', imgChoices)
      if (!imageId) return

      // 7. 配置密码
      const password = await passwordPrompt('请输入实例密码 (留空使用默认密码):')
      if (password === undefined) return

      // 8. 选择系统盘类型
      const diskTypes = await getAvailableSystemDiskTypes(instanceType, zoneId)
      if (diskTypes.length === 0) {
        this.warn('未找到可用的系统盘类型')
        return
      }

      const diskTypeDesc: Record<string, string> = {
        cloud: '普通云盘',
        cloud_auto: 'ESSD AutoPL云盘',
        cloud_efficiency: '高效云盘',
        cloud_essd: 'ESSD云盘',
        cloud_essd_entry: 'ESSD Entry云盘',
        cloud_ssd: 'SSD云盘',
      }

      const diskChoices: PromptChoice[] = diskTypes.map((d) => ({
        description: `${diskTypeDesc[d.value] ?? d.value} (容量范围: ${d.min}-${d.max}GB)`,
        title: d.value,
        value: d.value,
      }))

      const diskCategory = await selectPrompt('请选择系统盘类型:', diskChoices)
      if (!diskCategory) return

      // 9. 配置系统盘大小
      const diskSize = await textPrompt('请输入系统盘大小(GB) (留空使用默认值40GB):')
      if (diskSize === undefined) return

      // 10. 配置登录用户
      const loginAsNonRoot = await confirmPrompt('是否使用非root用户登录?', true)
      if (loginAsNonRoot === undefined) return

      // 11. 创建实例
      await createInstance({
        imageId,
        instanceName: 'test',
        instanceType,
        loginAsNonRoot,
        password: password || 'ggmm12LPP!',
        privateIpAddress: privateIp || undefined,
        securityGroupIds: sgIds,
        systemDiskCategory: diskCategory,
        systemDiskSize: diskSize || '40',
        vswitchId,
      })

      this.log('实例创建请求已发送')
    } catch (error: any) {
      this.error(error.message ?? '未知错误')
    }
  }
}
