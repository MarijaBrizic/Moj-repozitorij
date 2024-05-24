const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(bodyParser.json());
app.use(cors()); 
// Spajanje na MongoDB bazu
mongoose.connect('mongodb://127.0.0.1:27017/recepti').then(() => {
  console.log('Uspješno povezan s bazom podataka');
}).catch((err) => {
  console.error('Greška prilikom povezivanja s bazom podataka', err);
});
// Definiranje modela Recept
const Recept = mongoose.model('Recept', new mongoose.Schema({
  naslov: String,
  autor: String,
  recept: String
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