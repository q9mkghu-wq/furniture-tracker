import { useState, useEffect } from 'react'

export default function EntryPanel({ selectedKey, data, onSave, onDelete }) {
  const [bank, setBank] = useState('')
  const [cash, setCash] = useState('')
  const [factory, setFactory] = useState('')
  const [expenses, setExpenses] = useState([])
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!selectedKey) return
    const e = data[selectedKey] || {}
    setBank(e.bank || '')
    setCash(e.cash || '')
    setFactory(e.factory || '')
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
    setBank(''); setCash(''); setFactory(''); setExpenses([])
  }

  return (
    <div style={styles.panel}>
      <div style={styles.title}>{title}</div>

      <div style={styles.sectionLabel}>수입</div>

      <IncomeRow icon="🏦" iconBg="#E6F1FB" label="계좌 입금" value={bank} onChange={setBank} />
      <IncomeRow icon="💵" iconBg="#EAF3DE" label="현금" value={cash} onChange={setCash} />
      <IncomeRow icon="🏭" iconBg="#FAEEDA" label="공장 선불" value={factory} onChange={setFactory} />

      <div style={sty
