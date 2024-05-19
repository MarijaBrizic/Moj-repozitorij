/*
const container = document.getElementById("image-container")
const handleOnDown = (e) => (container.dataset.mouseDownAt = e.clientX)
const handleOnUp = () => {
    container.dataset.mouseDownAt = "0"
    container.dataset.prevPercentage = container.dataset.percentage
}
const handleOnMove = (e) => {
    if(container.dataset.mouseDownAt === "0") return
    const mouseDelta= parseFloat(container.dataset.mouseDownAt) -e.clientX
    maxDelta= window.innerWidth / 2
    const percentage = (mouseDelta / maxDelta) * -100,
    nextPercentageUnconstrained =
    parseFloat(container.dataset.prevPercentage) + percentage,
    nextPercentage = Math.max (Math.min
        (nextPercentageUnconstrained, 0) -100)
    container.dataset.percentage = nextPercentage
    container.animate( {
        transform: `translate (${nextPercentage}%, -50%)`,
    },
    {duration: 1200, fill: "forwards"}
)
for (const image of container.getElementsByClassName("images_container")){
    image.animate(
        {objectPosition:`${100 + nextPercentage}% center`,},
        {duration: 1200, fill: "forwards"}
    )
}
}
window.onmousedown = (e) => handleOnDown(e)
window.ontouchstart = (e) => handleOnDown(e.touches[0])
window.onmouseup = (e) => handleOnup(e)
window.ontouchend = (e) => handleOnUp(e.touches[0])
window.onmousemove = (e) => handleOnMove(e)
window.ontouchmove = (e) => handleOnMove(e.touches[0])

console.log(e);
*/



document.addEventListener('DOMContentLoaded', async () => {
    const ReceptiDiv = document.getElementById('recepti');
    const forma = document.getElementById('forma');
    await prikaziRecept();

    async function prikaziRecept () {
        ReceptiDiv.innerHTML = ' ';

        const response = await fetch ('http://localhost:3000/recepti.Recepti');
        const recepti = await response.json();

        recepti.forEach(recept => {
            const receptDiv = document.createElement('div')
            receptDiv.classList.add('recept');
            receptDiv.innerHTML = `
            <strong>${recept.title}</strong> - ${recept.author}
            <button onclick="azurirajRecepti('${recepti._id}')">Ažuriraj</button>
            <button onclick="obrisiRecept('${recept._id}')">Obriši</button>`;
            receptiDiv.appendChild(receptDiv);
        });
    }

    forma.addEventListener('submit', async (e) => {
        e.preventDefault();
        const naslov = document.getElementById('title').value;
        const autor = document.getElementById('author').value;

        const response = await fetch('http://localhost:3000/recepti.Recepti', {
           method: 'POST' ,
           headers: {
            'Content-Type': 'application/json'
           },
           body : JSON.stringify({title: naslov, author: autor, recept: recept})
        });

        if (response.ok) {
            prikaziRecepti();
            forma.reset();
        }
    });

    window.azurirajRecept = async (id) => {
        const noviNaslov = prompt('Unesite novi naslov recepta:');
        const noviAutor = prompt('Unesite novog autora recepta:');
        const noviRecept = prompt('Unesite tekst recepta:');

        const response = await fetch(`http://localhost:3000/recepti.Recepti/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify ({title: noviNaslov, author: noviAutor, recept: noviRecept})
        });

        if(response.ok){
            prikaziRecepti();
        }
    };
    window.obrisiRecept = async (id) => {
        const potvrda = confirm('Jeste li sigurni da želite obrisati recept?');
        if (potvrda) {
        const response = await fetch(`http://localhost:3000/recepti.Recepti/${id}`, {
            method: 'DELETE' });

        if(response.ok){
            prikaziRecepti();
        }
    }
    };

    prikaziRecepti();

}) 