'use strict';
/* Data Access Object (DAO) module for accessing questions and answers */

const sqlite = require('sqlite3');
const dayjs = require('dayjs');

// open the database
const db = new sqlite.Database('films_original.db', (err) => {
  if(err) throw err;
});

// get all films
exports.filmsList = () => {
    return new Promise ((resolve,reject) => {
        db.all('SELECT * FROM FILMS', (err,rows) => {
            if(err){
                reject(err);
            }
            else{
                let array = [];
                for(let row of rows){
                    array.push(row);
                }
                resolve(array);
            }
        })
    })
};


// get film having an id
exports.getFilmById = (filmId) => {
    return new Promise ((resolve,reject) => {
        
        db.all('SELECT * FROM FILMS WHERE id=?', [filmId], (err,rows) => {
            if(err){
                reject(err);
            }
            else{
                if (rows.length == 0) {
                    resolve({ error: 'Film not found.' });
                }
                else{
                    let array = [];
                    for(let row of rows){
                        array.push(row);
                    }
                    
                    resolve(array);
                }
                
            }
        })
    })
};

// add a new film, return the newly created ID from DB
exports.insertFilm = (film) => {
  
  return new Promise ((resolve,reject) => {

                db.run('insert into films (id, title, favorite, watchdate, rating) values (?,?,?,?,?)', [film.id, film.title,film.favorite ? 1:0 ,dayjs(film.watchdate).format("YYYY-MM-DD"),film.rating], (err) => {
                    if(err){
                        reject(err);
                    }
                    else{
                        resolve(this.lastID);
                    }
                })
            });
};

// delete film having an id
exports.deleteFilmById = (id) => {
    return new Promise ((resolve,reject) => {
                
        db.run('DELETE FROM films WHERE id = ?', [id], (err) => {
            if(err){
                reject(err);
            }
            else{
                resolve({deletedRows : this.changes});
            }
        })
    })
};


exports.markFilm = (id, mark) => {
    return new Promise((resolve, reject) => {
        db.run(
            'UPDATE films SET favorite = ? WHERE id = ?',
            [mark ? 1 : 0, id],  // Imposta il valore di favorite (1 o 0)
            function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ updatedRows: this.changes }); // Restituisce il numero di righe aggiornate
                }
            }
        );
    });
};


exports.addRating = (id, rating) => {
    return new Promise((resolve, reject) => {
        db.run(
            'UPDATE films SET rating = rating + ? WHERE id = ?',
            [rating , id], 
            function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ updatedRows: this.changes }); // Restituisce il numero di righe aggiornate
                }
            }
        );
    });
};

exports.GetFilteredFilms = (filter) => {
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM films";
        let params = [];

        switch (filter) {
            case "favorite":
                query += " WHERE favorite = true";
                break;
            case "best":
                query += " WHERE rating = 5";
                break;
            case "lastmonth":
                const lastMonthDate = dayjs().subtract(30, 'day').format("YYYY-MM-DD");
                query += " WHERE watchdate >= ?";
                params.push(lastMonthDate);
                break;
            case "unseen":
                query += " WHERE watchdate IS NULL";
                break;
            default:
                break; // Se il filtro non è riconosciuto, restituisce tutti i film
        }

        db.all(query, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

exports.UpdateFilm = (id, newData) => {
    return new Promise((resolve, reject) => {
      // 1. Recupera il film esistente
      db.get("SELECT * FROM films WHERE id = ?", [id], (err, film) => {
        if (err) {
          return reject(err);
        }
        if (!film) {
          return reject(new Error("Film non trovato"));
        }
  
        // 2. Crea l'oggetto aggiornato: sovrascrive i campi solo se forniti in newData
        const updatedFilm = {
          title: newData.title !== undefined ? newData.title : film.title,
          // Se favorite arriva come booleano, lo trasformiamo in 0/1 (assumendo che il DB lo gestisca come intero)
          favorite: newData.favorite !== undefined ? (newData.favorite ? 1 : 0) : film.favorite,
          // Per la data, se non fornita, manteniamo quella esistente
          watchDate: newData.watchDate !== undefined ? newData.watchDate : film.watchDate,
          rating: newData.rating !== undefined ? newData.rating : film.rating
        };
  
        // 3. Esegui l'UPDATE nel database
        const query = `
          UPDATE films 
          SET title = ?, favorite = ?, watchDate = ?, rating = ?
          WHERE id = ?
        `;
        db.run(query, [updatedFilm.title, updatedFilm.favorite, updatedFilm.watchDate, updatedFilm.rating, id], function(err) {
          if (err) {
            return reject(err);
          }
          resolve({ updatedRows: this.changes });
        });
      });
    });
  };