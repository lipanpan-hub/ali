`ali vsw`
=========

管理交换机

* [`ali vsw add [CIDRBLOCK] [VPCID] [VSWITCHNAME] [ZONEID]`](#ali-vsw-add-cidrblock-vpcid-vswitchname-zoneid)
* [`ali vsw del [VSWITCHID]`](#ali-vsw-del-vswitchid)
* [`ali vsw list [VPCID]`](#ali-vsw-list-vpcid)
* [`ali vsw ls [VPCID]`](#ali-vsw-ls-vpcid)

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

_See code: [src/commands/vsw/add.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.8/src/commands/vsw/add.ts)_

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

_See code: [src/commands/vsw/del.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.8/src/commands/vsw/del.ts)_

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

_See code: [src/commands/vsw/list.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.8/src/commands/vsw/list.ts)_

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
