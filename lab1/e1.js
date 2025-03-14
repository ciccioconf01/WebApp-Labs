"use strict"
const dayjs = require('dayjs');

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
}

let f1 = new Film(1,'Pulp Fiction',true,dayjs('2023-03-10'),5);
let f2 = new Film(2,'21 Grams',true,dayjs('2023-03-17'),4);
let f3 = new Film(3,'Star Wars',false);
let f4 = new Film(4,'Matrix', false);
let f5 = new Film(5,'Shrek',false, dayjs('2023-03-21'),3);

let array = [];
let library = new FilmLibrary(array);
library.addNewFilm(f1);
library.addNewFilm(f2);
library.addNewFilm(f3);
library.addNewFilm(f4);
library.addNewFilm(f5);


let arraySorted = library.sortByDate();

// library.deleteFilm(2);
// library.print();

let arraySorted2 = library.getRated();
// console.log(arraySorted2);
library.resetWatchedFilms();
console.log(library);
library.print();