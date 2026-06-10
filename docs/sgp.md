`ali sgp`
=========

管理安全组

* [`ali sgp add [SECURITYGROUPNAME] [VPCID]`](#ali-sgp-add-securitygroupname-vpcid)
* [`ali sgp del [SECURITYGROUPID]`](#ali-sgp-del-securitygroupid)
* [`ali sgp list`](#ali-sgp-list)
* [`ali sgp ls`](#ali-sgp-ls)

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

_See code: [src/commands/sgp/add.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.6/src/commands/sgp/add.ts)_

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

_See code: [src/commands/sgp/del.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.6/src/commands/sgp/del.ts)_

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

_See code: [src/commands/sgp/list.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.6/src/commands/sgp/list.ts)_

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
