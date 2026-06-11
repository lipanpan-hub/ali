import {Command} from '@oclif/core'

import {TingwuManager} from '../../../lib/twu/twu.js'

export default class TwuPhraseList extends Command {
  static aliases = ['twu:pl']
  static description = '列举通义听悟所有热词词表'
  static examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<void> {
    await new TingwuManager().listPhrases()
  }
}
