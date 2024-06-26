document.addEventListener('DOMContentLoaded', async () => {
  const ReceptiDiv = document.getElementById('Recepti');
  const forma = document.getElementById('forma');
  
  // Funkcija za prikaz svih recepata
  async function prikaziRecepti() {
    ReceptiDiv.innerHTML = '';

    const response = await fetch('http://localhost:3000/recepti');
    const Recepti = await response.json();
    console.log("marija +++", Recepti) // provjera
    Recepti.forEach(recept => {
      console.log("++++++", recept.naslov) //provjera
      const receptDiv = document.createElement('div');
      receptDiv.classList.add('recept');
      receptDiv.innerHTML = `
        <strong>${recept.naslov}</strong> - ${recept.autor}
        <button onclick="azurirajRecept('${recept._id}')">Ažuriraj</button>
        <button onclick="obrisiRecept('${recept._id}')">Obriši</button>
      `;
      ReceptiDiv.appendChild(receptDiv);
    });
  }

  // Funkcija za dodavanje nove Recepti
  forma.addEventListener('submit', async (e) => {
    e.preventDefault();
    const naslov = document.getElementById('title').value;
    const autor = document.getElementById('author').value;
    const recept = document.getElementById('recept_tekst').value;

    const response = await fetch('http://localhost:3000/recepti', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: naslov, author: autor, recept_tekst: recept })
    });

    if (response.ok) {
      prikaziRecepti();
      forma.reset();
    }
  });

  // Funkcija za ažuriranje Recepti
  window.azurirajRecept = async (id) => {
    const noviNaslov = prompt('Unesite novi naslov:');
    const noviAutor = prompt('Unesite novog autora:');
    const noviRecept = prompt('Unesite novi recept:');

    const response = await fetch(`http://localhost:3000/recepti/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: noviNaslov, author: noviAutor, recept_tekst: recept })
    });

    if (response.ok) {
      prikaziRecepti();
    }
  };

  // Funkcija za brisanje Recepti
  window.obrisiRecept = async (id) => {
    const potvrda = confirm('Jeste li sigurni da želite obrisati Recept?');
    if (potvrda) {
      const response = await fetch(`http://localhost:3000/recepti/${id}`, { method: 'DELETE' });
      if (response.ok) {
        prikaziRecepti();
      }
    }
  };

  // Inicijalno prikazivanje recept
  prikaziRecepti();
});
