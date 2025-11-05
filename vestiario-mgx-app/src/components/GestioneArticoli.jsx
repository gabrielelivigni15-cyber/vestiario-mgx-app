import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function InventoryList() {
  const [articoli, setArticoli] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    nome: '',
    tipo: 'T-shirt/Polo',
    taglia: '',
    quantita: 1,
    fornitore: '',
    codice_fornitore: '',
    foto_url: ''
  })

  const handleChange = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }))

  const carica = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('articoli')
      .select('*')
      .order('id', { ascending: true })
    if (error) alert('Errore caricamento articoli: ' + error.message)
    else setArticoli(data || [])
    setLoading(false)
  }

  useEffect(() => { carica() }, [])

  const aggiungi = async () => {
    if (!form.nome) return alert('Inserisci il nome articolo')
    const { error } = await supabase.from('articoli').insert([form])
    if (error) return alert('Errore inserimento: ' + error.message)
    setForm({ nome: '', tipo: 'T-shirt/Polo', taglia: '', quantita: 1, fornitore: '', codice_fornitore: '', foto_url: '' })
    await carica()
  }

  const elimina = async (id: number) => {
    if (!confirm('Vuoi eliminare questo articolo?')) return
    const { error } = await supabase.from('articoli').delete().eq('id', id)
    if (error) alert('Errore eliminazione: ' + error.message)
    else carica()
  }

  return (
    <div>
      <h2>🧥 Gestione Articoli</h2>
      <div className="grid">
        <input placeholder="Nome capo" value={form.nome} onChange={e => handleChange('nome', e.target.value)} />
        <select value={form.tipo} onChange={e => handleChange('tipo', e.target.value)}>
          <option>T-shirt/Polo</option>
          <option>Pantaloni</option>
          <option>Gilet/Giubbotto</option>
        </select>
        <input placeholder="Taglia" value={form.taglia} onChange={e => handleChange('taglia', e.target.value)} />
        <input type="number" min="1" placeholder="Quantità" value={form.quantita} onChange={e => handleChange('quantita', e.target.value)} />
        <input placeholder="Fornitore" value={form.fornitore} onChange={e => handleChange('fornitore', e.target.value)} />
        <input placeholder="Codice fornitore" value={form.codice_fornitore} onChange={e => handleChange('codice_fornitore', e.target.value)} />
        <input placeholder="URL foto (opzionale)" value={form.foto_url} onChange={e => handleChange('foto_url', e.target.value)} />
        <button className="primary" onClick={aggiungi}>➕ Aggiungi</button>
        <button onClick={carica}>🔄 Aggiorna</button>
      </div>

      <h3>📋 Elenco articoli</h3>
      {loading ? (
        <p>Caricamento…</p>
      ) : articoli.length === 0 ? (
        <p>Nessun articolo presente.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Nome</th><th>Tipo</th><th>Taglia</th><th>Q.tà</th>
              <th>Fornitore</th><th>Cod. Fornitore</th><th>Foto</th><th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {articoli.map((a: any) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.nome}</td>
                <td>{a.tipo}</td>
                <td>{a.taglia}</td>
                <td>{a.quantita}</td>
                <td>{a.fornitore}</td>
                <td>{a.codice_fornitore}</td>
                <td>
                  {a.foto_url ? <img src={a.foto_url} alt="foto" width="50" /> : '—'}
                </td>
                <td><button className="danger" onClick={() => elimina(a.id)}>🗑️</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
