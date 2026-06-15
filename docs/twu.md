`ali twu`
=========

管理通义听悟任务

* [`ali twu pa`](#ali-twu-pa)
* [`ali twu pd [PHRASEID]`](#ali-twu-pd-phraseid)
* [`ali twu pg [PHRASEID]`](#ali-twu-pg-phraseid)
* [`ali twu phrase add`](#ali-twu-phrase-add)
* [`ali twu phrase del [PHRASEID]`](#ali-twu-phrase-del-phraseid)
* [`ali twu phrase get [PHRASEID]`](#ali-twu-phrase-get-phraseid)
* [`ali twu phrase list`](#ali-twu-phrase-list)
* [`ali twu phrase update [PHRASEID]`](#ali-twu-phrase-update-phraseid)
* [`ali twu pl`](#ali-twu-pl)
* [`ali twu pu [PHRASEID]`](#ali-twu-pu-phraseid)
* [`ali twu ta`](#ali-twu-ta)
* [`ali twu task add`](#ali-twu-task-add)
* [`ali twu task query [TASKID]`](#ali-twu-task-query-taskid)
* [`ali twu tq [TASKID]`](#ali-twu-tq-taskid)

## `ali twu pa`

创建通义听悟热词词表 (默认交互式，--file 则从文件导入)

```
USAGE
  $ ali twu pa [-f <value>]

FLAGS
  -f, --file=<value>  从 JSON 文件导入热词词表

DESCRIPTION
  创建通义听悟热词词表 (默认交互式，--file 则从文件导入)

ALIASES
  $ ali twu pa

EXAMPLES
  $ ali twu pa

  $ ali twu pa --file phrases.json
```

## `ali twu pd [PHRASEID]`

删除通义听悟热词词表

```
USAGE
  $ ali twu pd [PHRASEID]

ARGUMENTS
  [PHRASEID]  热词词表 ID (可选，不提供则交互式选择)

DESCRIPTION
  删除通义听悟热词词表

ALIASES
  $ ali twu pd

EXAMPLES
  $ ali twu pd

  $ ali twu pd a93b91141c0f422fa114af203f8b
```

## `ali twu pg [PHRASEID]`

查询通义听悟热词词表内容 (--out 可导出为 JSON 文件)

```
USAGE
  $ ali twu pg [PHRASEID] [-o <value>]

ARGUMENTS
  [PHRASEID]  热词词表 ID (可选，不提供则交互式选择)

FLAGS
  -o, --out=<value>  导出词表到指定 JSON 文件

DESCRIPTION
  查询通义听悟热词词表内容 (--out 可导出为 JSON 文件)

ALIASES
  $ ali twu pg

EXAMPLES
  $ ali twu pg

  $ ali twu pg a93b91141c0f422fa114af203f8b

  $ ali twu pg a93b91141c0f422fa114af203f8b --out phrases.json
```

## `ali twu phrase add`

创建通义听悟热词词表 (默认交互式，--file 则从文件导入)

```
USAGE
  $ ali twu phrase add [-f <value>]

FLAGS
  -f, --file=<value>  从 JSON 文件导入热词词表

DESCRIPTION
  创建通义听悟热词词表 (默认交互式，--file 则从文件导入)

ALIASES
  $ ali twu pa

EXAMPLES
  $ ali twu phrase add

  $ ali twu phrase add --file phrases.json
```

_See code: [src/commands/twu/phrase/add.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.10/src/commands/twu/phrase/add.ts)_

## `ali twu phrase del [PHRASEID]`

删除通义听悟热词词表

```
USAGE
  $ ali twu phrase del [PHRASEID]

ARGUMENTS
  [PHRASEID]  热词词表 ID (可选，不提供则交互式选择)

DESCRIPTION
  删除通义听悟热词词表

ALIASES
  $ ali twu pd

EXAMPLES
  $ ali twu phrase del

  $ ali twu phrase del a93b91141c0f422fa114af203f8b
```

_See code: [src/commands/twu/phrase/del.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.10/src/commands/twu/phrase/del.ts)_

## `ali twu phrase get [PHRASEID]`

查询通义听悟热词词表内容 (--out 可导出为 JSON 文件)

```
USAGE
  $ ali twu phrase get [PHRASEID] [-o <value>]

ARGUMENTS
  [PHRASEID]  热词词表 ID (可选，不提供则交互式选择)

FLAGS
  -o, --out=<value>  导出词表到指定 JSON 文件

DESCRIPTION
  查询通义听悟热词词表内容 (--out 可导出为 JSON 文件)

ALIASES
  $ ali twu pg

EXAMPLES
  $ ali twu phrase get

  $ ali twu phrase get a93b91141c0f422fa114af203f8b

  $ ali twu phrase get a93b91141c0f422fa114af203f8b --out phrases.json
```

_See code: [src/commands/twu/phrase/get.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.10/src/commands/twu/phrase/get.ts)_

## `ali twu phrase list`

列举通义听悟所有热词词表

```
USAGE
  $ ali twu phrase list

DESCRIPTION
  列举通义听悟所有热词词表

ALIASES
  $ ali twu pl

EXAMPLES
  $ ali twu phrase list
```

_See code: [src/commands/twu/phrase/list.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.10/src/commands/twu/phrase/list.ts)_

## `ali twu phrase update [PHRASEID]`

更新通义听悟热词词表 (默认增量编辑，--file 则从文件全覆盖导入)

```
USAGE
  $ ali twu phrase update [PHRASEID] [-f <value>]

ARGUMENTS
  [PHRASEID]  热词词表 ID (可选，不提供则交互式选择)

FLAGS
  -f, --file=<value>  从 JSON 文件导入热词词表 (全覆盖)

DESCRIPTION
  更新通义听悟热词词表 (默认增量编辑，--file 则从文件全覆盖导入)

ALIASES
  $ ali twu pu

EXAMPLES
  $ ali twu phrase update

  $ ali twu phrase update a93b91141c0f422fa114af203f8b

  $ ali twu phrase update a93b91141c0f422fa114af203f8b --file phrases.json
```

_See code: [src/commands/twu/phrase/update.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.10/src/commands/twu/phrase/update.ts)_

## `ali twu pl`

列举通义听悟所有热词词表

```
USAGE
  $ ali twu pl

DESCRIPTION
  列举通义听悟所有热词词表

ALIASES
  $ ali twu pl

EXAMPLES
  $ ali twu pl
```

## `ali twu pu [PHRASEID]`

更新通义听悟热词词表 (默认增量编辑，--file 则从文件全覆盖导入)

```
USAGE
  $ ali twu pu [PHRASEID] [-f <value>]

ARGUMENTS
  [PHRASEID]  热词词表 ID (可选，不提供则交互式选择)

FLAGS
  -f, --file=<value>  从 JSON 文件导入热词词表 (全覆盖)

DESCRIPTION
  更新通义听悟热词词表 (默认增量编辑，--file 则从文件全覆盖导入)

ALIASES
  $ ali twu pu

EXAMPLES
  $ ali twu pu

  $ ali twu pu a93b91141c0f422fa114af203f8b

  $ ali twu pu a93b91141c0f422fa114af203f8b --file phrases.json
```

## `ali twu ta`

创建通义听悟离线语音转写任务

```
USAGE
  $ ali twu ta

DESCRIPTION
  创建通义听悟离线语音转写任务

ALIASES
  $ ali twu ta

EXAMPLES
  $ ali twu ta
```

## `ali twu task add`

创建通义听悟离线语音转写任务

```
USAGE
  $ ali twu task add

DESCRIPTION
  创建通义听悟离线语音转写任务

ALIASES
  $ ali twu ta

EXAMPLES
  $ ali twu task add
```

_See code: [src/commands/twu/task/add.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.10/src/commands/twu/task/add.ts)_

## `ali twu task query [TASKID]`

根据任务 ID 查询通义听悟转写任务信息

```
USAGE
  $ ali twu task query [TASKID] [-d] [--vtt] [-w]

ARGUMENTS
  [TASKID]  听悟任务 ID

FLAGS
  -d, --download  任务完成时下载转写结果 JSON 到当前目录
  -w, --watch     轮询查询, 直到任务状态为完成或失败
      --vtt       轮询等待任务完成, 下载 JSON 并自动转换为 WebVTT 字幕文件

DESCRIPTION
  根据任务 ID 查询通义听悟转写任务信息

ALIASES
  $ ali twu tq

EXAMPLES
  $ ali twu task query c5394c6ee0fb474899d42215a3925c7e

  $ ali twu task query c5394c6ee0fb474899d42215a3925c7e --download

  $ ali twu task query c5394c6ee0fb474899d42215a3925c7e --watch --download

  $ ali twu task query c5394c6ee0fb474899d42215a3925c7e --vtt
```

_See code: [src/commands/twu/task/query.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.10/src/commands/twu/task/query.ts)_

## `ali twu tq [TASKID]`

根据任务 ID 查询通义听悟转写任务信息

```
USAGE
  $ ali twu tq [TASKID] [-d] [--vtt] [-w]

ARGUMENTS
  [TASKID]  听悟任务 ID

FLAGS
  -d, --download  任务完成时下载转写结果 JSON 到当前目录
  -w, --watch     轮询查询, 直到任务状态为完成或失败
      --vtt       轮询等待任务完成, 下载 JSON 并自动转换为 WebVTT 字幕文件

DESCRIPTION
  根据任务 ID 查询通义听悟转写任务信息

ALIASES
  $ ali twu tq

EXAMPLES
  $ ali twu tq c5394c6ee0fb474899d42215a3925c7e

  $ ali twu tq c5394c6ee0fb474899d42215a3925c7e --download

  $ ali twu tq c5394c6ee0fb474899d42215a3925c7e --watch --download

  $ ali twu tq c5394c6ee0fb474899d42215a3925c7e --vtt
```
