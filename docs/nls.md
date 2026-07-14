`ali nls`
=========

智能语音服务 (录音文件识别)

* [`ali nls t`](#ali-nls-t)
* [`ali nls trans`](#ali-nls-trans)

## `ali nls t`

录音文件识别 (提交音频/视频文件 URL, 轮询并输出识别文本)

```
USAGE
  $ ali nls t [-k <value>] [-u <value>] [--txt] [--vtt] [--words]

FLAGS
  -k, --app-key=<value>    NLS 项目 AppKey
  -u, --file-link=<value>  录音文件 URL
      --txt                将识别出的所有句子额外抽取为纯文本文件
      --vtt                将识别结果额外转换为 VTT 字幕文件
      --words              输出词级别信息 (enable_words)

DESCRIPTION
  录音文件识别 (提交音频/视频文件 URL, 轮询并输出识别文本)

ALIASES
  $ ali nls t

EXAMPLES
  $ ali nls t -u https://example.com/a.wav

  $ ali nls t -u https://example.com/a.wav -k myAppKey --words
```

## `ali nls trans`

录音文件识别 (提交音频/视频文件 URL, 轮询并输出识别文本)

```
USAGE
  $ ali nls trans [-k <value>] [-u <value>] [--txt] [--vtt] [--words]

FLAGS
  -k, --app-key=<value>    NLS 项目 AppKey
  -u, --file-link=<value>  录音文件 URL
      --txt                将识别出的所有句子额外抽取为纯文本文件
      --vtt                将识别结果额外转换为 VTT 字幕文件
      --words              输出词级别信息 (enable_words)

DESCRIPTION
  录音文件识别 (提交音频/视频文件 URL, 轮询并输出识别文本)

ALIASES
  $ ali nls t

EXAMPLES
  $ ali nls trans -u https://example.com/a.wav

  $ ali nls trans -u https://example.com/a.wav -k myAppKey --words
```

_See code: [src/commands/nls/trans.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.12/src/commands/nls/trans.ts)_
