/*-------------Variables------------*/
//#region
//// UI HANDLER ////
const elBody =          document.querySelector('body');
const bonusVisualArea = dom("bonusVisualArea");
const clickingArea =    dom("clicking_area");
// var tooltipBill =       dom("billtooltip").style.top;
// var tooltipBelle =      dom("belletooltip").style.top;
// var tooltipGreg =       dom("gregtooltip").style.top;
var mouseX = 0;
var mouseY = 0;

// Popup counters (unique IDs so that they are deleted after a set time)
var toastID =      0;
var toastsList =  {};
var bonusID =      0;

// Menu state
var dialogOpen =            false;
var themeSwitcherOpen =     false;
var cosmeticSwitcherOpen =  false;
var keybindsMenuOpen =      false;
var prestigeMenuOpen =      false;
var inventoryOpen =         false;
var tipsMenuOpen =          false;
var creditsOpen =           false;

// Don't regenerate achievements list unless necessary
var achieveHTMLupdate =     true;
var tipsHTMLupdate =        true;

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
const prestigeMenu =  dom('prestige_menu');
const inventoryMenu = dom('inventory_menu');
const tipsMenu =      dom('tips_menu');
//#endregion



/*---------------FUNCTIONS-----------------*/
//#region

// Screen Confetti (GIF overlay)
const elConfetti = dom('confetti');
function confetti(type = 1) {
    console.log('Confetti!');
    if(!settings.confetti_effects) return;
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

// Mouse confetti
const confettiColors =  ['red', 'blue', 'cyan', 'purple', 'yellow'];
const ccGold =          ['goldenrod', 'yellow', 'white', '#e1cfa4', '#dcb276', '#be7e4e'];
const ccWhite =         ['white'];
const ccCarrot =        ['#ed9645', '#c3580d', '#de5a01', '#974810'];
/**
 * 
 * @param {array} particles Array item one is the minimum amount of particles, item 2 is the maximum.
 * @param {array} colorArray Array to pull random colors from
 * @param {number} time Particle lifespan in milliseconds. Will also effect the travel distance of the particles.
 * @returns 
 */
function mouseConfetti(particles=[5,5], colorArray=confettiColors, time=150) {
    if(!settings.confetti_effects) return;
    let count = r(particles[1] - particles[0] + 1) + particles[0] - 1;
    // console.log('mouse confetti!');
    for(i = 0; i < count; i++) {
        // Random attributes
        let color   = colorArray[r(colorArray.length)];
        let rot     = r(360);
        let skew    = r(100) - 50;
        let size    = r(4) + 4;
        // let distance = r(32) + 24;
        let distance = r(32 * time / 150) + 24 * time / 150;
        let lifespan = r(time) + time; // also effects speed
        // console.log(color, rot, skew, size, distance);

        // Create
        let confetti = document.createElement('div');
        // console.log(confetti);
        confetti.classList.add('small_confetti');
        confetti.style.top = `${mouseY}px`;
        confetti.style.left = `${mouseX}px`;
        confetti.style.backgroundColor = color;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
    
        confetti.style.transitionDuration = `${lifespan}ms`;
        confetti.style.transform = `skewX(${skew}deg) rotate(${rot}deg)`;

        mcContainer.append(confetti);

        // Animate
        setTimeout(() => {
            confetti.style.transform = `skewX(${skew}deg) rotate(${rot}deg) translateY(${distance}px)`; 
        }, 20);
        setTimeout(() => {
            confetti.remove();
        }, lifespan);
    }
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
    if(settings.enableSounds == false) return;
    playSound('click.flac');
}


// Popup Notifications
function openDialog(title, desc, buttonName, buttonStyle, buttonAction) {
    // Close other popup first
    closeDialog();

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

    // Reset dialog
    if(dialogOpen) {
        // Run a function when accept is pressed
        if(doAction) {
            switch(dialogButtonAction) {
                case 'prestige':
                    Prestige();
                    break;
                case 'clearsave':
                    clearSave();
                    break;
                case 'resetsettings':
                    resetSettings(true);
                    break;
                case 'jjcvip':
                    earnCarrots(1, 'bonus');
                    break;
                default:
                    console.error('Dialog action not listed');
                    break;
            };
        };

        dialogOpen = false;
        eInnerText(elDialog.title, 'Dialog Title');
        eInnerText(elDialog.desc, 'Dialog description');
        // Reset Accept button
        elDialog.buttons.accept.classList.remove(...elDialog.buttons.accept.classList);
        // elDialog.buttons.accept.onclick = closeDialog;
        eInnerText(elDialog.buttons.accept, "OK");
    }

    overlay.classList.remove("visible");
    elBody.classList.remove('overflow_hidden');
    elDialog.main.classList.remove('visible');

    dialogButtonAction = 'none';

    // Hide other popup menus
    //#region 
    if(themeSwitcherOpen) {
        themeMenu.classList.remove('visible');
        themeSwitcherOpen = false;
    }
    if(cosmeticSwitcherOpen) {
        cosmeticMenu.classList.remove('visible');
        cosmeticSwitcherOpen = false;
    }
    if(keybindsMenuOpen) {
        elKeybindsMenu.classList.remove('visible');
        keybindsMenuOpen = false;
    }
    if(prestigeMenuOpen) {
        prestigeMenu.classList.remove('visible');
        prestigeMenuOpen = false;
    }
    if(inventoryOpen) {
        inventoryMenu.classList.remove('visible');
        inventoryOpen = false;
    }
    if(tipsMenuOpen) {
        tipsMenu.classList.remove('visible');
        tipsMenuOpen = false;
    }
    if(creditsOpen) {
        elCredits.classList.remove('visible');
        creditsOpen = false;
    }
    //#endregion
}


// Create Toast notification
// For the COLOR parameter, options are:
// gray (leave blank), "red", "orange", "gold", "green", "cyan", "blue", "purple", "brown", "dirt"
/**
 * 
 * @param {string}   title Title
 * @param {string}   desc Description
 * @param {string}   color Toast style
 * @param {boolean}  persistent Whether or not the toast should stay open indefinitely
 * @param {boolean}  replaceable If true the toast will close whenever the next toast gets sent
 * @param {string}   achievement Key correlating to an achievement. If provided the title, desc, color, hide_close, and button_action params will be ignored
 * @param {boolean}  hide_close Whether or not to hide the X button
 * @param {function} button_action Provide a function to be run and the toast will get a button with it as an onclick
 * @param {string}   button_name The name the button will use. Is ignored if button_action isn't specified. Will default to "Done"
 * @returns {number} Returns the ID of the toast that was created
 */
function toast(title = '', desc = '', color = '', persistent, replaceable, achievement = false, hide_close = false, button_action = false, button_name = 'Done') {
    // Replace old if replace is true
    if(toastsList[toastID - 1] != undefined && toastsList[toastID - 1].includes('replace') == true) {
        closeToast(toastID - 1, false);
    }

    // Create element with parameters filled in
    var toastElement = document.createElement("div");
    toastElement.id = `toast${toastID}`;

    // Normal toast
    if(!achievement) {
        toastElement.classList = `toast background_${color}`;
        toastElement.innerHTML = `
        ${title == '' || title == false || title == undefined ? '' : `<h3>${title}</h3>`}
        ${ hide_close == true ? '' : `<span class="toast_close" onclick="closeToast(${toastID})">X</span>`}
        ${desc == '' || desc == false || desc == undefined ? '' : `<p>${desc}</p>`}
        `;

        // Button
        if(button_action != false) {
            var toastButton = document.createElement("button");
            toastButton.onclick = button_action;
            toastButton.innerText = button_name;
            toastElement.append(toastButton);
        }
    }
    // Achievement toast
    else {
        let achieve = achievements[achievement];
        let noImg = false;
        if(achieve.image == false || achieve.image == undefined) { noImg = true; }

        toastElement.classList = `toast achievement_item${achieve.mystery.list != true ? '' : ' achievement_secret'}${achieve.style != false ? ' style_' + achieve.style : ''}`;
        toastElement.innerHTML =`
        <!-- Close button -->
        <span class="toast_close" onclick="closeToast(${toastID})">X</span>
        <!-- Details -->
        <div class="achievement_details flex">
            <img src="${noImg ? './assets/achievements/missing.png' : achieve.image}" alt="${achieve.name}" id="${achievement}_img" class="achievement_img" title="${achieve.name}">
            <div>
                <h3>${achieve.name}</h3>
            </div>
        </div>`;
    }
    // OLD Achievement toast
    // else {
    //     let achieve = achievements[achievement];
    //     let rewardHTMLstring = '';
    //     let noImg = false;
    //     if(achieve.image == false || achieve.image == undefined) { noImg = true; }

    //     if(achieve.reward != false) {
    //         rewardHTMLstring =
    //         `<div class="rewards_list">
    //             ${ rewardHTML(achieve) }
    //         </div>
    //         `;
    //     }

    //     toastElement.classList = `toast achievement_item${achieve.mystery.list != true ? '' : ' achievement_secret'}${achieve.style != false ? ' style_' + achieve.style : ''}`;
    //     toastElement.innerHTML =`
    //     <!-- Close button -->
    //     <span class="toast_close" onclick="closeToast(${toastID})">X</span>
    //     <!-- Details -->
    //     <div class="achievement_details flex">
    //         <img src="${noImg ? './assets/achievements/missing.png' : achieve.image}" alt="${achieve.name}" id="${achievement}_img" class="achievement_img" title="${achieve.name}">
    //         <div>
    //             <h2>${achieve.name}</h2>
    //             <p class="secondary_text">${achieve.desc}${achieve.pages != false && achieve.pages != null ? `\n (+${achieve.pages} pages)` : ''}</p>
    //         </div>
    //     </div>
    //     ${rewardHTMLstring}`;
    // }

    toastContainer.prepend(toastElement);

    let id = `${toastID}`;
    toastsList[id] = replaceable == true ? 'replace' : id;
    toastsList[id] += hide_close == true ? '_noclose' : '';

    // Increase Toast ID
    toastID++;

    // Clear all button
    if(Object.keys(toastsList).length > 2) {
        toastsClear.classList.add("visible");
    }

    if(!persistent) {
        let timeout = settings.notificationLength * 1000;
        // if(achievement != false ) timeout *= 2;
        // console.log(timeout);

        setTimeout(() => { closeToast(id); }, timeout);
    }

    // Return toast's id
    return id;
}

// Delete Toast Notification
function closeToast(id, animate = true) {
    // console.log(id + " - toast removed");
    let t = JSON.stringify(toastsList[id]);
    var element = dom(`toast${id}`);

    // Clear all button
    if(Object.keys(toastsList).length <= 2) {
        toastsClear.classList.remove("visible");
    }

    // No animation
    if(animate == true && element != null) {
        // Dismiss Animation
        if(t != undefined && t.includes('replace') == false) {
            element.classList.add("toast_out");
        }
        
        // Delete Element after animation is done
        setTimeout(() => {
            element.remove();
        }, 300);
    } else if(element != null) {
        element.remove();
    }

    delete toastsList[id];
}

function clearToasts(force = false) {
    for(entry in toastsList) {
        // console.log(entry);
        let t = toastsList[entry];
        if(t != undefined && t.includes('noclose') == true && force != true) continue;
        closeToast(entry);
    }
}
//#endregion



// Panel handler
//#region 
var currentPanel = "achievements-panel";
// Tab Panels
const tripane           = dom('tripane');
const infoPanel         = dom("stats-panel");
const achievementsPanel = dom("achievements-panel");
const settingsPanel     = dom("settings-panel");
// const devPanel          = dom("dev-panel");

// Tab Buttons
const infoTab         = dom("stats-panel-button");
const achievementsTab = dom("achievements-panel-button");
const settingsTab     = dom("settings-panel-button");
// const devTab          = dom("dev-panel-button");
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
        // devTab.classList.remove("activetab");

        

        // Panel clear
        infoPanel.classList.remove('unremove');
        achievementsPanel.classList.remove('unremove');
        settingsPanel.classList.remove('unremove');
        // devPanel.classList.remove('unremove')

        // Unhide selected panel
        dom(to + "-button").classList.add("activetab");

        dom(to).classList.add('unremove');
        
        // Save
        settings.openpanel = to;
        saveSettings();
        currentPanel = to;
    }

    // Reset Statistics Panel
    // if(to !== "stats-panel") {
    //     elStatistics.innerHTML = statLoading;
    // }

    // Update achievements list
    if(to == 'achievements-panel' && achieveHTMLupdate == true) {
        populateAchievements();
    }
    if(to == 'stats-panel'){
        statsInterval = setInterval(() => {loadStatistics()}, 1000);
    } else {
        clearInterval(statsInterval);
    }

    // Change container size
    // let panelHeight = dom(currentPanel).clientHeight;
    // console.log(panelHeight);
    // tripane.style.height = `${panelHeight + 33}px`;
}
//#endregion


