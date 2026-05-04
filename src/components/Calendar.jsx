export default function Calendar({ viewYear, viewMonth, data, selectedKey, onSelect, onChangeMonth }) {
  const today = new Date()
  const days = ['일', '월', '화', '수', '목', '금', '토']
  const first = new Date(viewYear, viewMonth, 1).getDay()
  const last = new Date(viewYear, viewMonth + 1, 0).getDate()
  const prevLast = new Date(viewYear, viewMonth, 0).getDate()

  function dateKey(d) {
    return `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  }

  function fmtShort(n) {
    const v = Math.round(n || 0)
    if (Math.abs(v) >= 10000) return (v / 10000).toFixed(Math.abs(v) % 10000 === 0 ? 0 : 1) + '만'
    return v.toLocaleString('ko-KR')
  }

  const cells = []

  for (let i = 0; i < first; i++) {
    cells.push(
      <div key={`prev-${i}`} style={styles.dayEmpty}>
        <span style={styles.dayNum}>{prevLast - first + i + 1}</span>
      </div>
    )
  }

  for (let d = 1; d <= last; d++) {
    const key = dateKey(d)
    const e = data[key]
    const isToday = d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear()
    const isSelected = key === selectedKey
    const hasData = !!e

    const inc = e ? (e.bank || 0) + (e.cash || 0) + (e.factory || 0) : 0
    const exp = e ? (e.expenses || []).reduce((s, x) => s + (x.amount || 0), 0) : 0
    const net = inc - exp

    cells.push(
      <div
        key={key}
        onClick={() => onSelect(key)}
        style={{
          ...styles.day,
          background: isSelected ? '#185FA5' : hasData ? '#F4FAF0' : 'transparent',
          border: isToday ? '0.5px solid #378ADD' : '0.5px solid transparent',
          cursor: 'pointer',
        }}
      >
        <span style={{
          ...styles.dayNum,
          color: isSelected ? '#E6F1FB' : isToday ? '#378ADD' : hasData ? '#3B6D11' : '#888',
          fontWeight: isToday ? 500 : 400,
        }}>{d}</span>
        {hasData && inc > 0 && (
          <span style={{ ...styles.calAmt, color: isSelected ? '#9FE1CB' : '#3B6D11' }}>
            +{fmtShort(inc)}
          </span>
        )}
        {hasData && exp > 0 && (
          <span style={{ ...styles.calAmt, color: isSelected ? '#F4C0D1' : '#A32D2D' }}>
            -{fmtShort(exp)}
          </span>
        )}
        {hasData && (inc > 0 || exp > 0) && (
          <span style={{
            ...styles.calNet,
            color: isSelected ? '#B5D4F4' : net >= 0 ? '#185FA5' : '#A32D2D',
            borderTopColor: isSelected ? 'rgba(181,212,244,0.3)' : 'rgba(0,0,0,0.1)'
          }}>
            {net >= 0 ? '' : '-'}{fmtShort(Math.abs(net))}
          </span>
        )}
      </div>
    )
  }

  const rem = (first + last) % 7
  if (rem > 0) {
    for (let d = 1; d <= 7 - rem; d++) {
      cells.push(
        <div key={`next-${d}`} style={styles.dayEmpty}>
          <span style={styles.dayNum}>{d}</span>
        </div>
      )
    }
  }

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={styles.nav}>
        <button style={styles.navBtn} onClick={() => onChangeMonth(-1)}>◀</button>
        <span style={styles.title}>{viewYear}년 {viewMonth + 1}월</span>
        <button style={styles.navBtn} onClick={() => onChangeMonth(1)}>▶</button>
      </div>
      <div style={styles.grid}>
        {days.map(d => <div key={d} style={styles.header}>{d}</div>)}
        {cells}
      </div>
    </div>
  )
}

const styles = {
  nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' },
  title: { fontSize: '18px', fontWeight: 500 },
  navBtn: { background: 'none', border: '0.5px solid #ccc', borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', fontSize: '14px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px' },
  header: { textAlign: 'center', fontSize: '11px', color: '#888', padding: '4px 0', fontWeight: 500 },
  day: { minHeight: '64px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5px 2px 4px', borderRadius: '8px', gap: '2px' },
  dayEmpty: { minHeight: '64px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5px 2px 4px', borderRadius: '8px' },
  dayNum: { fontSize: '12px', color: '#888', lineHeight: 1 },
  calAmt: { fontSize: '9.5px', fontWeight: 500, lineHeight: 1.2, textAlign: 'center' },
  calNet: { fontSize: '9px', lineHeight: 1.2, textAlign: 'center', borderTop: '0.5px solid rgba(0,0,0,0.1)', paddingTop: '2px', width: '100%' },
}
