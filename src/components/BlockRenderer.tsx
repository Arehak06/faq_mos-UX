import { Block } from '../types/blocks'
import { TgCard } from './TgCard'
import { useNavigate } from 'react-router-dom'

type Props = {
  block: Block
}

export function BlockRenderer({ block }: Props) {
  const navigate = useNavigate()

  if (block.type === 'text') {
    return (
      <TgCard>
        <p>{block.text}</p>
      </TgCard>
    )
  }

  if (block.type === 'card') {
    return (
      <TgCard>п
        <div className="card-title">{block.title}</div>
        <div className="card-text">{block.text}</div>
      </TgCard>
    )
  }

  if (block.type === 'button') {
    return (
      <button
        className="tg-button"
        onClick={() => {
          if (block.url.startsWith('http')) {
            window.open(block.url, '_blank')
          } else {
            navigate(block.url)
          }
        }}
      >
        {block.text}
      </button>
    )
  }

  return null
}
