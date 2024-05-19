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
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(bodyParser.json());
app.use(cors()); 
// Spajanje na MongoDB bazu
mongoose.connect('mongodb://localhost:27017/recepti.Recepti').then(() => {
  console.log('Uspješno povezan s bazom podataka');
}).catch((err) => {
  console.error('Greška prilikom povezivanja s bazom podataka', err);
});
// Definiranje modela Recept
const Recept = mongoose.model('Recept', new mongoose.Schema({
  naslov: String,
  autor: String,
  recept: String,
}, { collection: 'Recepti' }));
// GET ruta za dohvaćanje svih recepata
app.get('/Recepti', async (req, res) => {
  try {
    const Recepti = await Recept.find();
    res.json(Recepti);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// POST ruta za dodavanje novog recepta
app.post('/Recepti', async (req, res) => {
  try {
    const { naslov, autor, recept } = req.body;
    const noviRecept = new Recept({ naslov, autor, recept });
    const spremljenRecept = await noviRecept.save();
    res.status(201).json(spremljenRecept);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// PUT ruta za ažuriranje recepata
app.put('/Recepti/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { naslov, autor, recept } = req.body;
    const ažuriranRecept = await Recept.findByIdAndUpdate(id, { naslov, autor, recept }, { new: true });
    res.json(ažuriranRecept);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// DELETE ruta za brisanje recepta
app.delete('/Recepti/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Recept.findByIdAndDelete(id);
    res.sendStatus(204);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
const port = 3000;
app.listen(port, () => {
  console.log(`Server sluša na portu ${port}`);
});