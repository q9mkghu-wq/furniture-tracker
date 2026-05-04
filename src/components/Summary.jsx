export default function Summary({ data, prefix }) {
  let bank = 0, cash = 0, factory = 0, expense = 0

  Object.keys(data).forEach(k => {
    if (!k.startsWith(prefix)) return
    const e = data[k]
    bank += e.bank || 0
    cash += e.cash || 0
    factory += e.factory || 0
    expense += (e.expenses || []).reduce((s, x) => s + (x.amount || 0), 0)
  })

  const income = bank + cash + factory
  const net = income - expense

  function fmtFull(n) {
    return Math.round(n || 0).toLocaleString('ko-KR') + '원'
  }

  return (
    <div style={{ marginBottom: '1.5rem' }}>

      <div style={styles.row2}>
        <Card label="이달 총 수입" value={fmtFull(income)} color="#3B6D11" />
        <Card label="이달 총 지출" value={fmtFull(expense)} color="#A32D2D" />
      </div>

      <div style={styles.row3}>
        <Card label="계좌 입금" value={fmtFull(bank)} />
        <Card label="현금" value={fmtFull(cash)} />
        <Card label="공장 선불" value={fmtFull(factory)} />
      </div>

      <div style={{
        ...styles.netCard,
        background: net < 0 ? '#FFF0F0' : '#F0F7FF'
      }}>
        <div style={styles.netLabel}>이달 순수익 (수입 − 지출)</div>
        <div style={{ ...styles.netValue, color: net < 0 ? '#A32D2D' : '#185FA5' }}>
          {net < 0 ? '-' : ''}{fmtFull(Math.abs(net))}
        </div>
      </div>

    </div>
  )
}

function Card({ label, value, color }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardLabel}>{label}</div>
      <div style={{ ...styles.cardValue, color: color || '#222' }}>{value}</div>
    </div>
  )
}

const styles = {
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' },
  row3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '10px' },
  card: { background: '#f5f5f5', borderRadius: '8px', padding: '10px 12px', textAlign: 'center' },
  cardLabel: { fontSize: '11px', color: '#888', marginBottom: '3px' },
  cardValue: { fontSize: '14px', fontWeight: 500 },
  netCard: { borderRadius: '8px', padding: '12px', textAlign: 'center', marginBottom: '0' },
  netLabel: { fontSize: '11px', color: '#888', marginBottom: '3px' },
  netValue: { fontSize: '16px', fontWeight: 500 },
}
