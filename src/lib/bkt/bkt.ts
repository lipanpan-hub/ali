import {existsSync, readdirSync, statSync} from 'node:fs'
import {createRequire} from 'node:module'
import {basename, join, resolve} from 'node:path'

import * as inquirer from '@inquirer/prompts'
import Table from 'cli-table3'
import Fuse from 'fuse.js'
import prompts from 'prompts'

import type {OssBktBinding} from '../config/types.js'

import {wrap} from '../client/wrap.js'
import {ConfigManager} from '../config/config.js'
import { createLogger } from '../logger/index.js'

const require = createRequire(import.meta.url)
const OSS = require('ali-oss')

interface BucketInfo {
  creationDate: string
  name: string
  region: string
  storageClass: string
}

interface ObjectInfo {
  lastModified: string
  name: string
  size: number
  storageClass: string
}

interface ListObjectsResult {
  isTruncated: boolean
  nextContinuationToken: string
  objects?: ObjectInfo[]
}

type ACLType = 'private' | 'public-read' | 'public-read-write'

interface BucketProperty {
  description: string
  key: string
  label: string
}

const BUCKET_PROPERTIES: BucketProperty[] = [
  {description: '访问控制权限 (private/public-read/public-read-write)', key: 'acl', label: 'ACL 访问控制'},
  {description: '开启或关闭阻止公共访问', key: 'blockPublicAccess', label: '阻止公共访问'},
  {description: '日志存储前缀', key: 'logging', label: '日志设置'},
  {description: '静态网站托管配置', key: 'website', label: '静态网站'},
]

export class BktManager {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private client: any = null
  private logger = createLogger('BktManager')
  private profile: ReturnType<ConfigManager['getCurrentProfile']> = null

  constructor() {
    const profile = new ConfigManager(ConfigManager.resolveConfigPath()).getCurrentProfile()
    if (!profile) {
      console.log('配置文件不存在, 请使用 ali config set 命令生成配置文件。')
      return
    }

    this.profile = profile
    this.client = new OSS({
      accessKeyId: profile.access_key_id,
      accessKeySecret: profile.access_key_secret,
      region: `oss-${profile.region_id}`,
    })
  }

  // #region 获取列表（账号级全局接口, 分页拉取全部）
  async getBuckets(): Promise<BucketInfo[]> {
    if (!this.client) return []

    const all: BucketInfo[] = []
    let marker: null | string = null

    const res = await wrap('获取存储空间列表', async () => {
      do {
         
        const page = await this.client.listBuckets({marker, 'max-keys': 1000})
        all.push(...(page.buckets ?? []))
        marker = page.isTruncated ? page.nextMarker : null
      } while (marker)

      return all
    })

    return res ?? []
  }
  // #endregion

  // #region 列出
  async listBuckets(): Promise<void> {
    const buckets = await this.getBuckets()
    if (buckets.length === 0) {
      console.log('当前账号没有 OSS 存储空间')
      return
    }

    // 权限是桶级接口, 并发拉取每个桶的 ACL
    const acls = await Promise.all(buckets.map((b) => this.getBucketACL(b)))

    const table = new Table({
      head: ['名称', '区域', '存储类型', '访问权限'],
    })

    for (const [i, b] of buckets.entries()) {
      table.push([b.name, b.region, b.storageClass, acls[i]])
    }

    console.log(table.toString())
    console.log(`共 ${buckets.length} 个存储空间`)
  }

  private async getBucketACL(bucket: BucketInfo): Promise<string> {
    const aclLabels: Record<string, string> = {
      'private': '私有',
      'public-read': '公共读',
      'public-read-write': '公共读写',
    }
    try {
      const client = this.createBucketClient(bucket)
      const res = await client.getBucketACL(bucket.name)
      return aclLabels[res.acl] ?? res.acl
    } catch {
      return '未知'
    }
  }
  // #endregion

  // #region 按名称查找存储桶
  async getBucketByName(name: string): Promise<BucketInfo | null> {
    const buckets = await this.getBuckets()
    return buckets.find((b) => b.name === name) ?? null
  }
  // #endregion

