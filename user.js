/* -------------------------------------------------------------
Users settings, keybind handling, and tutorial handling
------------------------------------------------------------- */

/** Returns true if any menu or popup is open */
function menuOpen() {
    return (menuState.dialog || menuState.character ||  menuState.theme || menuState.cosmetic /*|| menuState.keybinds*/ || menuState.prestige /*|| menuState.inventory*/ || menuState.tips || menuState.credits);
}

/*---------------OPTIONS-------------------*/

// Update the current slider value (each time you drag the slider handle)
function updateTipsInput(event) {
    let v = event.srcElement.value;
    elFunTipsSlider.value = v;
    elFunTipsSlider_label.value = v;
    settings.fun_tip_percentage = parseInt(elFunTipsSlider.value); // Set modifier
    saveSettings();
}
elFunTipsSlider.oninput = updateTipsInput;
elFunTipsSlider_label.onchange = updateTipsInput;

/** Universal checkbox option updater (not used by everything because some options need extra code)
 * @param option Option to update
*/
function setting(option, notif=false) {
    let state = dom(option).checked;
    console.log(`${option} set to ${state}`);
    settings[option] = state;
    saveSettings();
    if(option === 'compact_achievements') achieveCompactMode(state);
    else if(option === 'achievements_grid') achieveGridMode(state);
    else if(option === 'full_numbers') {
        carrotCount();
        updateCPC();
        characterPrices();
    } else if(option === 'show_nav') {
        style(elBody, 'hide_nav', !state);
    }
    // Toast
    if(!notif) return;
    toast("Settings", `${capitalizeFL(option.split('_').join(' '))} ${option[option.length - 1] === 's' ? 'are' : 'is'} now ${state ? 'enabled' : 'disabled'}`,
    '', false, true);
}


// Notification length
const elNotificationLength = dom('notificationLength');
const elNotificationLength_label = dom('notificationLength_label');
elNotificationLength.addEventListener('change', optionNotificationLength);
elNotificationLength_label.addEventListener('change', optionNotificationLength);
function optionNotificationLength(event) {
    let value = parseInt(event.srcElement.value);
    elNotificationLength.value = elNotificationLength_label.value = value;
    settings.notificationLength = value;
    saveSettings();
}

// Autosave interval
// Intended to be universal but needs unique code so just leaving it as is
dom('autosave_interval').addEventListener('change', settingAutosave);
dom('autosave_interval_label').addEventListener('change', settingAutosave);
function settingAutosave(event) {
    let value = event.srcElement.value;
    dom('autosave_interval').value = value;
    dom('autosave_interval_label').value = value;
    settings.autosave_interval = value;
    saveSettings();

    // Update autosave variable
    clearInterval(autosave);
    autosave = setInterval(() => {
        saveGame();
    }, value * 1000);
}

// Interface settings

// Main progress bar
function settingMainProgress() {
    let state = elEnableMainProgress.checked;
    console.log(`enableMainProgress set to ${state}`);
    toast("Settings", `Status bar progress is now ${state ? 'enabled' : 'disabled'}`,
    '', false, true);

    // localStorage
    settings.enableMainProgress = state;
    saveSettings();

    elMainProgressContainer.classList.remove('status_tidbit_in');
}


// Enable sounds
function settingSounds(notif=true) {
    let state = elEnableSounds.checked;
    console.log(`enableSounds set to ${state}`);

    // localStorage
    settings.enableSounds = state;
    saveSettings();

    optionSoundsDisable(state);
    settingMusic(true);

    // Toast
    if(notif !== true) return;
    toast("Settings", `Sounds are now ${state ? 'enabled' : 'disabled'}`,
    '', false, true);
}

function settingMusic(noToast = false) {
    let state = elEnableMusic.checked;
    console.log(`enableMusic set to ${state}`);
    if(!noToast) toast("Settings", `Music is now ${state ? 'enabled' : 'disabled'}`, '', false, true);
    settings.enableMusic = state;
    saveSettings();
    return state ? playMusic() : stopMusic(); // Start/Stop
}

/** Settings - Carrot sounds */
function settingCarrotSounds() {
    let state = elEnableCarrotSounds.checked;
    console.log(`enableCarrotSounds set to ${state}`);
    toast("Settings", `Carrot sounds are now ${state ? 'enabled' : 'disabled'}`,
    '', false, true);

    // localStorage
    settings.enableCarrotSounds = state;
    saveSettings();
}

// Volume slider
elVolumeMaster.oninput = volumeSliderHandler;
volumeMasterDropdown.oninput = volumeSliderHandler;
elVolumeMaster_label.onchange = volumeSliderHandler;

/*------------EVENT LISTENERS--------------*/

// Key Down
var keyCarrotFiring = false;
document.addEventListener('keydown', event => {
    let key = event.key;
    if(key === " ") event.preventDefault();
    key = interpretKey(key);
    if(!settings.enable_keybinds || menuOpen()) return;
    if(key === settings.keybinds['key_carrot'] && !keyCarrotFiring) {
        keyCarrotFiring = true;
        holdStart(false, 1);
    }
});


