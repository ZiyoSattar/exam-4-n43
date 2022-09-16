let elTemplate = document.querySelector("#template").content;
let errorTemplate = document.querySelector("#errorTemplate").content;
let elHeroInner = document.querySelector(".hero__inner");
let elSearchForm = document.querySelector(".js-form-seatch");
let elSearchInput = document.querySelector(".js-form-input");
let elMoviesList = document.querySelector(".js__movies-wrapper");
let spinner = document.querySelector(".spinner");

// PAGINATION
let elPagItem = document.querySelector(".movies__page-rs");
let pageButtons = document.querySelectorAll(".movies__btns-pg");
let page = 1;

// MODAL
let elModalWrapper = document.querySelector(".js-modal-wrapper");
let elModalBody = document.querySelector(".modal-body");

// MOVIES ARRAY
let moviesArr = [];

// ERROR FUNCTION
let errorFunction = (err) => {
  elMoviesList.innerHTML = null;
  let elFragmentError = document.createDocumentFragment();
  let errorMovie = errorTemplate.cloneNode(true);
  errorMovie.querySelector(".js-errot-text").textContent = err;
  elFragmentError.append(errorMovie);
  elMoviesList.appendChild(elFragmentError);
};

// RENDER MOVIES
let renderMovies = (movies) => {
  elMoviesList.innerHTML = null;
  let elTemplateFragment = document.createDocumentFragment();
  movies.forEach((movie) => {
    let newTemplate = elTemplate.cloneNode(true);

    let templateItemClone = newTemplate.querySelector(".js-search-item");

    templateItemClone.querySelector(".card-img-top").src = movie.Poster;
    templateItemClone.querySelector(".card-img-top").alt = movie.Title;
    templateItemClone.querySelector(".card-title").textContent = movie.Title;
    templateItemClone.querySelector(".card-text").textContent = movie.Plot;
    templateItemClone.querySelector(".js-search-button").value = movie.imdbID;
    elTemplateFragment.append(templateItemClone);
  });
  elMoviesList.append(elTemplateFragment);
};


// FETCH SEARCHING MOVIES || SPINNER
const searchMovies = async (movies = "", page) => {
  try {
    const responce = await fetch(`https://www.omdbapi.com/?s=${movies}&apikey=d05f1aad&page=${page}`);

    let data = await responce.json();
    moviesArr = data.Search;

    renderMovies(data.Search);
  } catch (err) {
    errorFunction("Kiritgan kinoingiz topilmadi");
  } finally {
    spinner.classList.add("d-none");
  }
};
let searchValue = "Hulk";
let selectValue = "movie";
searchMovies(searchValue, selectValue, page);


// SEARCH FORM || EVENTLISTENER
elSearchForm.addEventListener("submit", function (evt) {
  evt.preventDefault();

  elMoviesList.innerHTML = null;
  spinner.classList.remove("d-none");

  page = 1;
  elPagItem.textContent = page;
  searchValue = elSearchInput.value.toLowerCase().trim();

  searchMovies(searchValue,page);
});


// MODAL
elMoviesList.addEventListener("click", (e) => {
  if (e.target.matches(".js-search-button")) {
    const movieImdbID = e.target.value;
    const currentMovie = moviesArr.find((movie) => movie.imdbID == movieImdbID);

    elModalBody.querySelector(
      ".js-modal-movie-summary"
    ).textContent = `Movie type: ${currentMovie.Type}`;
    elModalBody.querySelector(
      ".js-modal-year"
    ).textContent = `Movies year : ${currentMovie.Year}`;
    elModalWrapper.querySelector(
      ".modal-title"
    ).textContent = `Movies title : ${currentMovie.Title}`;
  }
});


pageButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    if (btn.textContent == "preview") {
      if (page > 1) {
        --page
        elPagItem.textContent = page;
        searchMovies(searchValue,page);
      }
    } else {
      ++page
      elPagItem.textContent = page;
      searchMovies(searchValue,page);
    }
  })
});