// Click bonus popup
//#region 
function popupHandler(useMousePos = true, amount, style = 'carrot') {
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

    // Carrot
    if(style == 'carrot') {
        eInnerText(clickVisualElement, `+${amount}`); 
    }
    // Falling carrot
    else if(style == 'falling') {
        eInnerText(clickVisualElement, `+${amount}`);
        clickVisualElement.classList.add("clickvisual_falling");
    }
    // Cash
    else if(style == 'cash') {
        eInnerText(clickVisualElement, `₪${amount}`);
        clickVisualElement.classList.add("clickvisual_cash");
    }
    

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
    
    // 2% chance the drop is money instead
    let type = Math.floor(Math.random() * 50) == 0 ? 'cash' : 'carrot';

    element.src = type == 'carrot' ? cosmetics.farmable[settings.cosmetics.farmable].image : './assets/coin.png';
    element.classList.add('falling_carrot');
    element.id = fallingID;
    fallingID++;
    fallingActive++;

    let amount;

    if(type == 'carrot') {
        // Carrot reward
        // Between 500% and 2000% of player's CPC
        let rewardVariation = (Math.floor((Math.random() * 1500)) + 500) / 100;
        amount = Math.round(player.cpc * rewardVariation);
    } else if(type == 'cash') {
        // Cash reward
        // Between 5 and 15
        amount = Math.floor((Math.random() * 13)) + 5;
    }

    // Set onclick function
    element.onclick = () => {
        dom(element.id).remove();
        fallingActive--;
    
        if(type == 'carrot') {
            earnCarrots( amount, 'bonus', true);
        } else if(type == 'cash') {
            earnCash(amount, 'bonus');
        }
    };



    // Positioning
    let randomX = Math.floor((Math.random() * 324));
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

    newIndicator(false, 'theme');
    buttonSound();
}
function closeThemeSwitcher(noOverlay = false) {
    themeMenu.classList.remove('visible');
    if(noOverlay == false) {
        overlay.classList.remove("visible"); 
    }
}

