export type TextBlock = {
  type: 'text'
  value: string
}

export type ListBlock = {
  type: 'list'
  items: string[]
}

export type WarningBlock = {
  type: 'warning'
  value: string
}

export type ButtonBlock = {
  type: 'button'
  text: string
  url: string
}

export type Block =
  | TextBlock
  | ListBlock
  | WarningBlock
  | ButtonBlock

export type PageData = {
  title: string
  blocks: Block[]
}
