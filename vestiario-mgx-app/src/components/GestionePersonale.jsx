import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pencil, Trash, Search, ArrowUpDown } from "lucide-react";

export default function GestionePersonale() {
  const [personale, setPersonale] = useState([]);
  const [ricerca, setRicerca] = useState("");
  const [ordinaPerNome, setOrdinaPerNome] = useState(true);

  // Form nuovo dipendente
  const [nome, setNome] = useState("");
  const [qualifica, setQualifica] = useState("");
  const [tagliaTshirt, setTagliaTshirt] = useState("");
  const [tagliaPantaloni, setTagliaPantaloni] = useState("");
  const [tagliaGiubbotto, setTagliaGiubbotto] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");

  // Modale modifica e immagine
  const [dipendenteInModifica, setDipendenteInModifica] = useState(null);
  const [datiModifica, setDatiModifica] = useState({
    nome: "",
    qualifica: "",
    taglia_tshirt: "",
    taglia_pantaloni: "",
    taglia_giubbotto: "",
    foto_url: "",
  });
  const [immagineSelezionata, setImmagineSelezionata] = useState(null);

  // Carica personale
  async function caricaPersonale() {
    const { data, error } = await supabase
      .from("personale")
      .select("*")
      .order(ordinaPerNome ? "nome" : "id", { ascending: true });

    if (error) {
      alert("Errore caricamento: " + error.message);
      return;
    }
    setPersonale(data || []);
  }

  useEffect(() => {
    caricaPersonale();
  }, [ordinaPerNome]);

  // Filtra in base alla ricerca
  const personaleFiltrato = personale.filter(
    (p) =>
      p.nome.toLowerCase().includes(ricerca.toLowerCase()) ||
      p.qualifica.toLowerCase().includes(ricerca.toLowerCase())
  );

  // Inserisci nuovo dipendente
  async function aggiungiDipendente() {
    if (!nome) return alert("Inserisci il nome del dipendente!");

    const { error } = await supabase.from("personale").insert([
      {
        nome,
        qualifica,
        taglia_tshirt: tagliaTshirt,
        taglia_pantaloni: tagliaPantaloni,
        taglia_giubbotto: tagliaGiubbotto,
        foto_url: fotoUrl,
      },
    ]);

    if (error) alert("Errore inserimento: " + error.message);
    else {
      alert("Dipendente aggiunto ✅");
      setNome("");
      setQualifica("");
      setTagliaTshirt("");
      setTagliaPantaloni("");
      setTagliaGiubbotto("");
      setFotoUrl("");
      caricaPersonale();
    }
  }

  // Elimina
  async function eliminaDipendente(id) {
    if (!window.confirm("Vuoi eliminare questo dipendente?")) return;
    const { error } = await supabase.from("personale").delete().eq("id", id);
    if (error) alert("Errore eliminazione: " + error.message);
    else caricaPersonale();
  }

  // Salva modifiche
  async function salvaModifiche() {
    const { error } = await supabase
      .from("personale")
      .update(datiModifica)
      .eq("id", dipendenteInModifica.id);

    if (error) alert("Errore aggiornamento: " + error.message);
    else {
      alert("Dati aggiornati ✅");
      setDipendenteInModifica(null);
      caricaPersonale();
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">👷‍♂️ Gestione Personale</h2>

      {/* Barra ricerca e ordinamento */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
        <div className="flex items-center gap-2 w-full md:w-1/2">
          <Search size={18} />
          <Input
            placeholder="Cerca per nome o qualifica..."
            value={ricerca}
            onChange={(e) => setRicerca(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setOrdinaPerNome(!ordinaPerNome)}
          title="Cambia ordinamento"
        >
          <ArrowUpDown size={16} className="mr-1" />
          Ordina per {ordinaPerNome ? "ID" : "Nome"}
        </Button>
      </div>

      {/* Form inserimento */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
        <Input placeholder="Nome e Cognome" value={nome} onChange={(e) => setNome(e.target.value)} />
        <Input placeholder="Qualifica" value={qualifica} onChange={(e) => setQualifica(e.target.value)} />
        <Input placeholder="Taglia T-shirt/Polo" value={tagliaTshirt} onChange={(e) => setTagliaTshirt(e.target.value)} />
        <Input placeholder="Taglia Pantaloni" value={tagliaPantaloni} onChange={(e) => setTagliaPantaloni(e.target.value)} />
        <Input placeholder="Taglia Giubbotto" value={tagliaGiubbotto} onChange={(e) => setTagliaGiubbotto(e.target.value)} />
        <Input placeholder="URL Foto (opzionale)" value={fotoUrl} onChange={(e) => setFotoUrl(e.target.value)} />
      </div>

      <Button className="bg-green-600 text-white mb-6" onClick={aggiungiDipendente}>
        ➕ Aggiungi
      </Button>

      {/* Tabella personale */}
      <table className="w-full border text-sm text-center">
        <thead className="bg-gray-100">
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Qualifica</th>
            <th>T-shirt</th>
            <th>Pantaloni</th>
            <th>Giubbotto</th>
            <th>Foto</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {personaleFiltrato.length === 0 ? (
            <tr>
              <td colSpan={8} className="py-3 text-gray-500 italic">
                Nessun risultato trovato
              </td>
            </tr>
          ) : (
            personaleFiltrato.map((p) => (
              <tr key={p.id} className="border-t hover:bg-gray-50 transition">
                <td>{p.id}</td>
                <td>{p.nome}</td>
                <td>{p.qualifica}</td>
                <td>{p.taglia_tshirt}</td>
                <td>{p.taglia_pantaloni}</td>
                <td>{p.taglia_giubbotto}</td>
                <td>
                  {p.foto_url ? (
                    <img
                      src={p.foto_url}
                      alt={p.nome}
                      className="w-12 h-12 rounded object-cover cursor-pointer mx-auto"
                      onClick={() => setImmagineSelezionata(p.foto_url)}
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
                      setDipendenteInModifica(p);
                      setDatiModifica({
                        nome: p.nome,
                        qualifica: p.qualifica,
                        taglia_tshirt: p.taglia_tshirt,
                        taglia_pantaloni: p.taglia_pantaloni,
                        taglia_giubbotto: p.taglia_giubbotto,
                        foto_url: p.foto_url,
                      });
                    }}
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => eliminaDipendente(p.id)}>
                    <Trash size={16} />
                  </Button>
                </td>
              </tr>
            ))
          )}
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

      {/* MODALE MODIFICA DIPENDENTE */}
      <Dialog open={!!dipendenteInModifica} onOpenChange={() => setDipendenteInModifica(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifica dipendente</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Input placeholder="Nome" value={datiModifica.nome} onChange={(e) => setDatiModifica({ ...datiModifica, nome: e.target.value })} />
            <Input placeholder="Qualifica" value={datiModifica.qualifica} onChange={(e) => setDatiModifica({ ...datiModifica, qualifica: e.target.value })} />
            <Input placeholder="Taglia T-shirt" value={datiModifica.taglia_tshirt} onChange={(e) => setDatiModifica({ ...datiModifica, taglia_tshirt: e.target.value })} />
            <Input placeholder="Taglia Pantaloni" value={datiModifica.taglia_pantaloni} onChange={(e) => setDatiModifica({ ...datiModifica, taglia_pantaloni: e.target.value })} />
            <Input placeholder="Taglia Giubbotto" value={datiModifica.taglia_giubbotto} onChange={(e) => setDatiModifica({ ...datiModifica, taglia_giubbotto: e.target.value })} />
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
