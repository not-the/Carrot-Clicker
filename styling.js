/*-------------Variables------------*/
//#region
//// UI HANDLER ////
const elBody =          document.querySelector('body');
const bonusVisualArea = dom("bonusVisualArea");
const clickingArea =    dom("clicking_area");
const mainCarrot =      dom("main_carrot");
// var tooltipBill =       dom("billtooltip").style.top;
// var tooltipBelle =      dom("belletooltip").style.top;
// var tooltipGreg =       dom("gregtooltip").style.top;
var mouseX = 0;
var mouseY = 0;

// Popup counters (unique IDs so that they are deleted after a set time)
var toastID =      0;
var activeToasts = 0;
var toastsList =  {};
var bonusID =      0;

var dialogOpen = false;
var themeSwitcherOpen = false;
var cosmeticSwitcherOpen = false;
var keybindsMenuOpen = false;

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
const cosmeticMenu =    dom('cosmetic_menu');
const themesList =      dom('themes_list');
const cosmeticsList =   dom('cosmetics_list');
const cosmList = {
    farmable:   dom('farmable_cosmetics'),
    bill:       dom('bill_cosmetics'),
    bell:       dom('belle_cosmetics'),
    greg:       dom('greg_cosmetics'),
    charles:    dom('charles_cosmetics'),
    carl:       dom('carl_cosmetics'),
}
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


// Popup Notifications
function openDialog(title, desc, buttonName, buttonStyle, buttonAction) {
    buttonSound();

    dialogOpen = true;
    overlay.classList.add('visible');
    elBody.classList.add('overflow_hidden');
    elDialog.main.classList.add('visible');
    // elDialog.main.classList.add("dialog_animate");

    // Fill out dialog text, if applicable
    if(title)       {eInnerText(elDialog.title, title);}
    if(desc)        {eInnerText(elDialog.desc, desc);}
    if(buttonName)  {eInnerText(elDialog.buttons.accept, buttonName);}
    
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
    eInnerText(elDialog.title, 'Dialog Title');
    eInnerText(elDialog.desc, 'Dialog description');
    // Reset Accept button
    elDialog.buttons.accept.classList.remove(...elDialog.buttons.accept.classList);
    // elDialog.buttons.accept.onclick = closeDialog;
    eInnerText(elDialog.buttons.accept, "OK");

    overlay.classList.remove("visible");
    elBody.classList.remove('overflow_hidden');
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
            case 'resetsettings':
                resetSettings(true);
                break;
            default:
                console.log('Dialog action not listed');
                break;
        };
    };

    dialogButtonAction = 'none';

    // Hide Theme Switcher
    themeMenu.classList.remove('visible');
    themeSwitcherOpen = false;

    cosmeticMenu.classList.remove('visible');
    cosmeticSwitcherOpen = false;

    elKeybindsMenu.classList.remove('visible');
    keybindsMenuOpen = false;
}


