@lppx/ali
=================

aliyun cli tool


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@lppx/ali.svg)](https://npmjs.org/package/@lppx/ali)
[![Downloads/week](https://img.shields.io/npm/dw/@lppx/ali.svg)](https://npmjs.org/package/@lppx/ali)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @lppx/ali
$ ali COMMAND
running command...
$ ali (--version)
@lppx/ali/0.0.0 linux-x64 node-v22.22.3
$ ali --help [COMMAND]
USAGE
  $ ali COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`ali autocomplete [SHELL]`](#ali-autocomplete-shell)
* [`ali bkt add [NAME]`](#ali-bkt-add-name)
* [`ali bkt del`](#ali-bkt-del)
* [`ali bkt list`](#ali-bkt-list)
* [`ali bkt ls`](#ali-bkt-ls)
* [`ali bkt set`](#ali-bkt-set)
* [`ali bkt upload`](#ali-bkt-upload)
* [`ali config list`](#ali-config-list)
* [`ali config ls`](#ali-config-ls)
* [`ali config set`](#ali-config-set)
* [`ali ecs add`](#ali-ecs-add)
* [`ali ecs del [INSTANCEID]`](#ali-ecs-del-instanceid)
* [`ali ecs list`](#ali-ecs-list)
* [`ali ecs ls`](#ali-ecs-ls)
* [`ali help [COMMAND]`](#ali-help-command)
* [`ali img add [IMAGENAME] [INSTANCEID]`](#ali-img-add-imagename-instanceid)
* [`ali img del [IMAGEID]`](#ali-img-del-imageid)
* [`ali img list`](#ali-img-list)
* [`ali img ls`](#ali-img-ls)
* [`ali sgp add [SECURITYGROUPNAME] [VPCID]`](#ali-sgp-add-securitygroupname-vpcid)
* [`ali sgp del [SECURITYGROUPID]`](#ali-sgp-del-securitygroupid)
* [`ali sgp list`](#ali-sgp-list)
* [`ali sgp ls`](#ali-sgp-ls)
* [`ali version`](#ali-version)
* [`ali vpc add [CIDRBLOCK] [VPCNAME]`](#ali-vpc-add-cidrblock-vpcname)
* [`ali vpc del [VPCID]`](#ali-vpc-del-vpcid)
* [`ali vpc list`](#ali-vpc-list)
* [`ali vpc ls`](#ali-vpc-ls)
* [`ali vsw add [CIDRBLOCK] [VPCID] [VSWITCHNAME] [ZONEID]`](#ali-vsw-add-cidrblock-vpcid-vswitchname-zoneid)
* [`ali vsw del [VSWITCHID]`](#ali-vsw-del-vswitchid)
* [`ali vsw list [VPCID]`](#ali-vsw-list-vpcid)
* [`ali vsw ls [VPCID]`](#ali-vsw-ls-vpcid)

## `ali autocomplete [SHELL]`

Display autocomplete installation instructions.

```
USAGE
  $ ali autocomplete [SHELL] [-r]

ARGUMENTS
  [SHELL]  (zsh|bash|powershell) Shell type

FLAGS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

DESCRIPTION
  Display autocomplete installation instructions.

EXAMPLES
  $ ali autocomplete

  $ ali autocomplete bash

  $ ali autocomplete zsh

  $ ali autocomplete powershell

  $ ali autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v3.2.46/src/commands/autocomplete/index.ts)_

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

_See code: [src/commands/bkt/add.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.0/src/commands/bkt/add.ts)_

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

_See code: [src/commands/bkt/del.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.0/src/commands/bkt/del.ts)_

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

_See code: [src/commands/bkt/list.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.0/src/commands/bkt/list.ts)_

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

_See code: [src/commands/bkt/set.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.0/src/commands/bkt/set.ts)_

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

_See code: [src/commands/bkt/upload.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.0/src/commands/bkt/upload.ts)_

## `ali config list`

列出所有的配置

```
USAGE
  $ ali config list

DESCRIPTION
  列出所有的配置

ALIASES
  $ ali config ls

EXAMPLES
  $ ali config list
```

_See code: [src/commands/config/list.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.0/src/commands/config/list.ts)_

## `ali config ls`

列出所有的配置

```
USAGE
  $ ali config ls

DESCRIPTION
  列出所有的配置

ALIASES
  $ ali config ls

EXAMPLES
  $ ali config ls
```

## `ali config set`

设置配置文件

```
USAGE
  $ ali config set [-n <value>]

FLAGS
  -n, --name=<value>  配置文件名称

DESCRIPTION
  设置配置文件

EXAMPLES
  $ ali config set
```

_See code: [src/commands/config/set.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.0/src/commands/config/set.ts)_

## `ali ecs add`

创建 ECS 实例

```
USAGE
  $ ali ecs add

DESCRIPTION
  创建 ECS 实例

EXAMPLES
  $ ali ecs add
```

_See code: [src/commands/ecs/add.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.0/src/commands/ecs/add.ts)_

## `ali ecs del [INSTANCEID]`

删除 ECS 实例

```
USAGE
  $ ali ecs del [INSTANCEID]

ARGUMENTS
  [INSTANCEID]  ECS 实例 ID (可选，不提供则交互式选择)

DESCRIPTION
  删除 ECS 实例

EXAMPLES
  $ ali ecs del

  $ ali ecs del i-xxxxx
```

_See code: [src/commands/ecs/del.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.0/src/commands/ecs/del.ts)_

## `ali ecs list`

列出当前区域的所有 ECS 实例

```
USAGE
  $ ali ecs list [-b]

FLAGS
  -b, --block  使用块状显示模式

DESCRIPTION
  列出当前区域的所有 ECS 实例

ALIASES
  $ ali ecs ls

EXAMPLES
  $ ali ecs list

  $ ali ecs list --block
```

_See code: [src/commands/ecs/list.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.0/src/commands/ecs/list.ts)_

## `ali ecs ls`

列出当前区域的所有 ECS 实例

```
USAGE
  $ ali ecs ls [-b]

FLAGS
  -b, --block  使用块状显示模式

DESCRIPTION
  列出当前区域的所有 ECS 实例

ALIASES
  $ ali ecs ls

EXAMPLES
  $ ali ecs ls

  $ ali ecs ls --block
```

## `ali help [COMMAND]`

Display help for ali.

```
USAGE
  $ ali help [COMMAND...] [-n]

ARGUMENTS
  [COMMAND...]  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for ali.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/6.2.45/src/commands/help.ts)_

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

_See code: [src/commands/img/add.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.0/src/commands/img/add.ts)_

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

_See code: [src/commands/img/del.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.0/src/commands/img/del.ts)_

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

_See code: [src/commands/img/list.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.0/src/commands/img/list.ts)_

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

## `ali sgp add [SECURITYGROUPNAME] [VPCID]`

创建安全组

```
USAGE
  $ ali sgp add [SECURITYGROUPNAME] [VPCID]

ARGUMENTS
  [SECURITYGROUPNAME]  安全组名称
  [VPCID]              VPC ID

DESCRIPTION
  创建安全组

EXAMPLES
  $ ali sgp add

  $ ali sgp add vpc-xxxxx my-sg
```

_See code: [src/commands/sgp/add.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.0/src/commands/sgp/add.ts)_

## `ali sgp del [SECURITYGROUPID]`

删除安全组

```
USAGE
  $ ali sgp del [SECURITYGROUPID]

ARGUMENTS
  [SECURITYGROUPID]  安全组 ID (可选，不提供则交互式选择)

DESCRIPTION
  删除安全组

EXAMPLES
  $ ali sgp del

  $ ali sgp del sg-xxxxx
```

_See code: [src/commands/sgp/del.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.0/src/commands/sgp/del.ts)_

## `ali sgp list`

列出当前区域的所有安全组

```
USAGE
  $ ali sgp list [-b]

FLAGS
  -b, --block  使用块状显示模式

DESCRIPTION
  列出当前区域的所有安全组

ALIASES
  $ ali sgp ls

EXAMPLES
  $ ali sgp list

  $ ali sgp list --block
```

_See code: [src/commands/sgp/list.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.0/src/commands/sgp/list.ts)_

## `ali sgp ls`

列出当前区域的所有安全组

```
USAGE
  $ ali sgp ls [-b]

FLAGS
  -b, --block  使用块状显示模式

DESCRIPTION
  列出当前区域的所有安全组

ALIASES
  $ ali sgp ls

EXAMPLES
  $ ali sgp ls

  $ ali sgp ls --block
```

## `ali version`

```
USAGE
  $ ali version [--json] [--verbose]

FLAGS
  --verbose  Show additional information about the CLI.

GLOBAL FLAGS
  --json  Format output as json.

FLAG DESCRIPTIONS
  --verbose  Show additional information about the CLI.

    Additionally shows the architecture, node version, operating system, and versions of plugins that the CLI is using.
```

_See code: [@oclif/plugin-version](https://github.com/oclif/plugin-version/blob/2.2.42/src/commands/version.ts)_

## `ali vpc add [CIDRBLOCK] [VPCNAME]`

创建 VPC

```
USAGE
  $ ali vpc add [CIDRBLOCK] [VPCNAME]

ARGUMENTS
  [CIDRBLOCK]  CIDR 块 (例如: 10.0.0.0/8)
  [VPCNAME]    VPC 名称

DESCRIPTION
  创建 VPC

EXAMPLES
  $ ali vpc add

  $ ali vpc add 10.0.0.0/8 my-vpc
```

_See code: [src/commands/vpc/add.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.0/src/commands/vpc/add.ts)_

## `ali vpc del [VPCID]`

删除 VPC

```
USAGE
  $ ali vpc del [VPCID]

ARGUMENTS
  [VPCID]  VPC ID (可选，不提供则交互式选择)

DESCRIPTION
  删除 VPC

EXAMPLES
  $ ali vpc del

  $ ali vpc del vpc-xxxxx
```

_See code: [src/commands/vpc/del.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.0/src/commands/vpc/del.ts)_

## `ali vpc list`

列出当前区域的所有 VPC

```
USAGE
  $ ali vpc list

DESCRIPTION
  列出当前区域的所有 VPC

ALIASES
  $ ali vpc ls

EXAMPLES
  $ ali vpc list
```

_See code: [src/commands/vpc/list.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.0/src/commands/vpc/list.ts)_

## `ali vpc ls`

列出当前区域的所有 VPC

```
USAGE
  $ ali vpc ls

DESCRIPTION
  列出当前区域的所有 VPC

ALIASES
  $ ali vpc ls

EXAMPLES
  $ ali vpc ls
```

## `ali vsw add [CIDRBLOCK] [VPCID] [VSWITCHNAME] [ZONEID]`

创建交换机

```
USAGE
  $ ali vsw add [CIDRBLOCK] [VPCID] [VSWITCHNAME] [ZONEID]

ARGUMENTS
  [CIDRBLOCK]    CIDR 块 (例如: 10.10.1.0/24)
  [VPCID]        VPC ID
  [VSWITCHNAME]  交换机名称
  [ZONEID]       可用区 ID

DESCRIPTION
  创建交换机

EXAMPLES
  $ ali vsw add

  $ ali vsw add vpc-xxxxx cn-shenzhen-a 10.10.1.0/24 my-vswitch
```

_See code: [src/commands/vsw/add.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.0/src/commands/vsw/add.ts)_

## `ali vsw del [VSWITCHID]`

删除交换机

```
USAGE
  $ ali vsw del [VSWITCHID]

ARGUMENTS
  [VSWITCHID]  交换机 ID (可选，不提供则交互式选择)

DESCRIPTION
  删除交换机

EXAMPLES
  $ ali vsw del

  $ ali vsw del vsw-xxxxx
```

_See code: [src/commands/vsw/del.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.0/src/commands/vsw/del.ts)_

## `ali vsw list [VPCID]`

列出指定 VPC 下的所有交换机

```
USAGE
  $ ali vsw list [VPCID]

ARGUMENTS
  [VPCID]  VPC ID (可选，不提供则交互式选择)

DESCRIPTION
  列出指定 VPC 下的所有交换机

ALIASES
  $ ali vsw ls

EXAMPLES
  $ ali vsw list

  $ ali vsw list vpc-xxxxx
```

_See code: [src/commands/vsw/list.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.0/src/commands/vsw/list.ts)_

## `ali vsw ls [VPCID]`

列出指定 VPC 下的所有交换机

```
USAGE
  $ ali vsw ls [VPCID]

ARGUMENTS
  [VPCID]  VPC ID (可选，不提供则交互式选择)

DESCRIPTION
  列出指定 VPC 下的所有交换机

ALIASES
  $ ali vsw ls

EXAMPLES
  $ ali vsw ls

  $ ali vsw ls vpc-xxxxx
```
<!-- commandsstop -->
