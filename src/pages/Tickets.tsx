import rawData from '../data/tickets.json'
import type { PageData } from '../types/page'
import { BlockRenderer } from '../components/BlockRenderer'

const data = rawData as PageData

export default function Tickets() {
  return (
    <div className="page">
      <h1 className="page-title">{data.title}</h1>

      {data.blocks.map((block, i) => (
        <BlockRenderer key={i} block={block} />
      ))}
    </div>
  )
}
