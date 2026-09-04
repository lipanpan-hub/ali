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

_See code: [src/commands/twu/phrase/add.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.13/src/commands/twu/phrase/add.ts)_

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

_See code: [src/commands/twu/phrase/del.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.13/src/commands/twu/phrase/del.ts)_

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

_See code: [src/commands/twu/phrase/get.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.13/src/commands/twu/phrase/get.ts)_

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

_See code: [src/commands/twu/phrase/list.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.13/src/commands/twu/phrase/list.ts)_

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

_See code: [src/commands/twu/phrase/update.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.13/src/commands/twu/phrase/update.ts)_

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

创建通义听悟离线语音转写任务 (提交后轮询等待完成, 自动下载结果并生成 VTT 字幕和纯文本)

```
USAGE
  $ ali twu ta [-k <value>] [--diarization] [-u <value>] [-l cn|en|yue|ja|ko|auto] [--paragraph] [--phrase]
    [-p <value>] [--speaker-count <value>] [--txt] [--vtt]

FLAGS
  -k, --app-key=<value>        听悟项目 AppKey
  -l, --language=<option>      源语言
                               <options: cn|en|yue|ja|ko|auto>
  -p, --phrase-id=<value>      热词词表 ID
  -u, --file-url=<value>       音视频文件 URL
      --[no-]diarization       开启说话人分离 (不指定则交互式询问)
      --paragraph              额外按段落生成 WebVTT 字幕文件
      --[no-]phrase            是否使用热词词表 (不指定则交互式询问)
      --speaker-count=<value>  说话人数量 (0 表示自动判断), 指定即开启说话人分离
      --txt                    将识别结果抽取为纯文本文件
      --vtt                    将识别结果转换为 WebVTT 字幕文件

DESCRIPTION
  创建通义听悟离线语音转写任务 (提交后轮询等待完成, 自动下载结果并生成 VTT 字幕和纯文本)

ALIASES
  $ ali twu ta

EXAMPLES
  $ ali twu ta

  $ ali twu ta -k myAppKey -u https://example.com/a.mp4 -l cn

  $ ali twu ta -u https://example.com/a.mp4 --diarization --speaker-count 2

  $ ali twu ta -u https://example.com/a.mp4 -p phrase-id-xxx --paragraph
```

## `ali twu task add`

创建通义听悟离线语音转写任务 (提交后轮询等待完成, 自动下载结果并生成 VTT 字幕和纯文本)

```
USAGE
  $ ali twu task add [-k <value>] [--diarization] [-u <value>] [-l cn|en|yue|ja|ko|auto] [--paragraph] [--phrase]
    [-p <value>] [--speaker-count <value>] [--txt] [--vtt]

FLAGS
  -k, --app-key=<value>        听悟项目 AppKey
  -l, --language=<option>      源语言
                               <options: cn|en|yue|ja|ko|auto>
  -p, --phrase-id=<value>      热词词表 ID
  -u, --file-url=<value>       音视频文件 URL
      --[no-]diarization       开启说话人分离 (不指定则交互式询问)
      --paragraph              额外按段落生成 WebVTT 字幕文件
      --[no-]phrase            是否使用热词词表 (不指定则交互式询问)
      --speaker-count=<value>  说话人数量 (0 表示自动判断), 指定即开启说话人分离
      --txt                    将识别结果抽取为纯文本文件
      --vtt                    将识别结果转换为 WebVTT 字幕文件

DESCRIPTION
  创建通义听悟离线语音转写任务 (提交后轮询等待完成, 自动下载结果并生成 VTT 字幕和纯文本)

ALIASES
  $ ali twu ta

EXAMPLES
  $ ali twu task add

  $ ali twu task add -k myAppKey -u https://example.com/a.mp4 -l cn

  $ ali twu task add -u https://example.com/a.mp4 --diarization --speaker-count 2

  $ ali twu task add -u https://example.com/a.mp4 -p phrase-id-xxx --paragraph
```

_See code: [src/commands/twu/task/add.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.13/src/commands/twu/task/add.ts)_
