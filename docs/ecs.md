`ali ecs`
=========

管理 ECS 实例

* [`ali ecs add`](#ali-ecs-add)
* [`ali ecs del [INSTANCEID]`](#ali-ecs-del-instanceid)
* [`ali ecs list`](#ali-ecs-list)
* [`ali ecs ls`](#ali-ecs-ls)

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

_See code: [src/commands/ecs/add.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.6/src/commands/ecs/add.ts)_

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

_See code: [src/commands/ecs/del.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.6/src/commands/ecs/del.ts)_

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

_See code: [src/commands/ecs/list.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.6/src/commands/ecs/list.ts)_

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
