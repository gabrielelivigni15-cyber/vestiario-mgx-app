import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AssegnaVestiario() {
  const [personale, setPersonale] = useState([])
  const [articoli, setArticoli] = useState([])
  const [loading, setLoading] = useState(false)

  const [id_personale, setIdPersonale] = useState('')
  const [id_articolo, setIdArticolo] = useState('')
  const [quantita, setQuantita] = useState(1)
  const [note, setNote] = useState('')

  const carica = async () => {
    setLoading(true)
    const { data: p } = await supabase.from('personale').select('*').order('nome', { ascending: true })
    const { data: a } = await supabase.from('articoli').select('*').order('nome', { ascending: true })
    setPersonale(p || []); setArticoli(a || [])
    setLoading(false)
  }

  useEffect(() => { carica() }, [])

  const assegna = async () => {
    if (!id_personale || !id_articolo) return alert('Seleziona dipendente e articolo')
    if (quantita <= 0) return alert('Quantità non valida')

    const { error: errIns } = await supabase.from('assegnazioni').insert([{
      id_personale: Number(id_personale),
      id_articolo: Number(id_articolo),
      quantita: Number(quantita),
      note: note || null
    }])
    if (errIns) return alert('Errore assegnazione: ' + errIns.message)

    // scala quantità
    const { data: art } = await supabase.from('articoli').select('quantita').eq('id', id_articolo).single()
    const nuova = (art?.quantita || 0) - Number(quantita)
    await supabase.from('articoli').update({ quantita: nuova }).eq('id', id_articolo)

    alert('✅ Vestiario assegnato!')
    setIdPersonale(''); setIdArticolo(''); setQuantita(1); setNote('')
    await carica()
  }

  return (
    <div>
      <h2 className="title">🧾 Assegna Vestiario</h2>

      <div className="grid">
        <select value={id_personale} onChange={e => setIdPersonale(e.target.value)}>
          <option value="">👷‍♂️ Seleziona dipendente</option>
          {personale.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
        </select>

        <select value={id_articolo} onChange={e => setIdArticolo(e.target.value)}>
          <option value="">👕 Seleziona articolo</option>
          {articoli.map(a => <option key={a.id} value={a.id}>{a.nome} ({a.tipo}) - {a.taglia} - disp: {a.quantita}</option>)}
        </select>

        <input type="number" placeholder="Quantità" value={quantita} onChange={e => setQuantita(e.target.value)} />
        <input placeholder="Note (facoltative)" value={note} onChange={e => setNote(e.target.value)} />
        <button className="primary" onClick={assegna}>➕ Assegna</button>
        <button onClick={carica}>🔄 Aggiorna</button>
      </div>

      {loading && <p>Caricamento dati...</p>}
    </div>
  )
}
