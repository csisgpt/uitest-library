import type { Ref } from 'vue'

export type Command =
  | 'bold' | 'italic' | 'underline' | 'strike'
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'blockquote' | 'code'
  | 'orderedList' | 'unorderedList'
  | 'link' | 'image' | 'hr'
  | 'alignLeft' | 'alignCenter' | 'alignRight' | 'alignJustify'
  | 'textColor' | 'backgroundColor'
  | 'clear'

export function useCommands(editorRef: Ref<HTMLElement | undefined>) {
  const getRange = () => {
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) return null
    return sel.getRangeAt(0)
  }

  const wrapInline = (tag: string, attrs?: Record<string, string>) => {
    const range = getRange()
    if (!range || range.collapsed) return
    const el = document.createElement(tag)
    if (attrs) Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v))
    range.surroundContents(el)
  }

  const setBlock = (tag: string) => {
    const range = getRange()
    if (!range) return
    let node = range.startContainer as HTMLElement
    if (node.nodeType === 3) node = node.parentElement as HTMLElement
    const block = node.closest('p,div,blockquote,h1,h2,h3,h4,h5,h6,pre,li') as HTMLElement
    if (!block) return
    const newEl = document.createElement(tag)
    newEl.innerHTML = block.innerHTML
    block.replaceWith(newEl)
  }

  const insertList = (ordered: boolean) => {
    const range = getRange()
    if (!range) return
    let node = range.startContainer as HTMLElement
    if (node.nodeType === 3) node = node.parentElement as HTMLElement
    const block = node.closest('p,div,h1,h2,h3,h4,h5,h6,blockquote,pre') as HTMLElement
    if (!block) return
    const li = document.createElement('li')
    li.innerHTML = block.innerHTML
    const list = document.createElement(ordered ? 'ol' : 'ul')
    list.appendChild(li)
    block.replaceWith(list)
  }

  const insertLink = (url: string) => wrapInline('a', { href: url, target: '_blank' })

  const insertImage = (src: string) => {
    const range = getRange()
    if (!range) return
    const img = document.createElement('img')
    img.src = src
    range.insertNode(img)
  }

  const insertHr = () => {
    const range = getRange()
    if (!range) return
    const hr = document.createElement('hr')
    range.insertNode(hr)
  }

  const setAlign = (align: string) => {
    const range = getRange()
    if (!range) return
    let node = range.startContainer as HTMLElement
    if (node.nodeType === 3) node = node.parentElement as HTMLElement
    const block = node.closest('p,div,blockquote,h1,h2,h3,h4,h5,h6,li,pre') as HTMLElement
    if (block) block.style.textAlign = align
  }

  const wrapColor = (prop: 'color' | 'background-color', value: string) =>
    wrapInline('span', { style: `${prop}:${value}` })

  const clear = () => {
    const editor = editorRef.value
    if (editor) {
      editor.innerText = editor.innerText
    }
  }

  const exec = (cmd: Command, value?: string) => {
    switch (cmd) {
      case 'bold':
        wrapInline('strong')
        break
      case 'italic':
        wrapInline('em')
        break
      case 'underline':
        wrapInline('u')
        break
      case 'strike':
        wrapInline('s')
        break
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
      case 'p':
      case 'blockquote':
        setBlock(cmd)
        break
      case 'code':
        setBlock('pre')
        break
      case 'orderedList':
        insertList(true)
        break
      case 'unorderedList':
        insertList(false)
        break
      case 'link':
        value && insertLink(value)
        break
      case 'image':
        value && insertImage(value)
        break
      case 'hr':
        insertHr()
        break
      case 'alignLeft':
        setAlign('left')
        break
      case 'alignCenter':
        setAlign('center')
        break
      case 'alignRight':
        setAlign('right')
        break
      case 'alignJustify':
        setAlign('justify')
        break
      case 'textColor':
        value && wrapColor('color', value)
        break
      case 'backgroundColor':
        value && wrapColor('background-color', value)
        break
      case 'clear':
        clear()
        break
    }
  }

  return { exec }
}

export function detectFormats(): Set<Command> {
  const sel = window.getSelection()
  const set = new Set<Command>()
  if (!sel || sel.rangeCount === 0) return set
  let node = sel.anchorNode as HTMLElement
  if (node.nodeType === 3) node = node.parentElement as HTMLElement
  if (!node) return set
  if (node.closest('strong')) set.add('bold')
  if (node.closest('em')) set.add('italic')
  if (node.closest('u')) set.add('underline')
  if (node.closest('s')) set.add('strike')
  if (node.closest('ol')) set.add('orderedList')
  if (node.closest('ul')) set.add('unorderedList')
  const block = node.closest('h1,h2,h3,h4,h5,h6,p,blockquote,pre') as HTMLElement
  if (block) {
    const tag = block.tagName.toLowerCase() as Command
    if (tag) set.add(tag)
    const align = block.style.textAlign
    if (align === 'center') set.add('alignCenter')
    else if (align === 'right') set.add('alignRight')
    else if (align === 'justify') set.add('alignJustify')
    else set.add('alignLeft')
  }
  return set
}
