// code for the help popups

function togglePopup(){
    let popup = document.getElementsByClassName("popup")[0]
    let popupMsg = document.getElementsByClassName("popup-message")[0]
    if (popup.classList.contains("popup-open")){
        popup.classList.remove("popup-open")
        popupMsg.classList.remove("popup-message-open")
    }
    else{
        popup.classList.add("popup-open")
        popupMsg.classList.add("popup-message-open")
    }
}