/* ----- Fancy Cosmetic Switcher ----- */
var uncollapseNeeded = false;
function cosmeticSwitcher(category = false) {
    cosmeticSwitcherOpen = true;
    cosmeticMenu.classList.add('visible');
    overlay.classList.add("visible");
    elBody.classList.add('overflow_hidden');

    newIndicator(false, 'cosmetic');
    buttonSound();

    // Uncollapse intended category
    if(category != false) {
        // Collapse all
        document.querySelectorAll('.cosmetic_collapse').forEach(e => {
            e.open = false;
        });

        // Uncollapse
        dom(`collapse_${category}`).open = true;
        uncollapseNeeded = true;
    } else if(uncollapseNeeded == true) {
        uncollapseNeeded = false;
        document.querySelectorAll('.cosmetic_collapse').forEach(e => {
            e.open = true;
        });
    }
}
function closeCosmeticSwitcher(noOverlay = false) {
    cosmeticMenu.classList.remove('visible');
    if(noOverlay == false) {
        overlay.classList.remove("visible");
    }
}

/* ----- Fancy Prestige menu ----- */
function openPrestigeMenu() {
    // Prevent from opening if unavailable
    if(player.lifetime.golden_carrots < 1 && player.prestige_potential < 1) {return};
    
    closeDialog();
    prestigeMenuOpen = true;
    prestigeMenu.classList.add('visible');
    overlay.classList.add("visible");
    elBody.classList.add('overflow_hidden');

    updatePrestigeMenu();

    buttonSound();
}

