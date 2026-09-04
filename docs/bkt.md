`ali bkt`
=========

管理 OSS 存储空间

* [`ali bkt add [NAME]`](#ali-bkt-add-name)
* [`ali bkt bd add`](#ali-bkt-bd-add)
* [`ali bkt bd del`](#ali-bkt-bd-del)
* [`ali bkt bd ls`](#ali-bkt-bd-ls)
* [`ali bkt bd sync`](#ali-bkt-bd-sync)
* [`ali bkt binding add`](#ali-bkt-binding-add)
* [`ali bkt binding create`](#ali-bkt-binding-create)
* [`ali bkt binding del`](#ali-bkt-binding-del)
* [`ali bkt binding list`](#ali-bkt-binding-list)
* [`ali bkt binding ls`](#ali-bkt-binding-ls)
* [`ali bkt binding remove`](#ali-bkt-binding-remove)
* [`ali bkt binding sync`](#ali-bkt-binding-sync)
* [`ali bkt config`](#ali-bkt-config)
* [`ali bkt create [NAME]`](#ali-bkt-create-name)
* [`ali bkt del`](#ali-bkt-del)
* [`ali bkt list`](#ali-bkt-list)
* [`ali bkt ls`](#ali-bkt-ls)
* [`ali bkt obj del [BUCKET]`](#ali-bkt-obj-del-bucket)
* [`ali bkt obj info [BUCKET] [OBJECT]`](#ali-bkt-obj-info-bucket-object)
* [`ali bkt obj list [BUCKET]`](#ali-bkt-obj-list-bucket)
* [`ali bkt obj ls [BUCKET]`](#ali-bkt-obj-ls-bucket)
* [`ali bkt obj rm [BUCKET]`](#ali-bkt-obj-rm-bucket)
* [`ali bkt obj show [BUCKET] [OBJECT]`](#ali-bkt-obj-show-bucket-object)
* [`ali bkt obj sign [BUCKET] [OBJECT]`](#ali-bkt-obj-sign-bucket-object)
* [`ali bkt obj up [BUCKET]`](#ali-bkt-obj-up-bucket)
* [`ali bkt obj upload [BUCKET]`](#ali-bkt-obj-upload-bucket)
* [`ali bkt obj url [BUCKET] [OBJECT]`](#ali-bkt-obj-url-bucket-object)
* [`ali bkt rm`](#ali-bkt-rm)
* [`ali bkt set`](#ali-bkt-set)
* [`ali bkt sign [BUCKET] [OBJECT]`](#ali-bkt-sign-bucket-object)
* [`ali bkt upload-url [BUCKET] [OBJECT]`](#ali-bkt-upload-url-bucket-object)

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

ALIASES
  $ ali bkt create

EXAMPLES
  $ ali bkt add my-bucket -r cn-hangzhou

  $ ali bkt add
```

_See code: [src/commands/bkt/add.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.13/src/commands/bkt/add.ts)_

## `ali bkt bd add`

创建本地目录与 OSS 存储桶的绑定关系

```
USAGE
  $ ali bkt bd add

DESCRIPTION
  创建本地目录与 OSS 存储桶的绑定关系

ALIASES
  $ ali bkt binding create
  $ ali bkt bd add

EXAMPLES
  $ ali bkt bd add
```

## `ali bkt bd del`

交互式选择并删除一个本地目录与 OSS 存储桶的绑定关系

```
USAGE
  $ ali bkt bd del

DESCRIPTION
  交互式选择并删除一个本地目录与 OSS 存储桶的绑定关系

ALIASES
  $ ali bkt binding remove
  $ ali bkt bd del

EXAMPLES
  $ ali bkt bd del
```

## `ali bkt bd ls`

列出本地目录与 OSS 存储桶的绑定关系

```
USAGE
  $ ali bkt bd ls [-r]

FLAGS
  -r, --run  交互式选择一个绑定并预览过滤后可上传的文件列表

DESCRIPTION
  列出本地目录与 OSS 存储桶的绑定关系

ALIASES
  $ ali bkt binding list
  $ ali bkt bd ls

EXAMPLES
  $ ali bkt bd ls

  $ ali bkt bd ls --run
```

## `ali bkt bd sync`

交互式选择一个绑定关系, 将本地目录中过滤后的文件增量同步到 OSS 存储桶

```
USAGE
  $ ali bkt bd sync

DESCRIPTION
  交互式选择一个绑定关系, 将本地目录中过滤后的文件增量同步到 OSS 存储桶

ALIASES
  $ ali bkt bd sync

EXAMPLES
  $ ali bkt bd sync
```

## `ali bkt binding add`

创建本地目录与 OSS 存储桶的绑定关系

```
USAGE
  $ ali bkt binding add

DESCRIPTION
  创建本地目录与 OSS 存储桶的绑定关系

ALIASES
  $ ali bkt binding create
  $ ali bkt bd add

EXAMPLES
  $ ali bkt binding add
```

_See code: [src/commands/bkt/binding/add.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.13/src/commands/bkt/binding/add.ts)_

## `ali bkt binding create`

创建本地目录与 OSS 存储桶的绑定关系

```
USAGE
  $ ali bkt binding create

DESCRIPTION
  创建本地目录与 OSS 存储桶的绑定关系

ALIASES
  $ ali bkt binding create
  $ ali bkt bd add

EXAMPLES
  $ ali bkt binding create
```

## `ali bkt binding del`

交互式选择并删除一个本地目录与 OSS 存储桶的绑定关系

```
USAGE
  $ ali bkt binding del

DESCRIPTION
  交互式选择并删除一个本地目录与 OSS 存储桶的绑定关系

ALIASES
  $ ali bkt binding remove
  $ ali bkt bd del

EXAMPLES
  $ ali bkt binding del
```

_See code: [src/commands/bkt/binding/del.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.13/src/commands/bkt/binding/del.ts)_

## `ali bkt binding list`

列出本地目录与 OSS 存储桶的绑定关系

```
USAGE
  $ ali bkt binding list [-r]

FLAGS
  -r, --run  交互式选择一个绑定并预览过滤后可上传的文件列表

DESCRIPTION
  列出本地目录与 OSS 存储桶的绑定关系

ALIASES
  $ ali bkt binding list
  $ ali bkt bd ls

EXAMPLES
  $ ali bkt binding list

  $ ali bkt binding list --run
```

## `ali bkt binding ls`

列出本地目录与 OSS 存储桶的绑定关系

```
USAGE
  $ ali bkt binding ls [-r]

FLAGS
  -r, --run  交互式选择一个绑定并预览过滤后可上传的文件列表

DESCRIPTION
  列出本地目录与 OSS 存储桶的绑定关系

ALIASES
  $ ali bkt binding list
  $ ali bkt bd ls

EXAMPLES
  $ ali bkt binding ls

  $ ali bkt binding ls --run
```

_See code: [src/commands/bkt/binding/ls.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.13/src/commands/bkt/binding/ls.ts)_

## `ali bkt binding remove`

交互式选择并删除一个本地目录与 OSS 存储桶的绑定关系

```
USAGE
  $ ali bkt binding remove

DESCRIPTION
  交互式选择并删除一个本地目录与 OSS 存储桶的绑定关系

ALIASES
  $ ali bkt binding remove
  $ ali bkt bd del

EXAMPLES
  $ ali bkt binding remove
```

## `ali bkt binding sync`

交互式选择一个绑定关系, 将本地目录中过滤后的文件增量同步到 OSS 存储桶

```
USAGE
  $ ali bkt binding sync

DESCRIPTION
  交互式选择一个绑定关系, 将本地目录中过滤后的文件增量同步到 OSS 存储桶

ALIASES
  $ ali bkt bd sync

EXAMPLES
  $ ali bkt binding sync
```

_See code: [src/commands/bkt/binding/sync.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.13/src/commands/bkt/binding/sync.ts)_

## `ali bkt config`

交互式设置存储桶属性

```
USAGE
  $ ali bkt config

DESCRIPTION
  交互式设置存储桶属性

ALIASES
  $ ali bkt config

EXAMPLES
  $ ali bkt config
```

## `ali bkt create [NAME]`

创建 OSS 存储空间

```
USAGE
  $ ali bkt create [NAME] [-r <value>]

ARGUMENTS
  [NAME]  存储桶名称

FLAGS
  -r, --region=<value>  区域ID (例如: cn-hangzhou)

DESCRIPTION
  创建 OSS 存储空间

ALIASES
  $ ali bkt create

EXAMPLES
  $ ali bkt create my-bucket -r cn-hangzhou

  $ ali bkt create
```

## `ali bkt del`

删除空的 OSS 存储空间（交互式选择）

```
USAGE
  $ ali bkt del

DESCRIPTION
  删除空的 OSS 存储空间（交互式选择）

ALIASES
  $ ali bkt rm

EXAMPLES
  $ ali bkt del
```

_See code: [src/commands/bkt/del.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.13/src/commands/bkt/del.ts)_

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

_See code: [src/commands/bkt/list.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.13/src/commands/bkt/list.ts)_

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

## `ali bkt obj del [BUCKET]`

删除 OSS 存储桶中的对象，交互式多选，未指定存储桶时交互式选择

```
USAGE
  $ ali bkt obj del [BUCKET]

ARGUMENTS
  [BUCKET]  存储桶名称

DESCRIPTION
  删除 OSS 存储桶中的对象，交互式多选，未指定存储桶时交互式选择

ALIASES
  $ ali bkt obj rm

EXAMPLES
  $ ali bkt obj del

  $ ali bkt obj del my-bucket
```

_See code: [src/commands/bkt/obj/del.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.13/src/commands/bkt/obj/del.ts)_

## `ali bkt obj info [BUCKET] [OBJECT]`

显示 OSS 存储桶中对象的详细信息，未指定时交互式选择

```
USAGE
  $ ali bkt obj info [BUCKET] [OBJECT]

ARGUMENTS
  [BUCKET]  存储桶名称
  [OBJECT]  对象名称

DESCRIPTION
  显示 OSS 存储桶中对象的详细信息，未指定时交互式选择

ALIASES
  $ ali bkt obj info

EXAMPLES
  $ ali bkt obj info

  $ ali bkt obj info my-bucket path/to/file.zip
```

## `ali bkt obj list [BUCKET]`

列出 OSS 存储桶中的对象，未指定存储桶时交互式选择

```
USAGE
  $ ali bkt obj list [BUCKET]

ARGUMENTS
  [BUCKET]  存储桶名称

DESCRIPTION
  列出 OSS 存储桶中的对象，未指定存储桶时交互式选择

ALIASES
  $ ali bkt obj ls

EXAMPLES
  $ ali bkt obj list

  $ ali bkt obj list my-bucket
```

_See code: [src/commands/bkt/obj/list.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.13/src/commands/bkt/obj/list.ts)_

## `ali bkt obj ls [BUCKET]`

列出 OSS 存储桶中的对象，未指定存储桶时交互式选择

```
USAGE
  $ ali bkt obj ls [BUCKET]

ARGUMENTS
  [BUCKET]  存储桶名称

DESCRIPTION
  列出 OSS 存储桶中的对象，未指定存储桶时交互式选择

ALIASES
  $ ali bkt obj ls

EXAMPLES
  $ ali bkt obj ls

  $ ali bkt obj ls my-bucket
```

## `ali bkt obj rm [BUCKET]`

删除 OSS 存储桶中的对象，交互式多选，未指定存储桶时交互式选择

```
USAGE
  $ ali bkt obj rm [BUCKET]

ARGUMENTS
  [BUCKET]  存储桶名称

DESCRIPTION
  删除 OSS 存储桶中的对象，交互式多选，未指定存储桶时交互式选择

ALIASES
  $ ali bkt obj rm

EXAMPLES
  $ ali bkt obj rm

  $ ali bkt obj rm my-bucket
```

## `ali bkt obj show [BUCKET] [OBJECT]`

显示 OSS 存储桶中对象的详细信息，未指定时交互式选择

```
USAGE
  $ ali bkt obj show [BUCKET] [OBJECT]

ARGUMENTS
  [BUCKET]  存储桶名称
  [OBJECT]  对象名称

DESCRIPTION
  显示 OSS 存储桶中对象的详细信息，未指定时交互式选择

ALIASES
  $ ali bkt obj info

EXAMPLES
  $ ali bkt obj show

  $ ali bkt obj show my-bucket path/to/file.zip
```

_See code: [src/commands/bkt/obj/show.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.13/src/commands/bkt/obj/show.ts)_

## `ali bkt obj sign [BUCKET] [OBJECT]`

为 OSS 存储桶中的对象生成下载签名 URL，未指定时交互式选择

```
USAGE
  $ ali bkt obj sign [BUCKET] [OBJECT] [-e <value>]

ARGUMENTS
  [BUCKET]  存储桶名称
  [OBJECT]  对象名称

FLAGS
  -e, --expires=<value>  [default: 3600] URL 有效期（秒）

DESCRIPTION
  为 OSS 存储桶中的对象生成下载签名 URL，未指定时交互式选择

ALIASES
  $ ali bkt obj url

EXAMPLES
  $ ali bkt obj sign

  $ ali bkt obj sign my-bucket path/to/file.zip

  $ ali bkt obj sign my-bucket path/to/file.zip --expires 7200
```

_See code: [src/commands/bkt/obj/sign.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.13/src/commands/bkt/obj/sign.ts)_

## `ali bkt obj up [BUCKET]`

上传文件到 OSS 存储桶，未指定 --file 时交互式选择当前目录文件

```
USAGE
  $ ali bkt obj up [BUCKET] [-f <value>...]

ARGUMENTS
  [BUCKET]  存储桶名称，未指定时交互式选择

FLAGS
  -f, --file=<value>...  手动指定要上传的文件路径，可多次指定

DESCRIPTION
  上传文件到 OSS 存储桶，未指定 --file 时交互式选择当前目录文件

ALIASES
  $ ali bkt obj up

EXAMPLES
  $ ali bkt obj up

  $ ali bkt obj up my-bucket

  $ ali bkt obj up my-bucket -f ./a.zip -f /path/to/b.png
```

## `ali bkt obj upload [BUCKET]`

上传文件到 OSS 存储桶，未指定 --file 时交互式选择当前目录文件

```
USAGE
  $ ali bkt obj upload [BUCKET] [-f <value>...]

ARGUMENTS
  [BUCKET]  存储桶名称，未指定时交互式选择

FLAGS
  -f, --file=<value>...  手动指定要上传的文件路径，可多次指定

DESCRIPTION
  上传文件到 OSS 存储桶，未指定 --file 时交互式选择当前目录文件

ALIASES
  $ ali bkt obj up

EXAMPLES
  $ ali bkt obj upload

  $ ali bkt obj upload my-bucket

  $ ali bkt obj upload my-bucket -f ./a.zip -f /path/to/b.png
```

_See code: [src/commands/bkt/obj/upload.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.13/src/commands/bkt/obj/upload.ts)_

## `ali bkt obj url [BUCKET] [OBJECT]`

为 OSS 存储桶中的对象生成下载签名 URL，未指定时交互式选择

```
USAGE
  $ ali bkt obj url [BUCKET] [OBJECT] [-e <value>]

ARGUMENTS
  [BUCKET]  存储桶名称
  [OBJECT]  对象名称

FLAGS
  -e, --expires=<value>  [default: 3600] URL 有效期（秒）

DESCRIPTION
  为 OSS 存储桶中的对象生成下载签名 URL，未指定时交互式选择

ALIASES
  $ ali bkt obj url

EXAMPLES
  $ ali bkt obj url

  $ ali bkt obj url my-bucket path/to/file.zip

  $ ali bkt obj url my-bucket path/to/file.zip --expires 7200
```

## `ali bkt rm`

删除空的 OSS 存储空间（交互式选择）

```
USAGE
  $ ali bkt rm

DESCRIPTION
  删除空的 OSS 存储空间（交互式选择）

ALIASES
  $ ali bkt rm

EXAMPLES
  $ ali bkt rm
```

## `ali bkt set`

交互式设置存储桶属性

```
USAGE
  $ ali bkt set

DESCRIPTION
  交互式设置存储桶属性

ALIASES
  $ ali bkt config

EXAMPLES
  $ ali bkt set
```

_See code: [src/commands/bkt/set.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.13/src/commands/bkt/set.ts)_

## `ali bkt sign [BUCKET] [OBJECT]`

为 OSS 存储桶生成上传签名 URL，未指定时交互式选择

```
USAGE
  $ ali bkt sign [BUCKET] [OBJECT] [-e <value>]

ARGUMENTS
  [BUCKET]  存储桶名称
  [OBJECT]  上传的对象名称（含路径）

FLAGS
  -e, --expires=<value>  [default: 3600] URL 有效期（秒）

DESCRIPTION
  为 OSS 存储桶生成上传签名 URL，未指定时交互式选择

ALIASES
  $ ali bkt upload-url

EXAMPLES
  $ ali bkt sign

  $ ali bkt sign my-bucket path/to/file.zip

  $ ali bkt sign my-bucket path/to/file.zip --expires 7200
```

_See code: [src/commands/bkt/sign.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.13/src/commands/bkt/sign.ts)_

## `ali bkt upload-url [BUCKET] [OBJECT]`

为 OSS 存储桶生成上传签名 URL，未指定时交互式选择

```
USAGE
  $ ali bkt upload-url [BUCKET] [OBJECT] [-e <value>]

ARGUMENTS
  [BUCKET]  存储桶名称
  [OBJECT]  上传的对象名称（含路径）

FLAGS
  -e, --expires=<value>  [default: 3600] URL 有效期（秒）

DESCRIPTION
  为 OSS 存储桶生成上传签名 URL，未指定时交互式选择

ALIASES
  $ ali bkt upload-url

EXAMPLES
  $ ali bkt upload-url

  $ ali bkt upload-url my-bucket path/to/file.zip

  $ ali bkt upload-url my-bucket path/to/file.zip --expires 7200
```
