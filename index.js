const autoCompleteConfig = {

    // how to show the content of the individual items
    renderOption(movie){
        const imgSrc = movie.Poster === 'N/A' ? '': movie.Poster;
        return `
                <img src="${imgSrc}" />
                ${movie.Title} (${movie.Year})
            `;
    },
    // What to backfill into the input when an item is selected
    inputValue(movie){
        return movie.Title;
    },
    // How to fetch the data
    async fetchData (searchTerm){
        const response = await axios.get("http://www.omdbapi.com/", {
            params: {
                apikey: '2e832554',
                s: searchTerm,
            }
        });
        if(response.data.Error) {
            return [];
        }
        return response.data.Search;
    }
};

// Autocomplete configuration object
createAutocomplete({ 
    // root: where to render the autocomplete widget
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect(movie){
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
    },
    ...autoCompleteConfig
})

createAutocomplete({ 
    // root: where to render the autocomplete widget
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect(movie){
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
    },
    ...autoCompleteConfig
})

let leftMovie;
let rightMovie;

const onMovieSelect = async (movie, summaryElement, side) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: '2e832554',
            i: movie.imdbID,
        }
    });
    summaryElement.innerHTML = movieTemplate(response.data);

    if(side === 'left')
        leftMovie = response.data;
    else
        rightMovie = response.data;

    if(leftMovie && rightMovie) {
        runComparison();
    }
}

const runComparison = () => {
    const leftSideStats = document.querySelectorAll('#left-summary .notification');
    const rightSideStats = document.querySelectorAll('#right-summary .notification');

    leftSideStats.forEach( (leftStats, index) => {
        const rightStats = rightSideStats[index];

        const leftStatsValue = leftStats.dataset.value;
        const rightStatsValue = rightStats.dataset.value;

        if(leftStatsValue > rightStatsValue){
            rightStats.classList.remove('is-primary');
            rightStats.classList.add('is-warning');
        }
        else {
            leftStats.classList.remove('is-primary');
            leftStats.classList.add('is-warning');
        }
    });
};


const movieTemplate = (movieDetail) => {
    // const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
    const dollars = parseInt(movieDetail.BoxOffice.slice(1).split(',').join(''));
    const metascore = parseInt(movieDetail.Metascore);
    const imdbRating = parseInt(movieDetail.imdbRating);
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));
    console.log(imdbVotes);
    const awards = parseInt(movieDetail.Awards.split(' ').reduce((count, word) => {
        const value = parseInt(word);
        if(isNaN(value)){
            return count;
        }
        return count+value;
    }, 0));

    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetail.Poster}"/>
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movieDetail.Title}</h1>
                    <h4>${movieDetail.Genre}</h4>
                    <p>${movieDetail.Plot}</p>
                </div>
            </div>
        </article>
        <article data-value=${awards} class="notification is-primary">
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article data-value=${dollars} class="notification is-primary">
            <p class="title">${movieDetail.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article data-value=${metascore} class="notification is-primary">
            <p class="title">${movieDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article data-value=${imdbRating} class="notification is-primary">
            <p class="title">${movieDetail.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article data-value=${imdbVotes} class="notification is-primary">
            <p class="title">${movieDetail.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
        `;
}