/* ----- Inventory ----- */
// function openInventory() {
//     closeDialog();
//     inventoryOpen = true;
//     inventoryMenu.classList.add('visible');
//     overlay.classList.add("visible");
//     elBody.classList.add('overflow_hidden');

//     buttonSound();
// }
// Unused, use closeDialog() instead
// function closeInventory(noOverlay = false) {
//     themeMenu.classList.remove('visible');
//     if(noOverlay == false) {
//         overlay.classList.remove("visible");
//     }
// }

/* ----- Tips Menu ----- */
function openTipsMenu() {
    closeDialog();

    if(tipsHTMLupdate == true) {
        populateTipsMenu();
        tipsHTMLupdate = false;
    }

    tipsMenuOpen = true;
    tipsMenu.classList.add('visible');
    overlay.classList.add("visible");
    elBody.classList.add('overflow_hidden');

    buttonSound();
}
const elTipsList = dom('tips_list');
function populateTipsMenu() {
    let html = '';
    // Loop
    for(let i = 0; i <= tips.best + 0.5; i += 0.5) {
        let ri = Math.floor(i);
        let type = '';
        if(i % 1 != 0) { type = 'fun_'; }
        // console.log(type + ri);

        let id = `${type}${tl[ri]}`;
        let cat = tips[id];
        if(type != 'fun_') { html += `<h3>${capitalizeFL(id.split('_').join(' '))}</h3>`; }
        

        for(ii = 0; ii < cat.length; ii++) {
            // console.log(cat[ii]);
            // Normal
            if(tips[`s_${id}`][ii] == true) {
                html += `
                <p class="tip_item${type == 'fun_' ? ' fun': ''}"><span class="tip_number">${ii + 1}</span>${cat[ii]}</p>`;
            }
            // ???
            else {
                html += `
                <p class="tip_item secondary_text${type == 'fun_' ? ' fun': ''}"><span class="tip_number">${ii + 1}</span>???</p>`;
            }
        }
    }

    elTipsList.innerHTML = html;
}


