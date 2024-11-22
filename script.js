// Api acces key from unsplash
const accessKey = "84gsKGt1QFGBVu5NUS4Pyi_Y8jrxUBix25IU6PTywnY";

// All important variables
const btn = document.getElementById("btn");
const random = document.getElementById("random");
const orientations = document.querySelector("select[name='orientation']");
const color = document.querySelector("select[name='color']");
const orderBy = document.querySelector("select[name='orderBy']");
let keyword = document.getElementById("keyword")
const errors = document.getElementById("errors")


// Setting the cuurent value of keyword = null
let currentKeyword = "";


// Default page value = 1
let page = 1;



// Main function of the page which will fetch the data from url and display th result
const searchResult = async (userKeyword, clearResult = true) => {
    if (clearResult) {
        allOutputs.textContent = "";
    }
    let api_url = `https://api.unsplash.com/search/photos?client_id=${accessKey}&page=${page}&query=${userKeyword}&per_page=12`;
    console.log(api_url)

    
// Adding filters to the api url
    if (orientations.value) {
        api_url += `&orientation=${orientations.value}`
    }
    if (color.value) {
        api_url += `&color=${color.value}`
    }
    if (orderBy.value) {
        api_url += `&order_by=${orderBy.value}`
    }

    try {
        const response = await fetch(api_url);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            data.results.forEach((image) => {
                const allOutputs = document.getElementById("allOutputs")
                const imageContainer = document.createElement("div")
                imageContainer.classList.add("imageContainer")

                const img = document.createElement("img")
                const info = document.createElement("span")
                const imageLink = document.createElement("a")
                imageLink.href = image.links.html;
                imageLink.target = "_blank";

                img.src = image.urls.small;
                const isoDate = `${image.created_at}`
                const date = new Date(isoDate);
                const formattedDate = date.toISOString().split("T")[0];
                info.textContent = `Uploaded by: ${image.user.name || 'Unsplash user'} on ${formattedDate}`;
                info.classList.add("hide")
                info.classList.add("info")
                imageLink.appendChild(img)
                imageContainer.appendChild(imageLink)
                imageContainer.appendChild(info)
                allOutputs.appendChild(imageContainer)
                document.getElementById("errors").style.display = 'none'
                document.getElementById("filterButton").style.display = "block"

                document.getElementById("total").style.visibility = "visible"
                if (data.total_pages >= 1000) {

                    total.textContent = `Showing results for \" ${currentKeyword}\" (${page} out of ${data.total_pages}+ pages)`
                } else {

                    total.textContent = `Showing results for \"${currentKeyword}\"  (${page} out of ${data.total_pages} pages)`
                }
                document.getElementById("showMore").style.display = "block"


            });
        }
        
// If there is nothing in the requested data the webpage will showing the following
        else {
            allOutputs.textContent = ''
            document.getElementById("total").textContent = ""
            document.getElementById("errors").style.display = 'block'
            document.getElementById("errors").textContent = 'Nothing to show :('
            document.getElementById("showMore").style.display = 'none'
            document.getElementById("filterButton").style.display = 'none'
            document.getElementById("filters").style.display = 'none'

            return
        }

// Catching the error if the api is exhausted or doesn't work for any other reason
    }
    catch (error) {
        console.log("Error fetching in data", error)
        document.getElementById("total").textContent = ""
        document.getElementById("errors").style.display = 'block'
        document.getElementById("errors").textContent = "Error fetching in data " + error;
    }

}

// Calling the search result fucntion by adding eventlisten on the search button
btn.addEventListener("click", (e) => {
    e.preventDefault();
    if (keyword.value === '') {

        document.getElementById("total").textContent = ""
        document.getElementById("errors").style.display = 'block'
        document.getElementById("errors").textContent = "Enter Something to Search :/";
        return
    }
    page = 1;
    currentKeyword = keyword.value;
    searchResult(currentKeyword, true);
})