  // #region 创建桶级 OSS 客户端
  private createBucketClient(bucket: BucketInfo) {
    return new OSS({
      accessKeyId: this.profile!.access_key_id,
      accessKeySecret: this.profile!.access_key_secret,
      bucket: bucket.name,
      region: bucket.region,
    })
  }
  // #endregion

  // #region 获取对象列表（分页拉取全部）
  async getObjects(bucket: BucketInfo): Promise<ObjectInfo[]> {
    if (!this.profile) return []

    const client = this.createBucketClient(bucket)
    const all: ObjectInfo[] = []

    await wrap('获取对象列表', async () => {
      let token: null | string = null
      do {
         
        const res: ListObjectsResult = await client.listV2({'continuation-token': token, 'max-keys': 1000})
        all.push(...(res.objects ?? []))
        token = res.isTruncated ? res.nextContinuationToken : null
      } while (token)
    })

    return all
  }
  // #endregion

  // #region 列出对象
  async listObjects(bucket: BucketInfo): Promise<void> {
    const all = await this.getObjects(bucket)
    if (all.length === 0) {
      console.log(`存储桶 ${bucket.name} 中没有对象`)
      return
    }

    // 固定后三列宽度，剩余空间留给名称列并开启换行，避免超长 key 撑破终端导致边框错乱
    const SIZE_WIDTH = 12
    const MODIFIED_WIDTH = 28
    const STORAGE_WIDTH = 12
    const BORDER_WIDTH = 5
    const terminalWidth = process.stdout.columns || 120
    const nameWidth = Math.max(20, terminalWidth - SIZE_WIDTH - MODIFIED_WIDTH - STORAGE_WIDTH - BORDER_WIDTH)

    const table = new Table({
      colWidths: [nameWidth, SIZE_WIDTH, MODIFIED_WIDTH, STORAGE_WIDTH],
      head: ['名称', '大小', '最后修改', '存储类型'],
      wordWrap: true,
      // wrapOnWordBoundary: false, // key无空格，关闭单词边界才能按字符完整折行而非截断
    })

    for (const o of all) {
      table.push([o.name, this.formatSize(o.size), o.lastModified, o.storageClass])
    }

    console.log(table.toString())
    console.log(`共 ${all.length} 个对象`)
  }

  private formatSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    let size = bytes
    let i = 0
    while (size >= 1024 && i < units.length - 1) {
      size /= 1024
      i++
    }

