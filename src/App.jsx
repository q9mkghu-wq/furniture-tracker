import { useState, useEffect } from 'react'
import { db } from './firebase'
import {
  collection, doc, setDoc, deleteDoc, getDocs
} from 'firebase/firestore'
import Calendar from './components/Calendar.jsx'
import Summary from './components/Summary.jsx'
import EntryPanel from './components/EntryPanel.jsx'
import DayList from './components/DayList.jsx'

export default function App() {
  const [data, setData] = useState({})
  const [viewYear, setViewYear] = useState(new Date().getFullYear())
  const [viewMonth, setViewMonth] = useState(new Date().getMonth())
  const [selectedKey, setSelectedKey] = useState(null)
  const [loaded, setLoaded] = useState(false)

  const prefix = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}`

  useEffect(() => {
    fetchAll()
  }, [])

  async function fetchAll() {
    const snap = await getDocs(collection(db, 'entries'))
    const result = {}
    snap.forEach(d => { result[d.id] = d.data() })
    setData(result)
    setLoaded(true)
  }

  async function saveEntry(key, entry) {
    await setDoc(doc(db, 'entries', key), entry)
    setData(prev => ({ ...prev, [key]: entry }))
  }

  async function deleteEntry(key) {
    await deleteDoc(doc(db, 'entries', key))
    setData(prev => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  function changeMonth(dir) {
    let m = viewMonth + dir
    let y = viewYear
    if (m < 0) { m = 11; y-- }
    if (m > 11) { m = 0; y++ }
    setViewMonth(m)
    setViewYear(y)
  }

  if (!loaded) return (
    <div style={{ textAlign: 'center', padding: '3rem', color: '#888', fontSize: '16px' }}>
      불러오는 중...
    </div>
  )

  return (
    <div>
      <Calendar
        viewYear={viewYear}
        viewMonth={viewMonth}
        data={data}
        selectedKey={selectedKey}
        onSelect={setSelectedKey}
        onChangeMonth={changeMonth}
      />
      <Summary data={data} prefix={prefix} />
      <EntryPanel
        selectedKey={selectedKey}
        data={data}
        onSave={saveEntry}
        onDelete={deleteEntry}
      />
      <DayList
        data={data}
        prefix={prefix}
        viewMonth={viewMonth}
        onSelect={setSelectedKey}
      />
    </div>
  )
}
