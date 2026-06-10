`ali bkt`
=========

管理 OSS 存储空间

* [`ali bkt add [NAME]`](#ali-bkt-add-name)
* [`ali bkt del`](#ali-bkt-del)
* [`ali bkt list`](#ali-bkt-list)
* [`ali bkt ls`](#ali-bkt-ls)
* [`ali bkt set`](#ali-bkt-set)
* [`ali bkt upload`](#ali-bkt-upload)

## `ali bkt add [NAME]`

创建 OSS 存储空间

```
USAGE
  $ ali bkt add [NAME] [-r <value>]

ARGUMENTS
  [NAME]  存储桶名称

FLAGS
  -r, --region=<value>  区域ID (例如: cn-hangzhou)

DESCRIPTION
  创建 OSS 存储空间

EXAMPLES
  $ ali bkt add my-bucket -r cn-hangzhou

  $ ali bkt add
```

_See code: [src/commands/bkt/add.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.3/src/commands/bkt/add.ts)_

## `ali bkt del`

删除空的 OSS 存储空间（交互式选择）

```
USAGE
  $ ali bkt del

DESCRIPTION
  删除空的 OSS 存储空间（交互式选择）

EXAMPLES
  $ ali bkt del
```

_See code: [src/commands/bkt/del.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.3/src/commands/bkt/del.ts)_

## `ali bkt list`

列出当前账号的所有 OSS 存储空间

```
USAGE
  $ ali bkt list [-d]

FLAGS
  -d, --detail  交互式选择存储桶并显示详细信息

DESCRIPTION
  列出当前账号的所有 OSS 存储空间

ALIASES
  $ ali bkt ls

EXAMPLES
  $ ali bkt list

  $ ali bkt list -d
```

_See code: [src/commands/bkt/list.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.3/src/commands/bkt/list.ts)_

## `ali bkt ls`

列出当前账号的所有 OSS 存储空间

```
USAGE
  $ ali bkt ls [-d]

FLAGS
  -d, --detail  交互式选择存储桶并显示详细信息

DESCRIPTION
  列出当前账号的所有 OSS 存储空间

ALIASES
  $ ali bkt ls

EXAMPLES
  $ ali bkt ls

  $ ali bkt ls -d
```

## `ali bkt set`

交互式设置存储桶属性

```
USAGE
  $ ali bkt set

DESCRIPTION
  交互式设置存储桶属性

EXAMPLES
  $ ali bkt set
```

_See code: [src/commands/bkt/set.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.3/src/commands/bkt/set.ts)_

## `ali bkt upload`

交互式选择文件并上传到 OSS 存储桶

```
USAGE
  $ ali bkt upload

DESCRIPTION
  交互式选择文件并上传到 OSS 存储桶

EXAMPLES
  $ ali bkt upload
```

_See code: [src/commands/bkt/upload.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.3/src/commands/bkt/upload.ts)_
