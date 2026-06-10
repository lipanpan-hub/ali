`ali vpc`
=========

管理 VPC

* [`ali vpc add [CIDRBLOCK] [VPCNAME]`](#ali-vpc-add-cidrblock-vpcname)
* [`ali vpc del [VPCID]`](#ali-vpc-del-vpcid)
* [`ali vpc list`](#ali-vpc-list)
* [`ali vpc ls`](#ali-vpc-ls)

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

_See code: [src/commands/vpc/add.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.4/src/commands/vpc/add.ts)_

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

_See code: [src/commands/vpc/del.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.4/src/commands/vpc/del.ts)_

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

_See code: [src/commands/vpc/list.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.4/src/commands/vpc/list.ts)_

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
