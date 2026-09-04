@lppx/ali
=================

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@lppx/ali.svg)](https://npmjs.org/package/@lppx/ali)

# 项目介绍

`@lppx/ali` 是一个阿里云命令行工具,面向需要通过命令行管理阿里云资源的开发者和运维人员。

它将常用的阿里云资源操作封装为简洁直观的命令,支持多套凭证(Profile)管理、命令简写与交互式操作。绝大多数命令在缺少参数时会自动进入交互式选择(支持关键字模糊搜索),不需要提前把资源 ID 记在手边。

主要能力:

- **账单 (bill)**:按账期查看账单总览与实例明细、分析费用构成与产品排名,导出 CSV / JSON
- **OSS 存储 (bkt)**:创建/删除存储空间、查看与设置属性、列举对象、上传/删除对象、生成上传与下载签名 URL
- **OSS 目录绑定 (bkt binding)**:把本地目录与存储桶绑定,配合正/反向过滤器做增量同步(按云端 ETag 比对,内容未变的文件自动跳过)
- **ECS 实例 (ecs)**:创建、删除、列出 ECS 实例(支持表格与块状两种展示)
- **镜像 (img)**:按平台列出公共镜像、创建与删除自定义镜像
- **网络 (vpc / vsw / sgp)**:管理 VPC、交换机与安全组
- **录音文件识别 (nls)**:提交音视频 URL 做离线转写,自动轮询并输出识别文本,可导出 TXT / VTT
- **通义听悟 (twu)**:离线语音转写任务(说话人分离、热词、段落字幕),以及热词词表的增删改查与导入导出
- **配置 (config)**:管理多套 AccessKey 与区域配置,内置 TUI 编辑器,也可调用系统外部编辑器

# 安装方法

### 通过安装包安装

前往 GitHub 的 [Release 页面](https://github.com/lipanpan-hub/ali/releases) 下载对应平台的安装包(如 Windows 安装程序),直接安装即可使用,无需预先安装 Node.js 环境。

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

# 快速开始

### 1. 配置访问凭证

首次使用前,需要先配置阿里云的 AccessKey 与默认区域。运行以下命令进入交互式配置:

```bash
ali config set
```

按提示依次输入配置名称、`access_key_id`、`access_key_secret`,并选择默认区域(支持输入关键字搜索),最后确认是否立即将该配置设为当前生效配置。

### 2. 确认配置已生效

```bash
ali config list
```

该命令会打印配置文件的实际路径与完整内容,可用于确认凭证是否写入成功。

### 3. 执行第一条命令

```bash
# 列出当前区域的 ECS 实例
ali ecs list

# 列出当前账号的所有 OSS 存储空间
ali bkt list
```

# 配置文件

### 存放位置

配置文件由 CLI 自动管理,路径遵循各平台的用户配置目录约定:

- Windows:`%LOCALAPPDATA%\ali\config.json`(例如 `C:\Users\<用户名>\AppData\Local\ali\config.json`)
- macOS / Linux:`~/.config/ali/config.json`(若设置了 `XDG_CONFIG_HOME` 则以其为准)

不确定时直接运行 `ali config list`,输出的第一行就是当前使用的配置文件路径。

### 结构说明

配置文件采用 `current` + `profiles` 的结构,`current` 指向当前生效的配置名称:

```json
{
  "current": "default",
  "profiles": [
    {
      "name": "default",
      "access_key_id": "LTAI********",
      "access_key_secret": "********",
      "region_id": "cn-shenzhen",
      "site": "china",
      "mode": "AK",
      "language": "en",
      "output_format": "json",
      "nls_app_keys": [],
      "tingwu_app_keys": [],
      "oss_bkt_binding": []
    }
  ]
}
```

字段含义:

- `name`:配置名称,同一文件内唯一
- `access_key_id` / `access_key_secret`:阿里云 AccessKey,用于 API 签名
- `region_id`:默认区域,ECS / VPC / 交换机 / 安全组等区域级服务会使用它
- `site`:`china` 或 `intl`,账单服务会据此选择国内站或国际站的接口地址
- `nls_app_keys`:智能语音服务的项目 AppKey 列表,`ali nls trans` 未传 `-k` 时从这里交互式选择
- `tingwu_app_keys`:通义听悟的项目 AppKey 列表,`ali twu task add` 未传 `-k` 时从这里交互式选择
- `oss_bkt_binding`:本地目录与存储桶的绑定关系,由 `ali bkt binding add` 写入

### 多配置切换

`ali config set` 输入一个新的配置名称即可追加一套凭证;输入已存在的名称会提示是否覆盖。切换当前生效配置有两种方式:

```bash
# 方式一: 重新执行 set, 在最后一步确认"立即应用"
ali config set -n prod

# 方式二: 直接编辑配置文件, 修改 current 字段
ali config edit
```

`ali config edit` 默认启动内置 TUI 编辑器(回车换行,`Ctrl+S` 校验并保存,`Ctrl+C` 退出);加上 `-e` 则可交互式选择系统中已安装的外部编辑器。

# 使用示例

### 账单

```bash
# 上个月账单总览 (按产品汇总)
ali bill overview

# 指定账期的实例明细
ali bill detail 2025-04

# 分析费用构成与产品排名
ali bill analyze 2025-04

# 导出明细账单到当前目录
ali bill download 2025-04 -f json
```

账期参数统一使用 `YYYY-MM` 格式,省略时默认取上个月。

### OSS 存储

```bash
# 列出存储空间, -d 可交互式选择某个桶查看详情
ali bkt list -d

# 创建存储空间
ali bkt add my-bucket -r cn-hangzhou

# 列出桶内对象 (不传桶名则交互式选择)
ali bkt obj list my-bucket

# 上传文件, 不传 -f 则交互式勾选当前目录下的文件
ali bkt obj upload my-bucket -f ./a.zip -f /path/to/b.png

# 生成对象下载签名 URL, 默认有效期 3600 秒
ali bkt obj sign my-bucket path/to/file.zip --expires 7200

# 生成上传签名 URL
ali bkt sign my-bucket path/to/file.zip
```

### 本地目录与 OSS 增量同步

```bash
# 交互式创建绑定: 选本地目录 -> 选存储桶 -> 配置反向/正向过滤器
ali bkt binding add

# 查看已有绑定关系, -r 可预览过滤后实际会上传的文件列表
ali bkt binding ls
ali bkt binding ls -r

# 执行增量同步 (内容未变化的文件会自动跳过)
ali bkt binding sync

# 删除绑定关系
ali bkt binding del
```

过滤器为正则表达式:反向过滤器命中的文件会从待上传列表中剔除,正向过滤器命中的文件会被保留。上传时会以本地文件夹名作为前缀,保留目录层级。

### 计算与网络

```bash
# ECS: 列出 / 创建 / 删除
ali ecs list --block
ali ecs add
ali ecs del i-xxxxx

# 镜像: 按平台列出公共镜像, 创建/删除自定义镜像
ali img list -p Ubuntu
ali img add my-image i-xxxxx
ali img del m-xxxxx

# VPC / 交换机 / 安全组
ali vpc list
ali vsw list vpc-xxxxx
ali sgp list --block
```

### 录音文件识别 (NLS)

```bash
# 提交音视频 URL, 轮询直到识别完成并输出文本
ali nls trans -u https://example.com/a.wav

# 指定 AppKey, 并输出词级别信息
ali nls trans -u https://example.com/a.wav -k myAppKey --words

# 额外导出纯文本与 VTT 字幕
ali nls trans -u https://example.com/a.wav --txt --vtt
```

### 通义听悟 (Tingwu)

```bash
# 创建离线转写任务, 缺省参数会交互式询问
ali twu task add

# 指定 AppKey / 文件 URL / 源语言
ali twu task add -k myAppKey -u https://example.com/a.mp4 -l cn

# 开启说话人分离并指定说话人数量 (0 表示自动判断)
ali twu task add -u https://example.com/a.mp4 --diarization --speaker-count 2

# 使用热词词表, 并额外生成按段落切分的 VTT 字幕
ali twu task add -u https://example.com/a.mp4 -p phrase-id-xxx --paragraph
```

热词词表管理:

```bash
ali twu phrase list                      # 列举所有词表
ali twu phrase add                       # 交互式创建
ali twu phrase add --file phrases.json   # 从 JSON 文件导入
ali twu phrase get <phraseId> --out phrases.json   # 查看并导出
ali twu phrase update <phraseId>         # 增量编辑 (加 --file 为全覆盖)
ali twu phrase del <phraseId>            # 删除
```

任务提交后 CLI 会自动轮询任务状态,完成后下载结果并按需生成 VTT 字幕与纯文本文件。

# 命令简写

所有多级命令都提供了短别名,日常使用可以少敲很多字符。例如:

- `ali cf ls` = `ali config list`(还可写作 `ali cf show`)
- `ali cf edit` = `ali config edit`
- `ali bill ov` / `dt` / `az` / `dl` = `overview` / `detail` / `analyze` / `download`
- `ali bkt ls` = `ali bkt list`,`ali bkt rm` = `ali bkt del`,`ali bkt config` = `ali bkt set`
- `ali bkt obj ls` / `info` / `up` / `url` / `rm` = `list` / `show` / `upload` / `sign` / `del`
- `ali bkt bd ls` / `add` / `del` / `sync` = `ali bkt binding ...`
- `ali ecs ls`、`ali img ls`、`ali vpc ls`、`ali vsw ls`、`ali sgp ls` = 对应的 `list`
- `ali nls t` = `ali nls trans`
- `ali twu ta` = `ali twu task add`
- `ali twu pl` / `pa` / `pg` / `pu` / `pd` = `phrase list` / `add` / `get` / `update` / `del`

# Shell 自动补全

内置 `@oclif/plugin-autocomplete`,执行下面的命令会输出针对当前 Shell 的安装步骤:

```bash
ali autocomplete
ali autocomplete bash    # 或 zsh / powershell
```

# 日志

CLI 使用 pino 输出日志,配置文件与 `config.json` 同目录,名为 `logger.json`,首次运行时自动生成默认配置。可调整的开关包括:

- `console`:控制台输出,支持开关、着色与日志级别
- `file`:按天(或按小时)滚动写入配置目录下的 `logs` 子目录,`retainedFileCount` 控制保留份数
- `mongodb`:可选的 MongoDB 落库,默认关闭
- `childLoggerLevels`:以正则匹配日志 scope 来分模块设置级别,未命中的 scope 默认静默

临时排查问题时可通过环境变量覆盖所有通道的级别:

```powershell
$env:SPIDER_LOG_LEVEL = "debug"; ali bkt binding sync
```

# 注意事项

- **AppKey 不等于 AccessKey**:AccessKey(AK/SK)用于 API 签名;AppKey 是在智能语音服务、通义听悟控制台创建的项目标识,提交转写任务时必填。两者需要分别配置。
- **通义听悟仅部署在华北 2(北京)**:CLI 内部固定使用北京的接口地址,不会读取配置里的 `region_id`。即使账号的其他资源在别的地域,听悟相关命令也能正常工作。
- **录音文件识别为中心化服务**:接口地址固定在上海,同样与 `region_id` 无关。
- **账单为账号级全局服务**:接口地址按 `site` 字段区分国内站与国际站,不区分地域。
- **删除类命令不可逆**:`ecs del`、`bkt del`、`bkt obj del`、`img del`、`vpc del`、`vsw del`、`sgp del` 等会真实删除云上资源,交互式选择时请确认目标无误。

# 命令文档

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
* [`ali nls`](docs/nls.md) - 智能语音服务 (录音文件识别)
* [`ali sgp`](docs/sgp.md) - 管理安全组
* [`ali twu`](docs/twu.md) - 管理通义听悟任务
* [`ali version`](docs/version.md) - 查看项目的版本
* [`ali vpc`](docs/vpc.md) - 管理 VPC
* [`ali vsw`](docs/vsw.md) - 管理交换机

<!-- commandsstop -->

# 参与开发

```bash
git clone https://github.com/lipanpan-hub/ali.git
cd ali
npm install

npm run build        # 编译 TypeScript 到 dist
npm start            # 等价于 node ./bin/run.js
npm run lint         # ESLint 检查
npm test             # mocha 单元测试
```

本地调试未编译的代码时可直接使用开发入口:

```bash
node ./bin/dev.js ecs list
```

打包各平台安装包:

```bash
npm run pack:win        # Windows 安装程序
npm run pack:macos      # macOS pkg
npm run pack:deb        # Debian 包
npm run pack:tarballs   # 通用 tarball
```

新增或修改命令后,执行下面的命令重新生成 `docs/` 与本文件中的命令列表:

```bash
npx oclif readme --multi
```

### 目录结构

- `src/commands/`:命令定义,负责参数、Flag 与帮助文本,目录层级即命令层级
- `src/lib/`:业务逻辑,按服务划分(`bill` / `bkt` / `ecs` / `img` / `nls` / `sgp` / `twu` / `config` / `client` / `logger` / `utils`)
- `src/hooks/init/`:oclif init 钩子,在命令执行前注入配置目录
- `bin/`:CLI 入口(`run.js` 走编译产物,`dev.js` 走 ts-node)
- `docs/`:由 `oclif readme` 自动生成的命令文档

# 反馈与许可

- 问题反馈:[GitHub Issues](https://github.com/lipanpan-hub/ali/issues)
- 项目主页:[lipanpan-hub/ali](https://github.com/lipanpan-hub/ali)
- 许可协议:BSL
