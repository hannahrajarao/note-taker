const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
const { nanoid } = require('nanoid/non-secure');

const PORT = 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const { title, text } = req.body;

  if(req.body) {
    const newNote = {
      title,
      text,
      id: nanoid()
    };
    readAndAppend(newNote, './db/db.json');
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
  } 
  else {
    res.error('Error in adding note');
  }
});


const readFromFile = util.promisify(fs.readFile);

const readAndAppend = (content, file) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
}

const writeToFile = (destination, content) => {
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  )
};

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);