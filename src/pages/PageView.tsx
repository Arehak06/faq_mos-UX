import { Block } from '../types/blocks'
import { PageData } from '../types/page'

type Props = {
  page: PageData
}

export default function PageView({ page }: Props) {
  return (
    <div className="page">
      <h1 className="page-title">{page.title}</h1>

      {page.blocks.map((b: Block) => {
        if (b.type === 'text') {
          return (
            <p key={b.id}>
              {b.text}
            </p>
          )
        }

        if (b.type === 'card') {
          return (
            <div key={b.id} className="card">
              <div className="card-title">{b.title}</div>
              <div className="card-text">{b.text}</div>
            </div>
          )
        }

        if (b.type === 'button') {
          return (
            <button
              key={b.id}
              className="tg-button"
              onClick={() => {
                if (b.url.startsWith('http')) {
                  window.open(b.url, '_blank')
                } else {
                  window.location.hash = b.url
                }
              }}
            >
              {b.text}
            </button>
          )
        }

        return null
      })}
    </div>
  )
}
