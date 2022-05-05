//const http=http://www.omdbapi.com/?t=moa&plot=full
// https:www.omdbapi.com/?t=moana&apikey=39157e45

/*
Poster: "https://m.media-amazon.com/images/M/MV5BMjI4MzU5NTExNF5BMl5BanBnXkFtZTgwNzY1MTEwMDI@._V1_SX300.jpg"
Title: "Moana"
Type: "movie"
Year: "2016"
imdbID: "tt3521164"
*/
const myKey = "39157e45";

const searchContainer = document.querySelector('[data-search-container]');
const searchButton = document.querySelector('.search-button');
const searchInput = document.querySelector('.search-input');
let xhrRequest;
let favList = [];
document.onload = (() => {

    // Function for checking if alarm list is present in local storage
    const isPresent = localStorage.getItem("favList");
    if (isPresent) {
        favList = JSON.parse(isPresent);
    }



})();
const updateSearchResults = debounce((searchKeyword) => {
    // do the working
    let url = `https://www.omdbapi.com/?s=`
        // event.preventDefault();
        // console.log(searchInput.value);
        // 
    url = url + searchKeyword + `&plot=full&apikey=${myKey}&page=1`;
    console.log(url)
    xhrRequest = new XMLHttpRequest();
    xhrRequest.onload = getSearchResult;
    xhrRequest.open('GET', url);
    xhrRequest.send();
})

searchInput.addEventListener("input", e => {
    if (e.target.value.length > 2)
        updateSearchResults(e.target.value);

});

function debounce(cb, delay = 1000) {
    // debounce returning a function
    // finction takes any amount of arguments
    // it's generic
    let timeout
    return (...args) => {
        // setting up our timer
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            // call our callback with argument
            cb(...args)
        }, delay);


    }
}




searchButton.addEventListener('click', () => {
    let url = `https://www.omdbapi.com/?s=`
    event.preventDefault();
    // console.log(searchInput.value);
    // 
    url = url + searchInput.value + `&plot=full&apikey=${myKey}&page=1`;
    console.log(url)
    xhrRequest = new XMLHttpRequest();
    xhrRequest.onload = getSearchResult;
    xhrRequest.open('GET', url);
    xhrRequest.send();
});

function getSearchResult() {
    var responseJson = JSON.parse(xhrRequest.response);
    let searchList = responseJson.Search
    searchContainer.innerHTML = "";
    searchList.forEach(element => {

        let title = element.Title;
        let poster = element.Poster;
        // if no poster is available
        if (poster == "N/A" || poster == "n/a") {
            console.log("no image")
            poster = "./assets/images/No_Image_Available.jpg";
        }
        let year = element.Year;
        let stype = element.Type;
        let imdbID = element.imdbID;
        let togggleClass = "";
        let addedToFav = (() => {
            if (favList.some(row => row.includes(imdbID))) {
                togggleClass = "added-to-fav";
                console.log("found you")
                return 'active';

            }
            return 'inactive';

        })();
        console.log(addedToFav);



        searchContainer.innerHTML += ` <div class="col-lg-3 col-md-4 col-sm-6 ">
                                <div class="card text-white mb-4 shadow-sm bg-dark ">
                                    <div>
                                        <a href="https//www.google.com">
                                    <img class="card-img-top"  alt="Thumbnail [100%x225] " style="height: 350px; width: 100%; display: block; " src="${poster}
                        " onerror="this.onerror=null; this.src='./assets/images/No_Image_Available.jpg'" data-holder-rendered="true "></a>
                                    <div class="text-white like d-flex justify-content-end position-absolute end-0 top-0 mx-1 ${togggleClass}"  data-list-active="${addedToFav}" style="height: 1.25rem; width: 1.25rem; display: block;">
                                        
                                          <i class="fas fa-heart " onclick="event,addToFav('${encodeURIComponent(JSON.stringify(element))}')"></i>
                                        
                                        
                                      </div>
                                </div>
                                    <div class="card-body ">
                                       
                                        <h5 class="card-title searchTitle" data-search-result-title>${title}</h5>
                                        <h6 class="card-subtitle mb-2 text-muted ">${year}</h6>
                                      
                                    </div>
                                </div>
                            </div>`;

    });
    console.log(responseJson);

}

// function exists(imdbID) {
//     return favList.some(row => row.includes(imdbID));
// }

// Adding debounce feature

function addToFav(encodedObj) {
    // console.log(event);
    // console.log(event.target);
    let favIconContainer = event.target.parentElement;
    event.preventDefault();
    obj = JSON.parse(decodeURIComponent(encodedObj));
    let imdbID = obj.imdbID;
    let isAdded = favIconContainer.getAttribute('data-list-active');
    // console.log(isAdded)

    if (isAdded == 'inactive') {
        console.log("inside")
        favIconContainer.classList.toggle("added-to-fav")
        favIconContainer.setAttribute('data-list-active', 'active')
        favList.push([imdbID, obj]);
        localStorage.setItem("favList", JSON.stringify(favList));
    } else {
        // delete from the list
        console.log("inside delete")



        for (let i = 0; i < favList.length; i++) {
            if (favList[i].includes(imdbID)) {
                console.log("yes");
                favList.splice(i, 1);
                break;
            }
        }
        localStorage.setItem("favList", JSON.stringify(favList));
        favIconContainer.classList.toggle("added-to-fav")
        favIconContainer.setAttribute('data-list-active', 'inactive')

    }



}




//  const cardTemplate = document.querySelector('[data-search-template]');
// for (let i = 0; i <= 9; i++) {
//     const card = cardTemplate.content.cloneNode(true).children[0];
//     // console.log(card.children[0].children[1]);
//     const cardBody = card.children[0].children[1];
//     // const cardTitle = cardBody.querySelector('data-search-result-title');
//     const cardTitle = cardBody.children[0];
//     // console.log(cardTitle);
//     // cardTitle.textContent = i;
//     searchContainer.append(card);
//     let searchTitle = cardBody.querySelector('.searchTitle');
//     // console.log(searchTitle);
//     searchTitle.textContent = i;
// }