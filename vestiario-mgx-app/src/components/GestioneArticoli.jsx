import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pencil, Trash } from "lucide-react";

export default function GestioneArticoli() {
  const [articoli, setArticoli] = useState([]);
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("T-shirt/Polo");
  const [taglia, setTaglia] = useState("");
  const [quantita, setQuantita] = useState(1);
  const [fornitore, setFornitore] = useState("");
  const [codiceFornitore, setCodiceFornitore] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");

  // Stati per modale immagine e modifica
  const [immagineSelezionata, setImmagineSelezionata] = useState(null);
  const [articoloInModifica, setArticoloInModifica] = useState(null);
  const [datiModifica, setDatiModifica] = useState({
    nome: "",
    tipo: "",
    taglia: "",
    quantita: 0,
    fornitore: "",
    codice_fornitore: "",
    foto_url: "",
  });

  // Carica articoli dal database
  async function caricaArticoli() {
    const { data, error } = await supabase
      .from("articoli")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      alert("Errore durante il caricamento: " + error.message);
      return;
    }
    setArticoli(data || []);
  }

  useEffect(() => {
    caricaArticoli();
  }, []);

  // Inserimento nuovo articolo
  async function aggiungiArticolo() {
    if (!nome) {
      alert("Inserisci un nome per l'articolo!");
      return;
    }

    const { error } = await supabase.from("articoli").insert([
      {
        nome,
        tipo,
        taglia,
        quantita,
        fornitore,
        codice_fornitore: codiceFornitore,
        foto_url: fotoUrl,
      },
    ]);

    if (error) {
      alert("Errore inserimento: " + error.message);
    } else {
      alert("Articolo aggiunto con successo ✅");
      setNome("");
      setTaglia("");
      setQuantita(1);
      setFornitore("");
      setCodiceFornitore("");
      setFotoUrl("");
      caricaArticoli();
    }
  }

  // Eliminazione articolo
  async function eliminaArticolo(id) {
    if (!window.confirm("Vuoi davvero eliminare questo articolo?")) return;
    const { error } = await supabase.from("articoli").delete().eq("id", id);
    if (error) alert("Errore eliminazione: " + error.message);
    else caricaArticoli();
  }

  // Salvataggio modifica
  async function salvaModifiche() {
    const { error } = await supabase
      .from("articoli")
      .update(datiModifica)
      .eq("id", articoloInModifica.id);

    if (error) alert("Errore aggiornamento: " + error.message);
    else {
      alert("Articolo aggiornato ✅");
      setArticoloInModifica(null);
      caricaArticoli();
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">👕 Gestione Articoli</h2>

      {/* Form inserimento */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
        <Input placeholder="Nome capo" value={nome} onChange={(e) => setNome(e.target.value)} />
        <Input placeholder="Tipo (es. T-shirt/Polo)" value={tipo} onChange={(e) => setTipo(e.target.value)} />
        <Input placeholder="Taglia" value={taglia} onChange={(e) => setTaglia(e.target.value)} />
        <Input placeholder="Quantità" type="number" value={quantita} onChange={(e) => setQuantita(e.target.value)} />
        <Input placeholder="Fornitore" value={fornitore} onChange={(e) => setFornitore(e.target.value)} />
        <Input placeholder="Codice fornitore" value={codiceFornitore} onChange={(e) => setCodiceFornitore(e.target.value)} />
        <Input placeholder="URL foto (opzionale)" value={fotoUrl} onChange={(e) => setFotoUrl(e.target.value)} />
      </div>

      <Button className="bg-green-600 text-white mb-6" onClick={aggiungiArticolo}>
        ➕ Aggiungi
      </Button>

      {/* Tabella articoli */}
      <table className="w-full border text-sm text-center">
        <thead className="bg-gray-100">
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Taglia</th>
            <th>Q.tà</th>
            <th>Fornitore</th>
            <th>Codice</th>
            <th>Foto</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {articoli.map((a) => (
            <tr key={a.id} className="border-t">
              <td>{a.id}</td>
              <td>{a.nome}</td>
              <td>{a.tipo}</td>
              <td>{a.taglia}</td>
              <td>{a.quantita}</td>
              <td>{a.fornitore}</td>
              <td>{a.codice_fornitore}</td>
              <td>
                {a.foto_url ? (
                  <img
                    src={a.foto_url}
                    alt={a.nome}
                    className="w-12 h-12 rounded object-cover cursor-pointer mx-auto"
                    onClick={() => setImmagineSelezionata(a.foto_url)}
                  />
                ) : (
                  "—"
                )}
              </td>
              <td className="space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setArticoloInModifica(a);
                    setDatiModifica({
                      nome: a.nome,
                      tipo: a.tipo,
                      taglia: a.taglia,
                      quantita: a.quantita,
                      fornitore: a.fornitore,
                      codice_fornitore: a.codice_fornitore,
                      foto_url: a.foto_url,
                    });
                  }}
                >
                  <Pencil size={16} />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => eliminaArticolo(a.id)}>
                  <Trash size={16} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODALE IMMAGINE */}
      <Dialog open={!!immagineSelezionata} onOpenChange={() => setImmagineSelezionata(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Anteprima immagine</DialogTitle>
          </DialogHeader>
          {immagineSelezionata && (
            <img src={immagineSelezionata} alt="Anteprima" className="max-w-full rounded" />
          )}
        </DialogContent>
      </Dialog>

      {/* MODALE MODIFICA ARTICOLO */}
      <Dialog open={!!articoloInModifica} onOpenChange={() => setArticoloInModifica(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifica articolo</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Input placeholder="Nome" value={datiModifica.nome} onChange={(e) => setDatiModifica({ ...datiModifica, nome: e.target.value })} />
            <Input placeholder="Tipo" value={datiModifica.tipo} onChange={(e) => setDatiModifica({ ...datiModifica, tipo: e.target.value })} />
            <Input placeholder="Taglia" value={datiModifica.taglia} onChange={(e) => setDatiModifica({ ...datiModifica, taglia: e.target.value })} />
            <Input placeholder="Quantità" type="number" value={datiModifica.quantita} onChange={(e) => setDatiModifica({ ...datiModifica, quantita: Number(e.target.value) })} />
            <Input placeholder="Fornitore" value={datiModifica.fornitore} onChange={(e) => setDatiModifica({ ...datiModifica, fornitore: e.target.value })} />
            <Input placeholder="Codice fornitore" value={datiModifica.codice_fornitore} onChange={(e) => setDatiModifica({ ...datiModifica, codice_fornitore: e.target.value })} />
            <Input placeholder="URL foto" value={datiModifica.foto_url} onChange={(e) => setDatiModifica({ ...datiModifica, foto_url: e.target.value })} />
          </div>
          <Button className="mt-3 w-full" onClick={salvaModifiche}>
            💾 Salva modifiche
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
