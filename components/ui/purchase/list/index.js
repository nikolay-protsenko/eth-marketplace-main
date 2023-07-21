



export default function List({purchases, children}) {
  return (
    <section className="grid md:grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
      { purchases.map(purchase => children(purchase))}
    </section>
  )
}
