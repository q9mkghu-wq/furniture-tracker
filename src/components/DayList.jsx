export default function DayList({ data, prefix, viewMonth, onSelect }) {
  const keys = Object.keys(data)
    .filter(k => k.startsWith(prefix))
    .sort()
    .reverse()

  function fmtShort(n) {
    const v = Math.round(n || 0)
    if (Math.abs(v) >= 10000) return (v / 10000).toFixed(Math.abs(v) % 10000 === 0 ? 0 : 1) + '만'
    return v.toLocaleString('ko-KR')
  }

  function fmtFull(n) {
    return Math.round(n || 0).toLocaleString('ko-KR') + '원'
  }

  if (keys.length === 0) return (
    <div>
      <div style={styles.title}>{viewMonth + 1}월 기록 (0일)</div>
      <div style={styles.empty}>아직 입력된 기록이 없어요</div>
    </div>
  )

  return (
    <div>
      <div style={styles.title}>{viewMonth + 1}월 기록 ({keys.length}일)</div>
      {keys.map(k => {
        const e = data[k]
        const inc = (e.bank || 0) + (e.cash || 0) + (e.factory || 0)
        const exp = (e.expenses || []).reduce((s, x) => s + (x.amount || 0), 0)
        const net = inc - exp
        const parts = k.split('-')
        const dateStr = `${parseInt(parts[1])}/${parseInt(parts[2])}`

        return (
          <div key={k} style={styles.item} onClick={() => onSelect(k)}>
            <div style={styles.itemTop}>
              <span style={styles.date}>{dateStr}</span>
              <span style={{ ...styles.net, color: net >= 0 ? '#185FA5' : '#A32D2D' }}>
                {net >= 0 ? '' : '-'}{fmtFull(Math.abs(net))}
              </span>
            </div>
            <div style={styles.tags}>
              {e.bank > 0 && <Tag label={`계좌 ${fmtShort(e.bank)}`} bg="#E6F1FB" color="#185FA5" />}
              {e.cash > 0 && <Tag label={`현금 ${fmtShort(e.cash)}`} bg="#EAF3DE" color="#3B6D11" />}
              {e.factory > 0 && <Tag label={`공장 ${fmtShort(e.factory)}`} bg="#FAEEDA" color="#854F0B" />}
              {exp > 0 && <Tag label={`지출 -${fmtShort(exp)}`} bg="#FCEBEB" color="#A32D2D" />}
            </div>
            {(e.expenses || []).filter(x => x.memo).map((x, i) => (
              <div key={i} style={styles.memo}>💸 {x.name} — {x.memo}</div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

function Tag({ label, bg, color }) {
  return (
    <span style={{ ...styles.tag, background: bg, color }}>
      {label}
    </span>
  )
}

const styles = {
  title: { fontSize: '15px', fontWeight: 500, marginBottom: '10px' },
  empty: { textAlign: 'center', color: '#aaa', fontSize: '13px', padding: '2rem' },
  item: { padding: '10px 14px', borderRadius: '8px', border: '0.5px solid #e0e0e0', marginBottom: '6px', cursor: 'pointer', background: '#fff' },
  itemTop: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' },
  date: { fontSize: '13px', color: '#888' },
  net: { fontSize: '14px', fontWeight: 500 },
  tags: { display: 'flex', gap: '5px', flexWrap: 'wrap' },
  tag: { padding: '2px 7px', borderRadius: '12px', fontSize: '11px' },
  memo: { fontSize: '11px', color: '#888', marginTop: '5px' },
}
