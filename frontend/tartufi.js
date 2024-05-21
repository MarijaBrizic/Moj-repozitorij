document.addEventListener('DOMContentLoaded', async () => {
  const ReceptiDiv = document.getElementById('Recepti');
  const forma = document.getElementById('forma');
  await prikaziRecepti();
  // Funkcija za prikaz svih recept
  async function prikaziRecepti() {
    ReceptiDiv.innerHTML = '';

    const response = await fetch('http://localhost:3000/Recepti');
    const Recepti = await response.json();

    Recepti.forEach(recept => {
      const receptDiv = document.createElement('div');
      receptDiv.classList.add('recept');
      receptDiv.innerHTML = `
        <strong>${recept.title}</strong> - ${recept.author}
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

    const response = await fetch('http://localhost:3000/Recepti', {
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

    const response = await fetch(`http://localhost:3000/Recepti/${id}`, {
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
      const response = await fetch(`http://localhost:3000/Recepti/${id}`, { method: 'DELETE' });
      if (response.ok) {
        prikaziRecepti();
      }
    }
  };

  // Inicijalno prikazivanje recept
  prikaziRecepti();
});
