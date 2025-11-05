import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function GestioneArticoli() {
  const [articoli, setArticoli] = useState([])
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    nome: '',
    tipo: 'T-shirt/Polo',
    taglia: '',
    quantita: 1,
    fornitore: '',
    codice: '',
    foto_url: ''
  })

  const onChange = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const carica = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('articoli').select('*').order('id', { ascending: false })
    if (!error) setArticoli(data || [])
    setLoading(false)
  }

  useEffect(() => { carica() }, [])

  const aggiungi = async () => {
    if (!form.nome) return alert('Inserisci il nome del capo')
    const payload = {
      nome: form.nome,
      tipo: form.tipo,
      taglia: form.taglia,
      quantita: Number(form.quantita) || 0,
      fornitore: form.fornitore || null,
      codice_fornitore: form.codice || null,
      foto_url: form.foto_url || null
    }
    const { error } = await supabase.from('articoli').insert([payload])
    if (error) return alert('Errore inserimento: ' + error.message)
    setForm({ nome: '', tipo: 'T-shirt/Polo', taglia: '', quantita: 1, fornitore: '', codice: '', foto_url: '' })
    await carica()
  }

  const elimina = async (id) => {
    if (!confirm('Eliminare articolo?')) return
    const { error } = await supabase.from('articoli').delete().eq('id', id)
    if (error) return alert('Errore eliminazione: ' + error.message)
    await carica()
  }

  return (
    <div>
      <h2 className="title">👕 Gestione Articoli</h2>

      <div className="grid">
        <input placeholder="Nome capo" value={form.nome} onChange={e => onChange('nome', e.target.value)} />
        <select value={form.tipo} onChange={e => onChange('tipo', e.target.value)}>
          <option>T-shirt/Polo</option>
          <option>Pantaloni</option>
          <option>Gilet/Giubbotti</option>
        </select>
        <input placeholder="Taglia" value={form.taglia} onChange={e => onChange('taglia', e.target.value)} />
        <input type="number" placeholder="Quantità" value={form.quantita} onChange={e => onChange('quantita', e.target.value)} />
        <input placeholder="Fornitore" value={form.fornitore} onChange={e => onChange('fornitore', e.target.value)} />
        <input placeholder="Codice fornitore" value={form.codice} onChange={e => onChange('codice', e.target.value)} />
        <input placeholder="URL foto (opzionale)" value={form.foto_url} onChange={e => onChange('foto_url', e.target.value)} />
        <button onClick={aggiungi} className="primary">➕ Aggiungi</button>
        <button onClick={carica}>🔄 Aggiorna</button>
      </div>

      {loading ? <p>Caricamento...</p> : (
        <table>
          <thead>
            <tr><th>ID</th><th>Nome</th><th>Tipo</th><th>Taglia</th><th>Q.tà</th><th>Fornitore</th><th>Foto</th><th>Azioni</th></tr>
          </thead>
          <tbody>
            {articoli.map(a => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.nome}</td>
                <td>{a.tipo}</td>
                <td>{a.taglia}</td>
                <td>{a.quantita}</td>
                <td>{a.fornitore || '—'}</td>
                <td>{a.foto_url ? <img src={a.foto_url} alt="" style={{width:40,height:40,objectFit:'cover'}} /> : '—'}</td>
                <td><button className="danger" onClick={() => elimina(a.id)}>🗑️</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