// Key up (used for normal keybinds)
document.addEventListener('keyup', event => {
    if(event.key === "Enter") return document.activeElement.tagName !== 'SUMMARY' ? document.activeElement.click() : undefined; // Browser keyboard navigation enter acts as click

    // Escape
    if(event.key === "Escape") {
        if(equipWaiting !== -1) cancelToolEquip(); // Cancel tool equip
        else if(menuOpen()) closeDialog(); // Close menu
        else if(document.activeElement !== elInfoDropdown) elInfoDropdown.focus();
        else elInfoDropdown.blur();
    }

    if(menuState.prestige && event.key === "Enter") openDialog(...dialog.prestige_confirm);

    // KEYBIND HANDLER
    let state = 'keyup';
    if(event.ctrlKey || event.metaKey) return; // Ignore if CTRL or meta key was held
    let key = interpretKey(event.key);

    // Custom keybinds
    if(keyWaiting[0]) return doneKeybind(key, true);

    // Keyboard combos //
    //#region 
    keyCombo += key + ' ';
    if(keyCodes.includes(keyCombo)) keyComboHandler(keyCodes.indexOf(keyCombo));

    /** Keyboard combo detector */
    function keyComboHandler(combo) {
        console.log(`keyComboHandler(${combo})`);
        keyCombo = '';
        keyTrigger[combo] = true;
        keyCodesCode[combo](); // Reward
    }

    // Check if string is on track to be correct or not
    for(combo of keyCombo) {
        for(code of keyCodes) {
            if(combo === code) {
                keyCombo = '';
                break;
            }
        }
    }
    //#endregion

    // Stop if keybinds need to be ignored
    if(
        !settings.enable_keybinds
        || menuState.dialog
        || document.activeElement.nodeName === 'TEXTAREA'
        || document.activeElement.nodeName === 'INPUT'
        || menuOpen()
    ) return;

    // Multibuy
    if(key === settings.keybinds['key_multibuy'] && state === 'keyup') multibuySpin();
    // Carrot click
    if(key === settings.keybinds['key_carrot']) {
        carrotClick(false, false, 1);
        keyCarrotFiring = false;
        holdStop();

        // Prevent spacebar scrolling (for some reason this works even if the parent if statement resolves to false)
        if(key === "Spacebar") event.preventDefault();
    }

    //Level up
    else if(key === settings.keybinds['key_bill_lvlup']) {
        if(equipWaiting !== -1) { // Waiting to equip
            equipTool(Boomer_Bill, equipWaiting, multibuy[mbsel]);
            cancelToolEquip()
        }
        else levelUp(Boomer_Bill, multibuy[mbsel]); // Level up
    }
    else if(key === settings.keybinds['key_belle_lvlup']) {
        if(equipWaiting !== -1) { // Waiting to equip
            equipTool(Belle_Boomerette, equipWaiting, multibuy[mbsel]);
            cancelToolEquip();
        }
        else levelUp(Belle_Boomerette, multibuy[mbsel]); // Level up
    }
    else if(key === settings.keybinds['key_greg_lvlup']) {
        if(equipWaiting !== -1) { // Waiting to equip
            equipTool(Gregory, equipWaiting, multibuy[mbsel]);
            cancelToolEquip();
        }
        else levelUp(Gregory, multibuy[mbsel]); // Level up
    }

    // Tools
    else {
        for(i = 0; i <= 5; i++) {
            // Craft
            if(key === settings.keybinds[`key_craft_${i}`] && !event.altKey) createTool(i, multibuy[mbsel]);
            // Equip
            else if(key === settings.keybinds[`key_craft_${i}`] && event.altKey) {
                if(Gregory.Hoes[i] < 1) return;
                equipToastID = toast('Equipping Tool', 'Press a character\'s upgrade key to equip. Press escape to cancel.', '', true, false, false, true, () => { cancelToolEquip() }, 'Cancel');
                equipWaiting = i;
            }
        }
    }

    // Close all Toasts
    if(key === settings.keybinds['key_cleartoasts']) {
        event.preventDefault();
        clearToasts(false);
    }
    
    // Settings and prestige
    else if((key=="Backspace" || key=="Delete") && isDebug()) {
        event.preventDefault();
        openDialog(...dialog.clearsave);
    }

    // Menus
    else if(key === settings.keybinds['key_tips_menu'])         openTipsMenu();
    else if(key === settings.keybinds['key_prestige'])          openPrestigeMenu();
    else if(key === settings.keybinds['key_themes'])            themeSwitcher();
    else if(key === settings.keybinds['key_cosmetics'])         cosmeticSwitcher();

    // Tripane
    else if(key === settings.keybinds['key_pane_achievements']) panelChange(`achievements-panel`);
    else if(key === settings.keybinds['key_pane_statistics'])   panelChange(`stats-panel`);
    else if(key === settings.keybinds['key_pane_settings'])     panelChange(`settings-panel`);

    // Settings
    else if(key === settings.keybinds['key_full_numbers']) {
        let element = dom('full_numbers');
        element.checked = !element.checked
        setting('full_numbers', true);
    }

    // Inventory
    // else if(key === settings.keybinds['key_inventory']) {
    //     if(!inventoryOpen) openInventory();
    //     else closeDialog();
    // }
});


/*---------------------Keybinds---------------------*/
//#region