// Page elements
const farmableNames = document.querySelectorAll('.farmable_name');
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

    // console.log('Switching ' + target + '\'s cosmetic to: ' + to);

    var from = settings.cosmetics[target];
    let cosmetic = cosmetics[target][to];
    // console.log(`cosmetics[${target}][${to}]`)

    // Change page
    switch(target) {
        case 'bundle':
            // Loop types
            for(i = 0; i < cosmeticsKeys.length; i++) {
                let target = cosmeticsKeys[i];
                if(target == 'bundle') continue;
                if(cosmetic.hasOwnProperty(target))
                {setCosmetic(target, cosmetic[target]);}
                else {setCosmetic(target, 'default');}
            }

            break;
        
        case 'farmable':
            // Image
            if(cosmetic.hasOwnProperty('image') && cosmetic.image != false)
            { mainCarrot.src = cosmetic.image; }
            // Name
            if(cosmetic.hasOwnProperty('farmable') && cosmetic.farmable != false) {
                nameLoop(cosmetic.farmable);
            } else { nameLoop('Carrot'); }
            // Image render type
            if(cosmetic.hasOwnProperty('render_type') && cosmetic.render_type != false) {
                // Pixelated
                if(cosmetic.render_type == 'pixel') {
                    mainCarrot.classList.add('render_pixelated');
                }
            } else {
                mainCarrot.classList.remove('render_pixelated');
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


    // Object.hop = property => {return this.hasOwnProperty(property);}

    // Loop through page elements containing farmable item name and set accordingly
    function nameLoop(farmable) {
        farmableNames.forEach(e => {
            e.innerText = farmable + 's';
        });
    }

    settings.cosmetics[target] = to;
    saveSettings();

    // Fancy Switcher fix
    cosmeticSwitcherCheckmark(target, to, from);
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
            stillLocked++;
            // Locked HTML
            themeHTML += /* html */
            `
            <div class="theme_item flex achievement_locked" title="Locked" onclick="toast('Locked', 'This theme has not been unlocked', '', false, true)">
                <img src="./assets/locked_transparent.png" alt="img" class="theme_preview">
                <div>
                    <h3>???</h3>
                    <p class="secondary_text">Locked</p>
                </div>
            </div>
            `;
            continue;
        }

        // Unlocked HTML
        let imgsrc = theme.image !== false ? theme.image : './assets/Carrot Clicker.png';
        themeHTML += /* html */
        `
        <div class="theme_item flex" title="${theme.name}" onclick="setTheme('${key}')">
            <img src="${imgsrc}" alt="img" class="theme_preview" id="theme">
            <div>
                <h3>${theme.name}</h3>
                <p class="secondary_text">${theme.desc}</p>
            </div>
            <div class="theme_checkbox">
                <img src="./assets/checkmark.svg" alt="Selected" class="theme_checkmark${settings.theme == key ? '' : ' opacity0'}" id="${key + '_checkmark'}">
            </div>
        </div>
        `;
    }

    // if(stillLocked > 0) {
    //     themeHTML += /* html */
    //     `<br><center><i>${stillLocked} themes have not been unlocked</i></center>`;
    // } else {
    //     themeHTML += /* html */
    //     `<br><center><p>You've unlocked every theme!</p></center>`;
    // }

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
    cosmeticsGridMode();
});

function cosmeticsGridMode() {
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

    // Save preference
    settings.cosmetics_grid = value == 'list' ? false : true;
    saveSettings();
}

