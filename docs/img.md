`ali img`
=========

管理镜像

* [`ali img add [IMAGENAME] [INSTANCEID]`](#ali-img-add-imagename-instanceid)
* [`ali img del [IMAGEID]`](#ali-img-del-imageid)
* [`ali img list`](#ali-img-list)
* [`ali img ls`](#ali-img-ls)

## `ali img add [IMAGENAME] [INSTANCEID]`

创建自定义镜像

```
USAGE
  $ ali img add [IMAGENAME] [INSTANCEID]

ARGUMENTS
  [IMAGENAME]   镜像名称
  [INSTANCEID]  ECS 实例 ID

DESCRIPTION
  创建自定义镜像

EXAMPLES
  $ ali img add

  $ ali img add i-xxxxx my-image
```

_See code: [src/commands/img/add.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.4/src/commands/img/add.ts)_

## `ali img del [IMAGEID]`

删除自定义镜像

```
USAGE
  $ ali img del [IMAGEID]

ARGUMENTS
  [IMAGEID]  镜像 ID (可选，不提供则交互式选择)

DESCRIPTION
  删除自定义镜像

EXAMPLES
  $ ali img del

  $ ali img del m-xxxxx
```

_See code: [src/commands/img/del.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.4/src/commands/img/del.ts)_

## `ali img list`

列出指定平台的可用镜像

```
USAGE
  $ ali img list [-p <value>]

FLAGS
  -p, --platform=<value>  [default: Ubuntu] 操作系统平台名称

DESCRIPTION
  列出指定平台的可用镜像

ALIASES
  $ ali img ls

EXAMPLES
  $ ali img list

  $ ali img list --platform Ubuntu

  $ ali img list -p Debian
```

_See code: [src/commands/img/list.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.4/src/commands/img/list.ts)_

## `ali img ls`

列出指定平台的可用镜像

```
USAGE
  $ ali img ls [-p <value>]

FLAGS
  -p, --platform=<value>  [default: Ubuntu] 操作系统平台名称

DESCRIPTION
  列出指定平台的可用镜像

ALIASES
  $ ali img ls

EXAMPLES
  $ ali img ls

  $ ali img ls --platform Ubuntu

  $ ali img ls -p Debian
```
