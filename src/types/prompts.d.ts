/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'prompts' {
  interface PromptObject {
    active?: string
    choices?: Array<{ description?: string; title: string; value: any; }>
    float?: boolean
    format?: (value: any) => any
    hint?: string
    inactive?: string
    increment?: number
    initial?: boolean | number | string
    max?: number
    message?: string
    min?: number
    name: (() => string) | string
    round?: number
    separator?: string
    style?: string
    suggest?: (input: any, choices: any[]) => Promise<any>
    type: string
    validate?: (value: any) => boolean | string
  }

  function prompts(
    questions: PromptObject | PromptObject[],
    options?: any,
  ): Promise<Record<string, any>>
  export default prompts
}
