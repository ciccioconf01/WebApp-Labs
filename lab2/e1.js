"use strict"
const dayjs = require('dayjs');
const sqlite = require('sqlite3');
const db = new sqlite.Database('films.db', (err) => {if(err) throw err;});

function Film(id,title,favorites = false,date,rating){
    this.id = id;
    this.title = title;
    this.favorites = favorites;
    this.date = date;
    this.rating = rating;

}

function FilmLibrary(array){
    this.array = array;

    this.addNewFilm = (film) => array.push(film);

    this.print = () => {
        for(let f of array){
            let x = '';
            let datep;
            if (f.rating == undefined){
                x = '<Not Scored>';
            }
            else{
                x = f.rating;
            }

            if (f.date){
                datep = f.date.format('MMMM DD YYYY');
            }
            else{
                datep = f.date;
            }

            console.log(f.id + ' ' + f.title + ' ' + f.favorites + ' ' + datep + ' ' + x);
        }
    }

    this.sortByDate = () => {

        let tmp = this.array.filter ( (val) => val.date == undefined);
        let array = this.array.filter( (val) => val.date ).filter( (val) => val!=undefined).sort( (a,b) => a.date-b.date);
        let arrayFinal = [...array,...tmp];
        return arrayFinal;
    }

    this.getRated = () => {
        let tmp = this.array.filter ( (val) => val.rating != undefined).sort ( (a,b) => a.score + b.score);
        return tmp;
    }

    this.deleteFilm = (id) => {
        array = array.filter( (val) => val.id != id);
    } 

    this.resetWatchedFilms = () => {
        array = array.map (val => {
            val.date = undefined;
            return val;
        });
    }


    this.all = async () => {
        function list() {
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
        }

        async function principle(){
            let array=[];
            array = await list();
            //db.close();
            return array;
        }
        array = await principle();
        //console.log(array);
        
        return array;
    }



    this.favourite = async () => {
        function list() {
            return new Promise ((resolve,reject) => {
                db.all('SELECT * FROM FILMS WHERE favorite=true', (err,rows) => {
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
        }

        async function principle(){
            let array=[];
            array = await list();
            db.close();
            return array;
        }
        array = await principle();
        //console.log(array);
        
        return array;
    }


    this.watchedToday = async () => {
        function list() {
            return new Promise ((resolve,reject) => {
                //let today = dayjs().format('YYYY-MM-DD');
                let today = '2023-03-10';
                db.all('SELECT * FROM FILMS WHERE watchdate=?', [today], (err,rows) => {
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
        }

        async function principle(){
            let array=[];
            array = await list();
            db.close();
            return array;
        }
        array = await principle();
        //console.log(array);
        
        return array;
    }


    this.watchedEarlier = async (date) => {
        function list() {
            return new Promise ((resolve,reject) => {
                
                db.all('SELECT * FROM FILMS WHERE watchdate<?', [date], (err,rows) => {
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
        }

        async function principle(){
            let array=[];
            array = await list();
            db.close();
            return array;
        }
        array = await principle();
        //console.log(array);
        
        return array;
    }

    this.ratingGreaterEqual = async (rating) => {
        function list() {
            return new Promise ((resolve,reject) => {
                
                db.all('SELECT * FROM FILMS WHERE rating>=?', [rating], (err,rows) => {
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
        }

        async function principle(){
            let array=[];
            array = await list();
            db.close();
            return array;
        }
        array = await principle();
        //console.log(array);
        
        return array;
    }

    this.stringInTitle = async (string) => {
        function list() {
            return new Promise ((resolve,reject) => {
                string = '%' + string + '%';
                db.all('SELECT * FROM FILMS WHERE title LIKE ?', [string], (err,rows) => {
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
        }

        async function principle(){
            let array=[];
            array = await list();
            db.close();
            return array;
        }
        array = await principle();
        //console.log(array);
        
        return array;
    }

    this.insert = async (film) => {
        function list() {
            return new Promise ((resolve,reject) => {

                db.run('insert into films (id, title, favorite, watchdate, rating) values (?,?,?,?,?)', [film.id, film.title,film.favorite ? 1:0 ,film.date,film.rating], (err) => {
                    if(err){
                        reject(err);
                    }
                    else{
                        resolve('done');
                    }
                })
            })
        }

        async function principle(){
            let message;
            message = await list();

            return message;
        }
        let message = await principle();
        
        return message;
    }


    this.delete = async (id) => {
        function list() {
            return new Promise ((resolve,reject) => {
                
                db.run('DELETE FROM films WHERE id = ?', [id], (err) => {
                    if(err){
                        reject(err);
                    }
                    else{
                        resolve('done');
                    }
                })
            })
        }

        async function principle(){
            let message;
            message = await list();
            
            return message;
        }
        let message = await principle();
        
        return message;
    }

    this.deleteDate = async () => {
        function list() {
            return new Promise ((resolve,reject) => {
                
                db.run('UPDATE films SET watchdate = NULL;', (err) => {
                    if(err){
                        reject(err);
                    }
                    else{
                        resolve('done');
                    }
                })
            })
        }

        async function principle(){
            let message;
            message = await list();
            
            return message;
        }
        let message = await principle();
        
        return message;
    }
}


async function main(){
    let array=[];
    let library = new FilmLibrary(array);

    array = await library.all();
    console.log(array);

    let message;
    
    let f6 = new Film(6,'Suca',false, '2023-03-21' ,3);
    message = await library.insert(f6);
    console.log(message);

    array = await library.all();
    console.log(array);


    message = await library.delete(6);
    console.log(message);


    array = await library.all();
    console.log(array);

    message = await library.deleteDate();
    console.log(message);


    array = await library.all();
    console.log(array);

}

main();
