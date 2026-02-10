import { useState } from 'react'
import { Block, TextBlock, CardBlock, ButtonBlock } from '../types/blocks'
import { PageData } from '../types/page'
import { reorder } from '../utils/reorder'

function uid() {
  return Math.random().toString(36).slice(2)
}

type Props = {
  page: PageData
  onChange: (p: PageData) => void
}

export default function PageEditor({ page, onChange }: Props) {
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  const updateBlock = (i: number, block: Block) => {
    const blocks = [...page.blocks]
    blocks[i] = block
    onChange({ ...page, blocks })
  }

  return (
    <div className="editor">
      <input
        value={page.title}
        onChange={(e) =>
          onChange({ ...page, title: e.target.value })
        }
      />

      {page.blocks.map((b, i) => (
        <div
          key={b.id}
          draggable
          onDragStart={() => setDragIndex(i)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => {
            if (dragIndex === null) return
            onChange({
              ...page,
              blocks: reorder(page.blocks, dragIndex, i)
            })
          }}
        >
          {b.type === 'text' && (
            <textarea
              value={b.text}
              onChange={(e) =>
                updateBlock(i, { ...b, text: e.target.value })
              }
            />
          )}

          {b.type === 'card' && (
            <>
              <input
                value={b.title}
                onChange={(e) =>
                  updateBlock(i, { ...b, title: e.target.value })
                }
              />
              <textarea
                value={b.text}
                onChange={(e) =>
                  updateBlock(i, { ...b, text: e.target.value })
                }
              />
            </>
          )}

          {b.type === 'button' && (
            <>
              <input
                value={b.text}
                onChange={(e) =>
                  updateBlock(i, { ...b, text: e.target.value })
                }
              />
              <input
                value={b.url}
                onChange={(e) =>
                  updateBlock(i, { ...b, url: e.target.value })
                }
              />
            </>
          )}
        </div>
      ))}
    </div>
  )
}