var keyCombo = '';
const keyCodes = [
    'ArrowUp ArrowUp ArrowDown ArrowDown ArrowLeft ArrowRight ArrowLeft ArrowRight B A Enter ',
    'G A M I N G ',
    'J J C V I P ',
    'P I N E A P P L E ',
    'H U H W H U H ',
    'C O N F E T T I ',
    'B O R I N G ',
];
const keyCodesCode = {
    0: () => { mouseConfetti([24,24], confettiColors, 300); },
    1: () => {
        setTheme('theme_retro');
        mouseConfetti([24,24], ['gray'], 300);
    },
    2: () => {
        openDialog(...dialog.jjcvip);
        // mouseConfetti([24,24], ccCarrot, 600);
    },
    3: () => { setCosmetic('farmable', 'pineapple'); },
    4: () => {
        toast('huh', 'huh whuh', 'blue', true);
        unlock('cosmetic', 'huhwhuh', 'farmable');
        setCosmetic('farmable', 'huhwhuh');
    },
    5: () => {
        // toast('Confetti?', '', '', true, false, false, false, () => {
        //     randomConfetti();
        // }, 'Confetti!');
        randomConfetti();
        document.onclick = randomConfetti;
        
        /** Create confetti with randomized colors */
        function randomConfetti() {
            let hex = '0123456789abcdef';
            // mouseConfetti([64,64], ['orange', 'teal', 'coral', 'goldenrod', 'whitesmoke'], 600);
            let c = '#';
            let cs = [];
            // Loop across number of colors
            for(i = 0; i < 5; i++) {
                // Loop across individual characters
                for(ii = 0; ii < 6; ii++) { c += hex[r(16) + 1]; }
                cs.push(c);
                c = '#';
            }
            mouseConfetti([40,50], cs, 400);
        }
    },
    6: () => {
        setTheme('theme_dark');
        setCosmetic('bundle', 'default');
    },
}
// Variable achievement(s) test for
var keyTrigger = [];
var easterEgg = 0;
function eggUp() {
    easterEgg += easterEgg < 101 ? 1 : 0;
    mouseConfetti([1, easterEgg === 101 ? 2 : Math.floor(easterEgg/5)], ccCarrot);
    if(easterEgg === 100) mouseConfetti([24,24], confettiColors, 300, 4, true);
}
var equipWaiting = -1;
var equipToastID = false;

/** Cancel tool equip */
function cancelToolEquip() {
    equipWaiting = -1;
    closeToast(equipToastID);
}



// Custom Keybinds
var keyWaiting = [false, 'none'];
var keyWaitingToast;
/** Awaits the next key press to use as keybind */
function detectKey(bind) {
    keyWaiting = [true, bind];
    keyWaitingToast = toast(
        'Change keybind', `Press a key for "${bind}"`, '',
        true, true, false, true,
        () => { doneKeybind('none', false); }, 'Cancel'
    );
}
/** Runs when keybind is set or cancelled */
function doneKeybind(key, set=true) {
    let element = dom(keyWaiting[1]);
    if(key === 'Escape') key = 'Not set';
    element.blur();
    closeToast(keyWaitingToast);

    // Set and reset
    if(set) {
        element.innerText = key;
        setKeybind(keyWaiting[1], key);
    }
    keyWaiting = [false, 'none'];

    /** Sets the keybind */
    function setKeybind(action, key) {
        console.log(`[Settings] Set ${action} to key: ${key}`)
        settings.keybinds[action] = key;
        saveSettings();
    }
}


/** Returns user-friendly keybind names when given event.key */
function interpretKey(key) {
    return key === ' ' ? 'Spacebar' : capitalizeFL(key);
}
//#endregion



// Test achievement conditions every 5 seconds
setInterval(() => {
    for(let i = 0; i < achievementsKeys.length; i++) {
        let key = achievementsKeys[i];
        if(achieveQuery(key)) continue; // Skip if already unlocked
        evaluateConditions(key); // Evaluate
    }
}, 3000);

/** Achievement conditions evaluator */
function evaluateConditions(key) {
    let achievement = achievements[key];
    let multicondition = Array.isArray(achievement.conditions[0]);
    var multiamount = 1;
    var multifulfilled = 0;
    
    // One condition
    if(!multicondition) tests(key, achievement.conditions);
    // Multiple conditions
    else if(multicondition) {
        // Amount that need to be fulfilled
        multiamount = achievement.hasOwnProperty('condition_amount') ? achievement.condition_amount : achievement.conditions.length;
        for(let i = 0; i < achievement.conditions.length; i++) tests(key, achievement.conditions[i]);
    }

    // Run tests
    function tests(key, conditions) {
        let variable = Function(`return ${conditions[0]}`)();
        let requirement = conditions[1];
        // Grant achievement if reached requirement
        if(variable >= requirement) {
            multifulfilled++;
            if((multicondition && multiamount <= multifulfilled) || !multicondition) grantAchievement(key);
        }
    }
}

/** Takes in an achievement and grants rewards */
function rewardBreakdown(achieve, retroactive=false) {
    let reward = achieve?.reward;
    if(reward === undefined) return;
    if(Array.isArray(reward)) { // Check if there are multiple rewards
        for(let i = 0; i < reward.length; i++) giveReward(reward[i], retroactive);
    } else giveReward(reward, retroactive);

    /** Reward user */
    function giveReward(reward, retroactive=false) {
        // console.log(reward);
        let [rewardType, rewardName] =
        typeof reward === 'string' || reward instanceof String ? reward.split(':') : ['function', reward];
        if(!reward || retroactive && (rewardType === 'cash' || rewardType === 'function' || rewardType === 'character')) return;

        // Give
        if(rewardType === 'theme') unlock(rewardType, rewardName); // Theme reward
        else if(rewardType === 'cosmetic') { // Cosmetic reward
            let [target, cosmetic] = rewardName.split('/');
            unlock(rewardType, cosmetic, target);
        }
        else if(rewardType === 'shop') { // Carl shop
            let [target, item] = rewardName.split('/');
            console.error("shop_item", item, target, reward);
            unlock("shop_item", item, target, reward);
        }
        else if(rewardType === 'cash') earnCash(parseInt(rewardName), 'achievement'); // Cash reward
        else if(rewardType === 'function') rewardName(); // Function reward
        else if(rewardType === 'character') { // Character reward
            console.log('Character unlocked: ' + rewardName);
            unlock('character', rewardName);
        }
    }
}

