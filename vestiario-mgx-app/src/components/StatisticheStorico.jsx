import React, { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function StatisticheStorico() {
  const [stat, setStat] = useState([])
  const [storico, setStorico] = useState([])
  const [loading, setLoading] = useState(false)
  const [fNome, setFNome] = useState('')
  const [fArt, setFArt] = useState('')

  const carica = async () => {
    setLoading(true)
    const { data: s } = await supabase.from('vw_stat_assegnazioni').select('*')
    const { data: log } = await supabase
      .from('assegnazioni')
      .select(`id, data_consegna, quantita, note, personale (nome), articoli (nome, taglia, tipo)`)
      .order('data_consegna', { ascending: false })
    setStat(s || []); setStorico(log || [])
    setLoading(false)
  }

  useEffect(() => { carica() }, [])

  const filtrato = useMemo(() => {
    return (storico || []).filter(r => {
      const nOk = fNome ? (r.personale?.nome || '').toLowerCase().includes(fNome.toLowerCase()) : true
      const aOk = fArt ? (r.articoli?.nome || '').toLowerCase().includes(fArt.toLowerCase()) : true
      return nOk && aOk
    })
  }, [storico, fNome, fArt])

  return (
    <div>
      <h2 className="title">📊 Statistiche & Storico</h2>

      {loading && <p>Caricamento…</p>}

      <h3>🏆 Classifica dipendenti</h3>
      <table>
        <thead><tr><th>Nome</th><th>Qualifica</th><th>Totale capi</th><th>Ultima consegna</th></tr></thead>
        <tbody>
          {stat?.map((r, i) => (
            <tr key={i}>
              <td>{r.nome_personale}</td>
              <td>{r.qualifica || '—'}</td>
              <td><b>{r.totale_capi}</b></td>
              <td>{r.ultima_consegna ? new Date(r.ultima_consegna).toLocaleDateString() : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{marginTop:16}}>🧾 Storico assegnazioni</h3>
      <div className="filters">
        <input placeholder="Filtra per nome" value={fNome} onChange={e => setFNome(e.target.value)} />
        <input placeholder="Filtra per articolo" value={fArt} onChange={e => setFArt(e.target.value)} />
        <button onClick={carica}>🔄 Aggiorna</button>
      </div>
      <table>
        <thead><tr><th>Data</th><th>Dipendente</th><th>Articolo</th><th>Taglia</th><th>Tipo</th><th>Q.tà</th><th>Note</th></tr></thead>
        <tbody>
          {storico?.map(r => (
            <tr key={r.id}>
              <td>{r.data_consegna ? new Date(r.data_consegna).toLocaleDateString() : '—'}</td>
              <td>{r.personale?.nome || '—'}</td>
              <td>{r.articoli?.nome || '—'}</td>
              <td>{r.articoli?.taglia || '—'}</td>
              <td>{r.articoli?.tipo || '—'}</td>
              <td>{r.quantita}</td>
              <td>{r.note || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
