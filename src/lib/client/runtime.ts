import * as $Util from '@alicloud/tea-util'

const DEFAULT_READ_TIMEOUT = 30_000
const DEFAULT_CONNECT_TIMEOUT = 10_000

export function createRuntime(): $Util.RuntimeOptions {
  return new $Util.RuntimeOptions({
    connectTimeout: DEFAULT_CONNECT_TIMEOUT,
    readTimeout: DEFAULT_READ_TIMEOUT,
  })
}