/** Grant Achievement (Takes in object key) */
function grantAchievement(key) {
    if(achieveQuery(key)) return console.warn(key + ' achievement already unlocked');

    let achieve = achievements[key];

    // Notification
    console.log(`Achievement earned: ${achieve.name} (${key})`);
    if(achieve.internal !== true && achieve.hide_toast !== true && player.flags['no_achievement_toasts'] !== true) {
        toast('', '', '', false, false, key);
    }

    player.achievements[key] = Date.now(); // Add achievement to player.achievements
    if(achieve.internal) player.internal++;
    if(achieve.reward !== false) rewardBreakdown(achieve); // Check if there is an award to give

    // Give pages
    if(achieve.pages !== false && achieve.pages !== null) {
        player.pages += achieve.pages;
        pagesCount();
    }

    // Update achievement list
    achieveHTMLupdate = true;
    if(currentPanel === "achievements-panel") populateAchievements(key);

    // Update page
    updateMainIcon();
}

/** Unlock themes, cosmetics, characters, etc */
function unlock(type, thingToUnlock, subtype, raw) {
    if(isUnlocked(type, thingToUnlock, subtype)) return console.warn(`${type}:${subtype ? '/'+subtype : ''}${thingToUnlock} is already unlocked`);

    // Theme
    if(type === 'theme') {
        player.themes.push(thingToUnlock);
        newIndicator(true, 'theme');
        themesHTMLupdate = true;
        populateThemeList();
    }
    // Cosmetic
    else if(type === 'cosmetic') {
        // For bundles
        if(subtype === 'bundle') {
            console.log('Unlocking a cosmetic bundle! ' + subtype + thingToUnlock);

            // Loop across subtypes and unlock all relevant cosmetics
            for(let t = 0; t < cosmeticsKeys.length; t++) {
                let key = cosmeticsKeys[t];
                if(key === 'bundle') continue;

                let target = cosmetics[key];
                // Loop through cosmetics
                for(let c = 0; c < target['keys'].length; c++) {
                    if(target[ target['keys'][c] ].group === thingToUnlock) unlock('cosmetic', target.keys[c], key);
                }
            }

        }

        player.cosmetics[subtype].push(thingToUnlock);
        cosmeticHTMLupdate = true;
        populateCosmeticsList();
        newIndicator(true, 'cosmetic');
        playerCosmeticsCount();

        // Auto equip
        if(settings.cosmetic_auto_equip) setCosmetic(subtype, thingToUnlock);
    }
    // Character
    else if(type === 'character') {
        let charbox = dom(`${thingToUnlock}_box`);
        if(!characterQuery(thingToUnlock)) charbox.classList.add('char_anim');
        player.characters[thingToUnlock] = subtype || true;
        charbox.classList.remove('char_locked');
        elBody.classList.add(`c_${thingToUnlock}`);

        if(Object.keys(player.characters).length >= chars.length) dom('more_chars_tooltip').classList.add('char_locked');
        setTimeout(updateAllTools, 10);
    }
    // Carl shop item
    else if(type === 'shop_item') {
        // Make available
        const thing = subtype === 'cosmetic' ? `${raw.split('/')[1]}/${raw.split('/')[2]}`: thingToUnlock;
        try {
            Carl.shop['cosmetic'][thing].available = true;
            console.log(`[Shop] New ${subtype}: "${thing}" now available (Carl)}`);
        }
        catch (error) { console.warn(error); }

        if(settings.carl_shop_toasts && characterQuery('carl')) toast('', 'Carl: A new item is now available', '', false, true);
        populateCarl();
    }
    else if(type === 'trinket') {
        try {
            Jared.data[thingToUnlock].available = true;
            populateJared();
        } catch (error) {console.warn(`[Unlock] Trinket "${thingToUnlock}" doesn't exist`); }   
    }
}

/** Carl buy item */
function buyCarl(type, item, subtype = false) {
    let raw = item;

    // Fix input data for cosmetics
    if(type[type.length - 1] === 'c') {
        type = 'cosmetic';
        [subtype, item] = item.split('/');
    };

    // Check if already unlocked or bought
    if(isUnlocked(type, item, subtype) || Carl.shop[type][raw].bought) {
        console.warn(`${type}:${subtype !== false ? '/'+subtype : ''}${item} is already unlocked`);
        toast('Whoops', 'You already own this', '', false, true);

        Carl.shop[type][raw].bought = true;
        return populateCarl();
    }

    // Check if Carl is unlocked
    let carlListing = Carl.shop[type][raw];
    let defaultCarlListing = Default_Carl.shop[type][raw];
    if(!characterQuery('carl') || !carlListing.available) return;

    // Currency: Cash
    if(defaultCarlListing.currency === 'cash') {
        // Buy
        if(player.cash >= defaultCarlListing.price) {
            player.cash -= defaultCarlListing.price;
            Carl.shop[type][raw].bought = true;
            unlock(type, item, subtype);

            cashCount(false);
            // toast('', `Item bought: ${raw} (${type})`, '', false, true);

            let element = dom(`carl_shop_${raw}`)
            element.classList.add('shop_out');
            setTimeout(() => {
                populateCarl();
            }, 170);
        }
        // Can't afford
        else {
            toast('Can\'t Afford', `Carl wouldn\'t dare let this piece go for less than ${defaultCarlListing.price} coins`, '', false, true);
        }
    } else {
        toast('other currency', 'other currencies aren\'t supported yet');
    }
}

