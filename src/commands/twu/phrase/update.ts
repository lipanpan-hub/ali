import * as inquirer from '@inquirer/prompts'
import {Args, Command, Flags} from '@oclif/core'

import {parsePhraseFile} from '../../../lib/twu/phraseFile.js'
import {TingwuManager} from '../../../lib/twu/twu.js'

export default class TwuPhraseUpdate extends Command {
  static args = {
    phraseId: Args.string({description: '热词词表 ID (可选，不提供则交互式选择)', required: false}),
  }
  static description = '更新通义听悟热词词表 (默认增量编辑，--file 则从文件全覆盖导入)'
  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> a93b91141c0f422fa114af203f8b',
    '<%= config.bin %> <%= command.id %> a93b91141c0f422fa114af203f8b --file phrases.json',
  ]
  static flags = {
    file: Flags.string({char: 'f', description: '从 JSON 文件导入热词词表 (全覆盖)'}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(TwuPhraseUpdate)
    const manager = new TingwuManager()

    // #region 确定待更新的词表 ID
    let {phraseId} = args
    if (!phraseId) {
      const phrases = await manager.getPhrases()
      if (phrases.length === 0) {
        this.log('当前没有可更新的热词词表')
        return
      }

      phraseId = await inquirer.select({
        choices: phrases.map((p) => ({
          name: `${p.name ?? '-'} [id: ${p.phraseId ?? '-'}] ${p.description ?? ''}`,
          value: p.phraseId ?? '',
        })),
        message: '请选择要更新的热词词表:',
      })
    }

    if (!phraseId) return
    // #endregion

    // #region 拉取现有词表内容 (用于增量编辑基础 / 保留原词表名称)
    const detail = await manager.fetchPhrase(phraseId)
    if (!detail) {
      this.log(`未查询到词表 ${phraseId}`)
      return
    }
    // #endregion

    // #region 从文件全覆盖导入 (跳过交互编辑)
    if (flags.file) {
      let imported
      try {
        imported = parsePhraseFile(flags.file)
      } catch (error) {
        this.log(`读取文件失败: ${(error as Error).message}`)
        return
      }

      this.printWords(imported.wordWeights)
      await manager.updatePhrases({name: imported.name || detail.name, phraseId, wordWeights: imported.wordWeights})
      return
    }
    // #endregion

    const wordWeights: Record<string, number> = {...detail.wordWeights}
    this.printWords(wordWeights)

    // #region 采集新的词表名称 (默认保留原名)
    const name = (await inquirer.input({default: detail.name, message: '词表名称:'})).trim()
    if (!name) {
      this.log('词表名称不能为空')
      return
    }
    // #endregion

    // #region 增量编辑热词 (在现有热词基础上增删改)
    let editing = true
    while (editing) {
      const action = await inquirer.select({
        choices: [
          {name: '添加/修改热词', value: 'upsert'},
          {name: '删除热词', value: 'remove'},
          {name: '完成并保存', value: 'done'},
        ],
        message: '请选择操作:',
      })

      switch (action) {
        case 'done': {
          editing = false
          break
        }

        case 'remove': {
          const words = Object.keys(wordWeights)
          if (words.length === 0) {
            this.log('当前没有可删除的热词')
            break
          }

          const target = await inquirer.select({
            choices: words.map((w) => ({name: `${w}: ${wordWeights[w]}`, value: w})),
            message: '请选择要删除的热词:',
          })
          delete wordWeights[target]
          this.printWords(wordWeights)
          break
        }

        case 'upsert': {
          const word = (await inquirer.input({message: '请输入热词:'})).trim()
          if (!word) {
            this.log('热词不能为空, 已跳过')
            break
          }

          const weight = Number(
            await inquirer.input({
              default: String(wordWeights[word] ?? 3),
              message: `请输入「${word}」的权重 (1-5):`,
              validate: (v) => (/^[1-5]$/.test(v) ? true : '请输入 1-5 之间的整数'),
            }),
          )
          wordWeights[word] = weight
          this.printWords(wordWeights)
          break
        }
      }
    }
    // #endregion

    if (Object.keys(wordWeights).length === 0) {
      this.log('词表热词不能为空, 已取消更新')
      return
    }

    await manager.updatePhrases({name, phraseId, wordWeights})
  }

  private printWords(wordWeights: Record<string, number>): void {
    const entries = Object.entries(wordWeights)
    this.log(`当前热词 (共 ${entries.length} 个):`)
    for (const [word, weight] of entries) {
      this.log(`  - ${word}: ${weight}`)
    }
  }
}
