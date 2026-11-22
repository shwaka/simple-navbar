const renderDelayMs = 750

function simulateExpensiveRender(durationMs: number): number {
  const startedAt = performance.now()
  let iterations = 0
  while (performance.now() - startedAt < durationMs) {
    iterations += 1
  }
  return iterations
}

export default function SlowRenderDemo() {
  const iterations = simulateExpensiveRender(renderDelayMs)

  return (
    <div>
      <h1>Slow render demo</h1>
      <p>
        This page blocks its initial render for about {renderDelayMs} ms to
        simulate an expensive synchronous page component.
      </p>
      <p>Busy-loop iterations: {iterations.toLocaleString()}</p>
      <p>
        Navigate away and return to verify that the loading indicator also
        appears on repeat visits.
      </p>
    </div>
  )
}
