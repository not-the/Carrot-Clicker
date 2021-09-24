//// UI HANDLER ////
const bonusVisualArea = dom("bonusVisualArea");
const clickingArea =    dom("clicking_area");
const mainCarrot =      dom("main_carrot");
var tooltipBill = dom("billtooltip").style.top;
var tooltipBelle = dom("belletooltip").style.top;
var tooltipGreg = dom("gregtooltip").style.top;
var mouseX = 0;
var mouseY = 0;

// Popup counters (unique IDs so that they are deleted after a set time)
var toastID =      0;
var activeToasts = 0;
var toastsList =  {};
var bonusID =      0;

// Dialog Elements
const overlay = dom("overlay");
const elDialog = {
    main:    dom("dialog"),
    title:   dom("dialog_title"),
    desc:    dom("dialog_desc"),
    buttons: {
        container: dom("dialog_buttons"),
        accept:    dom("dialog_button_accept"),
        cancel:    dom("dialog_button_cancel")
    }
};
const toastContainer =  dom("toast_container");
const toastsClear =     dom("toasts_clear");

function testFunction(param) {
    console.log("testFunction runs");
}

// Popup Notifications
function openDialog(title, desc, buttonName, buttonStyle, buttonAction) {
    overlay.classList.add("visible");
    // elDialog.main.classList.add("dialog_animate");

    // Fill out dialog text, if applicable
    if(title)       {elDialog.title.innerText = title;}
    if(desc)        {elDialog.desc.innerText = desc;}
    if(buttonName)  {elDialog.buttons.accept.innerText = buttonName;}
    if(buttonStyle) {
        elDialog.buttons.accept.classList.add(buttonStyle);
    }
    if(buttonAction == Function) {
        elDialog.buttons.accept.onclick = buttonAction;
    }
}
function closeDialog(action) {
    elDialog.title.innerText = 'Dialog Title';
    elDialog.desc.innerText = 'Dialog description';
    // Reset Accept button
    elDialog.buttons.accept.classList.remove(...elDialog.buttons.accept.classList);
    elDialog.buttons.accept.onclick = closeDialog;
    elDialog.buttons.accept.innerText = "OK";

    overlay.classList.remove("visible");
    // elDialog.main.classList.remove("dialog_animate");

    // Run passed in function if applicable
    if(action) {
        action();
    }
}



// Create Toast notification
// For the COLOR parameter, options are:
// gray (leave blank), "red", "orange", "gold", "green", "cyan", "blue", "purple", "brown", "dirt" 
function toast(title, desc, color, persistent) {
    // Create element with parameters filled in
    var toastElement = document.createElement("div");
    toastElement.innerHTML =
    `<div class="toast background_${color}" id="toast${toastID}">
        <h3>${title}</h3>
        <span class="toast_close" onclick="closeToast(${toastID})">X</span>
        <p>${desc}</p>
    </div>`;
    toastContainer.prepend(toastElement);

    let id = toastID;
    toastsList[toastID] = id;

    // Increase Toast ID
    activeToasts++;
    if(toastID <= 100) {
        toastID++;
    } else {
        toastID = 0;
    }



    // Clear all button
    if(activeToasts > 2) {
        toastsClear.classList.add("visible");
    }

    if(!persistent) {
        setTimeout(() => {
            // console.log("Timeout runs: " + toastID);
            closeToast(id);
        }, store("notificationLength") == null ? 5000 : parseInt(store("notificationLength")) * 1000
        );
    }
}

// Delete Toast Notification
function closeToast(id) {
    // console.log(id + " - toast removed");
    activeToasts--;
    delete toastsList[id];
    element = dom(`toast${id}`);
    
    // Dismiss Animation
    if(element !== null) {element.classList.add("toast_out");}
    
    // Delete Element after animation is done
    setTimeout(() => {
        if(element !== null) {element.remove();}
    }, 300);

    // Clear all button
    if(activeToasts <= 2) {
        toastsClear.classList.remove("visible");
    }
}

function clearToasts() {
    for(entry in toastsList) {
        console.log(entry);
        closeToast(entry);
    }
}



// Panel handler
var currentPanel = "info-panel";
// Tab Panels
const infoPanel =       dom("info-panel");
const achievementsPanel = dom("achievements-panel");
const settingsPanel =   dom("settings-panel");

// Tab Buttons
const infoTab =         dom("info-panel-button");
const achievementsTab = dom("achievements-panel-button");
const settingsTab =     dom("settings-panel-button");
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




// Temporary option thing
const notificationLength = dom("notificationLength");
function saveOption() {
    let value = notificationLength.value;
    if(value >= 2 && value <= 15) {
        console.log(`[Settings] Notification length set to: ${value}`);
        store("notificationLength", value);
        toast("Notification time set", `Notification will disappear after ${value} seconds`);
    } else {
        toast("Invalid Number", "Must be between 2 and 15 seconds", "red");
    }
}
// Reset notification time to default
function resetOption() {
    notificationLength.value = 5;
    localStorage.removeItem("notificationLength");
    toast("Notification time reset", `Notification will disappear after 5 seconds`);
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



// Runs on startup
if(store("notificationLength") !== null) {
    notificationLength.value = parseInt(store("notificationLength"));
}


// Tutorial things maybe

// Initial Welcome
if(store("tutorial_sample") == null) {
    store("tutorial_sample", "done");
    toast("Please Wait", "As a temporary fix, the page will refresh after a few seconds. Hang on!", "red", true);
} else if(store("tutorial_sample") == "done") {
    // Temporary two step until someone fixes the storage issue
    store("tutorial_sample", "really_done");
    toast("Welcome to Carrot Clicker!", "Click the carrot to farm. Spend your carrots on hiring/upgrading new workers. Eventually you will be able to buy them better tools to work with. Good luck!", "", true);
}