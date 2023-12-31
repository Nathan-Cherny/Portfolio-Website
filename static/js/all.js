 // code for the help popups

function togglePopup(popupId, file="js"){ // default is js, can change this if i want
    
    let popup = document.getElementById(popupId)
    
    let popupMsg = popup.children[0]
    if (popup.classList.contains("popup-open")){ // close
        popup.classList.remove("popup-open")
        popupMsg.classList.remove("popup-message-open")
    }
    else{ // open
        popup.classList.add("popup-open")
        popupMsg.classList.add("popup-message-open")
        getCodeSrc(file)
    }
}

function changeCode(button){
    getCodeSrc(button.name)
}

function getActiveButton(){
    let buttons = document.getElementsByClassName("popup-bar")[0].children
    for(let button of buttons){
        if(button.classList.contains("active")){
            return button
        }
    }
}

function getCodeSrc(file){
    let fileType = ".js"
    let loc = "/static/js"
    switch(file){
        case "js":
            break;
        case "html":
            fileType = ""
            loc = ""
            break;
        case "css":
            fileType = ".css"
            loc = "/static/css"
            break;
    }

    let project = window.location.pathname

    if(project == "/" && file != "html"){ // css and js are /main while the html is just /, this if statement does this
        project = "/main"
    }

    let path = window.location.origin + loc + project + fileType

    let activeButton = getActiveButton()
    if(activeButton){ // user has clicked on one, therefore there's code, therefore we need to remove it
        let activeLanguage = activeButton.name
        activeButton.classList.remove("active")
        let textContainer = document.getElementById(activeLanguage)
        textContainer.style.display = "none"
    }

    if(file){
        document.getElementsByName(file)[0].classList.add("active")
        document.getElementById(file).style.display = "block"
        document.getElementById("code-name").innerHTML = "Code " + "<hr class='codeHr' ></hr>" + file.toUpperCase()
    }

    fetch(path)
        .then(res => {
            return res.text();
        })
        .then(text => { 
            text = "<code><plaintext>" + text
            text = text.replaceAll("&emsp;", "  ")
            text = text.replaceAll("<br>", "\n")
            document.getElementById(file).innerHTML = text
        });
    
}