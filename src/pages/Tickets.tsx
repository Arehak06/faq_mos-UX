import data from '../data/tickets.json'

export default function Tickets() {
  return (
    <div className="page">
      <h1 className="page-title">{data.title}</h1>

      {data.blocks.map((b, i) => (
        <p key={i} className="text">
          {b.value}
        </p>
      ))}
    </div>
  )
}
