import { useState, useEffect } from 'react'

export default function EntryPanel({ selectedKey, data, onSave, onDelete }) {
  const [bank, setBank] = useState('')
  const [cash, setCash] = useState('')
  const [factory, setFactory] = useState('')
  const [stock, setStock] = useState('')
  const [expenses, setExpenses] = useState([])
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!selectedKey) return
    const e = data[selectedKey] || {}
    setBank(e.bank || '')
    setCash(e.cash || '')
    setFactory(e.factory || '')
    setStock(e.stock || '')
    setExpenses(e.expenses || [])
  }, [selectedKey, data])

  if (!selectedKey) return (
    <div style={styles.panel}>
      <div style={styles.placeholder}>날짜를 선택해 내역을 입력하세요</div>
    </div>
  )

  const parts = selectedKey.split('-')
  const title = `${parseInt(parts[1])}월 ${parseInt(parts[2])}일 내역 입력`

  const totalIncome = (parseFloat(bank) || 0) + (parseFloat(cash) || 0) + (parseFloat(factory) || 0)
  const totalExpense = expenses.reduce((s, x) => s + (parseFloat(x.amount) || 0), 0)
  const net = totalIncome - totalExpense

  function fmtFull(n) {
    return Math.round(n || 0).toLocaleString('ko-KR') + '원'
  }

  function addExpense() {
    setExpenses(prev => [...prev, { name: '', amount: '', memo: '' }])
  }

  function updateExpense(i, field, value) {
    setExpenses(prev => prev.map((e, idx) => idx === i ? { ...e, [field]: value } : e))
  }

  function removeExpense(i) {
    setExpenses(prev => prev.filter((_, idx) => idx !== i))
  }

  async function handleSave() {
    const entry = {
      bank: parseFloat(bank) || 0,
      cash: parseFloat(cash) || 0,
      factory: parseFloat(factory) || 0,
      stock: parseFloat(stock) || 0,
      expenses: expenses.filter(e => e.name || parseFloat(e.amount) > 0).map(e => ({
        name: e.name,
        amount: parseFloat(e.amount) || 0,
        memo: e.memo || ''
      })),
      month: selectedKey.slice(0, 7)
    }
    await onSave(selectedKey, entry)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  async function handleDelete() {
    await onDelete(selectedKey)
    setBank(''); setCash(''); setFactory(''); setStock(''); setExpenses([])
  }

  return (
    <div style={styles.panel}>
      <div style={styles.title}>{title}</div>

      <div style={styles.sectionLabel}>수입</div>

      <IncomeRow icon="🏦" iconBg="#E6F1FB" label="계좌 입금" value={bank} onChange={setBank} />
      <IncomeRow icon="💵" iconBg="#EAF3DE" label="현금" value={cash} onChange={setCash} />
      <IncomeRow icon="🏭" iconBg="#FAEEDA" label="공장 선불" value={factory} onChange={setFactory} />

      <div style={styles.sectionLabel}>주식 투자</div>

      <IncomeRow icon="📈" iconBg="#E0EEFA" label="주식 계좌 입금" value={stock} onChange={setStock} />

      <div style={styles.sectionLabel}>지출</div>

      {expenses.map((e, i) => (
        <div key={i} style={styles.expenseItem}>
          <div style={styles.expenseTop}>
            <div style={styles.expenseIcon}>💸</div>
            <input
              style={styles.expenseNameInput}
              type="text"
              placeholder="항목명 (예: 기름값)"
              value={e.name}
              onChange={ev => updateExpense(i, 'name', ev.target.value)}
            />
            <input
              style={styles.expenseAmtInput}
              type="number"
              placeholder="금액"
              value={e.amount}
              min="0"
              onChange={ev => updateExpense(i, 'amount', ev.target.value)}
            />
            <span style={styles.currency}>원</span>
            <button style={styles.removeBtn} onClick={() => removeExpense(i)}>✕</button>
          </div>
          <input
            style={styles.memoInput}
            type="text"
            placeholder="메모 (예: 고속도로 2회, 점심식사 등)"
            value={e.memo}
            onChange={ev => updateExpense(i, 'memo', ev.target.value)}
          />
        </div>
      ))}

      <button style={styles.addExpenseBtn} onClick={addExpense}>+ 지출 항목 추가</button>

      <div style={styles.totalsRow}>
        <TotalBox label="수입 합계" value={fmtFull(totalIncome)} color="#3B6D11" />
        <TotalBox label="지출 합계" value={fmtFull(totalExpense)} color="#A32D2D" />
        <TotalBox label="순수익" value={(net < 0 ? '-' : '') + fmtFull(Math.abs(net))} color={net < 0 ? '#A32D2D' : '#185FA5'} />
      </div>

      <div style={styles.btnRow}>
        <button style={styles.saveBtn} onClick={handleSave}>
          {saved ? '저장됨 ✓' : '저장'}
        </button>
        <button style={styles.delBtn} onClick={handleDelete}>삭제</button>
      </div>
    </div>
  )
}

