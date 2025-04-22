'use strict';
/*
 * [2024/2025]
 * Web Applications
 */
const deleteOption = true;  // Enable or disable the optional part of the lab

const FILMS = [
    // Data Strucutre: id, title, favorite, watchDate, rating
    [1, "Pulp Fiction", true, "2024-03-10", 5],
    [2, "21 Grams", true, "2024-03-17", 4],
    [3, "Star Wars", false],
    [4, "Matrix", true],
    [5, "Shrek", false, "2024-03-21", 3],
    [6, "Il Papa", false, "2025-04-21", 1],
    [7, "Il Papa 2", false, "2025-04-21", 5]
  ];


function Film(id, title, isFavorite = false, watchDate, rating = 0) {
    this.id = id;
    this.title = title;
    this.favorite = isFavorite;
    this.rating = rating;
    // saved as dayjs object only if watchDate is truthy
    this.watchDate = watchDate && dayjs(watchDate);

    // Filters
    this.isFavorite =   () => { return this.favorite; }
    this.isBestRated =  () => { return this.rating === 5; }

    this.isSeenLastMonth = () => {
        if(!this.watchDate) return false;         // no watchDate
        const diff = this.watchDate.diff(dayjs(),'month')
        const ret = diff <= 0 && diff > -1 ;      // last month
        return ret;
    }

    this.isUnseen = () => {
        if(!this.watchDate) return true;     // no watchdate
        else return false;
    }

}

function FilmLibrary() {
    this.list = [];

    this.add = (film) => {
        this.list = [...this.list, film];
        
        /*
        if (!this.list.some(f => f.id == film.id))
            this.list = [...this.list, film];
        else throw new Error('Duplicate id');
        */
    };

    this.filterAll = () => {
        return this.list.filter( () => true);
    }


    this.filterByFavorite = () => {
        return this.list.filter( (film) => film.isFavorite() );
    }

    this.filterByBestRated = () => {
        return this.list.filter( (film) => film.isBestRated() );
    }

    this.filterBySeenLastMonth = () => {
        return this.list.filter( (film) => film.isSeenLastMonth() );
    }

    this.filterByUnseen = () => {
        return this.list.filter( (film) => film.isUnseen() );
    }

    // This function permanently delete one element from the library
    this.delete = (id) => {
        this.list = this.list.filter( f => f.id != id );
    }
}

function clearFilms() {
    const tableBody = document.getElementById('filmLibrary');
    tableBody.innerHTML = "";  // Be careful using innerHTML for XSS, however with constant strings this is safe
}


function vote(id) {
    // Modify the score corresponding to the id
    filmLibrary.list.forEach(e => { if (e.id == id) e.rating += 1 });
    //alternative:
    //answerList = answerList.map(e => e.id==id? Object.assign({}, e, {score: e.score+1}) : e );

    // Delete the full list
    clearFilms();

    // Recreate the full list starting from the data structure
    createFilmLibrary(filmLibrary.list);
}

function cancella(id) {
    // Modify the score corresponding to the id
    filmLibrary.list = filmLibrary.list.filter(film => film.id != id);
    //alternative:
    //answerList = answerList.map(e => e.id==id? Object.assign({}, e, {score: e.score+1}) : e );

    // Delete the full list
    clearFilms();

    // Recreate the full list starting from the data structure
    createFilmLibrary(filmLibrary.list);
}


