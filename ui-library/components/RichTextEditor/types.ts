export interface ToolbarButton {
  command: string;
  label: string;
  value?: string;
}

export type Command =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'paragraph'
  | 'code'
  | 'blockquote'
  | 'orderedList'
  | 'unorderedList'
  | 'alignLeft'
  | 'alignCenter'
  | 'alignRight'
  | 'alignJustify'
  | 'link'
  | 'removeLink'
  | 'image'
  | 'hr'
  | 'color'
  | 'background'
  | 'undo'
  | 'redo'
  | 'indent'
  | 'outdent'
  | 'clear';