// Create Toast notification
// For the COLOR parameter, options are:
// gray (leave blank), "red", "orange", "gold", "green", "cyan", "blue", "purple", "brown", "dirt"
function toast(title, desc, color, persistent, replaceable, achievement = false) {
    // Replace old if replace is true
    if(toastsList[toastID - 1] == 'replace') {
        closeToast(toastID - 1);
    }

    // Create element with parameters filled in
    var toastElement = document.createElement("div");
    toastElement.id = `toast${toastID}`;

    // Normal toast
    if(!achievement) {
        toastElement.innerHTML =
        `<div class="toast background_${color}">
            <h3>${title}</h3>
            <span class="toast_close" onclick="closeToast(${toastID})">X</span>
            <p>${desc}</p>
        </div>`;
    }
    // Achievement toast
    else {
        let achieve = achievements[achievement];
        let rewardHTMLstring = '';
        let noImg = false;
        if(achieve.image == false || achieve.image == undefined) { noImg = true; }

        if(achieve.reward != false) {
            rewardHTMLstring =
            `<div class="rewards_list">
                ${ rewardHTML(achieve) }
            </div>
            `;
        }

        toastElement.innerHTML =
        `<div class="toast achievement_item${achieve.mystery.list != true ? '' : ' achievement_secret'}${achieve.style != false ? ' style_' + achieve.style : ''}">
            <!-- Close button -->
            <span class="toast_close" onclick="closeToast(${toastID})">X</span>
            <!-- Details -->
            <div class="achievement_details flex">
                <img src="${noImg ? './assets/achievements/missing.png' : achieve.image}" alt="${achieve.name}" id="${achievement}_img" class="achievement_img" title="${achieve.name}">
                <div>
                    <h2>${achieve.name}</h2>
                    <p class="secondary_text">${achieve.desc}${achieve.pages != false && achieve.pages != null ? ` (+${achieve.pages} pages)` : ''}</p>
                </div>
            </div>
            ${rewardHTMLstring}
        </div>`;
    }

    toastContainer.prepend(toastElement);

    let id = toastID;
    toastsList[toastID] = replaceable == true ? 'replace' : id;

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
        let timeout = store("notificationLength") == null ? 5000 : parseInt(store("notificationLength")) * 1000;
        console.log(timeout);
        if(achievement == true ) timeout *= 2;

        setTimeout(() => {
            // console.log("Timeout runs: " + toastID);
            closeToast(id);
        }, timeout
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
    if(toastsList[id] !== 'replace' && element !== null) {
        element.classList.add("toast_out");
    }
    
    // Delete Element after animation is done
    if(element !== null) {
        if(toastsList[id] !== 'replace') {
            element.remove();
        } else {
            setTimeout(() => {
                element.remove();
            }, 300);
        }
    }



    // Clear all button
    if(activeToasts <= 2) {
        toastsClear.classList.remove("visible");
    }
}

function clearToasts() {
    for(entry in toastsList) {
        // console.log(entry);
        closeToast(entry);
    }
}
//#endregion



// Panel handler
//#region 
var currentPanel = "achievements-panel";
// Tab Panels
const tripane =         dom('notifs-section');
const infoPanel =       dom("info-panel");
const achievementsPanel = dom("achievements-panel");
const settingsPanel =   dom("settings-panel");

// Tab Buttons
const infoTab =         dom("info-panel-button");
const achievementsTab = dom("achievements-panel-button");
const settingsTab =     dom("settings-panel-button");
// const panelReset = "visibility: hidden; position: absolute; transform: translateY(-100%)";

// Change panel
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
        infoPanel.classList.remove('unremove');
        achievementsPanel.classList.remove('unremove');
        settingsPanel.classList.remove('unremove');

        // Unhide selected panel
        dom(to + "-button").classList.add("activetab");

        dom(to).classList.add('unremove');
        
        // Save
        store('openpanel', to);
        currentPanel = to;
    }

    // Reset Statistics Panel
    // if(to !== "info-panel") {
    //     elStatistics.innerHTML = statLoading;
    // }

    // Update achievements list
    if(to == 'achievements-panel') {
        populateAchievements();
    }

    // Change container size
    // let panelHeight = dom(currentPanel).clientHeight;
    // console.log(panelHeight);
    // tripane.style.height = `${panelHeight + 33}px`;
}
//#endregion



