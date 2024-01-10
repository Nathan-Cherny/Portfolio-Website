
    function putJSONIntoPage(json, data, card){
        let grid = document.getElementById(json)

        for(let item of data){
            div = card ? generateCard(item) : generateDoor(item)
            grid.appendChild(div)
        }
    }

    function showJsonData(json, card=false){ // card is true for projects 
        $.ajax({
            "url": 'static/json/' + json + '.json',
            "async": false,
            "success": function(data){
                putJSONIntoPage(json, data, card)
            }
        })
    }

    function randint(min, max){
        return Math.floor(Math.random() * (max - min + 1) + min) 
    }

    function randomColor(){
        return [randint(50, 175), randint(50, 175), randint(50, 175), 0.5]
    }

    function numberToExperience(number){
        let experience = "None"
        switch(number){
            case 1:
                experience = "Just Started"
                break;
            case 2:
                experience = "Learning"
                break;
            case 3:
                experience = "Intermediate"
                break;
            case 4:
                experience = "Proficent"
                break;
            case 5:
                experience = "Expert"
                break;
        }
        return experience
    }

    function generateCard(project){ // for projects
        let div = document.createElement("div")
        let infoRow = document.createElement("div")
        let titleRow = document.createElement("div")

        let title = document.createElement("h2")
        let github = document.createElement("a")
        let img = document.createElement("img")
        let desc = document.createElement("p")

        title.innerHTML = project['name']
        img.src = project['image']
        desc.innerHTML = project['desc']
        github.href = project['github']
        github.target = "_blank"

        github.classList.add("fa-brands")
        github.classList.add("fa-github")
        github.classList.add("fa-3x")

        infoRow.appendChild(img)
        infoRow.appendChild(desc)
        infoRow.classList.add("infoRow")

        titleRow.appendChild(title)
        titleRow.appendChild(github)
        titleRow.classList.add("titleRow")

        div.appendChild(titleRow)
        div.appendChild(infoRow)

        div.style.backgroundColor = "rgb(" + randomColor() + ")"

        div.classList.add("card")

        return div
    }

    function generateDoor(skill){ // for skills and learning. it's called a door because... it's vertical like a door.
        let div = document.createElement("div")
        let title = document.createElement("h2")
        let img = document.createElement("img")
        let desc = document.createElement("p")

        title.innerHTML = skill['name']
        img.src = skill['image']
        desc.innerHTML = numberToExperience(skill['experience'])

        div.appendChild(title)
        div.appendChild(img)
        div.appendChild(desc)

        div.classList.add("door")

        return div
    }

    function whenLoaded(){
        
        showJsonData("skills")
        showJsonData("learning")
        showJsonData("projects", card=true)
        getSectionsBoundaries()
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

        // console.log(boundaries)
    }

    function changeActivity(active, li){
        active.classList.remove("active")
        li.classList.add("active")
    }

    function checkSectionActivity(){
        let currentScroll = document.documentElement.scrollTop
        console.log(currentScroll)
        let lis = document.getElementsByTagName("li")
        let activeLi = document.getElementsByClassName("active")[0]

        let i = 0
        while(i < boundaries.length){
            let sectionData = boundaries[i]    
            let li = lis[i]

            if (sectionData["top"] <= currentScroll && currentScroll <= sectionData["bottom"] && activeLi != li){
                changeActivity(activeLi, li)
            }

            i++
        }
    }