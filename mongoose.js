const mongoose = require("mongoose");

const password = process.argv[2];
const url = `mongodb+srv://vbvnyk:${password}@cluster0.rvkmi22.mongodb.net/?retryWrites=true&w=majority`
mongoose.connect(url);

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean
});

const Note = mongoose.model('Note', noteSchema);

const note = new Note({ content: "HTML is easy", important: false });

note.save().then(result => {
    console.log(result);
    mongoose.connection.close();
})