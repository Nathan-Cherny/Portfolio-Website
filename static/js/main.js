async function getJsonData(json){
    return fetch('static/json/' + json + '.json')
        .then(response => response.json())
        .then(data => {
            return data
        });
}

async function showJsonData(json){ // json can be either skills or projects
    let data = await getJsonData(json)
    let grid = document.getElementById(json)

    for(skill of data){
        let div = document.createElement("div")
        
        let title = document.createElement("h2")
        let img = document.createElement("img")
        let experience = document.createElement("p")

        title.innerHTML = skill['name']
        img.src = skill['image']
        experience.innerHTML = skill['experience']

        div.appendChild(title)
        div.appendChild(img)
        div.appendChild(experience)

        grid.appendChild(div)
    }
}

function whenLoaded(){
    getSectionsBoundaries()
    showJsonData("skills")
    showJsonData("learning")
    document.onscroll = checkSectionActivity
}

function getSectionsBoundaries(){
    boundaries = []

    let sections = document.getElementsByTagName("section")
    let i = 0
    while(i < sections.length - 1){
        let section = sections[i]
        let top = sections[i].offsetTop
        let bottom = top + sections[i].offsetHeight
        boundaries.push({
            "section": section,
            "top": top,
            "bottom": bottom
        })
        i++
    }
}

function changeActivity(active, li){
    active.classList.remove("active")
    li.classList.add("active")
}

function checkSectionActivity(){
    let currentScroll = document.documentElement.scrollTop
    let lis = document.getElementsByTagName("li")
    let activeLi = document.getElementsByClassName("active")[0]

    let i = 0
    while(i < boundaries.length){
        let sectionData = boundaries[i]    
        let section = sectionData["section"]
        let li = lis[i]

        let liHrefToId = li.children[0].hash.slice(1)

        if (sectionData["top"] <= currentScroll && currentScroll <= sectionData["bottom"] && activeLi != li){
            changeActivity(activeLi, li)
        }

        i++
    }
}