'use client'

interface DuplicateOrderWarningProps {
  items: { id: string; display_order: number; name?: string }[]
}

export function DuplicateOrderWarning({ items }: DuplicateOrderWarningProps) {
  // Find duplicate orders
  const orderCounts: Record<number, number> = {}
  items.forEach(item => {
    orderCounts[item.display_order] = (orderCounts[item.display_order] || 0) + 1
  })

  const duplicates = Object.entries(orderCounts)
    .filter(([, count]) => count > 1)
    .map(([order]) => parseInt(order))

  if (duplicates.length === 0) return null

  return (
    <div style={{
      padding: '12px 16px',
      background: '#fef3c7',
      border: '1px solid #f59e0b',
      borderRadius: 8,
      marginBottom: 16,
      color: '#92400e',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 8
    }}>
      <span style={{ fontWeight: 700, fontSize: 16 }}>⚠</span>
      <div>
        <strong>Duplicate Display Orders Detected!</strong>
        <p style={{ margin: '4px 0 0', fontSize: 13 }}>
          The following display order values are used by multiple items: {duplicates.join(', ')}.
          This may cause unexpected sorting behavior. Please update the orders to be unique.
        </p>
      </div>
    </div>
  )
}
