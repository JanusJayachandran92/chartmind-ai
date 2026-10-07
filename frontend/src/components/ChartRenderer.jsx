import { useLayoutEffect, useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import './ChartRenderer.css'

export default function ChartRenderer({ config }) {
  const containerRef = useRef(null)
  const instanceRef  = useRef(null)

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return

    // Dispose old instance so a config change always creates a fresh canvas
    if (instanceRef.current) {
      instanceRef.current.dispose()
      instanceRef.current = null
    }

    // Init (no theme — let the config control all colors)
    instanceRef.current = echarts.init(el)
    instanceRef.current.setOption(config)

    // Force resize after the browser has finished layout
    const t = setTimeout(() => instanceRef.current?.resize(), 0)

    // Also watch for container width changes
    const ro = new ResizeObserver(() => instanceRef.current?.resize())
    ro.observe(el)

    const onWindowResize = () => instanceRef.current?.resize()
    window.addEventListener('resize', onWindowResize)

    return () => {
      clearTimeout(t)
      ro.disconnect()
      window.removeEventListener('resize', onWindowResize)
    }
  }, [config])

  // Final cleanup on unmount
  useEffect(() => () => {
    instanceRef.current?.dispose()
    instanceRef.current = null
  }, [])

  return (
    <div className="chart-shell">
      <div className="chart-topbar">
        <span className="chart-dot red"    />
        <span className="chart-dot yellow" />
        <span className="chart-dot green"  />
        <span className="chart-label">ECharts · Flint</span>
      </div>
      {/* Inline style guarantees ECharts gets real pixel dimensions at init */}
      <div ref={containerRef} style={{ width: '100%', height: '360px' }} />
    </div>
  )
}

