/*-------------Variables------------*/
//#region
//// UI HANDLER ////
const elBody =          document.querySelector('body');
const bonusVisualArea = dom("bonusVisualArea");
const clickingArea =    dom("clicking_area");
const mainCarrot =      dom("main_carrot");
var tooltipBill =       dom("billtooltip").style.top;
var tooltipBelle =      dom("belletooltip").style.top;
var tooltipGreg =       dom("gregtooltip").style.top;
var mouseX = 0;
var mouseY = 0;

// Popup counters (unique IDs so that they are deleted after a set time)
var toastID =      0;
var activeToasts = 0;
var toastsList =  {};
var bonusID =      0;

var dialogOpen = false;

// Dialog button action
var dialogButtonAction = 'none';

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
//#endregion



/*---------------FUNCTIONS-----------------*/
//#region
// function testFunction(param) {
//     console.log("testFunction runs");
// }



// Popup Notifications
function openDialog(title, desc, buttonName, buttonStyle, buttonAction) {
    dialogOpen = true;
    overlay.classList.add("visible");
    // elDialog.main.classList.add("dialog_animate");

    // Fill out dialog text, if applicable
    if(title)       {elDialog.title.innerText = title;}
    if(desc)        {elDialog.desc.innerText = desc;}
    if(buttonName)  {elDialog.buttons.accept.innerText = buttonName;}
    if(buttonStyle) {
        elDialog.buttons.accept.classList.add(buttonStyle);
    }

    dialogButtonAction = buttonAction;
}

// Close dialog
function closeDialog(doAction, backdrop = false) {
    // 
    if(backdrop == true && $('body').classList.contains('theme_blockgame')) return;

    dialogOpen = false;
    elDialog.title.innerText = 'Dialog Title';
    elDialog.desc.innerText = 'Dialog description';
    // Reset Accept button
    elDialog.buttons.accept.classList.remove(...elDialog.buttons.accept.classList);
    // elDialog.buttons.accept.onclick = closeDialog;
    elDialog.buttons.accept.innerText = "OK";

    overlay.classList.remove("visible");
    // elDialog.main.classList.remove("dialog_animate");

    // Run passed in function if applicable
    // if(action) {
    //     action();
    // }

    // Run a function when accept is pressed
    if(doAction) {
        switch(dialogButtonAction) {
            case 'prestige':
                Prestige();
                break;
            case 'clearsave':
                ClearLocalStorage();
                break;
        };
    };

    dialogButtonAction = 'none';
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
//#endregion



// Panel handler
//#region 
var currentPanel = "achievements-panel";
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
        
        store('openpanel', to);
        currentPanel = to;
    }
}
//#endregion



// Click bonus popup
//#region 
function popupHandler(useMousePos = true) {
    // Create Element
    var clickVisualElement = document.createElement("div");

    // Give element random displacement along with mouse position
    var randomX = Math.floor((Math.random() * 10) - 5) + mouseX;
    var randomY = Math.floor((Math.random() * 10) - 5) + mouseY;
    // var randomRot = Math.floor((Math.random() * 16) - 8);

    // Get position of carrot image (used when useMousePos is false)
    var mcPosition = mainCarrot.getBoundingClientRect();
    var fixedX = Math.floor((Math.random() * 10) - 5) + (mcPosition.left + (mcPosition.right - mcPosition.left) / 2);
    // var fixedY = mcPosition.top + (mcPosition.bottom - mcPosition.top) / 2;
    var fixedY = Math.floor((Math.random() * 10) - 5) + mcPosition.bottom - 12;

    if(useMousePos == true) {
        clickVisualElement.style.left = randomX + "px";
        clickVisualElement.style.top =  randomY + "px";
    } else {
        clickVisualElement.style.left = fixedX + "px";
        clickVisualElement.style.top =  fixedY + "px";
    }

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

/* ----- Cosmetics ----- */
//#region
const cosmetics = {
    // Default
    'default': {
        'image': './assets/Carrot Clicker.png',
        'name': 'Carrot'
    },
    // Golden Carrot
    'golden_carrot': {
        'image': './assets/golden carrot.png',
        'name': 'Golden Carrot'
    },
    // Minecraft
    'blockgame': {
        'image': './assets/theme/blockgame/carrot.png',
        'name': false
    },
    'blockgame_potato': {
        'image': './assets/theme/blockgame/potato.png',
        'name': 'Potatoe'
    },
    // Pineapple
    'pineapple': {
        'image': './assets/theme/pineapple/pineapple.png',
        'name': 'Pineapple'
    },
    // Bill clicker
    'bill': {
        'image': './assets/characters/Boomer_Bill.png',
        'name': 'Bill'
    },
    // Netherite hoe
    "netherite_hoe": {
        'image': './assets/tools/netherite_hoe.png',
        'name': 'Netherite hoe'
    }
}
const farmableNames = [
    dom('cc_name'),
    dom('cpc_name'),
    dom('cps_name')
]
function setCosmetic(set) {
    let cosmetic = cosmetics[set];
    if(cosmetic.image !== false) {
        mainCarrot.src = cosmetic.image;
    }
    if(cosmetic.name !== false) {
        nameLoop(cosmetic.name)
    } else {
        nameLoop('Carrot')
    }

    // Loop through page elements containing farmable item name and set accordingly
    function nameLoop(name) {
        for(i = 0; i < farmableNames.length; i++) {
            farmableNames[i].innerText = name + 's';
        }
    }

    store('cosmetic', set);
}
//#endregion


/* ----- Themes ----- */
//#region 
// Theme dropdown eventListener
const optionTheme = dom('theme_dropdown');
optionTheme.addEventListener('change', () => {
    setTheme(optionTheme.value);
});

// Set theme
function setTheme(theme) {
    // var theme = optionTheme.value;
    var theme_color = '#312e2e';

    elBody.className = '';
    elBody.classList.add(theme);

    // Temporary cosmetic activator 
    if(theme == 'theme_blockgame') {
        setCosmetic('blockgame');
    } else {
        setCosmetic('default');
    }

    // Mobile accent color
    if(theme == 'theme_light') {theme_color = '#FFFFFF';}
    else if(theme == 'theme_classic') {theme_color = '#4e3f34';}
    dom('theme_color').content = theme_color;

    // Save to localStorage
    store('theme', theme);
}
//#endregion

/* ----- On page load ----- */
//#region 
// Set user theme on page load
if(store('theme') !== null) {
    let theme = store('theme');
    console.log(`Theme setting found, switching to: ${theme}`);
    optionTheme.value = theme;
    setTheme(theme);
}
// Switch to previously open panel on page load
if(store('openpanel') !==null) {
    console.log('openpanel found, switching to: ' + store('openpanel'));
    panelChange(store('openpanel'));
}
// Set user cosmetic on page load
if(store('cosmetic') !== null) {
    let cosmetic = store('cosmetic');
    console.log(`Cosmetic setting found, switching to: ${cosmetic}`);
    // optionCosmetic.value = cosmetic;
    setCosmetic(cosmetic);
}
//#endregion

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
//#endregion