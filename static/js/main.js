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

showJsonData("skills")
showJsonData("learning")