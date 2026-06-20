`ali bill`
==========

查询和分析阿里云账单

* [`ali bill analyze [CYCLE]`](#ali-bill-analyze-cycle)
* [`ali bill az [CYCLE]`](#ali-bill-az-cycle)
* [`ali bill detail [CYCLE]`](#ali-bill-detail-cycle)
* [`ali bill dl [CYCLE]`](#ali-bill-dl-cycle)
* [`ali bill download [CYCLE]`](#ali-bill-download-cycle)
* [`ali bill dt [CYCLE]`](#ali-bill-dt-cycle)

## `ali bill analyze [CYCLE]`

分析指定账期的费用构成 (按产品占比与排名)

```
USAGE
  $ ali bill analyze [CYCLE]

ARGUMENTS
  [CYCLE]  账期 YYYY-MM (默认上个月)

DESCRIPTION
  分析指定账期的费用构成 (按产品占比与排名)

ALIASES
  $ ali bill az

EXAMPLES
  $ ali bill analyze

  $ ali bill analyze 2025-04
```

_See code: [src/commands/bill/analyze.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.11/src/commands/bill/analyze.ts)_

## `ali bill az [CYCLE]`

分析指定账期的费用构成 (按产品占比与排名)

```
USAGE
  $ ali bill az [CYCLE]

ARGUMENTS
  [CYCLE]  账期 YYYY-MM (默认上个月)

DESCRIPTION
  分析指定账期的费用构成 (按产品占比与排名)

ALIASES
  $ ali bill az

EXAMPLES
  $ ali bill az

  $ ali bill az 2025-04
```

## `ali bill detail [CYCLE]`

展示指定账期的实例明细账单

```
USAGE
  $ ali bill detail [CYCLE]

ARGUMENTS
  [CYCLE]  账期 YYYY-MM (默认上个月)

DESCRIPTION
  展示指定账期的实例明细账单

ALIASES
  $ ali bill dt

EXAMPLES
  $ ali bill detail

  $ ali bill detail 2025-04
```

_See code: [src/commands/bill/detail.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.11/src/commands/bill/detail.ts)_

## `ali bill dl [CYCLE]`

下载指定账期的实例明细账单到当前目录

```
USAGE
  $ ali bill dl [CYCLE] [-f csv|json]

ARGUMENTS
  [CYCLE]  账期 YYYY-MM (默认上个月)

FLAGS
  -f, --format=<option>  [default: csv] 导出格式
                         <options: csv|json>

DESCRIPTION
  下载指定账期的实例明细账单到当前目录

ALIASES
  $ ali bill dl

EXAMPLES
  $ ali bill dl

  $ ali bill dl 2025-04

  $ ali bill dl 2025-04 -f json
```

## `ali bill download [CYCLE]`

下载指定账期的实例明细账单到当前目录

```
USAGE
  $ ali bill download [CYCLE] [-f csv|json]

ARGUMENTS
  [CYCLE]  账期 YYYY-MM (默认上个月)

FLAGS
  -f, --format=<option>  [default: csv] 导出格式
                         <options: csv|json>

DESCRIPTION
  下载指定账期的实例明细账单到当前目录

ALIASES
  $ ali bill dl

EXAMPLES
  $ ali bill download

  $ ali bill download 2025-04

  $ ali bill download 2025-04 -f json
```

_See code: [src/commands/bill/download.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.11/src/commands/bill/download.ts)_

## `ali bill dt [CYCLE]`

展示指定账期的实例明细账单

```
USAGE
  $ ali bill dt [CYCLE]

ARGUMENTS
  [CYCLE]  账期 YYYY-MM (默认上个月)

DESCRIPTION
  展示指定账期的实例明细账单

ALIASES
  $ ali bill dt

EXAMPLES
  $ ali bill dt

  $ ali bill dt 2025-04
```
