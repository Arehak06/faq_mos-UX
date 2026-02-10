import { Block } from '../types/blocks'
import { TgCard } from './TgCard'

export function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case 'text':
      return (
        <TgCard>
          <p>{block.text}</p>
        </TgCard>
      )

    case 'card':
      return (
        <TgCard>
          <h3>{block.title}</h3>
          <p>{block.text}</p>
        </TgCard>
      )

    case 'button':
      return (
        <button
          className="tg-button"
          onClick={() => {
            if (block.url.startsWith('http')) {
              window.open(block.url, '_blank')
            } else {
              window.location.hash = block.url
            }
          }}
        >
          {block.text}
        </button>
      )
  }
}
