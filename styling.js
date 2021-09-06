//// UI HANDLER ////
const bonusVisualArea = document.getElementById("bonusVisualArea");
const clickingArea = document.getElementById("clicking_area");
const mainCarrot = document.getElementById("main_carrot");
// var tooltipBill = document.getElementById("billtooltip").style.top;
// var tooltipBelle = document.getElementById("belletooltip").style.top;
// var tooltipGreg = document.getElementById("gregtooltip").style.top;
var mouseX = 0;
var mouseY = 0;
var bonusID = 0;

// Carrot animations
clickingArea.addEventListener("mousedown", () => {mainCarrot.style.transform = "scale(0.98,0.98)";});
clickingArea.addEventListener("mouseup", () => {mainCarrot.style.transform = "scale(1,1)";});

// Panel handler
var currentPanel = "info-panel";
// Tab Panels
const infoPanel = document.getElementById("info-panel");
const achievementsPanel = document.getElementById("achievements-panel");
const settingsPanel = document.getElementById("settings-panel");

// Tab Buttons
const infoTab = document.getElementById("info-panel-button");
const achievementsTab = document.getElementById("achievements-panel-button");
const settingsTab = document.getElementById("settings-panel-button");
function panelChange(to) {
    if(currentPanel == to) {
        return;
    } else {
        // Tab reset
        infoTab.classList.remove("activetab");
        achievementsTab.classList.remove("activetab");
        settingsTab.classList.remove("activetab");

        // Panel clear
        infoPanel.style.visibility = "hidden";
        achievementsPanel.style.visibility = "hidden";
        settingsPanel.style.visibility = "hidden";

        // Unhide selected panel
        document.getElementById(to + "-button").classList.add("activetab");
        document.getElementById(to).style.visibility = "visible";
        
        currentPanel = to;
    }
}

// Click bonus popup
function popupHandler() {
    // Create Element
    var clickVisualElement = document.createElement("div");

    // Give element random displacement along with mouse position
    var randomX = Math.floor((Math.random() * 10) - 5) + mouseX;
    var randomY = Math.floor((Math.random() * 10) - 5) + mouseY;
    // var randomRot = Math.floor((Math.random() * 16) - 8);

    clickVisualElement.style.left = randomX + "px";
    clickVisualElement.style.top = randomY + "px";
    // clickVisualElement.style.transform = `translateX(-50%) rotate(${randomRot}deg)`;
    clickVisualElement.classList.add("clickvisual");
    clickVisualElement.id = `bonus${bonusID}`;
    clickVisualElement.innerText = `+${DisplayRounded(Math.floor(player.cpc,2))}`;

    bonusVisualArea.append(clickVisualElement);

    // Delete Popup after animation finishes/2 seconds
    var bonusCurrent = document.getElementById("bonus" + bonusID);
    setTimeout(() => {
        bonusCurrent.remove();
    }, 2000);

    // Incremement element ids
    if(bonusID < 100) {
        bonusID += 1;
    } else {
        bonusID = 0;
    }
}

// Mouse position handler
// CREDIT:
// https://stackoverflow.com/a/7790764
(function() {
    document.onmousemove = handleMouseMove;
    function handleMouseMove(event) {
        var eventDoc, doc, body;

        event = event || window.event; // IE-ism

        // If pageX/Y aren't available and clientX/Y are,
        // calculate pageX/Y - logic taken from jQuery.
        // (This is to support old IE)
        if (event.pageX == null && event.clientX != null) {
            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX +
            (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
            (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
            (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
            (doc && doc.clientTop  || body && body.clientTop  || 0 );
        }
        
        mouseX = event.pageX;
        mouseY = event.pageY;
    }
})();
