export default function StockTotal({ data }) {
  let totalStock = 0
  let monthStock = 0
  const today = new Date()
  const thisPrefix = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`

  Object.keys(data).forEach(k => {
    const stock = data[k].stock || 0
    totalStock += stock
    if (k.startsWith(thisPrefix)) monthStock += stock
  })

  function fmtFull(n) {
    return Math.round(n || 0).toLocaleString('ko-KR') + '원'
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.icon}>📈</div>
      <div style={styles.col}>
        <div style={styles.label}>주식 계좌 누적 총액</div>
        <div style={styles.total}>{fmtFull(totalStock)}</div>
      </div>
      <div style={styles.divider}></div>
      <div style={styles.col}>
        <div style={styles.label}>이번 달 입금</div>
        <div style={styles.month}>{fmtFull(monthStock)}</div>
      </div>
    </div>
  )
}

const styles = {
  wrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    background: 'linear-gradient(135deg, #0C447C, #185FA5)',
    borderRadius: '12px',
    padding: '18px 20px',
    marginBottom: '1.5rem',
  },
  icon: { fontSize: '28px', flexShrink: 0 },
  col: { flex: 1, textAlign: 'center' },
  label: { fontSize: '13px', color: '#B5D4F4', marginBottom: '4px' },
  total: { fontSize: '24px', fontWeight: 600, color: '#fff' },
  month: { fontSize: '18px', fontWeight: 500, color: '#fff' },
  divider: { width: '0.5px', height: '36px', background: 'rgba(255,255,255,0.25)' },
}
