var cuisineImage = {
  american: './images/food-american.jpg',
  california: './images/food-american.jpg',
  cuban: './images/food-cuban.jpg',
  dessert: './images/food-dessert.jpg',
  mexican: './images/food-mexican.jpg',
  seafood: './images/food-seafood.jpg',
  vegetarian: './images/food-vegetarian.jpg'
}

var movieArray = null;
var restaurantArray = null;
var rowMovie = document.getElementById('rowMovie');
var rowPlace = document.getElementById('rowPlace');
var movieText = document.getElementById('movieText');
var placeText = document.getElementById('placeText');
var container = document.querySelector('container');
var rowElt = document.querySelector('.row');
var loadingModal = document.getElementById('loadingModal');
var logo = document.getElementById('logo')

var header = document.getElementById('header')
header.addEventListener('click', handleHome)

var btnRegen = document.getElementById('btnRegenerate');
btnRegen.addEventListener('click', handleClick);


function handleClick() { //when button is clicked, ajax request is called
  //The Movie Database API
  reset();

  rowMovie.classList.add('row', 'border', 'border-white', 'rounded', 'bg-white', 'mx-1', 'my-3')
  rowMovie.classList.remove('d-none')
  rowPlace.classList.add('row', 'border', 'border-white', 'rounded', 'bg-white', 'mx-1', 'my-2')
  rowPlace.classList.remove('d-none')

  loadingModal.classList.remove('d-none');

  $.ajax({
    url: 'https://api.themoviedb.org/3/movie/top_rated?api_key=b67aeeb26d6866b85c4c2077bf8bbfc0&language=en-US&page=1',
    method: 'GET',
    success: function (data) {
      movieArray = data.results;
      renderMovie(data.results); //function with placeholder value (passing data as an argument to the function)
      //Zomato
      $.ajax({
        url: 'https://developers.zomato.com/api/v2.1/search?entity_id=484&entity_type=city',
        method: 'GET',
        headers: {
          "user-key": "fc53565b99be0fd264e83e23e8ca9552",
        },
        success: function (data) {
          restaurantArray = data.restaurants
          renderRestaurant(data.restaurants)
          loadingModal.classList.add('d-none');
        },
        error: function (data) {
          console.log("ZOMATO Error:", data)
          alert("There seems to be an error connecting. Try again when you're online!")
        }
      })
    },
    error: function (data) {
      console.log("TMDB Error:", data)
    }
  })

  btnRegen.textContent = "Regenerate"
}


function renderMovie() { //define function has a function keyword -- i.e. renderData
  var randomNumber = Math.floor(Math.random() * movieArray.length) //pick random number from length of array
  var randomMovie = movieArray[randomNumber]

  var randomPosterPath = randomMovie['poster_path']; //image path data

  var movieHeaderDiv = document.createElement('div');
  movieHeaderDiv.classList.add('col-11', 'm-2', 'd-flex', 'justify-content-center', 'align-items-center')

  var movieHeader = document.createElement('img');
  movieHeader.src = './images/watch-this.png'
  movieHeader.classList.add('movie-header-img', 'mb-2')

  var createImg = document.createElement('img');
  var movieImageDiv = document.createElement('div');
  movieImageDiv.classList.add('col-sm-3', 'd-flex', 'justify-content-center', 'align-items-center');
  createImg.src = 'https://image.tmdb.org/t/p/' + 'w200' + randomPosterPath;
  createImg.classList.add('movie-image', 'mb-3');

  var pEltTitle = document.createElement('h2');
  pEltTitle.textContent = randomMovie.original_title;

  var pSummary = document.createElement('p');
  pSummary.textContent = 'Summary: ' + randomMovie.overview;

  movieText.append(pEltTitle, pSummary);
  movieHeaderDiv.appendChild(movieHeader);
  movieImageDiv.appendChild(createImg);
  rowMovie.append(movieHeaderDiv, movieImageDiv, movieText);
}

function renderRestaurant() {
  var randomNumber = Math.floor(Math.random() * restaurantArray.length)
  var randomPlace = restaurantArray[randomNumber]

  var placeHeaderDiv = document.createElement('div');
  placeHeaderDiv.classList.add('col-11', 'm-2', 'd-flex', 'justify-content-center', 'align-items-center')

  var placeHeader = document.createElement('img');
  placeHeader.src = './images/eat-this.png';
  placeHeader.classList.add('place-header-img', 'mb-2')

  var placeImg = document.createElement('img');
  placeImg.classList.add('restaurant-image', 'm-2');
  var placeImageDiv = document.createElement('div');
  placeImageDiv.classList.add('col-sm-3', 'd-flex', 'justify-content-center', 'align-items-center')


  var cuisines = randomPlace.restaurant.cuisines;
  cuisines = cuisines.toLowerCase();
  var cuisineImgUrl = null;

  if (cuisines.includes(',')) {
    cuisines = cuisines.split(', ')
    for (var i = 0; i < cuisines.length; i++) {
      var currentCuisine = cuisines[i];
      if (cuisineImage.hasOwnProperty(currentCuisine)) {
        cuisineImgUrl = cuisineImage[currentCuisine]
        break
      }
    }
  } else {
    cuisineImgUrl = cuisineImage[cuisines]
  }
  if (!cuisineImgUrl) {
    placeImg.src = './images/food-image.png'
  } else {
    placeImg.src = cuisineImgUrl;
  }

  var pEltPlace = document.createElement('h2');
  pEltPlace.textContent = randomPlace.restaurant.name;

  var pPlaceAddress = document.createElement('p');
  pPlaceAddress.textContent = randomPlace.restaurant.location.address;

  var pPrice = document.createElement('p');
  pPrice.textContent = "Price: " + randomPlace.restaurant.currency;

  var pCuisine = document.createElement('p');
  pCuisine.textContent = "Cuisine: " + randomPlace.restaurant.cuisines;

  var pNumber = document.createElement('p');
  pNumber.textContent = randomPlace.restaurant.phone_numbers;

  var pTime = document.createElement('p');
  pTime.textContent = randomPlace.restaurant.timings;

  var disclaimer = document.createElement('p');
  disclaimer.setAttribute('class', 'disclaimer-text')
  disclaimer.textContent = "*Some featured images are used for illustration purposes only. Actual meal appearances will vary."

  placeText.append(pEltPlace, pPlaceAddress, pCuisine, pPrice, pNumber, pTime, disclaimer);
  placeHeaderDiv.appendChild(placeHeader);
  placeImageDiv.appendChild(placeImg);
  rowPlace.append(placeHeaderDiv, placeImageDiv, placeText)
}

function reset() {
  rowPlace.innerHTML = "";
  placeText.innerHTML = "";
  rowMovie.innerHTML = "";
  movieText.innerHTML = "";
  logo.setAttribute('class', 'd-none')
}

function handleHome(){
  rowMovie.setAttribute('class', 'd-none')
  rowPlace.setAttribute('class', 'd-none')
  logo.classList.remove('d-none')
  logo.classList.add('logo-img')
  btnRegen.textContent = 'What to eatch?'
}