function createFilmNode(film) {

    
    const newTd1 = document.createElement("td");
    const newContentDate = document.createTextNode(
        film.watchDate ? film.watchDate.format('YYYY-MM-DD') : ''
    );
    newTd1.appendChild(newContentDate);

    const newTd2 = document.createElement("td");
    // newTd2.innerText = ans.text;
    const newContentText = document.createTextNode(film.title);
    newTd2.appendChild(newContentText);
    
    const newTd3 = document.createElement("td");
    const newContentRespondent = document.createTextNode(film.favorite);
    newTd3.appendChild(newContentRespondent);
    
    const newTd4 = document.createElement("td");
    const newContentScore = document.createTextNode(film.rating);
    newTd4.appendChild(newContentScore);

    const newTd5 = document.createElement("td");
    const newButton = document.createElement("button");
    newButton.className = "btn btn-primary";
    newButton.id = film.id;
    newButton.textContent = "Vote";
    newTd5.appendChild(newButton);

    newButton.addEventListener('click', event =>  {
        console.log('button pressed, id '+film.id);
        //console.log(event.target);

        //newTd4.innerText = parseInt(newTd4.innerText)+1;
        vote(event.target.id);
    });

    
    
    const newTd6 = document.createElement("td");
    const newButton2 = document.createElement("button");
    newButton2.className = "btn btn-primary";
    newButton2.id = film.id;
    newButton2.textContent = "Delete";
    newTd6.appendChild(newButton2);

    newButton2.addEventListener('click', event =>  {
        console.log('button pressed, id '+film.id);
        //console.log(event.target);

        //newTd4.innerText = parseInt(newTd4.innerText)+1;
        cancella(event.target.id);
    });
    


    const newTr = document.createElement("tr");
    newTr.appendChild(newTd2);
    newTr.appendChild(newTd3);
    newTr.appendChild(newTd1);
    newTr.appendChild(newTd4);
    newTr.appendChild(newTd5);
    newTr.appendChild(newTd6);
    

    return newTr;

}

function createFilmLibrary(filmLibrary) {
    //const tableBody = document.querySelector('tbody');
    const tableBody = document.getElementById('filmLibrary');

    
    // Create table header
    const tr = document.createElement('tr');

    // Be careful using innerHTML for XSS, however with constant strings this is safe
    tr.innerHTML = '<th>Title</th> \
    <th>Favorite</th> \
    <th>Last seen</th> \
    <th>Rating</th>' + '<th>Vote</th>' + '<th>Delete</th>';
    tableBody.appendChild(tr);

    for (let film of filmLibrary) {
        const newRow = createFilmNode(film);
        tableBody.appendChild(newRow);
    }

}
/**
 * Function to manage film filtering in the web page.
 * @param {string}   filterId  The filter node id.
 * @param {string}   titleText The text to put in the film list content h1 header.
 * @param {function} filterFn  The function that does the filtering and returns an array of gilms.
 */

function filterFilms( filterId, titleText, filterFn ) {
    
    document.querySelectorAll('#left-sidebar div a ').forEach( node => node.classList.remove('active'));
    document.getElementById('active-filter-name').innerText = titleText;
    document.getElementById(filterId).classList.add('active');
    clearFilms();
    createFilmLibrary(filterFn());

}



// ----- Main ----- //
const filmLibrary = new FilmLibrary();
FILMS.forEach(f => filmLibrary.add(new Film(...f)));
createFilmLibrary(filmLibrary.filterAll());




// --- Creating Event Listeners for filters --- //
document.getElementById("filter-all").addEventListener( 'click', event => 
    filterFilms( 'filter-all', 'All', filmLibrary.filterAll )
);

document.getElementById("filter-favorites").addEventListener( 'click', event => 
    filterFilms( 'filter-favorites', 'Favorites', filmLibrary.filterByFavorite )
);

document.getElementById("filter-best").addEventListener( 'click', event => 
    filterFilms( 'filter-best', 'Best Rated', filmLibrary.filterByBestRated )
);

document.getElementById("filter-seen-last-month").addEventListener( 'click', event => 
    filterFilms( 'filter-seen-last-month', 'Seen Last Month', filmLibrary.filterBySeenLastMonth )
);

document.getElementById("filter-unseen").addEventListener( 'click', event => 
    filterFilms( 'filter-unseen', 'Unseen', filmLibrary.filterByUnseen )
);