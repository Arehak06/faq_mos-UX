import { Block } from '../types/blocks'
import { useNavigate } from 'react-router-dom'

export function BlockRenderer({ block }: { block: Block }) {
  const navigate = useNavigate()

  if (block.type === 'text') {
    return <p>{block.text}</p>
  }

  if (block.type === 'card') {
    return (
      <div className="card">
        <div className="card-title">{block.title}</div>
        <div className="card-text">{block.text}</div>
      </div>
    )
  }

  if (block.type === 'button') {
    return (
      <button
        className="tg-button"
        onClick={() =>
          block.url.startsWith('http')
            ? window.open(block.url, '_blank')
            : navigate(block.url)
        }
      >
        {block.text}
      </button>
    )
  }

  return null
}
