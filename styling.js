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
var themeSwitcherOpen = false;

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
const themeMenu =       dom("theme_menu");
//#endregion



/*---------------FUNCTIONS-----------------*/
//#region
// function testFunction(param) {
//     console.log("testFunction runs");
// }


// Confetti
const elConfetti = dom('confetti');
function confetti(type = 1) {
    console.log('Confetti!');
    let duration = 6760;
    elConfetti.src = `./assets/confetti${type}.gif`;
    elConfetti.classList.add('visible');

    setTimeout(() => {
        elConfetti.classList.add('fade_out');
    }, duration - 2000);

    setTimeout(() => {
        elConfetti.src = './assets/blank.png';
        elConfetti.classList.remove('fade_out');
        elConfetti.classList.remove('visible');
    }, duration);
}


// const sounds = [
    
// ];
// Picks random sound from sounds array
// Ignore chance is a % out of 100
function randomSound(type, ignoreChance = 0) {
    // Calculate ignore chance
    var ignore = Math.floor(Math.random() * 100);
    if(ignore < ignoreChance) return;

    var randomNum = Math.floor(Math.random() * 7) + 1;
    playSound(`crunch${randomNum}.flac`)
}
function buttonSound() {
    if(store('enableSounds') == false) return;
    playSound('click.flac');
}
// Play sound
function playSound(file) {
    if(store('enableSounds') == 'false') return;
    var audio = new Audio(`./assets/sounds/${file}`);
    audio.play();
}
// Play Music
var music;
function playMusic(file = 'music.m4a', loop = false) {
    if(store('enableSounds') == 'false' || store('enableMusic') == 'false') return;
    music = new Audio(`./assets/music/${file}`);
    music.loop = loop;
    console.log('playMusic() - Playing track 1...');
    music.play();
}
function stopMusic() {
    music.pause();
    music.currentTime = 0;
}

// Popup Notifications
function openDialog(title, desc, buttonName, buttonStyle, buttonAction) {
    buttonSound();

    dialogOpen = true;
    overlay.classList.add('visible');
    elDialog.main.classList.add('visible');
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
    buttonSound();

    // Cancel if specific theme is chosen
    if(backdrop == true && $('body').classList.contains('theme_blockgame')) return;

    dialogOpen = false;
    elDialog.title.innerText = 'Dialog Title';
    elDialog.desc.innerText = 'Dialog description';
    // Reset Accept button
    elDialog.buttons.accept.classList.remove(...elDialog.buttons.accept.classList);
    // elDialog.buttons.accept.onclick = closeDialog;
    elDialog.buttons.accept.innerText = "OK";

    overlay.classList.remove("visible");
    elDialog.main.classList.remove('visible');
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

    // Hide Theme Switcher
    themeMenu.classList.remove('visible');
    themeSwitcherOpen = false;
}


