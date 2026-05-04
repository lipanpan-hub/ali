import Fuse from 'fuse.js'
import prompts from 'prompts'

import type { PromptChoice } from './types.js'

export async function selectPrompt(
  message: string,
  choices: PromptChoice[],
): Promise<string | undefined> {
  const response = await prompts({
    choices,
    message,
    name: 'value',
    type: 'select',
  })
  return response.value
}

export async function checkboxPrompt(
  message: string,
  choices: PromptChoice[],
): Promise<string[] | undefined> {
  const response = await prompts({
    choices,
    message,
    name: 'value',
    type: 'multiselect',
  })
  return response.value
}

export async function textPrompt(
  message: string,
  validate?: (value: string) => boolean | string,
): Promise<string | undefined> {
  const response = await prompts({
    message,
    name: 'value',
    type: 'text',
    validate,
  })
  return response.value
}

export async function passwordPrompt(
  message: string,
): Promise<string | undefined> {
  const response = await prompts({
    message,
    name: 'value',
    type: 'password',
  })
  return response.value
}

export async function confirmPrompt(
  message: string,
  initial = false,
): Promise<boolean | undefined> {
  const response = await prompts({
    initial,
    message,
    name: 'value',
    type: 'confirm',
  })
  return response.value
}

export async function fuzzySelectPrompt(
  message: string,
  choices: Record<string, string>,
): Promise<string | undefined> {
  const items = Object.entries(choices).map(([key, label]) => ({
    description: label,
    title: key,
    value: key,
  }))

  const fuse = new Fuse(items, {
    keys: ['title', 'description'],
    threshold: 0.4,
  })

  const response = await prompts({
    choices: items,
    message,
    name: 'value',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async suggest(input: string, currChoices: any[]) {
      if (!input) return currChoices
      const results = fuse.search(input)
      return results.map((r) => r.item)
    },
    type: 'autocomplete',
  })

  return response.value
}