// Show more button will increase the page number while retaining the previous results
document.getElementById("showMore").addEventListener("click", () => {
    page++;
    console.log(page)
    searchResult(currentKeyword, false);
})


// Showing some popular categories, user can click on it and get the results
nature.addEventListener("click", () => {
    page = 1;
    currentKeyword = "nature"
    searchResult(currentKeyword, true);
})

texture.addEventListener("click", () => {
    page = 1;
    currentKeyword = "texture"
    searchResult(currentKeyword, true);
})

travel.addEventListener("click", () => {
    page = 1;
    currentKeyword = "travel"
    searchResult(currentKeyword, true);
})
wallpapers.addEventListener("click", () => {
    page = 1;
    currentKeyword = "wallpapers"
    searchResult(currentKeyword, true);
})
streetPhotography.addEventListener("click", () => {
    page = 1;
    currentKeyword = "Street Photography"
    searchResult(currentKeyword, true);
})

// Showing/hidden the filter bar whenever somebody click on the filter button
document.getElementById("filterButton").addEventListener("click", () => {
    const filters = document.getElementById("filters")
    filters.className = filters.classList.contains("hidden") ? "show" : "hidden";

    document.getElementById("filterButtonIcon").classList.toggle("rotate");

})


// Showing results according to the applied filters
color.addEventListener("change", () => {
    if (currentKeyword) {
        page = 1;
        searchResult(currentKeyword, true);
    }
});
orientations.addEventListener("change", () => {
    if (currentKeyword) {
        page = 1;
        searchResult(currentKeyword, true);
    }
});
orderBy.addEventListener("change", () => {
    if (currentKeyword) {
        page = 1;
        searchResult(currentKeyword, true);
    }
});

// Clearing all the filters in one go
const clearAllFilters = () => {
    orientations.value = "";
    color.value = "";
    orderBy.value = "";
    page = 1;
    searchResult(currentKeyword, true);
}


// calling thr clear filter fucntion here
document.getElementById("clearFilter").addEventListener("click", () => {
    clearAllFilters();
})



// fetchRandom fucntion will do same like searchResult fucntion but it will give 10 random images
const fetchRandom = (count, results = true) => {

    if (results) {
        allOutputs.textContent = "";
    }
    const random_url = `https://api.unsplash.com/photos/random?client_id=${accessKey}&count=${count}`;
    const populate = async () => {
        const response = await fetch(`${random_url}`);
        const data = await response.json();
        console.log(data)
        data.map((image => {

            const allOutputs = document.getElementById("allOutputs")
            const imageContainer = document.createElement("div")
            imageContainer.classList.add("imageContainer")

            const img = document.createElement("img")
            const info = document.createElement("span")
            const imageLink = document.createElement("a")
            imageLink.href = image.links.html;
            imageLink.target = "_blank";

            img.src = image.urls.small;
            info.textContent = `${image.description || 'No description'} ${image.created_at}`;
            info.classList.add("hide")
            info.classList.add("info")
            imageLink.appendChild(img)
            imageContainer.appendChild(imageLink)
            imageContainer.appendChild(info)
            allOutputs.appendChild(imageContainer)
        }))

        document.getElementById("showMoreRandom").style.display = "block"

    }

    populate();
}

// showing random images on every load of webpage  using the fetch random fucntion.
// window.addEventListener('DOMContentLoaded', () => {
//     fetchRandom(10, true); // 10 random images on initial load
// });


// showing random hero image on every load of webpage
// const populate = async () => {
//         const random_url = `https://api.unsplash.com/photos/random?client_id=${accessKey}&count=1`;
//         const response = await fetch(`${random_url}`);
//         const data = await response.json();
//         console.log(data[0].urls.full)

//         let bgHero  = document.getElementById("searchBox")
// bgHero.style.background = `url(${data[0].urls.full}) center no-repeat`
//     }

//     populate();
