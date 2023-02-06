
const { response } = require("express");
const express = require("express");
const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log("Please provide password");
}

const password = process.argv[2];

const url = `mongodb+srv://vbvnyk:${password}@cluster0.rvkmi22.mongodb.net/?retryWrites=true&w=majority`
mongoose.connect(url);

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean
});

const Note = mongoose.model('Note', noteSchema);
const app = express();
app.use(express.json());
const baseURL = "http://localhost:3001/api/notes"

let notes = [
    {
        "id": 1,
        "content": "HTML is easy",
        "important": true
    },
    {
        "id": 2,
        "content": "Browser can execute only JavaScript",
        "important": false
    },
    {
        "id": 3,
        "content": "GET and POST are the most important methods of HTTP protocol",
        "important": true
    }
];

app.get("/", (req, res) => {
    res.send(`<h1>Hello world<h1>`)
})

app.get('/api/notes', (req, res) => {
    Note.find({}).then(notesJson => {
        res.json(notesJson);
    })
})

app.get('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id);
    const note = notes.find(note => note.id === id)
    if (note)
        res.json(note);
    else
        res.status(404).end();
})

app.delete('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id);
    notes.map(note => note.id !== id);
    res.status(200).end();
})

const generateId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0;
    return maxId + 1;
}
app.post('/api/notes', (req, res) => {

    const body = req.body;
    if (!body.content) {
        return app.status(400).json({ error: 'missing content' })
    }
    const note = {
        content: body.content,
        important: body.important || false,
        date: new Date(),
        id: generateId()
    }
    notes = notes.concat(note);
    res.json(note);
})

app.listen(3001);