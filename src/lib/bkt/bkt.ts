import {readdirSync, statSync} from 'node:fs'
import {createRequire} from 'node:module'
import {join} from 'node:path'

import * as inquirer from '@inquirer/prompts'
import Table from 'cli-table3'
import Fuse from 'fuse.js'
import prompts from 'prompts'

import {wrap} from '../client/wrap.js'
import {ConfigManager} from '../config/config.js'

const require = createRequire(import.meta.url)
const OSS = require('ali-oss')

interface BucketInfo {
  creationDate: string
  name: string
  region: string
  storageClass: string
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
  private profile: ReturnType<ConfigManager['getCurrentProfile']> = null

  constructor() {
    const profile = new ConfigManager().getCurrentProfile()
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
        // eslint-disable-next-line no-await-in-loop
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

    const table = new Table({
      head: ['名称', '区域', '存储类型'],
    })

    for (const b of buckets) {
      table.push([b.name, b.region, b.storageClass])
    }

    console.log(table.toString())
    console.log(`共 ${buckets.length} 个存储空间`)
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

    const table = new Table()
    table.push(
      {名称: selected.name},
      {区域: selected.region},
      {存储类型: selected.storageClass},
      {创建时间: selected.creationDate},
    )
    console.log(table.toString())
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
  async uploadFiles(): Promise<void> {
    if (!this.client || !this.profile) return

    // 扫描当前目录文件
    const files = this.scanFiles(process.cwd())
    if (files.length === 0) {
      console.log('当前目录下没有文件')
      return
    }

    // 交互式模糊搜索多选文件
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
      return
    }

    // 交互式选择存储桶
    const bucket = await this.selectBucket()
    if (!bucket) return

    // 上传文件
    const client = new OSS({
      accessKeyId: this.profile.access_key_id,
      accessKeySecret: this.profile.access_key_secret,
      bucket: bucket.name,
      region: bucket.region,
    })

    for (const file of selectedFiles) {
      const filePath = join(process.cwd(), file)
      // eslint-disable-next-line no-await-in-loop
      await wrap(`上传 ${file}`, async () => {
        await client.put(file, filePath)
        console.log(`✓ ${file}`)
      })
    }

    console.log(`共上传 ${selectedFiles.length} 个文件到 ${bucket.name}`)
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
}
