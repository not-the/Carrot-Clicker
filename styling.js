//// UI HANDLER ////
const bonusVisualArea = dom("bonusVisualArea");
const clickingArea = dom("clicking_area");
const mainCarrot = dom("main_carrot");
// var tooltipBill = dom("billtooltip").style.top;
// var tooltipBelle = dom("belletooltip").style.top;
// var tooltipGreg = dom("gregtooltip").style.top;
var mouseX = 0;
var mouseY = 0;
var bonusID = 0;

// Dialog Elements
const overlay = dom("overlay");
const elDialog = {
    main:    dom("dialog"),
    title:   dom("dialog_title"),
    desc:    dom("dialog_desc"),
    buttons: dom("dialog_buttons")
};
const clearDataButtons =
    `<button class="button_red" onclick="ClearLocalStorage()">
        Delete Save Data
    </button>
    <button onclick="closeDialog()">
        Cancel
    </button>`;
const prestigeButtons = 
    `<button class="button_gold" onclick="Prestige()">
        Prestige
    </button>
    <button onclick="closeDialog()">
        Cancel
    </button>`;

// Popup Notifications
function openDialog(title, desc, buttons) {
    overlay.classList.add("visible");
    // elDialog.main.classList.add("dialog_animate");

    // Fill out dialog text, if applicable
    if(title) {elDialog.title.innerText = title;}
    if(desc) {elDialog.desc.innerText = desc;}

    if(buttons) {elDialog.buttons.innerHTML = buttons;}
    else {
        elDialog.buttons.innerHTML =
            `<button>
                OK
            </button>
            <button>
                Cancel
            </button>`;
    }
}

function closeDialog() {
    overlay.classList.remove("visible");
    // elDialog.main.classList.remove("dialog_animate");
}

function toast(option, title, desc) {
    // Toast notifications
}

// Carrot animations
clickingArea.addEventListener("mousedown", () => {mainCarrot.style.transform = "scale(0.98,0.98)";});
clickingArea.addEventListener("mouseup", () => {mainCarrot.style.transform = "scale(1,1)";});

// Panel handler
var currentPanel = "info-panel";
// Tab Panels
const infoPanel = dom("info-panel");
const achievementsPanel = dom("achievements-panel");
const settingsPanel = dom("settings-panel");

// Tab Buttons
const infoTab = dom("info-panel-button");
const achievementsTab = dom("achievements-panel-button");
const settingsTab = dom("settings-panel-button");
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
        dom(to + "-button").classList.add("activetab");
        dom(to).style.visibility = "visible";
        
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
    var bonusCurrent = dom("bonus" + bonusID);
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
