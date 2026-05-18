import {runHook} from '@oclif/test'
import {expect} from 'chai'

describe('init hook', () => {
  it('runs without throwing', async () => {
    const result = await runHook('init', {id: 'mycommand'})
    expect(result).to.be.an('object')
  })
})
