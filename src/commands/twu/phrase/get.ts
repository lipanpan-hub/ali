import * as inquirer from '@inquirer/prompts'
import {Args, Command, Flags} from '@oclif/core'

import {TingwuManager} from '../../../lib/twu/twu.js'

export default class TwuPhraseGet extends Command {
  static args = {
    phraseId: Args.string({description: '热词词表 ID (可选，不提供则交互式选择)', required: false}),
  }
  static aliases = ['twu:pg']
  static description = '查询通义听悟热词词表内容 (--out 可导出为 JSON 文件)'
  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> a93b91141c0f422fa114af203f8b',
    '<%= config.bin %> <%= command.id %> a93b91141c0f422fa114af203f8b --out phrases.json',
  ]
  static flags = {
    out: Flags.string({char: 'o', description: '导出词表到指定 JSON 文件'}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(TwuPhraseGet)
    const manager = new TingwuManager()

    // #region 确定待查询的词表 ID
    let {phraseId} = args
    if (!phraseId) {
      const phrases = await manager.getPhrases()
      if (phrases.length === 0) {
        this.log('当前没有可查询的热词词表')
        return
      }

      phraseId = await inquirer.select({
        choices: phrases.map((p) => ({
          name: `${p.name ?? '-'} [id: ${p.phraseId ?? '-'}] ${p.description ?? ''}`,
          value: p.phraseId ?? '',
        })),
        message: '请选择要查询的热词词表:',
      })
    }

    if (!phraseId) return
    // #endregion

    // #region 导出到文件
    if (flags.out) {
      const detail = await manager.fetchPhrase(phraseId)
      if (!detail) {
        this.log(`未查询到词表 ${phraseId}`)
        return
      }

      try {
        TingwuManager.writePhraseFile(flags.out, detail)
      } catch (error) {
        this.log(`写入文件失败: ${(error as Error).message}`)
        return
      }

      this.log(`词表已导出到 ${flags.out}`)
      return
    }
    // #endregion

    await manager.getPhrase(phraseId)
  }
}