// Click bonus popup
//#region 
function popupHandler(useMousePos = true, amount) {
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
    eInnerText(clickVisualElement, `+${amount}`);

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
//#endregion

// Falling carrots
var fallingID = 0;
var fallingActive = 0;
var fallingFrenzy = false;
const fallingCarrotsArea = dom('fallingCarrotsArea');
function fallingCarrot() {
    var element = document.createElement("img");
    element.src = './assets/Carrot Clicker.png';
    element.classList.add('falling_carrot');
    element.id = fallingID;
    fallingID++;
    fallingActive++;

    // Reward
    // Between 200% and 600% of player's CPC
    let rewardVariation = (Math.floor((Math.random() * 400)) + 200) / 100;
    let carrotReward = Math.round(player.cpc * rewardVariation);
    element.onclick = () => {
        earnCarrots( carrotReward, 'bonus' );
        dom(element.id).remove();
        fallingActive--;

        player.lifetime.falling_carrots_grabbed ++;
    };

    // Positioning
    let randomX = Math.floor((Math.random() * 400));
    element.style.left = randomX - 30 + "px";

    // To page
    fallingCarrotsArea.append(element);

    element.classList.add('bright_200');

    setTimeout(() => {
        if(dom(element.id) != null) {
            dom(element.id).remove();
            fallingActive--;
        }
    }, 2600);
}


// Theme switcher <-> Cosmetic switcher
function switchSwitchers() {
    buttonSound();

    if(themeSwitcherOpen == true) {
        themeSwitcherOpen = false;
        cosmeticSwitcherOpen = true;
        cosmeticSwitcher();
        closeThemeSwitcher(true);
    } else {
        themeSwitcherOpen = true;
        cosmeticSwitcherOpen = false;
        themeSwitcher();
        closeCosmeticSwitcher(true);
    }
}

/* ----- Fancy Theme Switcher ----- */
function themeSwitcher() {
    themeSwitcherOpen = true;
    themeMenu.classList.add('visible');
    overlay.classList.add("visible");
    elBody.classList.add('overflow_hidden');

    buttonSound();
}
function closeThemeSwitcher(noOverlay = false) {
    themeMenu.classList.remove('visible');
    if(noOverlay == false) {
        overlay.classList.remove("visible"); 
    }
}

/* ----- Fancy Cosmetic Switcher ----- */
function cosmeticSwitcher() {
    cosmeticSwitcherOpen = true;
    cosmeticMenu.classList.add('visible');
    overlay.classList.add("visible");
    elBody.classList.add('overflow_hidden');

    buttonSound();
}
function closeCosmeticSwitcher(noOverlay = false) {
    cosmeticMenu.classList.remove('visible');
    if(noOverlay == false) {
        overlay.classList.remove("visible");
    }
}

// Page elements
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
    'carl':     dom('carl_avatar'),
}
const characterNames = {
    // Nametag
    'bill':     dom('bill_name'),
    'belle':    dom('belle_name'),
    'greg':     dom('greg_name'),
    'charles':  dom('charles_name'),
    'carl':     dom('carl_name'),

    // Cost to upgrade:
    // ...
}