/** Buy Trinket  */
function buyTrinket(id) {
    if(characterQuery('jared') !== true) return;
    let item = jaredShop[id];
    let data = Jared.data[id];
    let price = item.price[data.level];
    if(!data.available || price > player.cash || item.currency !== 'cash' || data.level >= item.price.length) return;

    // Upgrade
    player.cash -= price;
    data.level++;
    data.value = item.value[data.level];

    // Store completion value
    player.trinket_completion = trinketCompletion();
    
    // Update page
    populateJared(id);
    cashCount(false);
    mouseConfetti([3,3], ccWhite, 150, 1);
    if(item.update) item.update();

    /** Calculates and returns completion (#/#) of trinkets */
    function trinketCompletion() {
        let keys = jaredShop.keys;
        let comTotal = 0;
        let maxTotal = 0;
        for(i = 0; i < keys.length; i++) {
            let key = keys[i];
            comTotal += Jared?.data[key]?.level;
            maxTotal += jaredShop[key].price.length;
        }
        return `${comTotal}/${maxTotal}`;
    }
}

/** Test if a character is unlocked */
function characterQuery(char) { return player.characters[char]; }
/** Test if all characters are unlocked */
function allCharQuery() {
    let c = 0;
    for(i=0; i<chars.length; i++) { if(characterQuery(chars[i])) c++; }
    if(c === chars.length) return true;
    return false;
}

/** Test if player has an achievement - True = yes, False = no */
function achieveQuery(key) {
    if(player.achievements[key] !== undefined) return true;
    return false;
}

/** Test if theme is unlocked or not: params example: 'cosmetic', 'biker_bill', 'bill' */
function isUnlocked(type = 'theme', key, subtype) {
    // Theme
    if(type === 'theme' && player.themes.includes(key)) return true;
    // Cosmetic
    else if(type === 'cosmetic') {
        let list = player.cosmetics[subtype];
        if(list.includes(key)) return true;
    }
    else if(type === 'shop_item') return carlShopQuery(subtype, key);
    return false;
}

/** Fill out keybinds menu */
function populateKeybinds() {
    for(i = 0; i < settings.keybinds.keys.length; i++) {
        let keybindName = settings.keybinds.keys[i];
        let key = settings.keybinds[keybindName];
        if(dom(keybindName) !== null) {
            let element = dom(keybindName);
            element.innerHTML = interpretKey(key);
        }
    }
}

/** Reset keybinds to defaults */
function resetKeybinds() {
    settings.keybinds = JSON.parse(JSON.stringify(keybinds_default));
    saveSettings();
    populateKeybinds();
    toast('Settings', 'Keybinds set to defaults', '', false, true);
}

var hashlist;
/** Returns true if game is in debug or developer mode */
function isDebug() { if(hashlist.includes('dev') || player.flags['debug']) return true; }

