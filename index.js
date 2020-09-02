
// Autocomplete configuration object
createAutocomplete({ 
    // root: where to render the autocomplete widget
    root: document.querySelector('.autocomplete'),
    // how to show the content of the individual items
    renderOption(movie){
        const imgSrc = movie.Poster === 'N/A' ? '': movie.Poster;
        return `
                <img src="${imgSrc}" />
                ${movie.Title} (${movie.Year})
            `;
    },
    // What to do when an item is pressed
    onOptionSelect(movie){
        onMovieSelect(movie);
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
})


const onMovieSelect = async (movie) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: '2e832554',
            i: movie.imdbID,
        }
    });
    document.querySelector('#summary').innerHTML = movieTemplate(response.data);
}


const movieTemplate = (movieDetail) => {
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
        <article class="notification is-primary">
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieDetail.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieDetail.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieDetail.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
        `;
}

