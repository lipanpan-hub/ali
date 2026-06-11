import * as inquirer from '@inquirer/prompts'
import {Args, Command} from '@oclif/core'

import {TingwuManager} from '../../../lib/twu/twu.js'

export default class TwuPhraseDel extends Command {
  static args = {
    phraseId: Args.string({description: '热词词表 ID (可选，不提供则交互式选择)', required: false}),
  }
  static aliases = ['twu:pd']
  static description = '删除通义听悟热词词表'
  static examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %> a93b91141c0f422fa114af203f8b']

  public async run(): Promise<void> {
    const {args} = await this.parse(TwuPhraseDel)
    const manager = new TingwuManager()

    // #region 确定待删除的词表 ID
    let {phraseId} = args
    if (!phraseId) {
      const phrases = await manager.getPhrases()
      if (phrases.length === 0) {
        this.log('当前没有可删除的热词词表')
        return
      }

      phraseId = await inquirer.select({
        choices: phrases.map((p) => ({
          name: `${p.name ?? '-'} [id: ${p.phraseId ?? '-'}] ${p.description ?? ''}`,
          value: p.phraseId ?? '',
        })),
        message: '请选择要删除的热词词表:',
      })
    }

    if (!phraseId) return
    // #endregion

    const confirm = await inquirer.confirm({default: false, message: `确认要删除词表 ${phraseId} 吗？此操作不可恢复！`})
    if (!confirm) {
      this.log('取消删除操作')
      return
    }

    await manager.deletePhrases(phraseId)
  }
}
