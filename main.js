let countries;

fetch("https://restcountries.eu/rest/v2/all")
.then(res => {
    return res.json()
})
.then(data => {
    storeData(data)
})
.catch(err => {
    console.log(err, "Cannot fetch api")
})

let storeData = (data) => {
   countries = data; 
}

let search = document.getElementById("search")
let search_suggestions = document.getElementsByClassName("search-suggestions")[0]
let slen = 9
let su_divs = []
let len = 1
let pos = len - 1

search.addEventListener("keyup", function(key) {
    if (key.keyCode == 38) {
        if (pos != len-1) su_divs[pos].classList.remove("suhl")
        pos = ((pos-1)%len+len)%len
        if (pos != len-1) su_divs[pos].classList.add("suhl")
        return
    } else if (key.keyCode == 40) {
        if (pos != len-1) su_divs[pos].classList.remove("suhl")
        pos = (pos+1)%len
        if (pos != len-1) su_divs[pos].classList.add("suhl")
        return
    }

    let suggestions = []
    if (search.value != "") {
        suggestions = countries.filter(function(country) {
            return country.name.toLowerCase().startsWith(search.value.toLowerCase())
        })
    }
    if (suggestions.length > slen) {
        suggestions = suggestions.slice(0, slen)
    }

    let htmlString = ""
    suggestions.forEach(country => {
        htmlString += "<div class='sunl'>" + country.name + "</div>"
    })

    if (htmlString != "") {
        search.style.borderBottomLeftRadius = "0px"
        search.style.borderBottomRightRadius = "0px"
    } else {
        search.style.borderBottomLeftRadius = "10px"
        search.style.borderBottomRightRadius = "10px"
    }

    search_suggestions.innerHTML = htmlString
    su_divs = document.getElementsByClassName("sunl")
    len = su_divs.length + 1
    pos = len - 1
})