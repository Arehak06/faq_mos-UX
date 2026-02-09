import type { Block } from '../types/page'
import { TgCard } from './TgCard'

export function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case 'text':
      return (
        <TgCard>
          <p>{block.value}</p>
        </TgCard>
      )

    case 'list':
      return (
        <TgCard>
          <ul className="tg-list">
            {block.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </TgCard>
      )

    case 'warning':
      return (
        <div className="tg-warning">
          ⚠️ {block.value}
        </div>
      )

    case 'button':
      return (
        <button
          className="tg-button"
          onClick={() => window.open(block.url, '_blank')}
        >
          {block.text}
        </button>
      )
  }
}
