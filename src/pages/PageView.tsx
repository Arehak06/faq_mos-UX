import { PageData } from '../types/page'
import { BlockRenderer } from '../components/BlockRenderer'

export default function PageView({ page }: { page: PageData }) {
  return (
    <div className="page">
      <h1>{page.title}</h1>

      {page.blocks.map((b) => (
        <BlockRenderer key={b.id} block={b} />
      ))}
    </div>
  )
}
