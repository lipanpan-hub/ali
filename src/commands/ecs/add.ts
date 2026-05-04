import {Command} from '@oclif/core'
import * as inquirer from '@inquirer/prompts'

import {EcsManager} from '../../lib/ecs/ecs.js'
import {ImageManager} from '../../lib/img/img.js'
import {SecurityGroupManager} from '../../lib/sgp/sgp.js'
import {VpcManager} from '../../lib/vpc/vpc.js'
import {VSwitchManager} from '../../lib/vsw/vsw.js'

export default class EcsAdd extends Command {
  static description = '创建 ECS 实例'

  static examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<void> {
    const ecsManager = new EcsManager()

    // #region 选择 VPC
    const vpcManager = new VpcManager()
    const vpcRes = await vpcManager.getVpcs()

    if (!vpcRes || !vpcRes.body?.vpcs?.vpc || vpcRes.body.vpcs.vpc.length === 0) {
      this.log('当前区域没有可用的 VPC，请先创建 VPC')
      return
    }

    const vpcs = vpcRes.body.vpcs.vpc
    const vpcChoices = vpcs.map((vpc) => ({
      name: `${vpc.vpcId} - ${vpc.vpcName} (${vpc.cidrBlock})`,
      value: vpc.vpcId || '',
    }))

    const selectedVpcId = await inquirer.select({
      choices: vpcChoices,
      message: '请选择 VPC:',
    })

    if (!selectedVpcId) {
      this.log('未选择 VPC')
      return
    }

    // #endregion

    // #region 选择交换机
    const vswManager = new VSwitchManager()
    const vswRes = await vswManager.getVSwitches(selectedVpcId)

    if (!vswRes || !vswRes.body?.vSwitches?.vSwitch || vswRes.body.vSwitches.vSwitch.length === 0) {
      this.log('当前 VPC 没有可用的交换机，请先创建交换机')
      return
    }

    const vSwitches = vswRes.body.vSwitches.vSwitch
    vSwitches.sort((a: any, b: any) => (a.zoneId || '').localeCompare(b.zoneId || ''))

    const vswChoices = vSwitches.map((vsw: any) => ({
      name: `${vsw.vSwitchId} - 名称:${vsw.vSwitchName} 可用区:${vsw.zoneId} CIDR:${vsw.cidrBlock}`,
      value: {id: vsw.vSwitchId, zoneId: vsw.zoneId},
    }))

    const selectedVSwitch = await inquirer.select({
      choices: vswChoices,
      message: '请选择交换机:',
    })

    if (!selectedVSwitch) {
      this.log('未选择交换机')
      return
    }

    const vSwitchId = selectedVSwitch.id
    const zoneId = selectedVSwitch.zoneId
    // #endregion

    // #region 选择实例规格
    this.log('正在获取可用的实例规格...')
    const instanceTypes = await ecsManager.getInstanceTypes(zoneId)

    if (instanceTypes.length === 0) {
      this.log('未找到可用的实例规格')
      return
    }

    this.log(`找到 ${instanceTypes.length} 种可用实例规格`)

    const instanceTypeChoices = instanceTypes.slice(0, 50).map((type) => ({
      name: type,
      value: type,
    }))

    const selectedInstanceType = await inquirer.select({
      choices: instanceTypeChoices,
      message: '请选择实例规格 (仅显示前50个):',
    })

    if (!selectedInstanceType) {
      this.log('未选择实例规格')
      return
    }

    // #endregion

    // #region 配置私网IP地址
    const privateIpAddress = await inquirer.input({
      message: '请输入私网IP地址 (留空则自动分配):',
    })
    // #endregion

    // #region 选择安全组
    const sgpManager = new SecurityGroupManager()
    const sgpRes = await sgpManager.getSecurityGroups()

    if (!sgpRes || !sgpRes.body?.securityGroups?.securityGroup) {
      this.log('未找到可用的安全组')
      return
    }

    const securityGroups = sgpRes.body.securityGroups.securityGroup.filter((sg) => sg.vpcId === selectedVpcId)

    if (securityGroups.length === 0) {
      this.log('当前 VPC 没有可用的安全组，请先创建安全组')
      return
    }

    const sgChoices = securityGroups.map((sg) => ({
      name: `${sg.securityGroupId} - 名称:${sg.securityGroupName} 规则数:${sg.ruleCount}`,
      value: sg.securityGroupId || '',
    }))

    const selectedSecurityGroupIds = await inquirer.checkbox({
      choices: sgChoices,
      message: '请选择安全组 (空格选择/取消，回车确认):',
    })

    if (!selectedSecurityGroupIds || selectedSecurityGroupIds.length === 0) {
      this.log('未选择安全组，取消操作')
      return
    }

    // #endregion

    // #region 选择镜像
    this.log('正在获取可用镜像...')
    const imgManager = new ImageManager()
    const imgRes = await imgManager.getImages()

    if (!imgRes || !imgRes.body?.images?.image || imgRes.body.images.image.length === 0) {
      this.log('未找到可用镜像')
      return
    }

    const ubuntuImages = imgRes.body.images.image
      .filter((img) => {
        const imageName = img.imageName || ''
        return imageName.toLowerCase().includes('ubuntu')
      })
      .sort((a, b) => (b.creationTime || '').localeCompare(a.creationTime || ''))
      .slice(0, 10)

    const imgChoices = ubuntuImages.map((img) => ({
      name: `${img.imageId} (${img.imageName})`,
      value: img.imageId || '',
    }))

    const selectedImageId = await inquirer.select({
      choices: imgChoices,
      message: '请选择镜像 (仅显示最新的10个Ubuntu镜像):',
    })

    if (!selectedImageId) {
      this.log('未选择镜像')
      return
    }

    // #endregion

    // #region 配置实例密码
    const selectedPassword = await inquirer.password({
      message: '请输入实例密码 (留空使用默认密码 ggmm12LPP!):',
    })

    const password = selectedPassword.trim() === '' ? 'ggmm12LPP!' : selectedPassword.trim()
    // #endregion

    // #region 选择系统盘类型
    const diskCategoryChoices = [
      {name: 'ESSD云盘 (cloud_essd)', value: 'cloud_essd'},
      {name: '高效云盘 (cloud_efficiency)', value: 'cloud_efficiency'},
      {name: 'SSD云盘 (cloud_ssd)', value: 'cloud_ssd'},
    ]

    const selectedDiskCategory = await inquirer.select({
      choices: diskCategoryChoices,
      message: '请选择系统盘类型:',
    })

    if (!selectedDiskCategory) {
      this.log('未选择系统盘类型')
      return
    }

    // #endregion

    // #region 配置系统盘大小
    const selectedDiskSize = await inquirer.input({
      default: '40',
      message: '请输入系统盘大小(GB):',
    })

    if (!selectedDiskSize) {
      this.log('未输入系统盘大小')
      return
    }

    // #endregion

    // #region 配置实例名称
    const instanceName = await inquirer.input({
      default: 'test',
      message: '请输入实例名称:',
    })

    if (!instanceName) {
      this.log('未输入实例名称')
      return
    }

    // #endregion

    // #region 创建实例
    await ecsManager.createInstance({
      imageId: selectedImageId,
      instanceName,
      instanceType: selectedInstanceType,
      password,
      privateIpAddress: privateIpAddress.trim() === '' ? undefined : privateIpAddress.trim(),
      securityGroupIds: selectedSecurityGroupIds,
      systemDiskCategory: selectedDiskCategory,
      systemDiskSize: selectedDiskSize,
      vSwitchId,
    })
    // #endregion
  }
}