// Change cosmetic (V2)
function setCosmetic(target, to, resetState = false) {
    // Reset to default first
    if(resetState == false && to !== 'default')
    {setCosmetic(target, 'default', true);}

    console.log('Switching ' + target + '\'s cosmetic to: ' + to);

    var from = settings.cosmetics[target];
    let cosmetic = cosmetics[target][to];

    // Change page
    switch(target) {
        case 'bundle':
            if(cosmetic.hasOwnProperty('farmable'))
            {setCosmetic('farmable', cosmetic.farmable);}
            else {setCosmetic('farmable', 'default');}

            if(cosmetic.hasOwnProperty('bill'))
            {setCosmetic('bill', cosmetic.bill);}
            else {setCosmetic('farmable', 'bill');}
            if(cosmetic.hasOwnProperty('belle'))
            {setCosmetic('belle', cosmetic.belle);}
            else {setCosmetic('farmable', 'belle');}
            if(cosmetic.hasOwnProperty('greg'))
            {setCosmetic('greg', cosmetic.greg);}
            else {setCosmetic('farmable', 'greg');}
            if(cosmetic.hasOwnProperty('charles'))
            {setCosmetic('charles', cosmetic.charles);}
            else {setCosmetic('farmable', 'charles');}
            if(cosmetic.hasOwnProperty('carl'))
            {setCosmetic('carl', cosmetic.carl);}
            else {setCosmetic('farmable', 'carl');}
            break;
        
        case 'farmable':
            // Image
            if(cosmetic.hasOwnProperty('image') && cosmetic.image != false)
            { mainCarrot.src = cosmetic.image; }
            // Name
            if(cosmetic.hasOwnProperty('farmable') && cosmetic.farmable != false) {
                nameLoop(cosmetic.farmable)
            } else {
                nameLoop('Carrot');
            }
            break;

        case 'bill':
        case 'belle':
        case 'greg':
        case 'charles':
        case 'carl':
            if(cosmetic.hasOwnProperty('image') && cosmetic.image != false)
            {characterAvatars[target]['src'] = cosmetic.image;}
            if(cosmetic.hasOwnProperty('rename') && cosmetic.rename != false)
            {eInnerText(characterNames[target], cosmetic.rename);}
            break;
    }


    // Image


    Object.hop = property => {return this.hasOwnProperty(property);}

    // Loop through page elements containing farmable item name and set accordingly
    function nameLoop(farmable) {
        for(i = 0; i < farmableNames.length; i++) {
            eInnerText(farmableNames[i], farmable + 's');
        }
    }

    store('cosmetic', to);

    // Fancy Switcher fix
    themeSwitcherCheckmark(to, from);
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


// Populate theme switcher list on page load
function populateThemeList() {
    var themeHTML = '';
    var stillLocked = 0;

    for(let i = 0; i < themesKeys.length; i++) {
        let key = themesKeys[i];
        let theme = themes[key];
  
        // Test if unlocked
        if(isUnlocked('theme', key) == false) {
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
                <p class="secondary_text">${theme.desc}</p>
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

/* Populate cosmetics */
// Populate theme switcher list on page load
//#region 
// Cosmetics List style
const cosmeticsView = dom('cosmetics_view');
cosmeticsView.addEventListener('input', () => {
    let value = cosmeticsView.value;
    let elements = document.querySelectorAll('.cosmetics_mini');
    
    if(value == 'grid') {
        elements.forEach(element => {
            element.classList.add('cosmetics_grid');
        });
    } else {
        elements.forEach(element => {
            element.classList.remove('cosmetics_grid');
        });
    }
});

// New
function populateCosmeticsList(target) {
    // Do all lists
    if(target == 'all') {
        for(let i = 0; cosmeticsKeys.length; i++) {
            populateCosmeticsList(cosmeticsKeys[i]);
        }
        return
    }

    var cosmeticHTML = '';
    var stillLocked = 0;
    
    let list = cosmetics[target];

    for(let i = 0; i < cosmetics[target].keys.length; i++) {
        let key = list['keys'][i];
        let cosmetic = list[key];

  
        // Test if unlocked
        // if(isUnlocked('cosmetic', key, target) == false) {
        //     // console.log(key + ' is not unlocked!');
        //     stillLocked++;
        //     continue;
        // }

        let imgsrc = cosmetic.hasOwnProperty('preview') ? cosmetic.preview : (cosmetic.hasOwnProperty('image') ? cosmetic.image : './assets/Carrot Clicker.png');
    
        console.log('aaa::: ' + `setCosmetic('${target}', '${key}')`)
        cosmeticHTML += /* html */
        `
        <div class="theme_item flex" title="${cosmetic.name}" onclick="setCosmetic('${target}', '${key}')" id="${target}_cosmetic_${key}">
            <img src="${imgsrc}" alt="img" class="theme_preview" id="theme">
            <div class="description">
                <h3>${cosmetic.name}</h3>
                <p class="secondary_text">${cosmetic.desc}</p>
            </div>
            <div class="theme_checkbox">
                <img src="./assets/checkmark.svg" alt="Selected" class="theme_checkmark" id="${target}_cosmetic_${key}_checkmark">
            </div>
        </div>
        `;
    }

    // if(stillLocked > 0) {
    //     cosmeticHTML += /* html */
    //     `<br><center><i>${stillLocked} cosmetics have not been unlocked</i></center>`;
    // } else {
    //     cosmeticHTML += /* html */
    //     `<br><center><p>You've unlocked every cosmetic!</p></center>`;
    // }

    dom(`${target}_cosmetics`).innerHTML = cosmeticHTML;
}
function cosmeticsPercent() {
    return percentage(Object.keys(player.cosmetics).length - 1, Object.keys(cosmetics).length - 1);
}


// Theme switcher checkmark fix
function cosmeticSwitcherCheckmark(cosmetic, from = false) {
    var elCosmetic = dom(`cosmetic_${cosmetic}_checkmark`);

    // Uncheck previous
    if(from == false || !dom(`cosmetic_${from}_checkmark`)) return;
    dom(`cosmetic_${from}_checkmark`).classList.add('opacity0');

    // Check new
    if(!elCosmetic) return;
    elCosmetic.classList.remove('opacity0');
}
//#endregion



// Populate achievements list
const elAchievementsList = dom('achievements_list');
const elAchievementFilter = dom('achievement_filter');
function populateAchievements() {
    var achievementHTML = '';
    var rewardHTML = '';

    for(let i = 0; i < achievementsKeys.length; i++) {
        let key = achievementsKeys[i];
        let achieve = achievements[key];

        // Test if unlocked
        let unlocked = achieveQuery(key);

        // Filters
        const achievementFilter = dom('achievement_filter');
        if(dom('achievement_filter').value == 'unlocked' && unlocked == false) continue;
        if(dom('achievement_filter').value == 'locked' && unlocked == true) continue;
        if(dom('achievement_filter').value == 'challenge' && achieve.style != 'challenge') continue;
        if(dom('achievement_filter').value == 'secret' && achieve.mystery.list != true) continue;
        if(achieve.mystery.list == true && unlocked == false) continue;

        let img = achieve.image != false ? achieve.image : './assets/achievements/missing.png';

        // Plain text list w/ achievement names
        //#region 
        // if(unlocked == true) {
        //     achievementHTML += /* html */
        //     `
        //         <b>Unlocked: ${achieve.name}</b><br>
        //     `;
        // } else {
        //     achievementHTML += /* html */
        //     `
        //         Not unlocked: ${achieve.name}<br>
        //     `;
        // }
        //#endregion

        // Rewards info
        if((achieve.reward != false) && unlocked == true) {
            let inner = '';
            // Multiple rewards
            if(Array.isArray(achieve.reward) == true) {
                for(let i = 0; i < achieve.reward.length; i++) {
                    let rewardType = achieve.reward[i].split(':')[0];
                    let rewardName = achieve.reward[i].split(':')[1];

                    if(rewardType == 'function') {
                        console.log('test');
                        continue;
                    };

                    let informalName;
                    let icon;
    
                    // Get reward info
                    if(rewardType == 'theme' || rewardType == 'cosmetic') {
                        informalName = (rewardType == 'theme' ? themes[rewardName].name : cosmetics[rewardName].name);
                        icon = (rewardType == 'theme' ? themes[rewardName].image : cosmetics[rewardName].image);
                    } else if(rewardType == 'character') {
                        informalName = capitalizeFL(rewardName);
                        // Get image
                        switch(rewardName) {
                            case 'bill':
                                icon = './assets/characters/Boomer_Bill.png'
                                break;
                            case 'belle':
                                icon = './assets/characters/BelleBommerette.png'
                                break;
                            case 'greg':
                                icon = './assets/characters/Gregory.png'
                                break;
                            case 'charles':
                                icon = './assets/characters/Charles.png'
                                break;
                            case 'carl':
                                icon = './assets/characters/Carl.png'
                                break;
                        }
                    }

                    inner += 
                    `
                    <div class="reward flex">
                        <img src="${icon}" alt="${informalName}" class="reward_img">
                        <div>
                            <h4>${informalName}</h4>
                            <p class="secondary_text">
                                ${capitalizeFL(rewardType)}
                            </p>
                        </div>
                    </div>
                    `;
                }
            }

            // Single reward
            else if(achieve.reward.split(':')[0] != 'function') {
                let rewardType = achieve.reward.split(':')[0];
                let rewardName = achieve.reward.split(':')[1];
                let informalName;
                let icon;

                // Get reward info
                if(rewardType == 'theme' || rewardType == 'cosmetic') {
                    informalName = (rewardType == 'theme' ? themes[rewardName].name : cosmetics[rewardName].name);
                    icon = (rewardType == 'theme' ? themes[rewardName].image : cosmetics[rewardName].image);
                } else if(rewardType == 'character') {
                    informalName = capitalizeFL(rewardName);
                    // Get image
                    switch(rewardName) {
                        case 'bill':
                            icon = './assets/characters/Boomer_Bill.png'
                            break;
                        case 'belle':
                            icon = './assets/characters/BelleBommerette.png'
                            break;
                        case 'greg':
                            icon = './assets/characters/Gregory.png'
                            break;
                        case 'charles':
                            icon = './assets/characters/Charles.png'
                            break;
                        case 'carl':
                            icon = './assets/characters/Carl.png'
                            break;
                    }
                }


                inner = 
                `<div class="reward flex">
                    <img src="${icon}" alt="${informalName}" class="reward_img">
                    <div>
                        <h4>${informalName}</h4>
                        <p class="secondary_text">
                            ${capitalizeFL(rewardType)}
                        </p>
                    </div>
                </div>
                `;
            }
            
            // Export HTML
            rewardHTML =
            `<!-- Rewards -->
            <div class="rewards_list">
                ${inner}
            </div>`;
            inner = '';
        }

        // Achievement info
        if(unlocked == true) {
            achievementHTML += /* htmla */
            `
            <div id="${key}" class="achievement_item${achieve.mystery.list != true ? '' : ' achievement_secret'}${achieve.style != false ? ' style_' + achieve.style : ''}">
                <!-- Details -->
                <div class="achievement_details flex">
                    ${achieve.pages != false && achieve.pages != null ? `<div class="achieve_pages secondary_text">+${achieve.pages} pages</div>` : ''}
                    

                    <img src="${img}" alt="${achieve.name}" id="${key}_img" class="achievement_img" title="${achieve.name}">
                    <div>
                        <h2>${achieve.name}</h2>
                        <p class="secondary_text">${achieve.desc}</p>
                    </div>
                </div>
                ${rewardHTML}
            </div>
            `;
        } else {
            achievementHTML += /* htmla */
            `
            <div id="${key}" class="achievement_item achievement_locked">
                <!-- Details -->
                <div class="achievement_details flex">
                    <img src="${achieve.mystery.image == false ? achieve.image : './assets/achievements/locked.png'}" alt="?" id="${key}_img" class="achievement_img" title="This achievement has not been unlocked">
                    <div>
                        <h2>${achieve.mystery.name == true ? '???' : achieve.name}</h2>
                        <p class="secondary_text">${achieve.mystery.desc == true ? '????' : achieve.desc}</p>
                    </div>
                </div>
            </div>
            `;
        }
    }

    // if(stillLocked > 0) {
    //     achievementHTML += /* html */
    //     `<br><center><i>${stillLocked} themes have not been unlocked</i></center>`
    // }

    if(dom('achievement_filter').value == 'unlocked' && achievementHTML == '') {
        achievementHTML =
            `<center><img src="./assets/theme/pixel_carrot.png" class="footer_carrot"><br/><p class="secondary_text">No achievements yet. :(</p></center>`;
    }

    // Filter by locked
    if(dom('achievement_filter').value == 'locked' && achievementHTML == '') {
        achievementHTML =
            `<center><img src="./assets/piggy_bank.png" class="footer_carrot"><p class="secondary_text">You've unlocked every achievement- great job!</p></center>`;
    };

    // Filter by locked
    if(dom('achievement_filter').value == 'secret' && achievementHTML == '') {
        achievementHTML =
            `<center><img src="./assets/easter_egg.png" class="footer_carrot pointer" onclick="confetti()"><p class="secondary_text">Don't tell anyone, but: you don't have any secret achievements.<br/>Secret achievements don't appear in the list until unlocked and<br/> they don't count towards your completion percentage.</p></center>`;
    };

    elAchievementsList.innerHTML = achievementHTML;
    // eInnerHTML(elAchievementsList, achievementHTML);
}

function rewardHTML(achieve) {
    // Rewards info
    if(achieve.reward != false) {
        let rewardHTML = '';
        let inner = '';
        // Multiple rewards
        if(Array.isArray(achieve.reward) == true) {
            for(let i = 0; i < achieve.reward.length; i++) {
                let rewardType = achieve.reward[i].split(':')[0];
                let rewardName = achieve.reward[i].split(':')[1];
                if(rewardType == 'function') continue;

                let informalName;
                let icon;

                // Get reward info
                if(rewardType == 'theme' || rewardType == 'cosmetic') {
                    informalName = (rewardType == 'theme' ? themes[rewardName].name : cosmetics[rewardName].name);
                    icon = (rewardType == 'theme' ? themes[rewardName].image : cosmetics[rewardName].image);
                } else if(rewardType == 'character') {
                    informalName = capitalizeFL(rewardName);
                    // Get image
                    switch(rewardName) {
                        case 'bill':
                            icon = './assets/characters/Boomer_Bill.png'
                            break;
                        case 'belle':
                            icon = './assets/characters/BelleBommerette.png'
                            break;
                        case 'greg':
                            icon = './assets/characters/Gregory.png'
                            break;
                        case 'charles':
                            icon = './assets/characters/Charles.png'
                            break;
                        case 'carl':
                            icon = './assets/characters/Carl.png'
                            break;
                    }
                }

                inner += 
                `
                <div class="reward flex">
                    <img src="${icon}" alt="${informalName}" class="reward_img">
                    <div>
                        <h4>${informalName}</h4>
                        <p class="secondary_text">
                            ${capitalizeFL(rewardType)}
                        </p>
                    </div>
                </div>
                `;
            }
        }

        // Single reward
        else if(achieve.reward.split(':')[0] != 'function') {
            let rewardType = achieve.reward.split(':')[0];
            let rewardName = achieve.reward.split(':')[1];

            let informalName;
            let icon;

            // Get reward info
            if(rewardType == 'theme' || rewardType == 'cosmetic') {
                informalName = (rewardType == 'theme' ? themes[rewardName].name : cosmetics[rewardName].name);
                icon = (rewardType == 'theme' ? themes[rewardName].image : cosmetics[rewardName].image);
            } else if(rewardType == 'character') {
                informalName = capitalizeFL(rewardName);
                // Get image
                switch(rewardName) {
                    case 'bill':
                        icon = './assets/characters/Boomer_Bill.png'
                        break;
                    case 'belle':
                        icon = './assets/characters/BelleBommerette.png'
                        break;
                    case 'greg':
                        icon = './assets/characters/Gregory.png'
                        break;
                    case 'charles':
                        icon = './assets/characters/Charles.png'
                        break;
                    case 'carl':
                        icon = './assets/characters/Carl.png'
                        break;
                }
            }

            inner = 
            `<div class="reward flex">
                <img src="${icon}" alt="${informalName}" class="reward_img">
                <div>
                    <h4>${informalName}</h4>
                    <p class="secondary_text">
                        ${capitalizeFL(rewardType)}
                    </p>
                </div>
            </div>
            `;
        }
        
        rewardHTML =
        `<!-- Rewards -->
        <div class="rewards_list">
            ${inner}
        </div>`;

        return rewardHTML;
    }
}

function achievementProgress() {
    let unlockedAchievements = Object.keys(player.achievements);
    eInnerText(
        dom('achievement_progress'),
        `${unlockedAchievements.length}/${achievementsKeys.length - hiddenAchievements} (${Math.round(percentage(Object.keys(player.achievements).length, achievementsKeys.length - hiddenAchievements))}%)`
    );
}

// Filter achievements on dropdown change
elAchievementFilter.addEventListener('change', () => {populateAchievements()});

var currentTheme;
// Set theme
function setTheme(theme) {
    // var theme = optionTheme.value;
    var theme_color = '#312e2e';
    var from = settings.theme;

    elBody.className = '';
    elBody.classList.add(theme);

    if(themeSwitcherOpen) {
        elBody.classList.add('overflow_hidden');
    }

    // Temporary cosmetic activator 
    // if(theme == 'theme_blockgame') {
    //     setCosmetic('blockgame');
    // } else {
    //     if(store('cosmetic') !== 'default') {
    //         setCosmetic('default');
    //     }
    // }

    // Mobile accent color
    // if(theme == 'theme_light') {theme_color = '#FFFFFF';}
    // else if(theme == 'theme_classic') {theme_color = '#4e3f34';}

    console.log(themes[theme]);
    if(themes[theme].hasOwnProperty('accent')) {
        theme_color = themes[theme].accent;
    };

    dom('theme_color').content = theme_color;

    // Save to localStorage
    settings.theme = theme;
    saveSettings();
    currentTheme = theme;

    // Fancy Switcher fix
    themeSwitcherCheckmark(theme, from);
}
//#endregion



// Character info
// function characterInfo(character) {
//     console.log('characterInfo(): ' + character);
//     let element = dom(`${character}_box`);
//     let back = dom(`${character}_bio`);

//     // Front
//     if(element.classList.contains('charflip')) {
//         element.classList.remove('charflip');
//         back.classList.add('charflip_r');
//     } else {
//         element.classList.add('charflip');
//         back.classList.remove('charflip_r');
//     }
// }


// Credits scroll
const elCredits = dom('credits');
function startCredits() {
    elCredits.classList.add('visible');
}


// Keybinds menu
const elKeybindsMenu = dom('keybinds_menu');
const elKeybindsBlurb = dom('keybinds_blurb');
let keyBlurbText = elKeybindsBlurb.innerHTML;
function keybindsMenu() {
    keybindsMenuOpen = true;
    elKeybindsMenu.classList.add('visible');
    overlay.classList.add("visible");
    elBody.classList.add('overflow_hidden');

    if(elDisableKeybinds.checked == true) {
        elKeybindsBlurb.classList.add('color_red');
        elKeybindsBlurb.innerText = 'Warning: Keybinds are currently disabled in settings.';
    } else {
        elKeybindsBlurb.classList.remove('color_red');
        elKeybindsBlurb.innerText = keyBlurbText;
    }

    buttonSound();
}
function closeKeybindsMenu(noOverlay = false) {
    elKeybindsMenu.classList.remove('visible');
    if(noOverlay == false) {
        overlay.classList.remove("visible"); 
    }
}


// Title changer
// setInterval(() => {
//     dom('page_title').innerText = `Carrot Clicker - ${DisplayRounded(player.Carrots)} carrots`;
// }, 15000);



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
