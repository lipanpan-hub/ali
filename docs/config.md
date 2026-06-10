`ali config`
============

管理阿里云 CLI 配置

* [`ali config list`](#ali-config-list)
* [`ali config ls`](#ali-config-ls)
* [`ali config set`](#ali-config-set)

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

_See code: [src/commands/config/list.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.1/src/commands/config/list.ts)_

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

_See code: [src/commands/config/set.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.1/src/commands/config/set.ts)_
