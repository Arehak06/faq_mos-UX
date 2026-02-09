import data from '../data/tickets.json'
import { TgCard } from '../components/TgCard'

export default function Tickets() {
  return (
    <div className="page">
      <h1 className="page-title">{data.title}</h1>

      {data.blocks.map((b, i) => (
        <TgCard key={i}>
          <p>{b.value}</p>
        </TgCard>
      ))}
    </div>
  )
}
