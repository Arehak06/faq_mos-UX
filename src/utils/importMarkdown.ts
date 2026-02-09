import matter from 'gray-matter'

function uid() {
  return Math.random().toString(36).slice(2)
}

export function importMarkdown(md: string) {
  const { data, content } = matter(md)

  const lines = content.split('\n')
  const blocks: any[] = []

  let buffer: string[] = []

  const flushText = () => {
    if (buffer.length) {
      blocks.push({
        id: uid(),
        type: 'text',
        value: buffer.join('\n').trim()
      })
      buffer = []
    }
  }

  for (const line of lines) {
    // Заголовки
    if (line.startsWith('## ')) {
      flushText()
      blocks.push({
        id: uid(),
        type: 'text',
        value: line.replace('## ', '')
      })
      continue
    }

    // Пустая строка = новый блок
    if (line.trim() === '') {
      flushText()
      continue
    }

    buffer.push(line)
  }

  flushText()

  return {
    title: data.title || 'Без названия',
    blocks
  }
}
