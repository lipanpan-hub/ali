@lppx/ali
=================

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@lppx/ali.svg)](https://npmjs.org/package/@lppx/ali)

# 项目介绍

`@lppx/ali` 是一个阿里云命令行工具,面向需要通过命令行管理阿里云资源的开发者和运维人员。

它将常用的阿里云资源操作封装为简洁直观的命令,支持多配置(Profile)管理与交互式操作,主要能力包括:

- **账单管理 (bill)**:查询账单总览、明细,分析费用构成,并导出为 CSV / JSON
- **OSS 存储 (bkt)**:创建/删除存储空间、查看详情、设置属性、上传文件
- **ECS 实例 (ecs)**:创建、删除、列出 ECS 实例
- **镜像管理 (img)**:管理自定义镜像
- **网络管理 (vpc / vsw / sgp)**:管理 VPC、交换机与安全组
- **配置管理 (config)**:管理多套阿里云访问凭证与区域配置

# 安装方法

### 通过安装包安装

也可以前往 GitHub 的 [Release 页面](https://github.com/lipanpan-hub/ali/releases) 下载对应平台的安装包(如 Windows 安装程序),直接安装即可使用,无需预先安装 Node.js 环境。

### 通过 npm 全局安装

```bash
npm install -g @lppx/ali
```

安装完成后,即可在终端使用 `ali` 命令:

```bash
ali --version
ali --help
```

### 环境要求

- Node.js >= 18.0.0(仅 npm 安装方式需要)

# 使用方法

### 1. 配置访问凭证

首次使用前,需要先配置阿里云的 AccessKey 与默认区域。运行以下命令进入交互式配置:

```bash
ali config set
```

按提示依次输入配置名称、`access_key_id`、`access_key_secret`,并选择默认区域。配置文件会保存到 `~/.aliops/config.json`,支持配置多套凭证(Profile)并随时切换。

查看已有配置:

```bash
ali config list
```

### 2. 使用命令

配置完成后即可使用各类命令,例如:

```bash
# 查看上个月账单总览
ali bill overview

# 分析指定账期的费用构成
ali bill analyze 2025-04

# 导出账单明细为 JSON
ali bill download 2025-04 -f json

# 列出当前区域的 ECS 实例
ali ecs list

# 列出所有 OSS 存储空间
ali bkt list
```

大多数支持删除、创建的命令都提供交互式选择,直接运行即可按提示操作。

### 3. 查看帮助

任何命令都可以追加 `--help` 查看详细用法:

```bash
ali --help
ali bill --help
ali ecs list --help
```

下方列出了全部命令主题,点击可查看各命令的完整文档。



<!-- commands -->
# Command Topics

* [`ali autocomplete`](docs/autocomplete.md) - Display autocomplete installation instructions.
* [`ali bill`](docs/bill.md) - 查询和分析阿里云账单
* [`ali bkt`](docs/bkt.md) - 管理 OSS 存储空间
* [`ali config`](docs/config.md) - 管理阿里云 CLI 配置
* [`ali ecs`](docs/ecs.md) - 管理 ECS 实例
* [`ali help`](docs/help.md) - Display help for ali.
* [`ali img`](docs/img.md) - 管理镜像
* [`ali sgp`](docs/sgp.md) - 管理安全组
* [`ali twu`](docs/twu.md) - 管理通义听悟任务
* [`ali version`](docs/version.md) - 查看项目的版本
* [`ali vpc`](docs/vpc.md) - 管理 VPC
* [`ali vsw`](docs/vsw.md) - 管理交换机

<!-- commandsstop -->
