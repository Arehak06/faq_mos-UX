import { useNavigate } from 'react-router-dom'

export default function PageRenderer({ page }: { page: any }) {
  const navigate = useNavigate()

  return (
    <div className="page">
      <h1 className="page-title">{page.title}</h1>

      <div className="list">
        {page.blocks.map((b: any) => {
          if (b.type === 'text') {
            return (
              <p key={b.id} className="text">
                {b.value}
              </p>
            )
          }

          if (b.type === 'card') {
            return (
              <div
                key={b.id}
                className="card"
                onClick={() => b.to && navigate(b.to)}
              >
                <div className="card-title">{b.title}</div>
                <div className="card-text">{b.text}</div>
              </div>
            )
          }

          return null
        })}
      </div>
    </div>
  )
}