// URL hashes
(() => {
    onhashchange = hash;
    function hash() {
        hashlist = location.hash.substring(1).split('#');

        // Mute
        if(hashlist.includes('automute') || hashlist.includes('mute')) {
            elEnableSounds.checked = false;
            settingSounds(false);
        }
        // Dev tools
        if(isDebug()) {
            player.flags['cookies_accepted'] = true; // Auto-accept cookie notice
            seeButton('hardmode'); // Feature in development

            // Register cheat functions globally
            //#region
            window.allCharacters = () => {
                for(let ci = 0; ci < chars.length; ci++) unlock('character', chars[ci], true);
                toast('', 'Devtools: All Characters now available');
                populateJared();
            }
            window.allAchievements = () => {
                for(let i = 0; i < achievementsKeys.length; i++) grantAchievement(achievementsKeys[i]);
                toast('', 'Devtools: All Achievements now unlocked');
            }
            window.allThemes = () => {
                for(let i = 0; i < themesKeys.length; i++) unlock('theme', themesKeys[i]);
                toast('', 'Devtools: All Themes now available');
            }
            window.allCosmetics = () => {
                for(let t = 0; t < cosmeticsKeys.length; t++) {
                    let key = cosmeticsKeys[t];
                    let target = cosmetics[key];

                    // Loop through cosmetics
                    for(let c = 0; c < target['keys'].length; c++) unlock('cosmetic', target.keys[c], key);
                }
                toast('', 'Devtools: All Cosmetics now available');
            }
            window.allTrinkets = () => {
                unlock('character', 'jared', true);
                let keys = jaredShop.keys;
                for(i = 0; i < keys.length; i++) {
                    let key = keys[i];
                    let item = jaredShop[key];
                    let data = Jared.data?.[key];
                    if(data === undefined) continue;
                    let prices = item.price;
                    data.level = prices.length;
                    data.value = item.value[data.level];
                }
                populateJared();
                toast('', 'Devtools: All Trinkets now maxed');
            }
            window.allTips = () => {
                player.flags['all_tips'] = true;
                populateTipsMenu();
                toast('', 'Devtools: All Tips now visible');
            }
            window.allPrestige = () => {
                let l = player.lifetime.prestige_count
                l = l === 0 ? 1 : l;
                player.prestige_available = true;
                seeButton('prestige');
                showPrestigeStats()
            }
            window.allUnlocks = () => {
                allCharacters();
                allAchievements();
                allThemes();
                allCosmetics();
                allTrinkets();
                allTips();
            }
            window.updateValues = event => {
                // Carrots
                let cc = parseInt(setCarrotsEl.value);
                player.carrots          = 0;
                player.lifetime.carrots = 0;
                player.prestige.carrots = 0;
                earnCarrots(cc);
                // Cash
                if(setCashEl.value !== '') {
                    let coinc = parseInt(setCashEl.value);
                    player.cash          = 0;
                    player.lifetime.cash = 0;
                    earnCash(coinc);
                }
                // Golden carrots
                if(setGoldenCarrotsEl.value !== '') {
                    let gcc = parseInt(setGoldenCarrotsEl.value);
                    player.golden_carrots = gcc
                    updateGC();
                    updateCharlesShop();
                }

                // Levels
                for(li = 0; li < levelable.length; li++) {
                    let character = levelable[li];
                    let nick = character.nickname;
                    let v = parseInt(elCharacterLevel[nick].value.split(',').join(''));
                    if(typeof v === "number" && !Number.isNaN(v) && v <= 1000 && v >= 0) {
                        character.lvl = v;
                    } else toast('Invalid level', 'Must be a number, and must be no more than 1000', 'error');
                }
                recalculateCarrotsPer();
                characterPrices();
                characterButtons();
                updateAllTools();
            }
            //#endregion
            
            // Register savedata functions globally
            //#region 
            window.importSave = () => {
                let imported = dom('import_export').value;
                // Textarea is empty
                if(imported === '') return toast('Savedata manager', 'Please input exported savedata', '', false, true);
                imported = imported.split('//+//');
                try {
                    for(let i = 0; i < saveListKeys.length; i++) {
                        let key = saveListKeys[i];
                        let obj_import = JSON.parse(imported[i]);
                        saveList[key] = obj_import;
                    }
                    saveGame();
                    setTimeout(() => { location.reload(); }, 50); // Reload after a delay
                } catch (error) {
                    console.error(error);
                    toast('Import error', error, 'error');
                }
            }
            window.exportSave = () => {
                let exported = '';
                for(let i = 0; i < saveListKeys.length; i++) {
                    let key = saveListKeys[i];
                    let obj = saveList[key];
                    exported += JSON.stringify(obj);
                    if(i === saveListKeys.length - 1) break;
                    exported += '//+//';
                }
                dom('import_export').value = exported;
            }
            window.optionDebugUpdate = () => {
                player.flags.debug_dont_autoupdate = !(dom('debug_dont_autoupdate').checked);
                toast('Flag set', `\ndebug_dont_autoupdate = ${player.flags.debug_dont_autoupdate}`, '', false, true);
            }
            //#endregion

            // Put dev panel in settings
            $('#devp').innerHTML = /* html */
            `<div style="">
                <div class="footer_bottom brown_darker_color">
                    <style type="text/css">
                        #devp > div { width: 100%; max-width: 550px; float: right; margin-top: -96px; }
                        #devp > div > div { display: block; padding: 12px 20px; margin-left: 32px; }
                        .unlock_buttons { width: 100%; max-width: 400px; }
                        .unlock_buttons button { width: 100%; margin-right: 4px; }
                        @media only screen and (max-width: 1200px) {
                            #devp > div { width: 100%; max-width: unset; float: unset; margin: 0; }
                            #devp > div > div { display: block; padding: 12px 20px; margin-left: 0; margin-bottom: 24px; }
                        }
                    </style>

                    <b style="font-size: 18pt; color: rgb(255, 161, 53)">Dev Tools</b><br>
                    <button onclick="clearSave()" class="button_red">Quick Reset</button>

                    <h4>Unlock all</h4>
                    <div class="unlock_buttons">
                        <div class="flex">
                            <button onclick="allUnlocks()">Everything</button>
                            <button onclick="allCharacters()">Characters</button>
                            <button onclick="allAchievements()">Achievements</button>
                        </div>
                        <div class="flex">
                            <button onclick="allThemes()">Themes</button>
                            <button onclick="allCosmetics()">Cosmetics</button>
                            <button onclick="allTrinkets()">Trinkets</button>
                        </div>
                        <div class="flex">
                            <button onclick="allTips()">Tips</button>
                            <button onclick="allPrestige()">Show prestige</button>
                        </div>
                    </div>
                    
                    <h4>Set Values</h4>
                    <table>
                        <tr>
                            <td>
                                <label for="setCarrot">Carrots:</label>
                            </td>
                            <td>
                                <input id="setCarrot" class="dev_input" type="number" value="500000">
                            </td>
                            <td id="setCarrotRounded" class="secondary_text"></td>
                        </tr>

                        <tr>
                            <td>
                                <label for="setGoldenCarrot">Golden Carrots:</label>
                            </td>
                            <td>
                                <input id="setGoldenCarrot" class="dev_input" type="number">
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <label for="setCash">Coins:</label>
                            </td>
                            <td>
                                <input id="setCash" class="dev_input" type="number" value="9999">
                            </td>
                        </tr>
                    </table>
                    <button onclick="updateValues()">Update Values</button>
                    
                    <h4>Save data management</h4>
                    <label for="debug_dont_autoupdate">
                    <input type="checkbox" name="debug_dont_autoupdate" id="debug_dont_autoupdate" ${!player.flags.debug_dont_autoupdate || player.flags.debug_dont_autoupdate === undefined ? 'checked' : ''}
                    onclick="optionDebugUpdate()">
                        Auto-update save while in debug mode
                    </label><br/>
                    <textarea name="import_export" id="import_export" cols="40" rows="3" style="max-width: 100%; min-width: 100%;" onclick="this.focus();this.select()"></textarea><br/>
                    <button onclick="exportSave()" style="width: 159px;">🠹 Export</button>
                    <button onclick="importSave()" style="width: 159px;">🠻 Import</button>
                </div>
            </div>`;

            window.setCarrotsEl       = dom("setCarrot");
            window.setGoldenCarrotsEl = dom("setGoldenCarrot");
            window.setCashEl          = dom("setCash");
            window.elSetCarrotRounded = dom('setCarrotRounded')

            // Enter key updates values
            document.querySelectorAll('.dev_input').forEach(element => {
                element.disabled = false;
                element.addEventListener('keyup', e => {
                    if(e.key === 'Escape' || e.key === 'Enter') document.activeElement.blur();
                    if(e.key === 'Enter') updateValues();
                });
            });

            // DisplayRounded preview
            setCarrotsEl.addEventListener('input', () => {
                if(setCarrotsEl.value === '') return;
                elSetCarrotRounded.innerText = `(${DisplayRounded(setCarrotsEl.value)})`;
            });
        }
        // Disable Annoying Notifications
        if(hashlist.includes('dan')) {
            player.flags['no_achievement_toasts'] = true;
            dom('tutorial_messages').checked = false;
            setting('tutorial_messages', false);
            dom('carl_shop_toasts').checked = false;
            setting('carl_shop_toasts', false);
        } else player.flags['no_achievement_toasts'] = false;

        // Console to toast
        if(hashlist.includes('log')) {
            window.clog = console.log;
            console.log = (...args) => { clog(args); toast('', '☰ ' + Array.prototype.slice.call(args).join(', ')); }
            window.cwarn = console.warn;
            console.warn = (...args) => { cwarn(args); toast('', '⚠ ' + Array.prototype.slice.call(args).join(', ')); }
            window.cerror = console.error;
            console.error = (...args) => { cerror(args); toast('', '⛔ ' + Array.prototype.slice.call(args).join(', ')); }
        } else if(typeof clog === 'function') [console.log, console.warn, console.error] = [clog, cwarn, cerror];

        // Update page
        updateMainIcon();
    }
    hash();
})();


