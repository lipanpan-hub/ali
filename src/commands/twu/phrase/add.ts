import * as inquirer from '@inquirer/prompts'
import {Command, Flags} from '@oclif/core'

import {parsePhraseFile} from '../../../lib/twu/phraseFile.js'
import {TingwuManager} from '../../../lib/twu/twu.js'

export default class TwuPhraseAdd extends Command {
  static description = '创建通义听悟热词词表 (默认交互式，--file 则从文件导入)'
  static examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %> --file phrases.json']
  static flags = {
    file: Flags.string({char: 'f', description: '从 JSON 文件导入热词词表'}),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(TwuPhraseAdd)
    const manager = new TingwuManager()

    // #region 从文件导入创建 (跳过交互)
    if (flags.file) {
      let imported
      try {
        imported = parsePhraseFile(flags.file)
      } catch (error) {
        this.log(`读取文件失败: ${(error as Error).message}`)
        return
      }

      if (!imported.name) {
        this.log('文件缺少 name 字段, 无法创建词表')
        return
      }

      await manager.createPhrases(imported)
      return
    }
    // #endregion

    // #region 采集词表基本信息
    const name = (await inquirer.input({message: '请输入词表名称:'})).trim()
    if (!name) {
      this.log('词表名称不能为空')
      return
    }

    const description = (await inquirer.input({message: '请输入词表描述 (可选):'})).trim()
    // #endregion

    // #region 循环录入热词与权重
    const wordWeights: Record<string, number> = {}
    let addMore = true
    while (addMore) {
      const word = (await inquirer.input({message: '请输入热词:'})).trim()
      if (!word) {
        this.log('热词不能为空, 已跳过')
      } else {
        const weight = Number(
          await inquirer.input({
            default: '3',
            message: `请输入「${word}」的权重 (1-5):`,
            validate: (v) => (/^[1-5]$/.test(v) ? true : '请输入 1-5 之间的整数'),
          }),
        )
        wordWeights[word] = weight
      }

      addMore = await inquirer.confirm({default: true, message: '是否继续添加热词?'})
    }

    if (Object.keys(wordWeights).length === 0) {
      this.log('未录入任何热词, 已取消创建')
      return
    }
    // #endregion

    await manager.createPhrases({description, name, wordWeights})
  }
}