    return `${i === 0 ? size : size.toFixed(2)} ${units[i]}`
  }
  // #endregion

  // #region 创建存储桶
  async createBucket(bucketName: string, region: string): Promise<void> {
    if (!this.client || !this.profile) return

    const client = new OSS({
      accessKeyId: this.profile.access_key_id,
      accessKeySecret: this.profile.access_key_secret,
      bucket: bucketName,
      region: `oss-${region}`,
    })

    await wrap('创建存储空间', async () => {
      await client.putBucket(bucketName, {storageClass: 'Standard'})
      console.log(`存储空间 ${bucketName} 创建成功 (区域: ${region})`)
    })
  }
  // #endregion

  // #region 删除存储桶
  async deleteBucket(bucketName: string, region: string): Promise<void> {
    if (!this.client || !this.profile) return

    const client = new OSS({
      accessKeyId: this.profile.access_key_id,
      accessKeySecret: this.profile.access_key_secret,
      bucket: bucketName,
      region,
    })

    await wrap('删除存储空间', async () => {
      await client.deleteBucket(bucketName)
      console.log(`存储空间 ${bucketName} 已删除`)
    })
  }
  // #endregion

  // #region 交互式选择并显示详情
  async selectBucketDetail(): Promise<void> {
    const buckets = await this.getBuckets()
    if (buckets.length === 0) {
      console.log('当前账号没有 OSS 存储空间')
      return
    }

    const fuse = new Fuse(buckets, {keys: ['name', 'region'], threshold: 0.4})

    const selected = await inquirer.search<BucketInfo>({
      message: '搜索并选择存储桶',
      source: (term) => {
        const results = term ? fuse.search(term).map((r) => r.item) : buckets
        return results.map((b) => ({
          description: `${b.region} | ${b.storageClass}`,
          name: b.name,
          value: b,
        }))
      },
    })

    const client = new OSS({
      accessKeyId: this.profile!.access_key_id,
      accessKeySecret: this.profile!.access_key_secret,
      bucket: selected.name,
      region: selected.region,
    })

    await wrap('获取存储桶详情', async () => {
      const info = await client.getBucketInfo(selected.name)
      console.dir(info.bucket, {depth: null})
    })
  }
  // #endregion

  // #region 交互式选择存储桶
  async selectBucket(): Promise<BucketInfo | null> {
    const buckets = await this.getBuckets()
    if (buckets.length === 0) {
      console.log('当前账号没有 OSS 存储空间')
      return null
    }

    const fuse = new Fuse(buckets, {keys: ['name', 'region'], threshold: 0.4})

    return inquirer.search<BucketInfo>({
      message: '搜索并选择存储桶',
      source: (term) => {
        const results = term ? fuse.search(term).map((r) => r.item) : buckets
        return results.map((b) => ({
          description: `${b.region} | ${b.storageClass}`,
          name: b.name,
          value: b,
        }))
      },
    })
  }
  // #endregion

  // #region 交互式选择属性
  async selectProperty(): Promise<BucketProperty> {
    const fuse = new Fuse(BUCKET_PROPERTIES, {keys: ['label', 'key', 'description'], threshold: 0.4})

    return inquirer.search<BucketProperty>({
      message: '选择要设置的属性',
      source: (term) => {
        const results = term ? fuse.search(term).map((r) => r.item) : BUCKET_PROPERTIES
        return results.map((p) => ({
          description: p.description,
          name: p.label,
          value: p,
        }))
      },
    })
  }
  // #endregion

  // #region 上传文件
  async uploadFiles(filePaths?: string[], bucketName?: string): Promise<void> {
    if (!this.client || !this.profile) return

    // 收集待上传文件: 手动指定优先, 否则扫描当前目录交互式选择
    // filePaths 是可选参数, 用 && 短路先确认它非 undefined 再读 length, 避免空值访问报错
    const uploads = (filePaths && (filePaths.length > 0)) ? this.resolveFiles(filePaths) : await this.pickFiles()
    this.logger.debug({uploads},"需要上传的文件")
    if (uploads.length === 0) return

    // 指定桶名则直接查找, 否则交互式选择
    const bucket = bucketName ? await this.getBucketByName(bucketName) : await this.selectBucket()
    if (!bucket) {
      if (bucketName) console.log(`未找到存储桶 ${bucketName}`)
      return
    }

    const client = new OSS({
      accessKeyId: this.profile.access_key_id,
      accessKeySecret: this.profile.access_key_secret,
      bucket: bucket.name,
      region: bucket.region,
    })

    for (const {filePath, name} of uploads) {
       
      await wrap(`上传 ${name}`, () => this.uploadSingle(client, name, filePath))
    }

    console.log(`共上传 ${uploads.length} 个文件到 ${bucket.name}`)

    // 上传完成后逐行展示各文件的签名 URL, 默认有效期 1 小时
    const expires = 3600
    console.log(`\n签名 URL (有效期 ${expires} 秒):`)
    for (const {name} of uploads) {
      console.log(`  ${name}`)
      console.log(`  ${client.signatureUrl(name, {expires})}\n`)
    }
  }

  // 解析手动指定的文件路径, 对象名取文件名, 过滤不存在或非文件的路径
  private resolveFiles(filePaths: string[]): Array<{filePath: string; name: string}> {
    const uploads: Array<{filePath: string; name: string}> = []
    for (const p of filePaths) {
      const filePath = resolve(p)
      if (!existsSync(filePath) || !statSync(filePath).isFile()) {
        console.log(`跳过: ${p} 不存在或不是文件`)
        continue
      }

      uploads.push({filePath, name: basename(filePath)})
    }

    return uploads
  }

  // 扫描当前目录并交互式模糊搜索多选, 对象名取相对路径
  private async pickFiles(): Promise<Array<{filePath: string; name: string}>> {
    const files = this.scanFiles(process.cwd())
    if (files.length === 0) {
      console.log('当前目录下没有文件')
      return []
    }

    const choices = files.map((f) => ({title: f, value: f}))
    const fuse = new Fuse(choices, {keys: ['title'], threshold: 0.4})

    const {selectedFiles} = await prompts({
      choices,
      message: '搜索并选择要上传的文件',
      name: 'selectedFiles',
      suggest: async (input: string, choices: prompts.Choice[]) => {
        if (!input) return choices
        return fuse.search(input).map((r) => r.item)
      },
      type: 'autocompleteMultiselect',
    })

    if (!selectedFiles || selectedFiles.length === 0) {
      console.log('未选择任何文件')
      return []
    }

    return (selectedFiles as string[]).map((f) => ({filePath: join(process.cwd(), f), name: f}))
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async uploadSingle(client: any, name: string, filePath: string): Promise<void> {
    const MULTIPART_THRESHOLD = 100 * 1024 * 1024 // 超过 100MB 走分片上传
    const size = statSync(filePath).size

    // 小文件直接整体上传
    if (size <= MULTIPART_THRESHOLD) {
      await client.put(name, filePath)
      console.log(`✓ ${name} (${this.formatSize(size)})`)
      return
    }

    // 大文件分片上传, partSize 自适应以满足最多 10000 分片限制
    const partSize = Math.max(1024 * 1024, Math.ceil(size / 10_000))
    await client.multipartUpload(name, filePath, {
      parallel: 4,
      partSize,
      progress: (p: number) => {
        this.renderProgress(name, p)
      },
    })
    this.renderProgress(name, 1)
    process.stdout.write('\n')
    console.log(`✓ ${name} (${this.formatSize(size)})`)
  }

  private renderProgress(name: string, percent: number): void {
    const width = 30
    const filled = Math.round(percent * width)
    const bar = '█'.repeat(filled) + '░'.repeat(width - filled)
    process.stdout.write(`\r  ${name} [${bar}] ${(percent * 100).toFixed(1)}%`)
  }

  private scanFiles(dir: string, base?: string): string[] {
    const results: string[] = []
    const entries = readdirSync(dir)
    for (const entry of entries) {
      if (entry.startsWith('.') || entry === 'node_modules') continue
      const fullPath = join(dir, entry)
      const relPath = base ? join(base, entry) : entry
      const stat = statSync(fullPath)
      if (stat.isFile()) {
        results.push(relPath.replaceAll('\\', '/'))
      } else if (stat.isDirectory()) {
        results.push(...this.scanFiles(fullPath, relPath))
      }
    }

    return results
  }
  // #endregion

  // #region 设置存储桶属性
  async setBucketProperty(bucket: BucketInfo, property: BucketProperty): Promise<void> {
    if (!this.client || !this.profile) return

    const client = new OSS({
      accessKeyId: this.profile.access_key_id,
      accessKeySecret: this.profile.access_key_secret,
      bucket: bucket.name,
      region: bucket.region,
    })

    switch (property.key) {
      case 'acl': {
        const acl = await inquirer.select<ACLType>({
          choices: [
            {name: 'private (私有)', value: 'private'},
            {name: 'public-read (公共读)', value: 'public-read'},
            {name: 'public-read-write (公共读写)', value: 'public-read-write'},
          ],
          message: '选择 ACL 权限',
        })
        await wrap('设置 ACL', async () => {
          try {
            await client.putBucketACL(bucket.name, acl)
            console.log(`存储桶 ${bucket.name} 的 ACL 已设置为 ${acl}`)
          } catch (error) {
            const msg = (error as {message?: string}).message ?? ''
            if (msg.includes('public') && msg.includes('not allowed')) {
              throw new Error('当前存储桶开启了「阻止公共访问」，请先关闭该选项后重试')
            }

            throw error
          }
        })
        break
      }

      case 'blockPublicAccess': {
        const block = await inquirer.select<boolean>({
          choices: [
            {name: '开启 (阻止公共访问)', value: true},
            {name: '关闭 (允许公共访问)', value: false},
          ],
          message: '是否阻止公共访问',
        })
        await wrap('设置阻止公共访问', async () => {
          const params = client._bucketRequestParams('PUT', bucket.name, 'publicAccessBlock', {})
          params.content = `<?xml version="1.0" encoding="UTF-8"?><PublicAccessBlockConfiguration><BlockPublicAccess>${block}</BlockPublicAccess></PublicAccessBlockConfiguration>`
          params.successStatuses = [200]
          await client.request(params)
          console.log(`存储桶 ${bucket.name} 的阻止公共访问已${block ? '开启' : '关闭'}`)
        })
        break
      }

      case 'logging': {
        const prefix = await inquirer.input({
          default: `${bucket.name}-logs/`,
          message: '请输入日志前缀 (留空则关闭日志)',
        })
        if (prefix) {
          await wrap('设置日志', async () => {
            await client.putBucketLogging(bucket.name, prefix)
            console.log(`存储桶 ${bucket.name} 的日志前缀已设置为 ${prefix}`)
          })
        } else {
          await wrap('关闭日志', async () => {
            await client.deleteBucketLogging(bucket.name)
            console.log(`存储桶 ${bucket.name} 的日志已关闭`)
          })
        }
        break
      }

      case 'website': {
        const index = await inquirer.input({default: 'index.html', message: '默认首页文件'})
        const error = await inquirer.input({default: 'error.html', message: '错误页面文件'})
        await wrap('设置静态网站', async () => {
          await client.putBucketWebsite(bucket.name, {error, index})
          console.log(`存储桶 ${bucket.name} 已配置为静态网站 (首页: ${index}, 错误页: ${error})`)
        })
        break
      }
    }
  }
  // #endregion

  // #region 交互式选择对象
  async selectObject(bucket: BucketInfo): Promise<null | ObjectInfo> {
    const objects = await this.getObjects(bucket)
    if (objects.length === 0) {
      console.log(`存储桶 ${bucket.name} 中没有对象`)
      return null
    }

    const fuse = new Fuse(objects, {keys: ['name'], threshold: 0.4})

    return inquirer.search<ObjectInfo>({
      message: '搜索并选择对象',
      source: (term) => {
        const results = term ? fuse.search(term).map((r) => r.item) : objects
        return results.map((o) => ({
          description: `${this.formatSize(o.size)} | ${o.lastModified}`,
          name: o.name,
          value: o,
        }))
      },
    })
  }
  // #endregion

  // #region 交互式多选对象
  async selectObjects(bucket: BucketInfo): Promise<ObjectInfo[]> {
    const objects = await this.getObjects(bucket)
    if (objects.length === 0) {
      console.log(`存储桶 ${bucket.name} 中没有对象`)
      return []
    }

    const choices = objects.map((o) => ({
      description: `${this.formatSize(o.size)} | ${o.lastModified}`,
      title: o.name,
      value: o,
    }))
    const fuse = new Fuse(choices, {keys: ['title'], threshold: 0.4})

    const {selected} = await prompts({
      choices,
      message: '搜索并选择要删除的对象（空格多选）',
      name: 'selected',
      suggest: async (input: string, choices: prompts.Choice[]) => {
        if (!input) return choices
        return fuse.search(input).map((r) => r.item)
      },
      type: 'autocompleteMultiselect',
    })

    if (!selected || selected.length === 0) {
      console.log('未选择任何对象')
      return []
    }

    return selected as ObjectInfo[]
  }
  // #endregion

  // #region 批量删除对象
  async deleteObjects(bucket: BucketInfo, objectNames: string[]): Promise<void> {
    if (!this.profile || objectNames.length === 0) return

    const client = this.createBucketClient(bucket)

    await wrap('删除对象', async () => {
      // ali-oss deleteMulti 单次最多删除 1000 个对象, 分批处理
      const BATCH_SIZE = 1000
      for (let i = 0; i < objectNames.length; i += BATCH_SIZE) {
        const batch = objectNames.slice(i, i + BATCH_SIZE)
         
        await client.deleteMulti(batch, {quiet: true})
      }

      console.log(`已从存储桶 ${bucket.name} 删除 ${objectNames.length} 个对象`)
    })
  }
  // #endregion

  // #region 显示对象详细信息
  async showObject(bucket: BucketInfo, objectName: string): Promise<void> {
    if (!this.profile) return

    const client = this.createBucketClient(bucket)

    await wrap('获取对象详情', async () => {
      const result = await client.head(objectName)
      const headers = result.res.headers as Record<string, string>

      const table = new Table()
      table.push(
        {'对象名称': objectName},
        {'HTTP 状态': result.status},
        {'Content-Type': headers['content-type'] ?? '-'},
        {'内容大小': headers['content-length'] ? this.formatSize(Number(headers['content-length'])) : '-'},
        {'最后修改时间': headers['last-modified'] ?? '-'},
        {'ETag': headers.etag ?? '-'},
        {'存储类型': headers['x-oss-storage-class'] ?? '-'},
        {'对象类型': headers['x-oss-object-type'] ?? '-'},
        {'公共访问 URL': client.generateObjectUrl(objectName)},
      )

      console.log(table.toString())
      console.log('提示: 公共访问 URL 仅在对象为 public-read 时可直接访问，私有对象请用 bkt:obj:sign 生成临时链接')
    })
  }
  // #endregion

  // #region 生成对象下载签名 URL
  async signObjectUrl(bucket: BucketInfo, objectName: string, expires: number): Promise<void> {
    if (!this.profile) return

    const client = this.createBucketClient(bucket)

    await wrap('生成签名 URL', async () => {
      const url = client.signatureUrl(objectName, {expires})
      console.log(`对象: ${objectName}`)
      console.log(`有效期: ${expires} 秒`)
      console.log(`下载地址: ${url}`)
    })
  }
  // #endregion

  // #region 生成对象上传签名 URL
  async signUploadUrl(bucket: BucketInfo, objectName: string | undefined, expires: number): Promise<void> {
    if (!this.profile) return

    const name = objectName ?? (await inquirer.input({message: '请输入上传的对象名称（含路径）'}))
    if (!name) {
      console.log('未指定对象名称')
      return
    }

    const client = this.createBucketClient(bucket)

    await wrap('生成上传签名 URL', async () => {
      const url = client.signatureUrl(name, {expires, method: 'PUT'})
      console.log(`对象: ${name}`)
      console.log(`有效期: ${expires} 秒`)
      console.log(`上传地址: ${url}`)
      console.log('提示: 使用 HTTP PUT 方法将文件内容上传到该地址')
    })
  }
  // #endregion

  // #region 添加本地目录与存储桶的绑定
  async addBinding(): Promise<void> {
    if (!this.client || !this.profile) return

    // 采集本地目录: 校验路径存在且为目录
    const inputDir = await inquirer.input({
      message: '请输入要绑定的本地目录:',
      validate(value) {
        if (!value) return '本地目录不能为空'
        const dir = resolve(value)
        if (!existsSync(dir)) return '目录不存在'
        if (!statSync(dir).isDirectory()) return '该路径不是目录'
        return true
      },
    })
    const localDir = resolve(inputDir)

    // 选择要绑定的存储桶
    const bucket = await this.selectBucket()
    if (!bucket) return

    // 反向过滤器: 命中则从本地目录中去除; 正向过滤器: 命中则保留
    const excludeFilters = await this.collectFilters('反向过滤器(去除文件)')
    const includeFilters = await this.collectFilters('正向过滤器(保留文件)')

    // 追加到当前档案的绑定列表并持久化
    const configManager = new ConfigManager(ConfigManager.resolveConfigPath())
    const bindings = configManager.getCurrentProfile()?.oss_bkt_binding ?? []

    /* eslint-disable camelcase */
    const binding: OssBktBinding = {
      bucket_name: bucket.name,
      bucket_region: bucket.region,
      exclude_filters: excludeFilters,
      include_filters: includeFilters,
      local_dir: localDir,
    }
    const ok = configManager.updateCurrentProfile({oss_bkt_binding: [...bindings, binding]})
    /* eslint-enable camelcase */

    if (ok) {
      console.log(`已创建绑定: ${localDir} <-> ${bucket.name} (${bucket.region})`)
      console.log(`反向过滤器 ${excludeFilters.length} 个, 正向过滤器 ${includeFilters.length} 个`)
    } else {
      console.log('保存失败: 当前无可用配置, 请先执行 ali config set')
    }
  }

  // 循环采集多个正则过滤器: 直接回车结束, 每次输入即校验正则合法性
  private async collectFilters(label: string): Promise<string[]> {
    const filters: string[] = []
    let hasMore = true
    while (hasMore) {
      const pattern = await inquirer.input({
        message: `请输入${label}正则表达式 (直接回车结束):`,
        validate(value) {
          if (!value) return true // 允许空值以结束采集
          try {
            const compiled = new RegExp(value)
            return Boolean(compiled)
          } catch (error) {
            return `无效的正则表达式: ${(error as Error).message}`
          }
        },
      })

      if (pattern) {
        filters.push(pattern)
      } else {
        hasMore = false
      }
    }

    return filters
  }
  // #endregion

  // #region 列出绑定关系与预览可上传文件
  /**
   * 列出当前档案下配置的所有本地目录与 OSS 存储桶的绑定关系。
   */
  async listBindings(): Promise<void> {
    if (!this.profile) return

    const bindings = this.profile.oss_bkt_binding ?? []
    if (bindings.length === 0) {
      console.log('当前档案未配置任何绑定关系, 请先执行 ali bkt binding add')
      return
    }

    const table = new Table({
      head: ['#', '本地目录', '存储桶', '区域', '反向过滤器', '正向过滤器'],
    })

    for (const [i, b] of bindings.entries()) {
      table.push([
        i + 1,
        b.local_dir,
        b.bucket_name,
        b.bucket_region,
        b.exclude_filters.join('\n') || '-',
        b.include_filters.join('\n') || '-',
      ])
    }

    console.log(table.toString())
    console.log(`共 ${bindings.length} 个绑定关系`)
  }

  /**
   * 交互式选择一个绑定关系, 对其本地目录应用过滤器, 打印最终可上传的文件列表。
   */
  async runBinding(): Promise<void> {
    if (!this.profile) return

    const bindings = this.profile.oss_bkt_binding ?? []
    if (bindings.length === 0) {
      console.log('当前档案未配置任何绑定关系, 请先执行 ali bkt binding add')
      return
    }

    // 交互式模糊搜索选择一个绑定
    const fuse = new Fuse(bindings, {keys: ['local_dir', 'bucket_name', 'bucket_region'], threshold: 0.4})
    const selected = await inquirer.search<OssBktBinding>({
      message: '搜索并选择一个绑定关系',
      source: (term) => {
        const results = term ? fuse.search(term).map((r) => r.item) : bindings
        return results.map((b) => ({
          description: `${b.bucket_name} (${b.bucket_region})`,
          name: b.local_dir,
          value: b,
        }))
      },
    })

    // 目录可能在绑定后被删除或移动, 预览前先校验
    if (!existsSync(selected.local_dir) || !statSync(selected.local_dir).isDirectory()) {
      console.log(`本地目录不存在或不是目录: ${selected.local_dir}`)
      return
    }

    const files = this.applyBindingFilters(selected)

    console.log(`\n绑定: ${selected.local_dir} <-> ${selected.bucket_name} (${selected.bucket_region})`)
    console.log(`过滤后可上传文件 ${files.length} 个:`)
    if (files.length === 0) {
      console.log('  (无)')
      return
    }

    for (const f of files) {
      console.log(`  ${f}`)
    }
  }

  // 依据绑定的过滤器筛选本地目录文件, 返回最终可上传的相对路径列表
  private applyBindingFilters(binding: OssBktBinding): string[] {
    const allFiles = this.scanFiles(binding.local_dir)

    // 预编译正则, 避免在循环内重复构造 (正则合法性已在添加绑定时校验)
    const includeRegexps = binding.include_filters.map((p) => new RegExp(p))
    const excludeRegexps = binding.exclude_filters.map((p) => new RegExp(p))

    return allFiles.filter((file) => {
      // 正向过滤器非空时作为白名单: 必须命中至少一个才保留; 为空则默认全部保留
      const isIncluded = (includeRegexps.length === 0) || includeRegexps.some((re) => re.test(file))
      // 反向过滤器作为黑名单: 命中任意一个即去除 (优先级高于白名单)
      const isExcluded = excludeRegexps.some((re) => re.test(file))
      return isIncluded && (!isExcluded)
    })
  }
  // #endregion
}