/* --------------- On page load --------------- */
// Runs on startup, after JS is loaded
(() => {
    // console.log('Running onLoad');

    // Flag for early playtesters
    // player.flags['playtest'] = true;

    /* --------------- PLAYER OBJECT --------------- */
    // player object compatibility check (because of the way the player object is created and saved, any new properties added to the player template will not carry over)

    // List of objects that need to be updated. "Objects Need Updating (onu)"
    //#region 
    var onu = [
        player,
        player.prestige,
        player.lifetime,
        player.cosmetics,
        
        settings,
        settings.cosmetics,
        settings.keybinds,

        Boomer_Bill,
        Belle_Boomerette,
        Gregory,

        Charles,
        Charles.improveWorkingConditions,
        Charles.decreaseWages,
        Charles.betterHoes,

        Carl,
        Carl.shop,
        Carl.shop.theme,
        Carl.shop.cosmetic,

        Jared,
        Jared.data,
    ];
    var onu_templates = [
        default_player,
        playerPrestigeTemplate,
        default_player.lifetime,
        default_player.cosmetics,

        default_settings,
        default_settings.cosmetics,
        keybinds_default,

        Default_Boomer_Bill,
        Default_Belle_Boomerette,
        Default_Gregory,

        Default_Charles,
        Default_Charles.improveWorkingConditions,
        Default_Charles.decreaseWages,
        Default_Charles.betterHoes,

        Default_Carl,
        Default_Carl.shop,
        Default_Carl.shop.theme,
        Default_Carl.shop.cosmetic,

        Default_Jared,
        Default_Jared.data,
    ];
    //#endregion
    if(default_player.data_version > player.data_version || isDebug() && !player.flags.debug_dont_autoupdate) {
        try {
            // Changelog toast
            if(!isDebug())
             toast('Update Beta 1.17.4', '- Added a "Time Played" statistic<br/>- Balance changes & bug fixes<br/><br/><a href="https://www.notkal.com/posts/carrot-clicker-changelog/#dev-beta-1_17_4">Full changelog</a>', undefined, true,);

            // Loop through onu_templates array
            //#region 
            for(oi = 0; oi < onu_templates.length; oi++) {
                let obj = onu[oi];
                let template = onu_templates[oi];
    
                // Loop through template
                let template_keys = Object.keys(template);
                for(i = 0; i < template_keys.length; i++) {
                    let key = template_keys[i];
                    if(!obj.hasOwnProperty(key)) {
                        console.log(key + ' property not found, updating save...');
                        obj[key] = JSON.parse(JSON.stringify(template[key]));
                    }
                }
            }
            //#endregion
    
            // Achievements
            //#region 
            let pagesIntended = 0;
            for(let i = 0; i < achievementsKeys.length; i++) {
                let key = achievementsKeys[i];
                let achieve = achievements[key];

                // Page count
                if(achieveQuery(key) && achieve.pages !== false && achieve.pages !== null) pagesIntended += achieve.pages;

                // Check that the player has recieved all achievement rewards
                let reward = achieve.reward;
                if(achieveQuery(key) && reward !== false) rewardBreakdown(achieve, true);
            }
            // Check that the players' page count is correct
            if(player.pages !== pagesIntended) {
                console.log('Achievement page rewards have been changed');
                let toaster = toast(
                    'Page Rewards Changed',
                    `The page rewards for completing achievements have been changed. Your page count has been updated to reflect those changes (${player.pages} -> ${pagesIntended})`, 'orange',
                    true, false, false, true, () => { closeToast(toaster); }, 'Got it'
                );
                player.pages = pagesIntended;
            }
            //#endregion

    
            // Done
            console.log(`Player object has been updated (Version ${player.data_version} -> ${default_player.data_version})`);
            if(isDebug() && player.data_version !== default_player.data_version) {
                toast('', `Player object has been updated (Version ${player.data_version} -> ${default_player.data_version})`, '', true);
            }

            player.data_version = default_player.data_version;
            saveGame();
        } catch (error) {
            console.warn('An object update was attempted but failed. Error info below:');
            console.error(error);
            toast('Save file update failed', 'If you run into any issues you may have to delete your save.', 'error', true);
        }

    }



    /* --------------- SETTINGS --------------- */
    // Set default settings if not found in localstorage
    //#region 

    // Enable unlocked characters
    for(i = 0; i < chars.length; i++) {
        let key = chars[i];
        let value = player.characters[key];
        if(characterQuery(key)) unlock('character', key, value);
    }

    // Achievement list CSS
    achieveCompactMode(settings.compact_achievements);
    achieveGridMode(settings.achievements_grid);

    // Set user theme on page load
    if(settings.theme !== 'theme_dark') {
        let theme = settings.theme;
        setTheme(theme);
    }
    // Set user cosmetics on page load
    for(let i = 1; i < cosmeticsKeys.length; i++) {
        if(settings.cosmetics[ cosmeticsKeys[i] ] === 'default') continue;
        setCosmetic(cosmeticsKeys[i], settings.cosmetics[ cosmeticsKeys[i] ]);
    }
    // Switch to previously open panel on page load
    if(settings.openpanel !== null) panelChange(settings.openpanel, true);

    // Set cosmetics grid mode
    if(settings.cosmetics_grid) {
        cosmeticsView.value = 'grid';
        cosmeticsGridMode();
    }
    // Restart unfinished crafting job (Greg)
    if(Gregory.crafting !== false) {
        console.log('[Greg] Restarting unfinished craft job');
        try { createTool(...Gregory.crafting); }
        catch (error) { console.error(error); }
    }
    // Disable bottom nav
    if(!settings.show_nav) elBody.classList.add('hide_nav');
    
    // OFFLINE EARNINGS
    // Doesn't work, Date.now() is imprecise
    // if(player.time_last_saved !== false) {
    //     // Convert to seconds
    //     let ls = (player.time_last_saved / 1000).toFixed(0);
    //     let now = (parseInt(JSON.stringify(Date.now())) / 1000).toFixed(0);
    //     console.log(ls, now);
    //     let difference = now - ls;
    //     let earned = difference * player.cps;
    //     toast('Offline Earnings', `${difference} seconds\n${earned} carrots`);

    //     player.time_last_saved === false;
    // }

    //#endregion
    
    // Figure out how many achievements aren't hidden
    for(let i = 0; i < achievementsKeys.length; i++) {
        let key = achievementsKeys[i];
        let achievement = achievements[key];
        if(achievement.internal) { internalAchievements++; continue; };
        if(achievement.hide_list) hiddenAchievements++;
        if(achievement.style === 'challenge') challengeAchievements++;
    }

    // Populate achievements if said tab is open
    if(currentPanel === "achievements-panel") populateAchievements();

    /* --------------- TUTORIAL --------------- */
    // Cookie usage notification
    if(player.flags['cookies_accepted'] !== true) {
        let cookieToast = toast(
            'Cookies & Privacy',
            'By clicking accept you agree to the usage of cookies to save your progress. If you choose not to click accept your progress will not be saved. <a href="https://www.notkal.com/about/#privacy">Privacy Policy</a>',
            'purple', true, false, false, true,
            () => {
                closeToast(cookieToast);
                player.flags['cookies_accepted'] = true;
                saveGame();
            }, 'Accept'
        );
    }
    // Initial Welcome
    if(player.flags.tutorial0 !== true) {
        toast("Welcome to Carrot Clicker!",
        "Click the carrot to farm. Spend your carrots on hiring/upgrading new workers. Eventually you will be able to buy them better tools to work with. Good luck!",
        "", true);
        player.flags.tutorial0 = true;
    }
    // Update notice
    // if(player.flags['v1.0_changelog'] !== true) {
    //     toast("Version 1.0 changelog", "Carrot Clicker 1.0 has been released. Read the changelog here:", "", true);
    //     player.flags['v1.0_changelog'] = true;
    // }

    /* -------------------- Fill out page -------------------- */
    populateKeybinds();
    fillSettingsPage();
    carrotCount();
    updateCPC();
    cashCount(false);
    characterPrices();
    characterButtons();
    updateCharlesShop();
    pagesCount(false);
    calculatePrestigePotential();
    updateAllTools();
    updateToolPrices();
    updateMainIcon();
    populateCarl();
    populateJared();
    if(player.new_theme) newIndicator(true, 'theme');
    if(player.new_cosmetic) newIndicator(true, 'cosmetic');
    if(player.prestige_available) seeButton('prestige'); // Prestige button visibility
    if(player.lifetime.prestige_count > 0) showPrestigeStats(); // Has prestiged before
})(); // Finished

loadCheck = true;