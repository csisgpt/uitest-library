import type { Command } from './commands'

export type { Command }

export interface RichTextEditorProps {
  content?: string
  placeholder?: string
  readonly?: boolean
  disabled?: boolean
}
