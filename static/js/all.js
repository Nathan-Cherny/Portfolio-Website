// code for the help popups

function togglePopup(popupId){
    
    let popup = document.getElementById(popupId)
    getCodeSrc()
    let popupMsg = popup.children[0]
    if (popup.classList.contains("popup-open")){
        popup.classList.remove("popup-open")
        popupMsg.classList.remove("popup-message-open")
    }
    else{
        popup.classList.add("popup-open")
        popupMsg.classList.add("popup-message-open")
    }
}

function getCodeSrc(){
    path = window.location.origin + "/static/js" + window.location.pathname + ".js"
    fetch(path)
        .then(res => {
            return res.text();
        })
        .then(text => { 
            text = text.replaceAll("  ", "&emsp;")
            text = text.replaceAll("\n", "<br>")
            document.getElementById('code').innerHTML = text
        });
}