// New
// var debug;
function populateCosmeticsList(target) {
    // Do all lists
    if(target == 'all') {
        for(let i = 0; i < cosmeticsKeys.length; i++) {
            populateCosmeticsList(cosmeticsKeys[i]);
        }

        setTimeout(() => {
            // Size adjust
            let width = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
            if(width > 632) { width = 632 - 68; }
            else { width = width - 68; }
            let item_width = 94;
            if(width <= 460) { item_width = 84; }
            // 632 theme popup width
            // minus 57 to get actual used space
            let amount = Math.floor(width / item_width);
            // console.log(amount);
            
            for(i = 0; i < cosmeticsKeys.length; i++) {
                let category = dom(`collapse_${cosmeticsKeys[i]}`);
                let item_list = category.querySelectorAll('.cosmetic_item');
                let iterate = 1;

                item_list.forEach(item => {
                    if(iterate > amount / 2) {
                        // console.log(item);
                        item.classList.add('desc_fit');
                    }
                    // Count
                    if(iterate < amount) {
                        iterate++;
                    } else {
                        iterate = 1;
                    }
                });
            }
        }, 50);

        return;
    }

    var cosmeticHTML = '';
    var stillLocked = 0;
    let list = cosmetics[target];
    // console.log('gg: ' + target);

    // console.log(list['keys']);
    for(let i = 0; i < list['keys'].length; i++) {
        let key = list['keys'][i];
        let cosmetic = list[key];
        // console.log(target + '/' + key);

        // If not unlocked
        if(isUnlocked('cosmetic', key, target) == false) {
            // Test if hidden
            if(cosmetic.hidden == true) continue;

            // console.log(key + ' is not unlocked!');
            stillLocked++;
            cosmeticHTML += /* html */
            `
            <div class="theme_item cosmetic_item flex achievement_locked" title="Locked" onclick="toast('Locked', 'This cosmetic has not been unlocked', '', false, true)">
                <img src="./assets/locked_transparent.png" alt="img" class="theme_preview" id="cosmetic_${key}">
                <div class="description">
                    <h3>???</h3>
                    <p class="secondary_text">Locked</p>
                </div>
            </div>
            `;
            continue;
        }

        let imgsrc = cosmetic.hasOwnProperty('preview') ? cosmetic.preview : (cosmetic.hasOwnProperty('image') ? cosmetic.image : './assets/Carrot Clicker.png');
    
        // console.log('aaa::: ' + `setCosmetic('${target}', '${key}')`);
        cosmeticHTML += /* html */
        `
        <div class="theme_item cosmetic_item flex" title="${cosmetic.name}" onclick="setCosmetic('${target}', '${key}')" id="${target}_cosmetic_${key}">
            <img src="${imgsrc}" alt="img" class="theme_preview" id="cosmetic_${key}">
            <div class="description">
                <h3>${cosmetic.name}</h3>
                <p class="secondary_text">${cosmetic.desc}</p>
            </div>
            <div class="theme_checkbox">
                <img src="./assets/checkmark.svg" alt="Selected" class="theme_checkmark${key == 'default' ? '' : ' opacity0'}" id="${target}_cosmetic_${key}_checkmark">
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
// function cosmeticsPercent() {
//     return percentage(Object.keys(player.cosmetics).length - 1, Object.keys(cosmetics).length - 1);
// }


// Theme switcher checkmark fix
function cosmeticSwitcherCheckmark(target, to, from = false) {
    var elCosmetic = dom(`${target}_cosmetic_${to}_checkmark`);

    // Uncheck previous
    if(from == false || !dom(`${target}_cosmetic_${to}_checkmark`)) return;
    dom(`${target}_cosmetic_${from}_checkmark`).classList.add('opacity0');

    // Check new
    if(!elCosmetic) return;
    elCosmetic.classList.remove('opacity0');
}
//#endregion



// Populate achievements list
const elAchievementsList = dom('achievements_list');
const elAchievementFilter = dom('achievement_filter');
function populateAchievements() {
    const filter = dom('achievement_filter').value;
    // Don't populate if not needed
    if(achieveHTMLupdate == false) {return;}
    else {achieveHTMLupdate = false;}
    
    var achievementHTML = '';
    var rewardHTML = '';

    for(let i = 0; i < achievementsKeys.length; i++) {
        let key = achievementsKeys[i];
        let achieve = achievements[key];

        // Skip if internal
        if(achieve.internal == true) continue;

        // Test if unlocked
        let unlocked = achieveQuery(key);

        // Filters
        if(filter == 'unlocked'  && unlocked == false) continue;
        if(filter == 'locked'    && unlocked == true) continue;
        if(filter == 'challenge' && achieve.style != 'challenge') continue;
        if(filter == 'secret'    && achieve.mystery.list != true) continue;
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
        if(achieve.reward != false && unlocked == true) {

            let inner = '';
            // Multiple rewards
            if(Array.isArray(achieve.reward) == true) {
                for(let i = 0; i < achieve.reward.length; i++) {
                    let [rewardType, rewardName] =
                    typeof achieve.reward === 'string' || achieve.reward instanceof String ? achieve.reward.split(':') : ['function', achieve.reward];
                    let subtype = '';
    
                    let informalName;
                    let icon;
    
                    // Exceptions
                    if(rewardType == 'function') continue;
    
    
                    // Get reward info
                    if(rewardType == 'theme') {
                        informalName = themes[rewardName].name;
                        icon = themes[rewardName].image
                    }
                    // Cosmetic
                    else if(rewardType == 'cosmetic') {
                        [subtype, rewardName] = rewardName.split('/');
                        
    
                        // console.log(` cosmetics[${subtype}][${rewardName}].preview`);

                        informalName = cosmetics[subtype][rewardName].name;
                        if(cosmetics[subtype][rewardName].hasOwnProperty('preview') == false) {
                            icon = cosmetics[subtype][rewardName].image;
                        } else {
                            icon = cosmetics[subtype][rewardName].preview;
                        }
                        
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
                    } else if(rewardType == 'cash') {
                        icon = './assets/piggy_bank.png';
                        informalName = `x${rewardName} shekels`;
                    } else if(rewardType == 'shop') {
                        continue;
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
            else if(typeof achieve.reward === 'string' || achieve.reward instanceof String) {
                let [rewardType, rewardName] =
                typeof achieve.reward === 'string' || achieve.reward instanceof String ? achieve.reward.split(':') : ['function', achieve.reward];
                let subtype = '';

                let informalName;
                let icon;


                // Get reward info
                if(rewardType == 'theme') {
                    informalName = themes[rewardName].name;
                    icon = themes[rewardName].image
                }
                // Cosmetic
                else if(rewardType == 'cosmetic') {
                    [subtype, rewardName] = rewardName.split('/');

                    informalName = cosmetics[subtype][rewardName].name;
                    icon = cosmetics[subtype][rewardName].image;
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
                } else if(rewardType == 'cash') {
                    icon = './assets/piggy_bank.png';
                    informalName = `x${rewardName} shekels`;
                } else if(rewardType == 'shop') {
                    continue;
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
        } else {
            rewardHTML = '';
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
            // cheat: onclick="grantAchievement('${key}')"
            achievementHTML += /* htmla */
            `
            <div id="${key}" class="achievement_item achievement_locked${achieve.mystery.list != true ? '' : ' achievement_secret'}${achieve.style != false ? ' style_' + achieve.style : ''}" >
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

    // Filter by unlocked
    if(filter == 'unlocked' && achievementHTML == '') {
        achievementHTML =
            `<center><img src="./assets/theme/pixel_carrot.png" class="footer_carrot"><br/><p class="secondary_text">No achievements yet. :(</p></center>`;
    }
    // Filter by locked
    if(filter == 'locked' && achievementHTML == '') {
        achievementHTML =
            `<center><img src="./assets/piggy_bank.png" class="footer_carrot"><p class="secondary_text">You've unlocked every achievement- great job!</p></center>`;
    };
    // Filter by secret
    if(filter == 'secret' && achievementHTML == '') {
        achievementHTML =
            `<center><img src="./assets/easter_egg.png" class="footer_carrot pointer" onclick="confetti()"><p class="secondary_text">Don't tell anyone, but: you don't have any secret achievements.<br/>Secret achievements don't appear in the list until unlocked and<br/> they don't count towards your completion percentage.</p></center>`;
    };

    elAchievementsList.innerHTML = achievementHTML;
    // eInnerHTML(elAchievementsList, achievementHTML); // doesn't work
}

function rewardHTML(achieve) {
    // Rewards info
    if(achieve.reward != false) {
        let rewardHTML = '';
        let inner = '';
        // Multiple rewards
        if(Array.isArray(achieve.reward) == true) {
            for(let i = 0; i < achieve.reward.length; i++) {
                let [rewardType, rewardName] = achieve.reward[i].split(':');
                let target = '';
                let cosKey = '';

                let informalName;
                let icon;

                // Exceptions
                if(rewardType == 'cosmetic') {
                    [target, cosKey] = rewardName.split('/');
                }
                else if(rewardType == 'function') continue;


                // Get reward info
                if(rewardType == 'theme') {
                    informalName = themes[rewardName].name;
                    icon = themes[rewardName].image
                }
                // Cosmetic
                else if(rewardType == 'cosmetic') {
                    // console.log('vvvvv: ' + target + cosKey);
                    // console.log(cosmetics[target]);
                    informalName = cosmetics[target][cosKey].name;
                    icon = cosmetics[target][cosKey].image;
                }
                // Character
                else if(rewardType == 'character') {
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
                } else if(rewardType == 'cash') {
                    icon = './assets/piggy_bank.png';
                    informalName = `x${rewardName} shekels`;
                } else if(rewardType == 'shop') {
                    continue;
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
            let [rewardType, rewardName] = achieve.reward.split(':');
            let subtype = '';

            let informalName;
            let icon;

            // Get reward info
            if(rewardType == 'theme') {
                informalName = themes[rewardName].name;
                icon = themes[rewardName].image;
            }
            // Cosmetic
            else if(rewardType == 'cosmetic') {
                [subtype, rewardName] = rewardName.split('/');

                informalName = cosmetics[subtype][rewardName].name;
                icon = cosmetics[subtype][rewardName].image;
            }
            // Character
            else if(rewardType == 'character') {
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
            } else if(rewardType == 'cash') {
                icon = './assets/piggy_bank.png';
                informalName = `x${rewardName} shekels`;
            } else if(rewardType == 'shop') {
                return '';
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

function achievementProgress(element = dom('achievement_progress')) {
    let unlockedAchievements = Object.keys(player.achievements);
    eInnerText(
        element,
        `${unlockedAchievements.length - player.internal}/${achievementsKeys.length - hiddenAchievements} (${Math.round(percentage(Object.keys(player.achievements).length, achievementsKeys.length - hiddenAchievements))}%)`
    );
}

// Filter achievements on dropdown change
elAchievementFilter.addEventListener('change', () => {
    achieveHTMLupdate = true;
    populateAchievements();
});

var currentTheme;
// Set theme
function setTheme(theme) {
    // var theme = optionTheme.value;
    var theme_color = '#312e2e';
    var from = settings.theme;

    // If there is already a theme class, remove it
    [...elBody.classList].forEach(c => {
        if(c.includes('theme')) {
            elBody.classList.remove(c);
        }
    });

    // Add new theme
    elBody.classList.add(theme);

    // console.log(themes[theme]);
    if(themes[theme].hasOwnProperty('accent') == true) {
        theme_color = themes[theme].accent;
    };

    dom('theme_color').content = theme_color;

    // Set related cosmetic
    // if(themes[theme].hasOwnProperty('cosmetic') == true && themes[theme].cosmetic != false) {
    //     let [t, c] = themes[theme].cosmetic.split('/');
    //     setCosmetic(t, c);
    // }

    // Save to localStorage
    settings.theme = theme;
    saveSettings();
    currentTheme = theme;

    // Fancy Switcher fix
    themeSwitcherCheckmark(theme, from);
}
//#endregion



// Character info
function characterInfo(character) {
    // console.log('characterInfo: ' + character);
    let charbox = dom(`${character}_box`);

    if(charbox.classList.contains('show_info')) {
        charbox.classList.remove('show_info');
    } else {
        charbox.classList.add('show_info');
    }
}


// Credits scroll
const elCredits = dom('credits');
var creditInterval;
function startCredits(toast = false) {
    console.log(`startCredits()`);

    closeDialog();
    if(toast != false) { closeToast(toast); }
    
    creditsOpen = true;
    elCredits.scrollTop = 0;
    elCredits.classList.add('visible');
    overlay.classList.add("visible");
    elBody.classList.add('overflow_hidden');
    clearInterval(creditInterval);
    creditInterval = setInterval(() => {
        elCredits.scrollTop += 1;
        if(elCredits.scrollHeight - elCredits.scrollTop === elCredits.clientHeight) {
            clearInterval(creditInterval);
        }
    }, 30);

    // buttonSound();
}

// Stop autoscroll is player scrolls
elCredits.addEventListener('wheel', () => {
    clearInterval(creditInterval);
});
// elCredits.addEventListener('mousedown', () => {
//     clearInterval(creditInterval);
// });


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


// Populate Carls' shop
const carlShop = dom('cosmetic_shop');
// let carlHTMLStore = {};
function populateCarl() {
    let html = '';
    carlShopData = {};

    // Loop through shop_order
    // for(let i = 0; i < Carl.shop_order.length; i++) {
    //     let raw = Carl.shop_order[i];
    //     console.log('aaaaaaaa: ' + raw);
    //     let [type, name] = raw.includes(':') == false ? ['theme', raw] : raw.split(':');
    //     let item = Carl.shop[type][name];
    //     if(
    //         item.available == false ||
    //         item.bought == true
    //     ) continue;

    //     carlShopData[name] = item.price;

    //     // Theme
    //     if(type == 'theme') {
    //         // let theme_keys = Carl.shop.theme.keys;
    //         let theme = themes[name];
    //         let img = theme.image;
    
    //         html += carlHTML(name, 'theme', theme.name, img, item.price);
    //     }
    //     // Cosmetic
    //     else if(type == 'cosmetic') {
    //         // let cosm_keys = Carl.shop.cosmetic.keys;
    //         let [ca, cb] = name.split('/');
    //         let cosmetic = cosmetics[ca][cb];
    //         let img = cosmetic.image;
    
    //         html += carlHTML(name, `${ca} Cosmetic`, cosmetic.name, img, item.price);
    //     }
    // }

    // Loop through themes
    let theme_keys = Carl.shop.theme.keys;
    for(let ti = 0; ti < theme_keys.length; ti++) {
        let name = theme_keys[ti];
        let item = Carl.shop.theme[name];
        if(
            item.available == false ||
            item.bought == true
        ) continue;

        carlShopData[name] = item.price;

        let theme = themes[theme_keys[ti]];
        let img = theme.image;

        html += carlHTML(name, 'theme', theme.name, img, item.price);
    }

    // Loop through cosmetics
    let cosm_keys = Carl.shop.cosmetic.keys;
    for(let ti = 0; ti < cosm_keys.length; ti++) {
        let name = cosm_keys[ti];
        let item = Carl.shop.cosmetic[name];
        if(
            item.available == false ||
            item.bought == true
        ) continue;

        carlShopData[name] = item.price;

        let [ca, cb] = name.split('/');
        let cosmetic = cosmetics[ca][cb];
        let img = cosmetic.image;

        html += carlHTML(name, `${ca} Cosmetic`, cosmetic.name, img, item.price);
    }

    if(html == '') {
        carlShop.innerHTML = `
        <p class="padding-5px secondary_text center">
            That's all for now. Complete more achievements for more things to buy!
        </p>`;
    } else {
        carlShop.innerHTML = html;
    }
    updateCarlsShop();
}
function carlHTML(internalName, type, name, img, price) {
    return `
    <div id="carl_shop_${internalName}" class="shop_item" onclick="purchase('carl', '${type}', '${internalName}')">
        <div class="flex">
            <img src="${img}" alt="" class="shop_img">
            <div class="info" style="margin-top: 4px;">
                <b>${name}</b>
                <p class="secondary_text">${capitalizeFL(type)}</p>

                <div class="shop_price">
                    ₪${price}
                </div>
            </div>
        </div>
    </div>`;
}

// Theme/cosmetic NEW indicator
const carl_theme_button =       dom('carl_theme_button');
const carl_cosmetic_button =    dom('carl_cosmetic_button');
const theme_tab_button =        dom('theme_tab_button');
const cosmetic_tab_button =     dom('cosmetic_tab_button');
function newIndicator(state, type, item, subtype) {
    let carl_element = type == 'theme' ? carl_theme_button : carl_cosmetic_button;
    let tab_element =  type == 'theme' ? theme_tab_button  : cosmetic_tab_button;
    let buttonName = type == 'theme' ? 'Themes' : 'Cosmetics';
    let html = `${buttonName}<div class="new_indicator">NEW</div>`;

    // Save
    player[`new_${type}`] = state;

    // Page
    if(state == true) {
        carl_element.innerHTML = html;
        tab_element.innerHTML  = html;
    } else {
        carl_element.innerHTML = buttonName;
        tab_element.innerHTML  = buttonName;
    }
}

// Achievement list CSS modes
function achieveCompactMode(state) {
    if(state == true) {
        elAchievementsList.classList.add('compact');
    } else {
        elAchievementsList.classList.remove('compact');
    }
}
function achieveGridMode(state) {
    if(state == true) {
        elAchievementsList.classList.add('achieve_grid');
    } else {
        elAchievementsList.classList.remove('achieve_grid');
    }
}

// Title changer
// setInterval(() => {
//     dom('page_title').innerText = `Carrot Clicker - ${DisplayRounded(player.Carrots)} carrots`;
// }, 2000);



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