// Create Toast notification
// For the COLOR parameter, options are:
// gray (leave blank), "red", "orange", "gold", "green", "cyan", "blue", "purple", "brown", "dirt" 
function toast(title, desc, color, persistent) {
    // Create element with parameters filled in
    var toastElement = document.createElement("div");
    toastElement.id = `toast${toastID}`;
    toastElement.innerHTML =
    `<div class="toast background_${color}">
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
function panelChange(to, noSound = false) {
    if(currentPanel == to) {
        return;
    } else {
        // Sound effect
        if(noSound == false) {buttonSound();}

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

    // Reset Statistics Panel
    if(to !== "info-panel") {
        elStatistics.innerHTML = statLoading;
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

/* ----- Fancy Theme Switcher ----- */
function themeSwitcher() {
    themeSwitcherOpen = true;
    themeMenu.classList.add('visible');
    overlay.classList.add("visible");
}
// themeSwitcher();

function closeThemeSwitcher() {
    themeMenu.classList.remove('visible');
    overlay.classList.remove("visible");
}



/* ----- Cosmetics ----- */
//#region
const cosmetics = {
    // Default
    'default': {
        'image': './assets/Carrot Clicker.png',
        'name': 'Carrot',

        'bill_image':    './assets/characters/Boomer_Bill.png',
        'belle_image':   './assets/characters/BelleBommerette.png',
        'greg_image':    './assets/characters/Gregory.png',
        'charles_image': './assets/characters/Charles.png',

        'bill_name':    'Bill',
        'belle_name':   'Belle',
        'greg_name':    'Greg',
        'charles_name': 'Charles',
    },
    // Golden Carrot
    'golden_carrot': {
        'image': './assets/golden carrot.png',
        'name': 'Golden Carrot'
    },
    // Minecraft
    'blockgame': {
        'image': './assets/theme/blockgame/carrot.png',
        // 'name': 'Carrots'
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
        'name': 'Bill',

        'bill_image':    './assets/characters/Boomer_Bill.png',
        'belle_image':   './assets/characters/Boomer_Bill.png',
        'greg_image':    './assets/characters/Boomer_Bill.png',
        'charles_image': './assets/characters/Boomer_Bill.png',

    
        'bill_name':    'Bill',
        'belle_name':   'Bill',
        'greg_name':    'Bill',
        'charles_name': 'Bill',
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
    dom('cps_name'),
]
const characterAvatars = {
    'bill':     dom('bill_avatar'),
    'belle':    dom('belle_avatar'),
    'greg':     dom('greg_avatar'),
    'charles':  dom('charles_avatar'),
}
const characterNames = {
    // Nametag
    'bill':     dom('bill_name'),
    'belle':    dom('belle_name'),
    'greg':     dom('greg_name'),
    'charles':  dom('charles_name'),

    // Cost to upgrade:
    // ...
}
function setCosmetic(set, resetState = false) {
    // Reset to default first
    if(resetState == false && set !== 'default') {setCosmetic('default', true);}
    console.log('Switching to cosmetic: ' + set);

    let cosmetic = cosmetics[set];

    // Image
    if(cosmetic.hasOwnProperty('image')) {mainCarrot.src = cosmetic.image;}

    // Name
    if(cosmetic.hasOwnProperty('name')) {
        nameLoop(cosmetic.name)
    } else {
        nameLoop('Carrot');
    }

    // Character Avatars
    if(cosmetic.hasOwnProperty('bill_image'))     {characterAvatars.bill.src = cosmetic.bill_image;}
    if(cosmetic.hasOwnProperty('belle_image'))    {characterAvatars.belle.src = cosmetic.belle_image;}
    if(cosmetic.hasOwnProperty('greg_image'))     {characterAvatars.greg.src = cosmetic.greg_image;}
    if(cosmetic.hasOwnProperty('charles_image'))  {characterAvatars.charles.src = cosmetic.charles_image;}

    // Character Names
    if(cosmetic.hasOwnProperty('bill_name'))     {characterNames.bill.innerText = cosmetic.bill_name;}
    if(cosmetic.hasOwnProperty('belle_name'))    {characterNames.belle.innerText = cosmetic.belle_name;}
    if(cosmetic.hasOwnProperty('greg_name'))     {characterNames.greg.innerText = cosmetic.greg_name;}
    if(cosmetic.hasOwnProperty('charles_name'))  {characterNames.charles.innerText = cosmetic.charles_name;}


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
// const optionTheme = dom('theme_dropdown');
// optionTheme.addEventListener('change', () => {
//     setTheme(optionTheme.value);
// });

// Theme class
// class theme {
//     constructor(name, image, desc, cosmetic) {
//         this.name = name;
//         this.image = image;
//         this.desc = desc;
//         this.cosmetic = cosmetic;
//     }
// }

const themesList = dom('themes_list');

// Theme data
const themes = {
    // Default
    'theme_dark': {
        name:     'Dark Theme',
        image:    './assets/theme/theme_dark.png',
        desc:     'Default dark',
        cosmetic: false
    },
    'theme_light': {
        name:     'Light Theme',
        image:    './assets/theme/theme_light.png',
        desc:     'Default light',
        cosmetic: false
    },
    'theme_oled': {
        name:     'OLED Dark Theme',
        image:    './assets/theme/theme_oled.png',
        desc:     'Don\'t play Carrot Clicker after midnight',
        cosmetic: false
    },
    'theme_classic': {
        name:     'Carrot Clicker classic',
        image:    './assets/theme/theme_classic.png',
        desc:     'The original look of carrot clicker',
        cosmetic: false
    },
    'theme_red': {
        name:     'Red Theme',
        image:    './assets/theme/theme_red.png',
        desc:     'Town painted.',
        cosmetic: false
    },
    'theme_green': {
        name:     'Green Theme',
        image:    './assets/theme/theme_green.png',
        desc:     'Green',
        cosmetic: false
    },
    'theme_blue': {
        name:     'Blue Theme',
        image:    './assets/theme/theme_blue.png',
        desc:     'For when you get tired of gray',
        cosmetic: false
    },
    'theme_retro': {
        name:     'Retro Green Theme',
        image:    './assets/theme/theme_retro.png',
        desc:     ':D',
        cosmetic: false
    },
    'theme_blockgame': {
        name:     'Minecraft',
        image:    './assets/theme/blockgame/grass_block_side.png',
        desc:     'Does it violate copyright if this is just a hobby project with no ads? Genuine question',
        cosmetic: false
    },
};
const themesKeys = Object.keys(themes);

// Populate theme switcher list on page load
function populateThemeList() {
    var themeHTML = '';
    var stillLocked = 0;

    for(let i = 0; i < themesKeys.length; i++) {
        let key = themesKeys[i];
        let theme = themes[key];
  
        // Test if unlocked
        if(isUnlocked(key) == false) {
            // console.log(key + ' is not unlocked!');
            stillLocked++;
            continue;
        }

        let imgsrc = theme.image !== false ? theme.image : './assets/Carrot Clicker.png'
    
        themeHTML += /* html */
        `
        <div class="theme_item flex" title="${theme.name}" onclick="setTheme('${key}')">
            <img src="${imgsrc}" alt="img" class="theme_preview" id="theme">
            <div>
                <h3>${theme.name}</h3>
                <p>${theme.desc}</p>
            </div>
            <div class="theme_checkbox">
                <img src="./assets/checkmark.svg" alt="Selected" class="theme_checkmark opacity0" id="${key + '_checkmark'}">
            </div>
        </div>
        `;
    }

    if(stillLocked > 0) {
        themeHTML += /* html */
        `<br><center><i>${stillLocked} themes have not been unlocked</i></center>`;
    } else {
        themeHTML += /* html */
        `<br><center><p>You've unlocked every theme!</p></center>`;
    }

    themesList.innerHTML = themeHTML;
}

