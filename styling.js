/*-------------Variables------------*/
//#region
//// UI HANDLER ////
const elBody =          document.querySelector('body');
const bonusVisualArea = dom("bonusVisualArea");
const clickingArea =    dom("clicking_area");
var mouseX = 0;
var mouseY = 0;

// Popup counters (unique IDs so that they are deleted after a set time)
var toastID    = 0;
var toastsList = {};
var bonusID    = 0;

/** Menu state */
var menuState = {
    dialog:    false,
    character: false,
    theme:     false,
    cosmetic:  false,
    keybinds:  false,
    prestige:  false,
    inventory: false,
    tips:      false,
    credits:   false,
}

// Don't populate lists unless necessary
var achieveHTMLupdate  = true;
var tipsHTMLupdate     = true;
var themesHTMLupdate   = true;
var cosmeticHTMLupdate = true;

// Dialog Elements
const overlay = dom("overlay");
const elDialog = {
    // main:    dom("dialog"),
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

// Mouse confetti
const confettiColors =  ['red', 'blue', 'cyan', 'purple', 'yellow'];
const ccGold =          ['goldenrod', 'yellow', 'white', '#e1cfa4', '#dcb276', '#be7e4e'];
const ccWhite =         ['white'];
const ccCarrot =        ['#ed9645', '#c3580d', '#de5a01', '#974810'];
/** Confetti effect at mouse position
 * @param {array} particles Array [0] is the minimum amount of particles, [1] is the maximum.
 * @param {array} colorArray Array to pull random colors from
 * @param {number} time Particle lifespan in milliseconds. Will also effect the travel distance of the particles.
 * @returns 
 */
function mouseConfetti(particles=[5,5], colorArray=confettiColors, time=150, size_min=4, force_display=false) {
    if(!settings.confetti_effects && !force_display) return;
    let count = r(particles[1] - particles[0] + 1) + particles[0] - 1;
    // console.log('mouse confetti!');
    for(i = 0; i < count; i++) {
        // Random attributes
        let color   = colorArray[r(colorArray.length)];
        let rot     = r(360);
        let skew    = r(100) - 50;
        let size    = r(4) + size_min;
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

/** Screen shake */
// function screenShake(time=800, intensity=1) {
//     $('body').classList.add('screen_shake');
//     clearTimeout(shakeTimeout);
//     var shakeTimeout = setTimeout(() => {
//         $('body').classList.remove('screen_shake'); 
//     }, time);
// }


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

/** Popup Dialog
 * @param {string} title Dialog title
 * @param {string} desc Dialog description
 * @param {string} buttonName Name for the accept button
 * @param {string} buttonStyle Class to be applied to the accept button
 * @param {function} button_action Function to be run if the accept button is pressed
 */
function openDialog(title, desc, buttonName, buttonStyle, button_action) {
    openMenu('dialog');

    // Fill out dialog text, if applicable
    if(title)        eInnerText(elDialog.title, title);
    if(desc)         eInnerText(elDialog.desc, desc);
    if(buttonName)   eInnerText(elDialog.buttons.accept, buttonName);
    if(buttonStyle)  elDialog.buttons.accept.classList.add(buttonStyle);
    if(button_action) elDialog.buttons.accept.onclick = button_action;
}

/** Close all popup menus
 * @param {boolean} accept Whether or not to run the dialog accept function 
 * @returns 
 */
function closeDialog(accept=false) {
    overlay.className = "";
    elBody.classList.remove('overflow_hidden');
    buttonSound();

    // Reset dialog
    if(menuState.dialog) {
        menuState.dialog = false;
        eInnerText(elDialog.title, 'Dialog Title');
        eInnerText(elDialog.desc, 'Dialog description');
        // Reset Accept button
        elDialog.buttons.accept.classList.remove(...elDialog.buttons.accept.classList);
        elDialog.buttons.accept.onclick = closeDialog;
        eInnerText(elDialog.buttons.accept, "OK");
    }

    // Hide other popup menus
    //#region
    if(menuState.dialog) menuState.dialog = false;
    if(menuState.character) {
        dom(`${menuState.character}_box`).classList.remove('show_info');
        menuState.character = false;
    }
    if(menuState.theme)    menuState.theme = false;
    if(menuState.cosmetic) menuState.cosmetic = false;
    if(menuState.keybinds) menuState.keybinds = false;
    if(menuState.prestige) menuState.prestige = false;
    if(menuState.prestige) menuState.prestige = false;
    if(menuState.tips)     menuState.tips = false;
    if(menuState.credits)  menuState.credits = false;

    // Enable keyboard navigation for main page
    dom('main').ariaHidden = false;
    document.querySelectorAll('#main *[tabindex="-1"], #main button, #main input, #main select, #main a, #main textarea').forEach(element => {
        element.tabIndex = 0;
    });
    //#endregion
}


/** Toast notifications
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
function toast(
    title          = '',
    desc           = '',
    color          = '',
    persistent     = false,
    replaceable    = false,
    achievement    = false,
    hide_close     = false,
    button_action  = false,
    button_name    = 'Done',
) {
    // Cancel if tutorial message, and tutorial messages are disabled
    let istutorial = (title.toUpperCase().includes('TUTORIAL') || title.toUpperCase().includes('CARROT CLICKER'))
    if(istutorial && settings.tutorial_messages == false) return;

    // Replace old if replace is true
    if(toastsList[toastID - 1] != undefined && toastsList[toastID - 1].includes('replace') == true) {
        closeToast(toastID - 1, false);
    }

    // Create element with parameters filled in
    var toastElement = document.createElement("div");
    toastElement.id = `toast${toastID}`;
    let id = `${toastID}`;

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
        // Secondary line // disable tutorial messages
        if(istutorial) {
            var secondary_line = document.createElement("p");
            secondary_line.innerText = `Disable tutorial messages`;
            secondary_line.className = 'secondary_text link_styling center';
            secondary_line.role = 'button';
            secondary_line.tabIndex = '0';
            secondary_line.style.margin = '0';
            secondary_line.onclick = () => { disableTutorials(id); };
            toastElement.append(secondary_line);
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
        <span class="toast_close" role="button" tabindex="0" onclick="closeToast(${toastID})">X</span>
        <!-- Details -->
        <div class="achievement_details flex">
            <img src="${noImg ? './assets/achievements/missing.png' : achieve.image}" alt="${achieve.name}" id="${achievement}_img" class="achievement_img" title="${achieve.name}">
            <div>
                <a href="#${achievement}" class="link_styling white" onclick="panelChange('achievements-panel')"><h3>${achieve.name}</h3></a>
            </div>
        </div>`;
    }

    toastContainer.prepend(toastElement);
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
    
    /** Disable tutorial toasts */
    function disableTutorials(toastID) {
        settings.tutorial_messages = false;
        dom('tutorial_messages').checked = false;
        saveSettings();
        closeToast(toastID, false);
        toast('', 'Tutorial messages disabled. They can be reenabled in settings.');
    }
}

/** Close Toast Notification
 * @param {number} id ID of the toast you want to close
 * @param {boolean} animate Whether or not to play a dismiss animation
 */
function closeToast(id, animate = true) {
    let t = JSON.stringify(toastsList[id]);
    var element = dom(`toast${id}`);

    // Clear all button
    if(Object.keys(toastsList).length <= 2) {
        toastsClear.classList.remove("visible");
    }

    // No animation
    if(animate == true && element != null) {
        // Dismiss Animation
        element.classList.add("toast_out");
        setTimeout(() => { element.remove(); }, 300);
    }
    else if(element != null) { element.remove(); }

    delete toastsList[id];
}

/** Clear all toasts
 * @param {boolean} force Forces a clear even if some toasts cannot be closed normally
 */
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

// Tab Buttons
const infoTab         = dom("stats-panel-button");
const achievementsTab = dom("achievements-panel-button");
const settingsTab     = dom("settings-panel-button");

/** Change Tripane panel
 * @param {string} to Name of the tripane panel to switch to
 * @param {boolean} noSound True prevents the button sound from playing
 * @returns 
 */
function panelChange(to, noSound = false) {
    if(currentPanel == to) return;
    else {
        currentPanel = to;

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
        settings.openpanel = to;
        saveSettings();

        buttonSound();
    }

    // Update achievements list
    if(to == 'achievements-panel' && achieveHTMLupdate == true)  populateAchievements();
    if(to == 'stats-panel') statsInterval = setInterval(() => {loadStatistics()}, 1000);
    else clearInterval(statsInterval);
}
//#endregion


/** Click number popup
 * @param {boolean} useMousePos 
 * @param {string} amount 
 * @param {string} style Styling to be applied
 */
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

    // Negative number
    let sign = amount[0] == '-' ? '' : '+';
    if(sign == '') { clickVisualElement.classList.add('clickvisual_negative'); }

    // Carrot
    if(style == 'carrot') {
        clickVisualElement.innerText = `${sign}${amount}`; 
    }
    // Falling carrot
    else if(style == 'falling') {
        clickVisualElement.innerText = `${sign}${amount}`;
        clickVisualElement.classList.add("clickvisual_falling");
    }
    // Cash
    else if(style == 'cash') {
        clickVisualElement.innerText = `⚬${amount}`;
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



/* ----- Fancy Theme Switcher ----- */
/** Opens the theme menu */
function themeSwitcher() {
    openMenu('theme');
    newIndicator(false, 'theme');
    populateThemeList();
}
/** Closes the theme menu */
function closeThemeSwitcher(noOverlay = false) {
    themeMenu.classList.remove('visible');
    if(noOverlay == false) overlay.classList.remove("visible"); 
}

/* ----- Fancy Cosmetic Switcher ----- */
var uncollapseNeeded = false;
/** Opens the cosmetic menu */
function cosmeticSwitcher(category = false) {
    if(!characterQuery('carl')) return;
    openMenu('cosmetic');
    newIndicator(false, 'cosmetic');

    // Uncollapse intended category
    if(category) {
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

    populateCosmeticsList();
}
/** Closes the cosmetic menu */
function closeCosmeticSwitcher(noOverlay = false) {
    cosmeticMenu.classList.remove('visible');
    if(!noOverlay) overlay.classList.remove("visible");
}

// Always run when a menu is open
function openMenu(id) {
    closeDialog();
    overlay.classList.add("visible");
    overlay.classList.add(`show_${id}`);
    elBody.classList.add('overflow_hidden');

    // Disable keyboard navigation for main page
    dom('main').ariaHidden = true;
    document.querySelectorAll('#main *[tabindex="-1"], #main button, #main input, #main select, #main a, #main textarea').forEach(element => {
        element.tabIndex = -1;
    });
    menuState[id] = true;

    buttonSound();
}

/** Opens the prestige menu */
function openPrestigeMenu() {
    // Prevent from opening if unavailable
    if(player.prestige_available != true) {return};
    
    openMenu('prestige');
    updatePrestigeMenu();
}

/* ----- Inventory ----- */
// function openInventory() {
//     closeDialog();
//     menuState.inventory = true;
//     overlay.classList.add("visible");
//     elBody.classList.add('overflow_hidden');
// }

/* ----- Tips Menu ----- */
function openTipsMenu() {
    openMenu('tips');
}
const elTipsList = dom('tips_list');
function populateTipsMenu() {
    if(!tipsHTMLupdate) return;
    tipsHTMLupdate = false;

    let html = '';
    let best = player.flags['all_tips'] == true ? tl.length - 1 : tips.best;
    // Loop
    for(let i = 0; i <= best + 0.5; i += 0.5) {
        let ri = Math.floor(i);
        let type = '';
        if(i % 1 != 0) { type = 'fun_'; }

        let id = `${type}${tl[ri]}`;
        let cat = tips[id];
        if(type != 'fun_') html += `<h3>${capitalizeFL(id.split('_').join(' '))}</h3>`;

        for(ii = 0; ii < cat.length; ii++) {
            // Normal
            if(tips.seen[id][ii] == true || player.flags['all_tips'] == true) html += `<p class="tip_item${type == 'fun_' ? ' fun': ''}"><span class="tip_number">${ii + 1}</span>${cat[ii]}</p>`;
            // Fun
            else html += `<p class="tip_item secondary_text${type == 'fun_' ? ' fun': ''}"><span class="tip_number">${ii + 1}</span>???</p>`;
        }
    }
    elTipsList.innerHTML = html;
}

/** Toggles hardmode, replace with save file menu perhaps */
function openDifficultyMenu() {
    if(player.flags['hardcore'] != true) {
        player.flags['hardcore'] = true;
        toast('Hardmode enabled', '', 'error', false, true);
    } else {
        player.flags['hardcore'] = false;
        toast('Hardmode disabled', '', '', false, true);
    }
    updateMainIcon();
}

/** Change cosmetics
 * @param {string} target Cosmetic type
 * @param {string} to Cosmetic name
 * @param {boolean} resetState 
 */
function setCosmetic(target, to, resetState = false) {
    // console.log('Switching ' + target + '\'s cosmetic to: ' + to);

    // Reset to default first
    if(resetState == false && to != 'default') setCosmetic(target, 'default', true);

    var from = settings.cosmetics[target];
    let cosmetic = cosmetics[target][to];

    // Change page
    switch(target) {
        case 'bundle':
            // Loop types
            for(i = 0; i < cosmeticsKeys.length; i++) {
                let target = cosmeticsKeys[i];
                if(target == 'bundle') continue;
                if(cosmetic.hasOwnProperty(target)) setCosmetic(target, cosmetic[target]);
                else setCosmetic(target, 'default');
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
                if(cosmetic.render_type == 'pixel') { mainCarrot.classList.add('render_pixelated'); }
            } else {
                mainCarrot.classList.remove('render_pixelated');
            }
            break;
        // Tools
        case 'tools':
            for(hi = 0; hi < Default_Gregory.HoePrices.length; hi++) {
                if(cosmetic.hasOwnProperty(`${hi}`) && cosmetic[`${hi}`] != false) {
                    document.querySelectorAll(`.tool_${hi}`).forEach(element => {
                        element.src = cosmetic[hi];
                    });
                }
            }
            break;
        // Character
        default:
            if(!characterQuery(target)) return;
            if(cosmetic.image) dom(`${target}_avatar`)['src'] = cosmetic.image;
            if(cosmetic.rename) eInnerText(dom(`${target}_name`), cosmetic.rename);
            break;
    }

    // Loop through page elements containing farmable item name and set accordingly
    function nameLoop(farmable) {
        document.querySelectorAll('.farmable_name').forEach(e => {
            e.innerText = farmable + 's';
        });
    }

    // Save
    settings.cosmetics[target] = to;
    saveSettings();

    // Update page
    cosmeticSwitcherCheckmark(target, to, from);
    /** Theme switcher checkmarks */
    function cosmeticSwitcherCheckmark(target, to, from = false) {
        var elCosmetic = dom(`${target}_cosmetic_${to}_checkmark`);

        // Uncheck previous
        if(from == false || !dom(`${target}_cosmetic_${to}_checkmark`)) return;
        try {
            dom(`${target}_cosmetic_${from}_checkmark`).classList.add('opacity0');
        } catch (error) {
            console.error(error);
        }

        // Check new
        if(!elCosmetic) return;
        elCosmetic.classList.remove('opacity0');
    }
}
//#endregion


/* ----- Themes ----- */
//#region 

// Populate theme switcher list on page load
function populateThemeList() {
    if(!themesHTMLupdate) return;
    themesHTMLupdate = false;

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
            <div class="theme_item flex achievement_locked" title="Locked" tabindex="0" role="button">
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
        <div class="theme_item flex" title="${theme.name}" onclick="setTheme('${key}')" tabindex="0" role="button">
            <img src="${imgsrc}" alt="img" class="theme_preview" id="theme" loading="lazy">
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

/* Populate cosmetics */
// Populate theme switcher list on page load
//#region 
// Cosmetics List style
const cosmeticsView = dom('cosmetics_view');
cosmeticsView.addEventListener('input', () => {
    cosmeticsGridMode();
});

/**  */
function cosmeticsGridMode() {
    let value = cosmeticsView.value;
    let elements = document.querySelectorAll('.cosmetics_mini');
    elements.forEach(element => { style(element, 'cosmetics_grid', (value == 'grid')); });

    // Save preference
    settings.cosmetics_grid = value == 'list' ? false : true;
    saveSettings();
}

/** Populate cosmetics list
 * @param {string} target Cosmetic type to populate, or "all" for all
 */
function populateCosmeticsList(target='all') {
    // Update all lists
    if(target == 'all') {
        if(!cosmeticHTMLupdate) return;
        cosmeticHTMLupdate = false;

        for(let i = 0; i < cosmeticsKeys.length; i++) populateCosmeticsList(cosmeticsKeys[i]);

        // Size adjust
        setTimeout(() => {
            let width = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
            if(width > 655) { width = 655 - 64; }
            else { width = width - 64; }
            let item_width = 84;
            if(width <= 460) { item_width = 84; }
            // 655 theme popup width
            // minus 64 to get actual used space
            let amount = Math.floor(width / item_width);
            
            for(i = 0; i < cosmeticsKeys.length; i++) {
                let category = dom(`collapse_${cosmeticsKeys[i]}`);
                let item_list = category.querySelectorAll('.cosmetic_item');
                let iterate = 1;
                item_list.forEach(item => {
                    if(iterate > amount / 2) item.classList.add('desc_fit');
                    if(iterate < amount) iterate++;
                    else iterate = 1;
                });
            }
        }, 50);

        return;
    }

    var cosmeticHTML = '';
    let list = cosmetics[target];
    for(let i = 0; i < list['keys'].length; i++) {
        let key = list['keys'][i];
        let cosmetic = list[key];

        // Locked
        if(isUnlocked('cosmetic', key, target) == false) {
            // Test if hidden
            if(cosmetic.hidden == true) continue;
            cosmeticHTML += /* html */
            `
            <div class="theme_item cosmetic_item flex achievement_locked" title="Locked" tabindex="0" role="button">
                <img src="./assets/locked_transparent.png" alt="img" class="theme_preview" id="cosmetic_${key}" loading="lazy">
                <div class="description">
                    <h3>???</h3>
                    <p class="secondary_text">Locked</p>
                </div>
            </div>
            `;
            continue;
        }

        let imgsrc = cosmetic.hasOwnProperty('preview') ? cosmetic.preview : (cosmetic.hasOwnProperty('image') ? cosmetic.image : './assets/Carrot Clicker.png');
    
        // HTML
        cosmeticHTML += /* html */
        `
        <div class="theme_item cosmetic_item flex" title="${cosmetic.name}" onclick="setCosmetic('${target}', '${key}')" id="${target}_cosmetic_${key}" tabindex="0" role="button">
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

    dom(`${target}_cosmetics`).innerHTML = cosmeticHTML;
}
//#endregion


const elAchievementsList = dom('achievements_list');
const elAchievementFilter = dom('achievement_filter');

/** Populate achievements list
 * @param {string} specific Accepts an achievement key and updates only that achievement instead
 */
function populateAchievements(specific=false) {
    // Don't populate if not needed
    if(!achieveHTMLupdate) return;
    achieveHTMLupdate = false;

    achievementProgress();
    const filter = dom('achievement_filter').value;
    var achievementHTML = '';

    // Populate all
    if(!specific) {
        for(let i = 0; i < achievementsKeys.length; i++) achievementHTML += htmlTemplate(achievementsKeys[i]);
    }
    // Populate single
    else {
        let item = achievements?.[specific];
        if(item == undefined) return console.warn(`populateAchievements(): [${specific}] is not a valid achievement`);

        let ahtml = new DOMParser().parseFromString(htmlTemplate(specific), "text/html").body.firstChild;
        let replace = document.getElementById(specific);
        replace.parentNode.replaceChild(ahtml, replace);
        return;
    }


    // Filter by unlocked
    if(achievementHTML == '') {
        if(filter == 'unlocked') {
            achievementHTML = `<center><img src="./assets/theme/pixel_carrot.png" class="footer_carrot"><br/><p class="secondary_text">No achievements yet. :(</p></center>`;
        }
        // Filter by locked
        else if(filter == 'locked') {
            achievementHTML = `<center><img src="./assets/piggy_bank.png" class="footer_carrot"><p class="secondary_text">You've unlocked every achievement- great job!</p></center>`;
        }
        // Filter by secret
        else if(filter == 'secret') {
            achievementHTML = `<center><img src="./assets/easter_egg.png" class="footer_carrot pointer" onclick="mouseConfetti([24,24], confettiColors, 300)"><p class="secondary_text">Don't tell anyone, but: you don't have any secret achievements.<br/>Secret achievements don't appear in the list until unlocked and<br/> they don't count towards your completion percentage.</p></center>`;
        }
    }

    elAchievementsList.innerHTML = achievementHTML;
    setTimeout(() => {achieveGridAdjust()}, 50);

    function htmlTemplate(key) {
        var rewardsHTML = '';
        let achieve = achievements[key];
        let unlocked = achieveQuery(key); // Test if unlocked

        // Filters
        if(
            achieve.internal == true ||
            filter == 'unlocked'  && unlocked == false ||
            filter == 'locked'    && unlocked == true ||
            filter == 'challenge' && achieve.style != 'challenge' || 
            filter == 'secret'    && achieve.mystery.list != true ||
            achieve.mystery.list == true && unlocked == false
        ) return '';


        // Rewards info
        if(achieve.reward != false) {
            let inner = '';
            // Multiple rewards
            if(Array.isArray(achieve.reward) == true) {
                for(let i = 0; i < achieve.reward.length; i++) {
                    let reward = achieve.reward[i];
                    inner += rewardHTML(reward, unlocked);
                }
            }
            // Single reward
            else if(typeof achieve.reward === 'string' || achieve.reward instanceof String) {
                let reward = achieve.reward;
                inner += rewardHTML(reward, unlocked);
            }

            // Export HTML
            rewardsHTML = `<div class="rewards_list">${inner}</div>`;
        } else rewardsHTML = '';

        // Achievement info
        // cheat:       onclick="grantAchievement('${key}')"
        // unlock date: onclick="toast('', new Date(player.achievements['${key}']), '', true, true)"
        let pagesHTML = achieve.pages != false && achieve.pages != null ? `<div class="achieve_pages secondary_text">+${achieve.pages} pages</div>` : '';
        let name = unlocked || achieve.mystery.name != true ? achieve.name : '???';
        let desc = unlocked || achieve.mystery.desc != true ? achieve.desc : '???';
        let img = achieve.image || './assets/achievements/missing.png';
        img  =  unlocked || achieve.mystery.image == false ? img : './assets/achievements/locked.png';
        let title = name == '???' ? 'This achievement has not been unlocked' : name;

        // Create
        return /* htmla */ `
        <div
            id="${key}"
            class="achievement_item 
            ${unlocked ? '' : 'achievement_locked'}
            ${achieve.mystery.list != true ? '' : ' achievement_secret'}
            ${achieve.style != false ? ' style_' + achieve.style : ''}"
        >
            <!-- Details -->
            <div class="achievement_details flex">
                ${pagesHTML}
                <img
                    src="${img}"
                    alt="${name}"
                    id="${key}_img"
                    class="achievement_img"
                    title="${title}"
                    loading="lazy"
                >
                <div>
                    <h2>${name}</h2>
                    <p class="secondary_text">${desc}</p>
                </div>
            </div>
            ${rewardsHTML}
        </div>
        `;

        /** Achievement reward HTML */
        function rewardHTML(reward, unlocked) {
            let [rewardType, rewardName] =
            typeof reward === 'string' || reward instanceof String ? reward.split(':') : ['function', reward];
            let subtype;

            let informalName;
            let icon;
            let extraClass = '';

            // Don't show function rewards
            if(rewardType == 'function' || rewardType == 'shop') return '';

            // Get reward info
            if(!unlocked) {
                informalName = "Locked";
                icon = './assets/gift.png';
            }
            else if(rewardType == 'theme') {
                informalName = themes[rewardName].name;
                icon = themes[rewardName].image
            }
            // Cosmetic
            else if(rewardType == 'cosmetic') {
                [subtype, rewardName] = rewardName.split('/');
                informalName = cosmetics[subtype][rewardName].name;
                icon = cosmetics[subtype][rewardName].image || cosmetics[subtype][rewardName].preview;
            }
            // Character
            else if(rewardType == 'character') {
                informalName = capitalizeFL(rewardName);
                icon = defaultChar[rewardName].img; // Get image
            }
            // Cash
            if(rewardType == 'cash') {
                icon = './assets/piggy_bank.png';
                informalName = `${rewardName} coins`;
                rewardType = '';
                extraClass = 'rcash';
            }

            return `
            <div class="reward flex ${extraClass}">
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
}
function achieveGridAdjust() {
    // Size adjust
    let width = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    if(width > 1166) { width = 1166 - 64; }
    else { width = dom('achievements_list').offsetWidth; }
    let item_width = 68;
    let amount = Math.floor(width / item_width);
    
    var iterate = 1;
    let list = document.querySelectorAll('#achievements_list .achievement_item');
    list.forEach(item => {
        if(iterate > Math.ceil(amount / 2)) {
            item.classList.add('desc_fit');
        } else { item.classList.remove('desc_fit'); }
        // Count
        if(iterate < amount) {
            iterate++;
        } else {
            iterate = 1;
        }
    });
}

/** Achievement progress */
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

/** Set theme
 * @param {string} theme Theme to switch to
 */
function setTheme(theme) {
    var theme_color = themes[theme].accent || '#312e2e';
    var from = settings.theme;

    // If there is already a theme class, remove it
    [...elBody.classList].forEach(c => { if(c.includes('theme')) elBody.classList.remove(c); });
    elBody.classList.add(theme); // Add new theme
    dom('theme_color').content = theme_color;

    // Save to localStorage
    settings.theme = theme;
    saveSettings(); 

    themeSwitcherCheckmark(theme, from);
    /** Theme switcher checkmarks */
    function themeSwitcherCheckmark(theme, from = false) {
        var elTheme = dom(`${theme}_checkmark`);

        // Uncheck previous
        if(from == false || !dom(`${from}_checkmark`)) return;
        dom(`${from}_checkmark`).classList.add('opacity0');

        // Check new
        if(!elTheme) return;
        elTheme.classList.remove('opacity0');
    }
}
//#endregion



/** Opens character info screen */
function characterInfo(character, state=undefined) {
    let charbox = dom(`${character}_box`);
    if(charbox.classList.contains('show_info') || state == false) {
        charbox.classList.remove('show_info');
        closeDialog();
    } else {
        openMenu();
        charbox.classList.add('show_info');
        menuState.character = character;
    }
}


// Credits scroll
const elCredits = dom('credits');
var creditInterval;
/** Opens the credits with autoscroll */
function startCredits(toast = false) {
    if(toast) closeToast(toast);
    openMenu('credits');
    elCredits.scrollTop = 0;
    clearInterval(creditInterval);
    creditInterval = setInterval(() => {
        elCredits.scrollTop += 1;
        if(elCredits.scrollHeight - elCredits.scrollTop === elCredits.clientHeight) {
            clearInterval(creditInterval);
        }
    }, 30);
}

// Stop autoscroll if player scrolls
elCredits.addEventListener('wheel', () => { clearInterval(creditInterval); });


// Keybinds menu
const elKeybindsMenu = dom('keybinds_menu');
const elKeybindsBlurb = dom('keybinds_blurb');
let keyBlurbText = elKeybindsBlurb.innerHTML;
/** Opens the keybind menu */
function keybindsMenu() {
    openMenu('keybinds');
    let checked = elDisableKeybinds.checked;
    style(elKeybindsBlurb, 'color_red', checked);
    elKeybindsBlurb.innerText = checked ? 'Warning: Keybinds are currently disabled in settings.' : keyBlurbText;
}

const carlShop = dom('carl_shop');
// var pageCarl = 1;
/** Populate Carls' shop */
function populateCarl() {
    let html = '';
    carlShopData = {};
    // let count = 0;

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
        let desc = theme.desc;

        html += carlHTML(name, 'theme', theme.name, img, item.price, desc);
        // count++;
    }

    // Loop through cosmetics
    let cosm_keys = Carl.shop.cosmetic.keys;
    for(let ti = 0; ti < cosm_keys.length; ti++) {
        let name = cosm_keys[ti];
        let item = Carl.shop.cosmetic[name];
        if(!item.available || item.bought) continue;

        carlShopData[name] = item.price;

        let [ca, cb] = name.split('/');
        let cosmetic = cosmetics[ca][cb];
        let img = cosmetic.image || cosmetic.preview;
        let desc = cosmetic.desc;

        html += carlHTML(name, `${ca} Cosmetic`, cosmetic.name, img, item.price, desc);
        // count++;
    }

    // Update page
    if(html == '') {
        html = `
        <p class="padding-5px secondary_text center">
            That's all for now. Complete more achievements for more things to buy!
        </p>`;
    }
    carlShop.innerHTML = html;
    cashCount(false);
    updateCarlsShop();

    /** Carl HTML template */
    function carlHTML(internalName, type, name, img, price, desc) {
        return `
        <div class="tooltip_area">
            <div id="carl_shop_${internalName}" class="shop_item flex" onclick="buyCarl('${type}', '${internalName}')" tabindex="0" role="button">
                <img src="${img}" alt="" class="shop_img" loading="lazy">
                <div class="info">
                    <b>${name}</b>
                    <p class="secondary_text">${capitalizeFL(type)}</p>
    
                    <div class="shop_price">
                        ${price} coins
                    </div>
                </div>
            </div>

            <div class="shop_tooltip">${desc}</div>
        </div>
        `;
    }
}

const elJaredShop = dom('jared_shop');
/** Populate Jared's shop */
function populateJared(specific=false) {
    if(characterQuery('jared') != true) return;

    let html = '';
    let keys = jaredShop.keys;

    // Populate all
    if(!specific) {
        for(i = 0; i < keys.length; i++) {
            let key = keys[i];
            html += jaredHTML(key);
        }

        elJaredShop.innerHTML = html;
        // "Check back later for more trinkets"
        html += `
        <p class="secondary_text center" style="padding: 4px; margin-top: 8px;">
            Thanks for stopping by!
        </p>`;
    }
    // Populate single
    else {
        let item = jaredShop?.[specific];
        if(item == undefined) return console.warn(`populateJared(): [${specific}] is not a valid trinket`);

        let ahtml = new DOMParser().parseFromString(jaredHTML(specific), "text/html").body.firstChild;
        let replace = document.getElementById(`jared_shop_container_${specific}`);
        replace.parentNode.replaceChild(ahtml, replace);
        return;
    }
    
    cashCount(false);

    /** Jared HTML template */
    function jaredHTML(key) {
        let item = jaredShop[key];
        let data = Jared.data?.[key];
        if(!data.available || data == undefined) return;

        // Segment bar
        let src = item.img || './assets/achievements/missing.png';
        let segments = '';
        for(si = 1; si <= item.price.length; si++) {
            let styles = data.level >= si ? 'filled' : '';
            segments += `<div class="segment ${styles}"></div>`;
        }
        let price = item.price[data.level] || '✓ Done';
        let currency = '';
        let styles = 'complete';
        if(price != '✓ Done') {
            currency = 'coins';
            styles = '';
        }
        let value = typeof data.value == 'string' ? data.value : item.written.split('@').join(data.value);

        return `
        <div id="jared_shop_container_${key}" class="tooltip_area">
            <div id="jared_shop_${key}" class="shop_item ${styles}" onclick="buyTrinket('${key}')" tabindex="0" role="button">
                <img src="${src}" alt="" class="shop_img" loading="lazy">
                <div class="info">
                    <b>${item.name}</b>
                    <div class="segment_bar darker_bg_color">${segments}</div>
                    <div class="shop_value secondary_text">${value}</div>
                    <div class="shop_price">${price} ${currency}</div>
                </div>
            </div>
            <div class="shop_tooltip">${item.desc}</div>
        </div>`;
    }
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

/** Enable/disable compact achievement CSS */
function achieveCompactMode(state) {
    style(elAchievementsList, 'compact', state);
}
/** Enable/disable achievement grid CSS */
function achieveGridMode(state) {
    style(elAchievementsList, 'achieve_grid', state);
    achieveGridAdjust();
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
//#endregion