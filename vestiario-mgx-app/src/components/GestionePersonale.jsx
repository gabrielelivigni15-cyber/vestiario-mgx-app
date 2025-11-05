import React, { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function GestionePersonale() {
  const [personale, setPersonale] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  const [form, setForm] = useState({
    nome: '',
    qualifica: '',
    taglia_tshirt: '',
    taglia_pantaloni: '',
    taglia_giubbotto: '',
    note: ''
  })
  const onChange = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const carica = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('personale')
      .select('*')
      .order('nome', { ascending: true })
    if (error) {
      alert('Errore lettura personale: ' + error.message)
    } else {
      setPersonale(data || [])
    }
    setLoading(false)
  }

  useEffect(() => { carica() }, [])

  const aggiungi = async () => {
    if (!form.nome.trim()) return alert('Inserisci il nome')
    const { error } = await supabase.from('personale').insert([form])
    if (error) return alert('Errore inserimento: ' + error.message)
    // reset form e ricarica lista
    setForm({ nome:'', qualifica:'', taglia_tshirt:'', taglia_pantaloni:'', taglia_giubbotto:'', note:'' })
    await carica()
  }

  const elimina = async (id) => {
    if (!confirm('Eliminare questo dipendente?')) return
    const { error } = await supabase.from('personale').delete().eq('id', id)
    if (error) return alert('Errore eliminazione: ' + error.message)
    await carica()
  }

  // filtro lato client per ricerca veloce
  const filtrati = useMemo(() => {
    const q = search.toLowerCase()
    if (!q) return personale
    return personale.filter(p =>
      (p.nome || '').toLowerCase().includes(q) ||
      (p.qualifica || '').toLowerCase().includes(q)
    )
  }, [personale, search])

  return (
    <div>
      <h2 className="title">👷‍♂️ Gestione Personale</h2>

      {/* form inserimento */}
      <div className="grid">
        <input placeholder="Nome e Cognome" value={form.nome} onChange={e => onChange('nome', e.target.value)} />
        <input placeholder="Qualifica" value={form.qualifica} onChange={e => onChange('qualifica', e.target.value)} />
        <input placeholder="Taglia T-shirt/Polo" value={form.taglia_tshirt} onChange={e => onChange('taglia_tshirt', e.target.value)} />
        <input placeholder="Taglia Pantaloni" value={form.taglia_pantaloni} onChange={e => onChange('taglia_pantaloni', e.target.value)} />
        <input placeholder="Taglia Gilet/Giubbotto" value={form.taglia_giubbotto} onChange={e => onChange('taglia_giubbotto', e.target.value)} />
        <input placeholder="Note" value={form.note} onChange={e => onChange('note', e.target.value)} />
        <button className="primary" onClick={aggiungi}>➕ Aggiungi</button>
        <button onClick={carica}>🔄 Aggiorna</button>
      </div>

      {/* barra ricerca + totale */}
      <div className="filters">
        <input placeholder="Cerca per nome o qualifica…" value={search} onChange={e => setSearch(e.target.value)} />
        <span style={{opacity:.7}}>Totale: {personale.length}</span>
      </div>

      {/* tabella elenco */}
      {loading ? (
        <p>Caricamento elenco…</p>
      ) : filtrati.length === 0 ? (
        <p>Nessun dipendente trovato.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Nome</th><th>Qualifica</th>
              <th>T-shirt</th><th>Pantaloni</th><th>Giubbotto</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {filtrati.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nome}</td>
                <td>{p.qualifica || '—'}</td>
                <td>{p.taglia_tshirt || '—'}</td>
                <td>{p.taglia_pantaloni || '—'}</td>
                <td>{p.taglia_giubbotto || '—'}</td>
                <td><button className="danger" onClick={() => elimina(p.id)}>🗑️</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
