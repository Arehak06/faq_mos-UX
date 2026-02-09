export default function PageView({ page }: { page: any }) {
  return (
    <div className="page">
      <h1 className="page-title">{page.title}</h1>

      {page.blocks.map((b: any) => {
        if (b.type === 'text') {
          return <p key={b.id}>{b.value}</p>
        }

        if (b.type === 'card') {
          return (
            <div key={b.id} className="card">
              <div className="card-title">{b.title}</div>
              <div className="card-text">{b.text}</div>
            </div>
          )
        }

        return null
      })}
    </div>
  )
}
