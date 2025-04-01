'use strict';

const express = require('express');
const morgan = require('morgan');
const {check, validationResult} = require('express-validator');

const dao = require('./dao'); // module for accessing the DB.  NB: use ./ syntax for files in the same dir

const app = express();

const maxTitleLength = 160;

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
app.get('/api/films/:id',
  check('id').isInt({min:1}),
  async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }
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
app.post('/api/films', 
  check('title').isLength({min: 1, max: maxTitleLength}),
  check('favorite').isInt({min : 0, max: 1 }),
  check('watchdate').isDate({format: 'YYYY-MM-DD', strictMode: true}),
  check('rating').isInt({min: 0, max: 5}),
  async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }

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
app.delete('/api/films/:id',
  check('id').isInt({min:1}), 
  async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }

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
app.put('/api/films/:id/favorite',
  check('id').isInt(),
  check('favorite').isInt({min:0,max:1}),
  async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }

  const filmId = Number(req.params.id);
    // Is the id in the body present? If yes, is it equal to the id in the url?
  if (req.body.id && req.body.id !== filmId) {
      return res.status(422).json({ error: 'URL and body id mismatch' });
  }

  const film = await dao.getFilmById(filmId);
    if (film.error)   // If not found, the function returns a resolved promise with an object where the "error" field is set
      return res.status(404).json(film);
  
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


// POST
app.post('/api/films/:id/rating', 
  check('id').isInt({min:1}),
  check('rating').isInt({min:-4, max:4}),
  async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }

  const filmId = Number(req.params.id);
    // Is the id in the body present? If yes, is it equal to the id in the url?
  if (req.body.id && req.body.id !== filmId) {
      return res.status(422).json({ error: 'URL and body id mismatch' });
  }


  const film = await dao.getFilmById(filmId);

  if (film.error)
        return res.status(404).json(film);
  if (!film[0].rating)
    return res.status(422).json({error: `Modification of rating not allowed because rating is not set`});
  const deltaRating = req.body.rating;
  
  if (film[0].rating + deltaRating > 5 || film[0].rating + deltaRating < 1)
    return res.status(422).json({error: `Modification of rating would yield a value out of valid range`});
  try {

    const result = await dao.addRating(req.body.id,req.body.rating);
   
    if (result.error)
      res.status(404).json(result);
    else
      res.json(result);  // NB: list of answers can also be an empty array
  } catch (err) {
    res.status(501).end();
  }
});


//GET
app.get('/api/films', (req, res) => {
  const filter = req.query.filter || "all"; // Se non specificato, mostra tutti i film
  dao.GetFilteredFilms(filter)
  .then(films => res.json(films))
  .catch(err => res.status(500).json({ error: err.message }));
});

app.put('/api/films/:id', 
  check('id').isInt({min: 1}),    // check: is the id an integer, and is it a positive integer?
  check('title').isLength({min: 1, max: maxTitleLength}).optional(),
  check('favorite').isInt({min:0,max:1}).optional(),
  check('watchdate').isDate({format: 'YYYY-MM-DD', strictMode: true}).optional({checkFalsy: true}),
  check('rating').isInt({min: 1, max: 5}).optional(),
  async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }


  const filmId = Number(req.params.id);
  const film = {
      id: req.body.id,
      title: req.body.title,
      favorite: req.body.favorite,
      watchDate: req.body.watchDate,
      rating: req.body.rating,
  };


  // Is the id in the body present? If yes, is it equal to the id in the url?
    if (req.body.id && req.body.id !== filmId) {
      return res.status(422).json({ error: 'URL and body id mismatch' });
    }

  const film2 = await dao.getFilmById(filmId);

  if (film2.error)
        return res.status(404).json(film);


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