function IncomeRow({ icon, iconBg, label, value, onChange }) {
  return (
    <div style={styles.incomeRow}>
      <div style={styles.incomeLabel}>
        <div style={{ ...styles.incomeIcon, background: iconBg }}>{icon}</div>
        <span style={styles.incomeName}>{label}</span>
      </div>
      <input
        style={styles.incomeInput}
        type="number"
        placeholder="0"
        min="0"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      <span style={styles.currency}>원</span>
    </div>
  )
}

function TotalBox({ label, value, color }) {
  return (
    <div style={styles.totalBox}>
      <div style={styles.totalLabel}>{label}</div>
      <div style={{ ...styles.totalValue, color }}>{value}</div>
    </div>
  )
}

const styles = {
  panel: { background: '#fff', border: '0.5px solid #e0e0e0', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' },
  placeholder: { fontSize: '14px', color: '#aaa', textAlign: 'center', padding: '1rem 0' },
  title: { fontSize: '15px', fontWeight: 500, marginBottom: '1rem' },
  sectionLabel: { fontSize: '12px', fontWeight: 500, color: '#888', margin: '14px 0 8px', paddingBottom: '5px', borderBottom: '0.5px solid #eee' },
  incomeRow: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' },
  incomeLabel: { display: 'flex', alignItems: 'center', gap: '6px', width: '130px', flexShrink: 0 },
  incomeIcon: { width: '26px', height: '26px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', flexShrink: 0 },
  incomeName: { fontSize: '12px', color: '#666' },
  incomeInput: { flex: 1, border: '0.5px solid #ddd', borderRadius: '8px', padding: '6px 10px', fontSize: '14px', minWidth: 0 },
  currency: { fontSize: '13px', color: '#888', flexShrink: 0 },
  expenseItem: { border: '0.5px solid #eee', borderRadius: '8px', padding: '10px', marginBottom: '8px', background: '#fafafa' },
  expenseTop: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '7px' },
  expenseIcon: { width: '24px', height: '24px', borderRadius: '5px', background: '#FCEBEB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', flexShrink: 0 },
  expenseNameInput: { flex: 1, border: '0.5px solid #ddd', borderRadius: '8px', padding: '5px 9px', fontSize: '13px', minWidth: 0 },
  expenseAmtInput: { width: '100px', border: '0.5px solid #ddd', borderRadius: '8px', padding: '5px 9px', fontSize: '13px', flexShrink: 0 },
  memoInput: { width: '100%', border: '0.5px solid #ddd', borderRadius: '8px', padding: '5px 9px', fontSize: '12px', color: '#666' },
  removeBtn: { background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '15px', padding: '0 2px', flexShrink: 0 },
  addExpenseBtn: { background: 'none', border: '0.5px dashed #ccc', borderRadius: '8px', padding: '7px 12px', fontSize: '12px', color: '#888', cursor: 'pointer', width: '100%', marginTop: '2px' },
  totalsRow: { display: 'flex', gap: '10px', borderTop: '0.5px solid #eee', marginTop: '12px', paddingTop: '12px' },
  totalBox: { flex: 1, textAlign: 'center' },
  totalLabel: { fontSize: '11px', color: '#888', marginBottom: '3px' },
  totalValue: { fontSize: '15px', fontWeight: 500 },
  btnRow: { display: 'flex', gap: '8px', marginTop: '14px' },
  saveBtn: { flex: 1, background: '#185FA5', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' },
  delBtn: { background: 'none', border: '0.5px solid #E24B4A', color: '#E24B4A', borderRadius: '8px', padding: '10px 16px', fontSize: '14px', cursor: 'pointer' },
}
