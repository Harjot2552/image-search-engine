const accessKey = "84gsKGt1QFGBVu5NUS4Pyi_Y8jrxUBix25IU6PTywnY";
const btn = document.getElementById("btn");
const random = document.getElementById("random");
const orientations = document.querySelector("select[name='orientation']");
const color = document.querySelector("select[name='color']");
const orderBy = document.querySelector("select[name='orderBy']");
let keyword = document.getElementById("keyword")
const errors = document.getElementById("errors")

let currentKeyword = "";

let page = 1;


const searchResult = async (userKeyword, clearResult = true) => {
    if (clearResult) {
        allOutputs.textContent = "";
    }
    let api_url = `https://api.unsplash.com/search/photos?client_id=${accessKey}&page=${page}&query=${userKeyword}&per_page=12`;
    console.log(api_url)

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


    }
    catch (error) {
        console.log("Error fetching in data", error)
        document.getElementById("total").textContent = ""
        document.getElementById("errors").style.display = 'block'
        document.getElementById("errors").textContent = "Error fetching in data " + error;
    }

}

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
