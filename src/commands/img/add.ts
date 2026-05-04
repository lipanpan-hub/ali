import {Args, Command} from '@oclif/core'
import * as inquirer from '@inquirer/prompts'

import {EcsManager} from '../../lib/ecs/ecs.js'
import {ImageManager} from '../../lib/img/img.js'

export default class ImgAdd extends Command {
  static args = {
    imageName: Args.string({description: '镜像名称', required: false}),
    instanceId: Args.string({description: 'ECS 实例 ID', required: false}),
  }

  static description = '创建自定义镜像'

  static examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %> i-xxxxx my-image']

  public async run(): Promise<void> {
    const {args} = await this.parse(ImgAdd)

    let {imageName, instanceId} = args

    // 选择 ECS 实例
    if (!instanceId) {
      const ecsManager = new EcsManager()
      const res = await ecsManager.getInstances()

      if (!res || !res.body?.instances?.instance || res.body.instances.instance.length === 0) {
        this.log('当前区域没有可用的实例')
        return
      }

      const instances = res.body.instances.instance
      const choices = instances.map((inst) => {
        const primaryIp =
          inst.networkInterfaces?.networkInterface && inst.networkInterfaces.networkInterface.length > 0
            ? inst.networkInterfaces.networkInterface[0].primaryIpAddress || ''
            : ''

        return {
          name: `${inst.instanceId} - ${inst.instanceName} (状态: ${inst.status}, 私网IP: ${primaryIp})`,
          value: inst.instanceId || '',
        }
      })

      instanceId = await inquirer.select({
        choices,
        message: '请选择 ECS 实例:',
      })
    }

    if (!instanceId) {
      this.log('未选择实例')
      return
    }

    // 输入镜像名称
    if (!imageName) {
      imageName = await inquirer.input({
        message: '请输入镜像名称:',
        validate: (value) => {
          if (value.length === 0) {
            return '镜像名称不能为空'
          }

          return true
        },
      })
    }

    if (!imageName) {
      this.log('未输入镜像名称')
      return
    }

    // 输入描述（可选）
    const description = await inquirer.input({
      message: '请输入镜像描述 (可选):',
    })

    const imgManager = new ImageManager()
    await imgManager.createImage(instanceId, imageName, description || undefined)
  }
}
