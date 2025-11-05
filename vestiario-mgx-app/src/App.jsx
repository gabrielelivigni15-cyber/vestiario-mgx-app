import React, { useState } from 'react'
import GestioneArticoli from './components/GestioneArticoli.jsx'
import GestionePersonale from './components/GestionePersonale.jsx'
import AssegnaVestiario from './components/AssegnaVestiario.jsx'
import StatisticheStorico from './components/StatisticheStorico.jsx'

export default function App() {
  const [page, setPage] = useState('articoli')

  return (
    <div style={{padding:20, fontFamily:'Inter, system-ui, Arial'}}>
      <h1 style={{textAlign:'center'}}>🧥 Gestionale Vestiario</h1>
      <div style={{display:'flex', gap:8, justifyContent:'center', margin:'16px 0'}}>
        <button className={page==='articoli'?'tab active':'tab'} onClick={()=>setPage('articoli')}>Articoli</button>
        <button className={page==='personale'?'tab active':'tab'} onClick={()=>setPage('personale')}>Personale</button>
        <button className={page==='assegna'?'tab active':'tab'} onClick={()=>setPage('assegna')}>Assegna</button>
        <button className={page==='stat'?'tab active':'tab'} onClick={()=>setPage('stat')}>Statistiche</button>
      </div>

      <div className="container">
        {page==='articoli' && <GestioneArticoli />}
        {page==='personale' && <GestionePersonale />}
        {page==='assegna' && <AssegnaVestiario />}
        {page==='stat' && <StatisticheStorico />}
      </div>

      <style>{`
        .tab { padding:8px 14px; border-radius:10px; border:1px solid #ddd; background:#f2f2f2; cursor:pointer }
        .tab.active { background:#2563eb; color:#fff; border-color:#2563eb }
        .container { max-width:1100px; margin:0 auto }
        .title { font-size:20px; font-weight:700; margin:12px 0 }
        .grid { display:grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap:8px; margin-bottom:12px }
        input, select { padding:8px; border:1px solid #ddd; border-radius:8px }
        button { padding:8px 12px; border-radius:8px; border:1px solid #ddd; background:#f8f8f8; cursor:pointer }
        button.primary { background:#16a34a; color:#fff; border-color:#16a34a }
        button.danger { background:#ef4444; color:#fff; border-color:#ef4444 }
        table { width:100%; border-collapse: collapse; margin-top:8px }
        th, td { border:1px solid #e5e7eb; padding:8px; text-align:left }
        thead tr { background:#f9fafb }
        .filters { display:flex; gap:8px; align-items:center; margin:8px 0 }
      `}</style>
    </div>
  )
}
