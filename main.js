let countries;

fetch("https://restcountries.eu/rest/v2/all")
.then(res => {
    return res.json()
})
.then(data => {
    storeData(data)
})
.catch(err => {
    console.log(err, "cannot fetch api")
})

function storeData(data) {
   countries = data;
}

// functions to add and remove classes from elements
// added condition to prevent adding and removing classes
// from the last non-existent divs
function addClass(element, className) {
    if (element) {
        element.classList.add(className)
    }
}

function removeClass(element, className) {
    if (element) {
        element.classList.remove(className)
    }
}

function addSearchBorderRadius() {
    search.style.borderBottomLeftRadius = "0px"
    search.style.borderBottomRightRadius = "0px"
}

function removeSearchBorderRadius() {
    search.style.borderBottomLeftRadius = "10px"
    search.style.borderBottomRightRadius = "10px"
}

let search = document.getElementById("search")
let search_suggestions = document.getElementsByClassName("search-suggestions")[0]
let search_icon = document.getElementById("search-icon")

let usr_input = ""
let slen = 9                                            // maximum length of list of suggestion divs
let su_divs = []                                        // intialise empty array of suggestion divs
let len = 1                                             // length is always one greater than actual length
let pos = len - 1
// initialise highlight position at last index (non-existing suggestion div)
// for navigation purposes

search.addEventListener("input", function() {
    let suggestions = []

    // if the search value is not empty after an input
    // filter the countries with names starting with search value
    if (search.value != "") {
        suggestions = countries.filter(function(country) {
            return country.name.toLowerCase().startsWith(search.value.toLowerCase())
        })
    }
    //truncate results to maximium length of list if it exceeds
    if (suggestions.length > slen) {
        suggestions = suggestions.slice(0, slen)
    }

    let htmlstring = ""
    suggestions.forEach( (country, index) => {
        htmlstring += "<div id='" + index + "' class='sunl' onmouseover='setPos()' onmouseout='resetPos()'>" + country.name + "</div>"
    })
    
    // square and restore bottom borders of search box
    // when showing suggestions box
    if (htmlstring != "") {
        addSearchBorderRadius()
    } else {
        removeSearchBorderRadius()
    }

    search_suggestions.style.display = "block"          // show block if it is hidden due to blur
    usr_input = search.value                            // retain state of original user input
    search_suggestions.innerHTML = htmlstring
    su_divs = document.getElementsByClassName("sunl")   // get array of suggestion divs
    len = su_divs.length + 1                            // assign len to one more than actual length
    pos = len - 1                                       
    // reset position to last index (non-existing suggestion div)
})

// handling arrows in onkeydown event as they can't 
// be handled in oninput event and defaults can be prevented in keydown
search.addEventListener("keydown", function(event) {
    if (event.keyCode == 38) {                          // up arrow
        event.preventDefault()
        if (search_suggestions.style.display == "none") {
            addSearchBorderRadius()
            search_suggestions.style.display = "block"
            return
        }
        removeClass(su_divs[pos], "suhl")
        pos = ((pos-1)%len+len)%len
        search.value = su_divs[pos] ? su_divs[pos].innerHTML : usr_input
        addClass(su_divs[pos], "suhl")
    } else if (event.keyCode == 40) {                   // down arrow
        event.preventDefault()
        if (search_suggestions.style.display == "none") {
            addSearchBorderRadius()
            search_suggestions.style.display = "block"
            return
        }
        removeClass(su_divs[pos], "suhl")
        pos = (pos+1)%len
        search.value = su_divs[pos] ? su_divs[pos].innerHTML : usr_input
        addClass(su_divs[pos], "suhl")
    } else if (event.keyCode == 27) {                   // escape key
        search_suggestions.style.display = "none";
        removeSearchBorderRadius()
        search.value = usr_input
        removeClass(su_divs[pos], "suhl")               // escape resets highlight state
        pos = len - 1
    }
})

// remove suggestino box when user clicks outside the search box
search.addEventListener("blur", function() {
    search_suggestions.style.display = "none";          // clicking outside retains highlight state
    removeSearchBorderRadius()
})

// focus search when search icon is clicked
search_icon.addEventListener("click", function() {
    search.focus()
})

// handle onmouseover event 
function setPos() {
    removeClass(su_divs[pos], "suhl")
    pos = parseInt(event.target.id)
    addClass(su_divs[pos], "suhl")
}

// handle onmouseout event
function resetPos() {
    removeClass(su_divs[pos], "suhl")
    pos = len - 1
}