// Theme switcher checkmark fix
function themeSwitcherCheckmark(theme, from = false) {
    var elTheme = dom(`${theme}_checkmark`);

    // Uncheck previous
    if(from == false || !dom(`${from}_checkmark`)) return;
    dom(`${from}_checkmark`).classList.add('opacity0');

    // Check new
    if(!elTheme) return;
    elTheme.classList.remove('opacity0');
}

// Populate achievements list
const elAchievementsList = dom('achievements_list');
function populateAchievements() {
    var achievementHTML = '';

    for(let i = 0; i < achievementsKeys.length; i++) {
        let key = achievementsKeys[i];
        let achieve = achievements[key];
  
        // Test if unlocked
        let unlocked = achieveQuery(key);

        let img = achieve.image !== false ? achieve.image : './assets/Carrot Clicker.png'
    
        if(unlocked == true) {
            achievementHTML += /* html */
            `
                <b>Unlocked: ${achieve.name}</b><br>
            `;
        } else {
            achievementHTML += /* html */
            `
                Not unlocked: ${achieve.name}<br>
            `;
        }
    }

    // if(stillLocked > 0) {
    //     achievementHTML += /* html */
    //     `<br><center><i>${stillLocked} themes have not been unlocked</i></center>`
    // }

    elAchievementsList.innerHTML = achievementHTML;
}




// Set theme
function setTheme(theme) {
    // var theme = optionTheme.value;
    var theme_color = '#312e2e';
    var from = store('theme');

    elBody.className = '';
    elBody.classList.add(theme);

    // Temporary cosmetic activator 
    if(theme == 'theme_blockgame') {
        setCosmetic('blockgame');
    } else {
        if(store('cosmetic') !== 'default') {
            setCosmetic('default');
        }
    }

    // Mobile accent color
    if(theme == 'theme_light') {theme_color = '#FFFFFF';}
    else if(theme == 'theme_classic') {theme_color = '#4e3f34';}
    dom('theme_color').content = theme_color;

    // Save to localStorage
    store('theme', theme);

    // Fancy Switcher fix
    themeSwitcherCheckmark(theme, from);
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
