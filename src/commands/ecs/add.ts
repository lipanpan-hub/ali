import * as inquirer from '@inquirer/prompts'
import {Command} from '@oclif/core'

import {EcsManager} from '../../lib/ecs/ecs.js'
import {ImageManager} from '../../lib/img/img.js'
import {SecurityGroupManager} from '../../lib/sgp/sgp.js'
import {VpcManager} from '../../lib/vpc/vpc.js'
import {VSwitchManager} from '../../lib/vsw/vsw.js'

const DEFAULT_PASSWORD = 'ggmm12LPP!'
const PLATFORM_CHOICES = ['Ubuntu', 'Debian', 'CentOS', 'AlmaLinux', 'Anolis OS', 'Windows Server', '全部']

export default class EcsAdd extends Command {
  static description = '创建 ECS 实例'
static examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<void> {
    const ecsManager = new EcsManager()

    // #region 选择 VPC
    const vpcRes = await new VpcManager().getVpcs()
    const vpcs = vpcRes?.body?.vpcs?.vpc ?? []
    if (vpcs.length === 0) {
      this.log('当前区域没有可用的 VPC，请先创建 VPC')
      return
    }

    const selectedVpcId = await inquirer.select({
      choices: vpcs.map((vpc) => ({
        name: `${vpc.vpcId} - ${vpc.vpcName} (${vpc.cidrBlock})`,
        value: vpc.vpcId || '',
      })),
      message: '请选择 VPC:',
    })

    if (!selectedVpcId) return
    // #endregion

    // #region 选择交换机
    const vswRes = await new VSwitchManager().getVSwitches(selectedVpcId)
    const vSwitches = [...(vswRes?.body?.vSwitches?.vSwitch ?? [])].sort((a, b) =>
      (a.zoneId || '').localeCompare(b.zoneId || ''),
    )
    if (vSwitches.length === 0) {
      this.log('当前 VPC 没有可用的交换机，请先创建交换机')
      return
    }

    const selectedVSwitch = await inquirer.select({
      choices: vSwitches.map((vsw) => ({
        name: `${vsw.vSwitchId} - 名称:${vsw.vSwitchName} 可用区:${vsw.zoneId} CIDR:${vsw.cidrBlock}`,
        value: {id: vsw.vSwitchId || '', zoneId: vsw.zoneId || ''},
      })),
      message: '请选择交换机:',
    })

    const {id: vSwitchId, zoneId} = selectedVSwitch
    if (!vSwitchId) return
    // #endregion

    // #region 选择实例规格
    this.log('正在获取可用的实例规格...')
    const instanceTypes = await ecsManager.getInstanceTypes(zoneId)
    if (instanceTypes.length === 0) {
      this.log('未找到可用的实例规格')
      return
    }

    this.log(`找到 ${instanceTypes.length} 种可用实例规格`)
    const selectedInstanceType = await inquirer.search({
      message: '请选择实例规格 (输入关键字搜索):',
      source(input) {
        const keyword = (input || '').toLowerCase()
        return instanceTypes
          .filter((t) => !keyword || t.toLowerCase().includes(keyword))
          .slice(0, 50)
          .map((t) => ({name: t, value: t}))
      },
    })

    if (!selectedInstanceType) return
    // #endregion

    // #region 私网IP
    const privateIpInput = await inquirer.input({message: '请输入私网IP地址 (留空则自动分配):'})
    const privateIpAddress = privateIpInput.trim() === '' ? undefined : privateIpInput.trim()
    // #endregion

    // #region 选择安全组
    const sgpRes = await new SecurityGroupManager().getSecurityGroups()
    const securityGroups = (sgpRes?.body?.securityGroups?.securityGroup ?? []).filter((sg) => sg.vpcId === selectedVpcId)
    if (securityGroups.length === 0) {
      this.log('当前 VPC 没有可用的安全组，请先创建安全组')
      return
    }

    const selectedSecurityGroupIds = await inquirer.checkbox({
      choices: securityGroups.map((sg) => ({
        name: `${sg.securityGroupId} - 名称:${sg.securityGroupName} 规则数:${sg.ruleCount}`,
        value: sg.securityGroupId || '',
      })),
      message: '请选择安全组 (空格选择/取消，回车确认):',
      validate: (selected) => selected.length > 0 || '至少选择一个安全组',
    })

    if (!selectedSecurityGroupIds || selectedSecurityGroupIds.length === 0) return
    // #endregion

    // #region 选择镜像
    const platform = await inquirer.select({
      choices: PLATFORM_CHOICES.map((p) => ({name: p, value: p})),
      message: '请选择镜像平台:',
    })

    this.log('正在获取可用镜像...')
    const imgRes = await new ImageManager().getImages()
    const allImages = imgRes?.body?.images?.image ?? []
    if (allImages.length === 0) {
      this.log('未找到可用镜像')
      return
    }

    const filtered =
      platform === '全部'
        ? allImages
        : allImages.filter((img) => {
            const keyword = platform.toLowerCase()
            return (
              (img.imageName || '').toLowerCase().includes(keyword) ||
              (img.platform || '').toLowerCase().includes(keyword) ||
              (img.OSNameEn || '').toLowerCase().includes(keyword)
            )
          })

    const sorted = [...filtered].sort((a, b) => (b.creationTime || '').localeCompare(a.creationTime || ''))
    if (sorted.length === 0) {
      this.log(`未找到 ${platform} 相关镜像`)
      return
    }

    const selectedImageId = await inquirer.search({
      message: `请选择镜像 (共 ${sorted.length} 个，输入关键字过滤):`,
      source(input) {
        const keyword = (input || '').toLowerCase()
        return sorted
          .filter((img) => !keyword || (img.imageName || '').toLowerCase().includes(keyword))
          .slice(0, 50)
          .map((img) => ({name: `${img.imageId} (${img.imageName})`, value: img.imageId || ''}))
      },
    })

    if (!selectedImageId) return
    // #endregion

    // #region 密码
    const passwordInput = await inquirer.password({
      message: `请输入实例密码 (留空使用默认密码 ${DEFAULT_PASSWORD}):`,
    })
    const password = passwordInput.trim() === '' ? DEFAULT_PASSWORD : passwordInput.trim()
    // #endregion

    // #region 系统盘
    const systemDiskCategory = await inquirer.select({
      choices: [
        {name: 'ESSD云盘 (cloud_essd)', value: 'cloud_essd'},
        {name: '高效云盘 (cloud_efficiency)', value: 'cloud_efficiency'},
        {name: 'SSD云盘 (cloud_ssd)', value: 'cloud_ssd'},
      ],
      message: '请选择系统盘类型:',
    })

    const systemDiskSize = await inquirer.input({
      default: '40',
      message: '请输入系统盘大小(GB):',
      validate: (value) => /^\d+$/.test(value) || '请输入数字',
    })
    // #endregion

    // #region 实例名称
    const instanceName = await inquirer.input({default: 'test', message: '请输入实例名称:'})
    if (!instanceName) return
    // #endregion

    await ecsManager.createInstance({
      imageId: selectedImageId,
      instanceName,
      instanceType: selectedInstanceType,
      password,
      privateIpAddress,
      securityGroupIds: selectedSecurityGroupIds,
      systemDiskCategory,
      systemDiskSize,
      vSwitchId,
    })
  }
}
