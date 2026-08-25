import {includeIgnoreFile} from '@eslint/compat'
import oclif from 'eslint-config-oclif'
import prettier from 'eslint-config-prettier'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const gitignorePath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '.gitignore')

export default [
  includeIgnoreFile(gitignorePath),
  ...oclif,
  prettier,
  {
    // 关闭对本 CLI 项目审查无实际收益的纯风格/主观偏好规则
    rules: {
      // 代码风格排版：不影响正确性
      '@stylistic/lines-between-class-members': 'off',
      '@stylistic/padding-line-between-statements': 'off',
      // 命令入口分支多、CLI 环境已支持 fetch，属误报
      'complexity': 'off',
      'n/no-unsupported-features/node-builtins': 'off',
      // 串行调用云 API 是合理的，避免并发限流
      'no-await-in-loop': 'off',
      'object-shorthand': 'off',
      // 成员/导入/对象键排序：纯主观，无功能意义
      'perfectionist/sort-classes': 'off',
      'perfectionist/sort-imports': 'off',
      'perfectionist/sort-objects': 'off',
      'perfectionist/sort-union-types': 'off',
      'prefer-destructuring': 'off',
      'unicorn/consistent-function-scoping': 'off',
      'unicorn/no-negated-condition': 'off',
      'unicorn/no-useless-undefined': 'off',
      // 写法偏好：三元、简写等
      'unicorn/prefer-ternary': 'off',
    },
  },
]
