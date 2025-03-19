'use strict';

const express = require('express');
const morgan = require('morgan');

const dao = require('./dao'); // module for accessing the DB.  NB: use ./ syntax for files in the same dir

const app = express();

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());  // To automatically decode incoming json

app.get('/', (req, res) => {
    res.send('Hello!');
});

/*** APIs ***/

// // GET /api/films
// app.get('/api/films', (req, res) => {
//     dao.filmsList()
//       .then(films => res.json(films))
//       .catch(() => res.status(500).end());
//   });


// GET /api/films/<id>
app.get('/api/films/:id', async (req, res) => {
  try {
    const result = await dao.getFilmById(req.params.id);
    //console.log("result: "+JSON.stringify(result));
    if (result.error)
      res.status(404).json(result);
    else
      res.json(result);  // NB: list of answers can also be an empty array
  } catch (err) {
    res.status(500).end();
  }
});

  
// POST /api/films
app.post('/api/films', async (req, res) => {
  const film = {

    title: req.body.title,
    favorite: req.body.favorite,
    watchdate: req.body.watchdate,
    rating: req.body.rating,
  };

  try {
    const result = await dao.insertFilm(film);
    res.status(201).json(result);  // could also be the whole object including the newId
  } catch (err) {
    res.status(503).json({ error: `Database error during the creation of the film` });
  }
}
);

// DELETE /api/films/<id>
app.delete('/api/films/:id', async (req, res) => {
  try {
    const result = await dao.deleteFilmById(req.params.id);
   
    if (result.error)
      res.status(404).json(result);
    else
      res.json(result);  // NB: list of answers can also be an empty array
  } catch (err) {
    res.status(500).end();
  }
});


// PUT 
app.put('/api/films/:id/favorite', async (req, res) => {
  try {
    const result = await dao.markFilm(req.body.id,req.body.favorite);
   
    if (result.error)
      res.status(404).json(result);
    else
      res.json(result);  // NB: list of answers can also be an empty array
  } catch (err) {
    res.status(500).end();
  }
});


// PUT 
app.put('/api/films/:id/rating', async (req, res) => {
  try {

    const result = await dao.addRating(req.body.id,req.body.rating);
   
    if (result.error)
      res.status(404).json(result);
    else
      res.json(result);  // NB: list of answers can also be an empty array
  } catch (err) {
    res.status(500).end();
  }
});


//GET
app.get('/api/films', (req, res) => {
  const filter = req.query.filter || "all"; // Se non specificato, mostra tutti i film
  dao.GetFilteredFilms(filter)
  .then(films => res.json(films))
  .catch(err => res.status(500).json({ error: err.message }));
});

app.put('/api/films/:id', (req, res) => {
  const filmId = req.params.id;
  const film = {
      title: req.body.title,
      favorite: req.body.favorite,
      watchDate: req.body.watchDate,
      rating: req.body.rating,
  };
  dao.UpdateFilm(filmId, film)
    .then(result => {
        if (result.updatedRows > 0)
            res.json({ message: "Film aggiornato con successo" });
        else
            res.status(404).json({ message: "Film non trovato" });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});



app.listen(3001, ()=>{console.log('Server ready');})