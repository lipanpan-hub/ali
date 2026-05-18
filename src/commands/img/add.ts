import * as inquirer from '@inquirer/prompts'
import {Args, Command} from '@oclif/core'

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

    if (!instanceId) {
      const res = await new EcsManager().getInstances()
      const instances = res?.body?.instances?.instance ?? []
      if (instances.length === 0) {
        this.log('当前区域没有可用的实例')
        return
      }

      instanceId = await inquirer.select({
        choices: instances.map((inst) => {
          const primaryIp = inst.networkInterfaces?.networkInterface?.[0]?.primaryIpAddress || ''
          return {
            name: `${inst.instanceId} - ${inst.instanceName} (状态: ${inst.status}, 私网IP: ${primaryIp})`,
            value: inst.instanceId || '',
          }
        }),
        message: '请选择 ECS 实例:',
      })
    }

    if (!imageName) {
      imageName = await inquirer.input({
        message: '请输入镜像名称:',
        validate: (value) => value.length > 0 || '镜像名称不能为空',
      })
    }

    if (!instanceId || !imageName) return

    const description = await inquirer.input({message: '请输入镜像描述 (可选):'})
    await new ImageManager().createImage(instanceId, imageName, description || undefined)
  }
}
