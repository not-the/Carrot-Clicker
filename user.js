/* -------------------------------------------------------------
Users settings, keybind handling, and tutorial handling
------------------------------------------------------------- */

/*---------------AUDIO HANDLING-------------------*/
//#region 
// Volume variable
var volume = 1;

/** Plays a sound from the sound folder
 * @param {*} file Filename
 * @param {*} path Only specify if file is outside of './assets/sounds/'
 * @returns 
 */
function playSound(file, path = './assets/sounds/') {
    if(settings.enableSounds == false) return;
    var audio = new Audio(path + file);
    audio.play();
}

// Play Music
var music;
function playMusic(file = 'music.m4a', loop = false, path='assets/music/') {
    // Return if sounds are disabled
    if(settings.enableSounds == false || settings.enableMusic == false) return;

    // Create
    music = new Audio(path + file);
    music.volume = volume;
    music.loop = loop;

    console.log('playMusic() - Playing track 1...');
    music.play();
}

function stopMusic() {
    if(!music) {
        console.log('stopMusic(): No music is playing');
        return;
    };
    music.pause();
    music.currentTime = 0;
}
//#endregion



/** Returns true if any menu or popup is open */
function menuOpen() {
    if(dialogOpen || themeSwitcherOpen || cosmeticSwitcherOpen /*|| keybindsMenuOpen*/ || prestigeMenuOpen || inventoryOpen || tipsMenuOpen || creditsOpen)
    { return true; }
    return false;
}



/*---------------OPTIONS-------------------*/

// Page variables


// Update the current slider value (each time you drag the slider handle)
elFunTipsSlider.oninput = () => {
    // Update percentage
    eInnerText(elFunTipsSlider_label, elFunTipsSlider.value);
    
    // Set modifier
    settings.fun_tip_percentage = parseInt(elFunTipsSlider.value);
    saveSettings();
}

/** Universal checkbox option updater (not used by everything because some options need extra code)
 * @param option Option to update
*/
function setting(option) {
    let state = dom(option).checked;
    console.log(`${option} set to ${state}`);

    toast("Settings", `${capitalizeFL(option.split('_').join(' '))} is now ${state == true ? 'enabled' : 'disabled'}`,
    '', false, true);

    settings[option] = state;
    saveSettings();

    if(option == 'compact_achievements') {
        achieveCompactMode(state);
    } else if(option == 'achievements_grid') {
        achieveGridMode(state);
    }
}


// Notification length
notificationLength.addEventListener('input', () => {saveOption('notificationLength')} );
function saveOption() {
    let value = parseInt(notificationLength.value);
    if(value >= 2 && value <= 15) {
        console.log(`[Settings] Notification length set to: ${value}`);
        settings.notificationLength = value;
        saveSettings();
        toast("Notification time set", `Notifications will disappear after ${value} seconds`,
        '', false, true);
    } else {
        toast("Invalid Number", "Must be between 2 and 15 seconds", "red", false, true);
    }
}
// Reset notification time to default
function resetOption(option = 'notificationLength') {
    let value = default_settings[option];
    settings[option] = value;
    notificationLength.value = value;

    saveSettings();
    toast("Notification time reset", `Notifications will disappear after ${value} seconds`,
    '', false, true);
}

// Autosave interval
// Intended to be universal but needs unique code so just leaving it as is
dom('autosave_interval').addEventListener('input', () => { settingText('autosave_interval') });
function settingText(option) {
    let value = dom(option).value;

    if(value == '') return;

    if(value >= 1 && value <= 60) {
        console.log(`[Settings] Autosave interval set to: ${value}`);

        settings.autosave_interval = value;
        saveSettings();

        toast("Autosave interval set", `Game will save every ${value} seconds`,
        '', false, true);

        // Update autosave variable
        clearInterval(autosave);
        autosave = setInterval(() => {
            saveGame();
        }, value * 1000);
    } else {
        toast("Invalid Number", "Must be between 1 and 60 seconds", "red", false, true);
    }
}
function resetAutosave() {
    let value = default_settings.autosave_interval;

    console.log(`[Settings] Autosave interval reset to: ${value}`);
    dom('autosave_interval').value = value;

    settings.autosave_interval = value;
    saveSettings();

    toast("Autosave interval reset", `Game will save every ${value} seconds`,
    '', false, true);

    // Update autosave variable
    clearInterval(autosave);
    autosave = setInterval(() => {
        saveGame();
    }, value * 1000);
}

// Disable keybinds setting

function settingDisableKeybinds() {
    let state = elDisableKeybinds.checked;
    console.log(`disableKeybinds set to ${state}`);
    toast("Settings", `Keybinds are now ${state == true ? 'disabled' : 'enabled'}`,
    '', false, true);

    // localStorage
    settings.disableKeybinds = state;
    saveSettings();
}

// Interface settings

// Main progress bar
function settingMainProgress() {
    let state = elEnableMainProgress.checked;
    console.log(`enableMainProgress set to ${state}`);
    toast("Settings", `Status bar progress is now ${state == true ? 'enabled' : 'disabled'}`,
    '', false, true);

    // localStorage
    settings.enableMainProgress = state;
    saveSettings();

    elMainProgressContainer.classList.remove('status_tidbit_in');
}


// Enable sounds
function settingSounds() {
    let state = elEnableSounds.checked;
    console.log(`enableSounds set to ${state}`);
    toast("Settings", `Sounds are now ${state == true ? 'enabled' : 'disabled'}`,
    '', false, true);

    // localStorage
    settings.enableSounds = state;
    saveSettings();

    optionSoundsDisable(state);
    settingMusic(true);
}


function settingMusic(noToast = false) {
    let state = elEnableMusic.checked;
    console.log(`enableMusic set to ${state}`);
    if(noToast == false) {
        toast("Settings", `Music is now ${state == true ? 'enabled' : 'disabled'}`,
        '', false, true);
    }

    // localStorage
    settings.enableMusic = state;
    saveSettings();

    // Start/Stop
    if(state == true) {
        playMusic();
    } else {
        stopMusic();
    }
}

// Carrot sounds
function settingCarrotSounds() {
    let state = elEnableCarrotSounds.checked;
    console.log(`enableCarrotSounds set to ${state}`);
    toast("Settings", `Carrot sounds are now ${state == true ? 'enabled' : 'disabled'}`,
    '', false, true);

    // localStorage
    settings.enableCarrotSounds = state;
    saveSettings();
}

// Volume slider
elVolumeMaster.oninput = () => {
    volumeSliderHandler(0);
}
volumeMasterDropdown.oninput = () => {
    volumeSliderHandler(1);
}

// Volume slider
function volumeSliderHandler(v) {
    let value;
    if(v == 0) {
        value = elVolumeMaster.value;
        volumeMasterDropdown.value = value;
    } else {
        value = volumeMasterDropdown.value;
        elVolumeMaster.value = value;
    }

    if(value == 0) {
        vmdImage.src = './assets/icons/mute.svg';
    } else if(vmdImage.src != './assets/icons/volume.svg') {
        vmdImage.src = './assets/icons/volume.svg';
    }

    volume = value / 100;

    if(music !== undefined) {
        music.volume = volume;
    }

    // Update percentage
    eInnerText(elVolumeMaster_label, value > 0 ? `${value}%` : 'OFF');

    settings.master_volume = value / 100;
    saveSettings();
}



/*------------EVENT LISTENERS--------------*/

// Key Down
var keyCarrotFiring = false;
document.addEventListener('keydown', event => {
    let key = event.key;
    if(key == " ") {
        event.preventDefault();
    }

    key = interpretKey(key);

    if(dialogOpen || menuOpen() || settings.disableKeybinds) return;
    if(key == settings.keybinds['key_carrot'] && keyCarrotFiring == false) {
        keyCarrotFiring = true;
        holdStart(false);
    }
});


// Key up (used for normal keybinds)
document.addEventListener('keyup', event => {
    // Close/Accept dialog
    if(dialogOpen) {
        if(event.key == "Escape"){
            closeDialog();
            if(equipWaiting != -1) { cancelHoeEquip(); }
        } else if(event.key == "Enter"){
            closeDialog(true);``
        }
        return;
    } else {
        if(event.key == "Escape" && equipWaiting != -1){
            cancelHoeEquip();
        }
    }
    // Close theme switcher
    if(menuOpen()) {
        if(event.key == "Escape"){
            closeDialog();
        } else if(prestigeMenuOpen && event.key == "Enter") {
            prestigeDialog();
        }
    }

    // When on main page send to keybind handler
    keybindHandler(event, 'keyup');
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
];
// Variable achievement(s) test for
var keyTrigger = [];
var easterEgg = 0;
function eggUp() {
    easterEgg += easterEgg < 101 ? 1 : 0;
    mouseConfetti([1, easterEgg == 101 ? 2 : Math.floor(easterEgg/5)], ccCarrot);
    if(easterEgg == 100) { mouseConfetti([24,24], confettiColors, 300); }
}
var equipWaiting = -1;
var equipToastID = false;

function keybindHandler(event, state) {
    // Ignore if CTRL or meta key was held
    if(event.ctrlKey == true || event.metaKey == true) return;

    let key = interpretKey(event.key);
    // console.log(key);
    // console.log(equipWaiting);



    // Custom keybinds
    if(keyWaiting[0] == true) {
        doneKeybind(key, true);
        return;
    }

    // Stop if keybinds need to be ignored
    if(
        settings.disableKeybinds == "true"
        || dialogOpen == true
        || document.activeElement.nodeName == 'TEXTAREA'
        || document.activeElement.nodeName == 'INPUT'
        || menuOpen()
    ) return;


    keyCombo += key + ' ';
    // Keyboard combos //
    //#region 
    for(let ci = 0; ci < keyCodes.length; ci++) {
        if(keyCombo == keyCodes[ci]) {
            keyComboHandler(ci);
        }
    }

    function keyComboHandler(combo) {
        console.log(`keyComboHandler(${combo})`);
        keyCombo = '';
        keyTrigger[combo] = true;

        // Reward
        switch(combo) {
            case 0:
                mouseConfetti([24,24], confettiColors, 300)
                break;
            case 1:
                setTheme('theme_retro');
                break;
            case 2:
                openDialog('Are you sure you want to CARROT?', 'All of your CARROT will be lost.', 'Carrot', 'button_orange', 'jjcvip');
                break;
            case 3:
                setCosmetic('farmable', 'pineapple');
                break;
            case 4:
                toast('huh', 'huh whuh', 'blue');
                unlock('huhwhuh', 'cosmetic', 'farmable');
                setCosmetic('farmable', 'huhwhuh');
                break;
        }
    }
    //#endregion

    // Check if string is on track to be correct or not
    for(i = 0; i < keyCombo.length; i++) {
        if(keyCombo[i] != keyCodes[0][i]
        && keyCombo[i] != keyCodes[1][i]
        && keyCombo[i] != keyCodes[2][i]
        && keyCombo[i] != keyCodes[3][i]
        && keyCombo[i] != keyCodes[4][i]) {
            keyCombo = '';
            break;
        }
    }
    //#endregion


    // Browser keyboard navigation enter acts as click
    if(key == "Enter"){
        let tag = document.activeElement.tagName;
        if(
            tag != 'SUMMARY'
        ) {
            document.activeElement.click();
        }
    }

    
    // End function if keybinds are disabled, a dialog box is open, or an input field is focused
    if(settings.disableKeybinds == "true" || dialogOpen == true || document.activeElement.id == 'notificationLength') return;

    // if(state != 'keyup') return;




    // Multibuy
    if(
        key == settings.keybinds['key_multibuy']
        && state == 'keyup')
    {
        multibuySpin();
    }
    // Carrot click
    if(key == settings.keybinds['key_carrot']) {
        onClick(false, 'click', 1);
        keyCarrotFiring = false;
        holdStop();

        // Prevent spacebar scrolling (for some reason this works even if the parent if statement resolves to false)
        if(key == "Spacebar") {
            event.preventDefault();
        }
    }

    //Level up
    else if(key == settings.keybinds['key_bill_lvlup']) {
        // Waiting to equip hoe
        if(equipWaiting != -1) {
            EquipHoe(Boomer_Bill, equipWaiting, multibuy[mbsel]);
            cancelHoeEquip()
        }
        // Level up
        else {
            LevelUp(Boomer_Bill, multibuy[mbsel]);
        }
    }
    else if(key == settings.keybinds['key_belle_lvlup']) {
        // Waiting to equip hoe
        if(equipWaiting != -1) {
            EquipHoe(Belle_Boomerette, equipWaiting, multibuy[mbsel]);
            cancelHoeEquip();
        }
        // Level up
        else {
            LevelUp(Belle_Boomerette, multibuy[mbsel]);
        }
    }
    else if(key == settings.keybinds['key_greg_lvlup']) {
        // Waiting to equip hoe
        if(equipWaiting != -1) {
            EquipHoe(Gregory, equipWaiting, multibuy[mbsel]);
            cancelHoeEquip();
        }
        // Level up
        else {
            LevelUp(Gregory, multibuy[mbsel]);
        }
    }

    // Tools
    else {
        for(i = 0; i <= 5; i++) {
            // Craft
            if(key == settings.keybinds[`key_craft_${i}`] && event.altKey == false) {
                // console.log(`key_craft_${i}: Craft`);
                CreateHoe(i, multibuy[mbsel]);
            }
            // Equip
            else if(key == settings.keybinds[`key_craft_${i}`] && event.altKey == true) {
                // console.log(`key_craft_${i}: Ready to equip hoe #${i}`);

                // No hoes
                if(Gregory.Hoes[i] < 1) return;

                equipToastID = toast('Equipping Hoe', 'Press a character\'s upgrade key to equip. Press escape to cancel.', '', true, false, false, true, () => { cancelHoeEquip() }, 'Cancel');
                equipWaiting = i;
            }
        }
    }

    // Close all Toasts
    if(key == settings.keybinds['key_cleartoasts']) {
        event.preventDefault();
        clearToasts(false);
    }
    
    // Settings and prestige
    else if((key=="Backspace" || key=="Delete") && isDebug()) {
        event.preventDefault();
        openDialog('Are you sure?', 'Your progress will be lost forever!', 'Delete Save Data', 'button_red', 'clearsave');
    }
    else if(key == settings.keybinds['key_prestige']) {
        openPrestigeMenu();
        // openDialog('Are you Sure you want to Prestige?', 'Your carrots, characters, and upgrades will be lost, but you will gain a permanent earnings boost.', 'Prestige', 'button_gold', 'prestige');
    }

    // Inventory
    // else if(key == settings.keybinds['key_inventory']) {
    //     // console.log('inventory');
    //     // openDialog('test', 'test');
    //     if(inventoryOpen == false) {
    //         openInventory();
    //     } else {
    //         closeDialog();
    //     }
    // }
}


function cancelHoeEquip() {
    equipWaiting = -1;
    closeToast(equipToastID);
}



// Custom Keybinds
var keyWaiting = [false, 'none'];
var keyWaitingToast;
function detectKey(bind) {
    keyWaiting = [true, bind];
    keyWaitingToast = toast(
        'Change keybind', `Press a key for "${bind}"`, '',
        true, true, false, true,
        () => { doneKeybind('none', false); }, 'Cancel'
    );
}
function setKeybind(action, key) {
    console.log(`[Settings] Set ${action} to key: ${key}`)
    settings.keybinds[action] = key;
    // console.log(action, key);
    saveSettings();
    // populateKeyConflicts();
}
function doneKeybind(key, set=true) {
    let element = dom(keyWaiting[1]);

    if(key == 'Escape') key = 'Not set';
    
    element.blur();
    closeToast(keyWaitingToast);

    // Set and reset
    if(set == true) {
        element.innerText = key;
        setKeybind(keyWaiting[1], key);
    }
    keyWaiting = [false, 'none'];
}


/** Returns user-friendly keybind names when given event.key */
function interpretKey(key) {
    if(key == ' ') return 'Spacebar';
    return capitalizeFL(key);
}
//#endregion



// Test achievement conditions every 5 seconds
setInterval(() => {
    for(let i = 0; i < achievementsKeys.length; i++) {
        let key = achievementsKeys[i];
        let achievement = achievements[key];

        if(achieveQuery(key)) continue; // Skip if already unlocked
        evaluateConditions(key, achievement); // Evaluate
    }
}, 1000);

/** Achievement Conditions evaluator */
function evaluateConditions(key, achievement) {
    let multicondition = Array.isArray(achievement.conditions[0]);
    var multiamount = 1;
    var multifulfilled = 0;
    
    // 1 condition
    if(!multicondition) {
        tests(key, achievement.conditions);
    }
    // Multiple conditions
    else if(multicondition) {
        // Amount that need to be fulfilled
        multiamount = achievement.hasOwnProperty('condition_amount') ? achievement.condition_amount : achievement.conditions.length;
        // Loop
        for(let i = 0; i < achievement.conditions.length; i++) {
            tests(key, achievement.conditions[i]);
        }
    }

    // Run tests
    function tests(key, conditions) {
        let variable =      Function(`return ${conditions[0]}`)();
        let requirement =   conditions[1];

        // Grant achievement if reached requirement
        // console.log(`${key}: ${variable} >= ${requirement}`);
        if(variable >= requirement) {
            multifulfilled++;
            if((multicondition && multiamount <= multifulfilled) || !multicondition) {
                grantAchievement(key);
            }
        }
    }
}

/** Takes in achievement and grants rewards */
function rewardBreakdown(achieve, retroactive = false) {
    // console.log(`rewardBreakdown(${achieve}, ${retroactive})`);
    let reward = achieve?.reward;
    if(reward == undefined) return;

    // Check if there are multiple rewards
    if(Array.isArray(reward) == true) {
        for(let i = 0; i < reward.length; i++) {
            giveReward(reward[i], retroactive);
        }
    } else {
        giveReward(reward, retroactive);
    }

    // Reward user
    function giveReward(reward, retroactive = false) {
        // console.log(reward);
        let [rewardType, rewardName] =
        typeof reward === 'string' || reward instanceof String ? reward.split(':') : ['function', reward];
        if(
            retroactive == true
            &&
            (rewardType   == 'cash'
            || rewardType == 'function'
            || rewardType == 'character')
        ) { return; }
        if(reward == false) return;

        // Theme reward
        if(rewardType == 'theme') {
            unlock(rewardType, rewardName);
        }
        // Cosmetic reward
        else if(rewardType == 'cosmetic') {
            let [target, cosmetic] = rewardName.split('/');
            unlock(rewardType, cosmetic, target);
        }
        // Shop reward
        else if(rewardType == 'shop') {
            let [target, item] = rewardName.split('/');
            unlock("shop_item", item, target, reward);
        }
        // Cash reward
        else if(rewardType == 'cash') {
            earnCash(parseInt(rewardName), 'achievement');
        }
        // Function reward
        else if(rewardType == 'function') {
            rewardName();
        }

        // Character reward
        else if(rewardType == 'character') {
            console.log('Character unlocked: ' + rewardName);
            unlock('character', rewardName);
        }
    }
}

/** Grant Achievement (Takes in object key) */
function grantAchievement(key) {
    if(achieveQuery(key)) {
        console.warn(key + ' achievement already unlocked');
        return;
    }

    let achieve = achievements[key];

    // Notification
    console.log(`Achievement earned: ${achieve.name} (${key})`);
    if(achieve.internal != true && achieve.mystery.noToast != true) {
        // Normal toast
        // toast(`Achievement earned: ${achieve.name}`, `${achieve.desc}\nUnlocked:\n${achieve.reward.toString().split(',').join('\n')}`);

        // New toast
        if(player.flags['no_achievement_toasts'] != true) {
            toast('', '', '', false, false, key);
        }
    }

    // Add achievement to player.achievements
    player.achievements[key] = Date.now();
    if(achieve.internal == true) {
        player.internal++;
    }

    // Check if there is an award to give
    if(achieve.reward != false) {
        rewardBreakdown(achieve);
    }


    // Give pages
    if(achieve.pages != false && achieve.pages != null) {
        player.pages += achieve.pages;
        pagesCount();
    }

    // Update achievement list
    achieveHTMLupdate = true;
    if(currentPanel == "achievements-panel") {
        populateAchievements();
    }

    // Update page
    achievementProgress();
    updateMainIcon();
}

// Unlock themes/cosmetics
function unlock(type, thingToUnlock, subtype, raw) {
    if(isUnlocked(type, thingToUnlock, subtype) == true) {
        console.warn(`${type}:${subtype != false ? '/'+subtype : ''}${thingToUnlock} is already unlocked`);
        return;
    }
    // console.log('unlock(): ' + type + ':' + thingToUnlock);

    // Theme
    if(type == 'theme') {
        player.themes.push(thingToUnlock);

        newIndicator(true, 'theme');
        populateThemeList();
    }
    // Cosmetic
    else if(type == 'cosmetic') {
        // For bundles
        if(subtype == 'bundle') {
            console.log('Unlocking a cosmetic bundle! ' + subtype + thingToUnlock);

            // Loop across subtypes and unlock all relevant cosmetics
            for(let t = 0; t < cosmeticsKeys.length; t++) {
                let key = cosmeticsKeys[t];
                if(key == 'bundle') continue;

                let target = cosmetics[key];

                // Loop through cosmetics
                for(let c = 0; c < target['keys'].length; c++) {
                    if(target[ target['keys'][c] ].group == thingToUnlock) {
                        unlock('cosmetic', target.keys[c], key);
                    }
                }
            }

        }

        player.cosmetics[subtype].push(thingToUnlock);
        populateCosmeticsList('all');

        newIndicator(true, 'cosmetic');
        playerCosmeticsCount();

        // Auto equip
        if(settings.cosmetic_auto_equip == true) {
            setCosmetic(subtype, thingToUnlock);
        }
    }
    // Character
    else if(type == 'character') {
        let charbox = dom(`${thingToUnlock}_box`);
        if(characterQuery(thingToUnlock) == false) { charbox.classList.add('char_anim'); }
        player.characters[thingToUnlock] = true;
        charbox.classList.remove('char_locked');
        playerCharKeys = Object.keys(player.characters);
        elBody.classList.add(`c_${thingToUnlock}`);

        if(playerCharKeys.length == 5) {
            dom('more_chars_tooltip').classList.add('char_locked');
        }
    }
    // Carl shop item
    else if(type == 'shop_item') {
        // console.log(raw);
        // Theme
        if(subtype == 'theme') {
            try {
                Carl.shop['theme'][thingToUnlock].available = true;
                console.log(`[Shop] New ${subtype}: "${thingToUnlock}" now available (Carl)}`);
            } catch (error) {
                console.warn(error);
            }
        }
        // Cosmetic
        else if(subtype == 'cosmetic') {
            let target = raw.split('/')[1];
            let cosmetic = raw.split('/')[2];
            // console.log(`${target}/${cosmetic}`);
            try {
                Carl.shop['cosmetic'][`${target}/${cosmetic}`].available = true;
                console.log(`[Shop] New ${subtype}: "${target}/${cosmetic}" now available (Carl)}`);
            } catch (error) {
                console.warn(error);
            }
        }

        // Toast
        if(settings.carl_shop_toasts == true && characterQuery('carl')) {
            toast('', 'Carl: A new item is now available', '', false, true);
        }
        // Carl.shop_order.unshift(raw.split(':')[1]);
        populateCarl();
    }
}

// Shop
function purchase(source, type, item, subtype = false) {
    let raw = item;
    // Fix input data for cosmetics
    if(type[type.length - 1] == 'c') {
        type = 'cosmetic';
        [subtype, item] = item.split('/');
    };

    // console.log(`purchase(${source}, ${type}, ${item}, ${subtype})`);

    // Check if already unlocked or bought
    // console.log(`isUnlocked(${type}, ${item}, ${subtype})`);
    if(isUnlocked(type, item, subtype) || Carl.shop[type][raw].bought == true) {
        console.warn(`${type}:${subtype != false ? '/'+subtype : ''}${item} is already unlocked`);
        toast('Whoops', 'You already own this', '', false, true);

        Carl.shop[type][raw].bought = true;
        populateCarl();
        return;
    }
    // console.log('purchase(): ' + type + ':' + raw);

    // let currency = Carl.shop[type][item].currency;
    // let price;

    let carlListing = Carl.shop[type][raw];
    let defaultCarlListing = Default_Carl.shop[type][raw];

    // Carl shop
    if(source == 'carl') {
        // Check if Carl is unlocked (anticheat)
        if(characterQuery('carl') == false) {
            // toast('Nice Try', 'That character has not been unlocked');
            return;
        }
        if(carlListing.available == false) {
            toast('Nice Try', 'This item isn\'t available yet');
            return;
        }

        // Currency: Cash
        if(defaultCarlListing.currency == 'cash') {
            // Buy
            if(player.cash >= defaultCarlListing.price) {
                player.cash -= defaultCarlListing.price;
                Carl.shop[type][raw].bought = true;
                unlock(type, item, subtype);

                cashCount(false);
                // toast('', `Item bought: ${raw} (${type})`, '', false, true);

                let element = dom(`carl_shop_${raw}`)
                element.classList.add('shop_out');
                updateCarlsShop();
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
}

// Test if a character is unlocked
function characterQuery(char) {
    if(player.characters.hasOwnProperty(char)) return true;
    return false;
}
function allCharQuery() {
    if(
        characterQuery('belle') == true
        && characterQuery('greg') == true
        && characterQuery('charles') == true
        && characterQuery('carl') == true
        // And so on
    ) { return true; }
    return false;
}

// Test if player has an achievement - True = yes, False = no
function achieveQuery(key) {
    if(player.achievements[key] != undefined) return true;
    else return false;
}

// Test if theme is unlocked or not
                    // 'cosmetic', 'biker_bill', 'bill'
function isUnlocked(type = 'theme', key, subtype) {
    // Theme
    if(type == 'theme') {
        for(let i = 0; i < player.themes.length; i++) {
            if(key == player.themes[i]) {
                return true;
            }
        }
        return false;
    }
    // Cosmetic
    else if(type == 'cosmetic') {
        // console.log(player.cosmetics[subtype]);
        // console.log(player.cosmetics[subtype].length);

        for(let i = 0; i < player.cosmetics[subtype].length; i++) {
            // console.log(key == player.cosmetics[subtype][i]);
            if(key == player.cosmetics[subtype][i]) {
                return true;
            }
        }
        return false;
    }
    else if(type == 'shop_item') {
        return carlShopQuery(subtype, key);
    }
    // Does not return anything for characters
}

// Fill inventory
// function populateInventory() {
//     console.log('populateInventory() runs');
// }


// External achievement checks
// After Greg crafts a tool for the first time ~~(Called in carrot_clicker.js)~~ Called by first tool achievement
function tutorialHoes() {
    // store('tutorial_first_hoe', "done");
    toast(
        "You've created your first tool!",
        "To equip it, click one of the glowing tools on either Bill or Belle. The character will recieve a permanent buff, but remember that equipping a tools is irreversible (for now).",
        "", true);
}
// use_charles
function ex_charlesUses() {
    if(
    Charles.tome.improveWorkingConditions.value > Default_Charles.tome.improveWorkingConditions.value
    || Charles.tome.betterHoes.value > Default_Charles.tome.betterHoes.value
    || Charles.tome.decreaseWages.value > Default_Charles.tome.decreaseWages.value
    ) {
        return 1;
    }

    return 0;
}
// No falling carrots challenge
function ex_noBonusCarrots() {
    if(player.prestige.carrots >= 500000 && player.prestige.falling_carrots_grabbed == 0) return true;
    return false;
}
// No Bill challenge
function ex_noBill() {
    if(Boomer_Bill.lvl == 1 && player.prestige.carrots >= 2500000) return true;
    return false;
}
// No Belle challenge
function ex_noBelle() {
    if(Belle_Boomerette.lvl == 0 && player.prestige.carrots >= 5000000) return true;
    return false;
}
// No hoes challenge
function ex_noHoes() {
    if(player.prestige.hoes.craftedTotal == 0 && player.prestige.carrots >= 5000000) return true;
    return false;
}

// Not funny
function ex_notFunny() {
    if(Boomer_Bill.lvl == 69 && Belle_Boomerette.lvl == 69 && Gregory.lvl == 69) return 1;
    return 0;
}

// Get total cosmetics count
function playerCosmeticsCount() {
    let a = 0;
    for(i = 0; i < cosmeticsKeys.length; i++) {
        a += player.cosmetics[cosmeticsKeys[i]].length - 1;
    }
    return a;
}


// Fill out keybinds menu
function populateKeybinds() {
    for(i = 0; i < settings.keybinds.keys.length; i++) {
        let keybindName =   settings.keybinds.keys[i];
        let key =           settings.keybinds[keybindName];
    
        // console.log(keybindName + ' ' + key);
    
        if(dom(keybindName) != null) {
            let element = dom(keybindName);
            element.innerHTML = interpretKey(key);
        }
    }
}
function resetKeybinds() {
    settings.keybinds = keybinds_default;
    saveSettings();
    populateKeybinds();
    // populateKeyConflicts();
    toast('Settings', 'Keybinds set to defaults', '', false, true);
}


// Loop through object shorthand
function loopObject(obj, func) {
    let keys =     Object.keys(obj);
    for(i = 0; i < keys.length; i++) {
        let key = keys[i];
        let item = obj[key];
        func(item, key);
    }
}
var hashlist;
function isDebug() {
    if(hashlist.includes('dev')
    || hashlist.includes('developer')
    || hashlist.includes('cheatmode')
    || hashlist.includes('debug')
    || store('debug') == 'true') return true;
}

// URL hashes
(() => {
    onhashchange = hash;
    function hash() {
        hashlist = location.hash.substring(1).split('#');
        // console.log(hashlist);

        // Mute
        if(hashlist.includes('automute') || hashlist.includes('mute')) {
            elEnableSounds.checked = false;
            settingSounds();
        }
        // Dev tools
        if(
            hashlist.includes('dev')
            || hashlist.includes('developer')
            || hashlist.includes('cheatmode')
            || hashlist.includes('debug')
        ) {
            player.flags['cookies_accepted'] = true;

            // Register cheat functions globally
            //#region
            window.allCharacters = () => {
                unlock('character', 'belle');
                unlock('character', 'greg');
                unlock('character', 'charles');
                unlock('character', 'carl');
                toast('All Characters now available', 'Dev tools');
            }
            window.allAchievements = () => {
                for(let i = 0; i < achievementsKeys.length; i++) {
                grantAchievement(achievementsKeys[i])
                }
                toast('All Achievements now unlocked', 'Dev tools');
            }
            window.allThemes = () => {
                for(let i = 0; i < themesKeys.length; i++) {
                    unlock('theme', themesKeys[i])
                }
                toast('All Themes now available', 'Dev tools');
            }
            window.allCosmetics = () => {
                for(let t = 0; t < cosmeticsKeys.length; t++) {
                    let key = cosmeticsKeys[t];
                    let target = cosmetics[key];
            
                    // Loop through cosmetics
                    for(let c = 0; c < target['keys'].length; c++) {
                        unlock('cosmetic', target.keys[c], key);
                    }
                }
                toast('All Cosmetics now available', 'Dev tools');
            }
            window.allTips = () => {
                player.flags['all_tips'] = true;
                populateTipsMenu();
            }
            window.allUnlocks = () => {
                allCharacters();
                allAchievements();
                allThemes();
                allCosmetics();
                allTips();
            }
            window.updateValues = () => {
                // Carrots
                let cc = parseInt(setCarrotsEl.value);
                player.carrots          = 0;
                player.lifetime.carrots = 0;
                player.prestige.carrots = 0;
                earnCarrots(cc);
                // Cash
                if(setCashEl.value != '') {
                    let coinc = parseInt(setCashEl.value);
                    player.cash             = 0;
                    player.lifetime.cash    = 0;
                    earnCash(coinc);
                }
                // Golden carrots
                if(setGoldenCarrotsEl.value != '') {
                    let gcc = parseInt(setGoldenCarrotsEl.value);
                    player.golden_carrots = gcc
                    updateGC();
                }
                // Levels
                if(setBillLvlEl.value != '') {
                    let lbill = parseInt(setBillLvlEl.value);
                    Boomer_Bill.lvl = lbill;
                    characterPrices();
                }
            }
            //#endregion
            
            // Put dev panel in settings
            $('#devp').innerHTML = /* html */
            `<div class="footer_bottom brown_darker_color" style="display: block; padding: 16px 24px;">
                <b style="font-size: 18pt; color: rgb(255, 161, 53)">Dev Tools</b><br>

                <button onclick="clearSave()" class="button_red">
                    Quick Reset
                </button>

                <h4>Unlock all</h4>
                <button onclick="allUnlocks()">
                    Everything
                </button>
                <button onclick="allCharacters()">
                    Characters
                </button>
                <button onclick="allAchievements()">
                    Achievements
                </button>
                <button onclick="allThemes()">
                    Themes
                </button>
                <button onclick="allCosmetics()">
                    Cosmetics
                </button>
                <button onclick="allTips()">
                    Tips
                </button><br/>
                
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
                            <input id="setCash" class="dev_input" type="number">
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <label for="setBillLvl">Bill's Level:</label>
                        </td>
                        <td>
                            <input id="setBillLvl" class="dev_input" type="number">
                        </td>
                    </tr>
                </table>
                
                <button onclick="updateValues()">Update Values</button>
            </div><br>`;

            window.setCarrotsEl =   dom("setCarrot");
            window.setGoldenCarrotsEl =    dom("setGoldenCarrot");
            window.setCashEl =             dom("setCash");
            window.setBillLvlEl =          dom("setBillLvl");
            window.elSetCarrotRounded =    dom('setCarrotRounded')

            // Enter key updates values
            document.querySelectorAll('.dev_input').forEach(element => {
                element.addEventListener('keyup', e => {
                    if(e.key == 'Enter') { updateValues(); }
                });
            });

            // DisplayRounded preview
            setCarrotsEl.addEventListener('input', () => {
                if(setCarrotsEl.value == '') return;
                elSetCarrotRounded.innerText = `(${DisplayRounded(setCarrotsEl.value)})`;
            });

            // toast('Dev Tools enabled', false);
        }
        // else {
        //     $('#devp').innerHTML = '';
        // }

        // Hide achievement toasts
        if(hashlist.includes('itch') || hashlist.includes('dan')) {
            player.flags['no_achievement_toasts'] = true;
        } else {
            player.flags['no_achievement_toasts'] = false;
        }

        // Settings
        // if(hashlist.join('#').includes('$')) {
        //     console.log('setting hash');
        // }
    }
    hash();
})();


/* --------------- On page load --------------- */
// Runs on startup, after JS is loaded
(() => {
    // console.log('Running onLoad');

    // Flag for early playtesters
    player.flags['playtest'] = true;

    /* --------------- PLAYER OBJECT --------------- */
    // player object compatibility check (because of the way the player object is created and saved, any new properties added to the player template will not carry over)

    // List of objects that need to be updated
    // onu = objects_need_updating
    //#region 
    var onu = [
        player,
        player.prestige,
        player.lifetime,
        
        settings,
        settings.cosmetics,
        settings.keybinds,

        Boomer_Bill,
        Belle_Boomerette,
        Gregory,

        Charles,
        Charles.tome,
        Charles.tome.improveWorkingConditions,
        Charles.tome.decreaseWages,
        Charles.tome.betterHoes,

        Carl,
        Carl.shop,
        Carl.shop.theme,
        Carl.shop.cosmetic,
    ];
    var onu_templates = [
        default_player,
        playerPrestigeTemplate,
        default_player.lifetime,

        default_settings,
        default_settings.cosmetics,
        default_settings.keybinds,

        Default_Boomer_Bill,
        Default_Belle_Boomerette,
        Default_Gregory,

        Default_Charles,
        Default_Charles.tome,
        Default_Charles.tome.improveWorkingConditions,
        Default_Charles.tome.decreaseWages,
        Default_Charles.tome.betterHoes,

        Default_Carl,
        Default_Carl.shop,
        Default_Carl.shop.theme,
        Default_Carl.shop.cosmetic,
    ];
    //#endregion
    if(
        default_player.data_version > player.data_version
        || player.hasOwnProperty('data_version') == false
        || isDebug() == true
    ) {
        try {
            // Loop through onu_templates array
            //#region 
            for(oi = 0; oi < onu_templates.length; oi++) {
                let obj = onu[oi];
                let template = onu_templates[oi];
    
                // Loop through template
                let template_keys = Object.keys(template);
                for(i = 0; i < template_keys.length; i++) {
                    let key = template_keys[i];
                    if(obj.hasOwnProperty(key) == false) {
                        console.log(key + ' property not found, updating save...');
                        obj[key] = JSON.parse(JSON.stringify(template[key]));
                    }
                }
            }
            //#endregion
    
            // Achievements
            let pagesIntended = 0;
            for(let i = 0; i < achievementsKeys.length; i++) {
                let key = achievementsKeys[i];
                let achieve = achievements[key];

                // Page count
                if(achieveQuery(key) && achieve.pages != false && achieve.pages != null) { pagesIntended += achieve.pages; }

                // Check that the player has recieved all achievement rewards
                let reward = achieve.reward;
                // console.log(reward);
                if(achieveQuery(key) && reward != false) {
                    // console.log(`Re-granting reward for ${key}: ${achieve.reward}`);
                    rewardBreakdown(achieve, true);
                }
            }
            // Check that the players' page count is correct
            if(player.pages != pagesIntended) {
                console.log('Achievement page rewards have been changed');
                toast(
                    'Page Rewards Changed',
                    `The page rewards for completing achievements have been changed. Your Page count has been updated to reflect those changes (${player.pages} -> ${pagesIntended})`,
                    'orange',
                    true
                );
    
                // console.log(pagesIntended);
                player.pages = pagesIntended;
            }
    
            // Done
            console.log(`Player object has been updated (Version ${player.data_version} -> ${default_player.data_version})`);
            if(isDebug() == true && player.data_version != default_player.data_version) {
                toast('', `Player object has been updated (Version ${player.data_version} -> ${default_player.data_version})`, '', true);
            }

            player.data_version = default_player.data_version;
            saveGame();
        } catch (error) {
            console.error('An object update was attempted but failed. Error info below:');
            console.error(error);
            toast('Save file update failed', 'If you run into any issues you may have to delete your save.', 'error', true);
        }

    }



    /* --------------- SETTINGS --------------- */
    // Set default settings if not found in localstorage
    //#region 

    // > Settings object moved to carrot_clicker.js <

    populateKeybinds();

    // Fill out settings page from settings object
    fillSettingsPage();

    // Achievement list CSS
    achieveCompactMode(settings.compact_achievements);
    achieveGridMode(settings.achievements_grid);

    // Theme Switcher
    populateThemeList();
    populateCosmeticsList('all');

    // Set user theme on page load
    if(settings.theme != 'theme_dark') {
        let theme = settings.theme;
        // console.log(`Theme setting found, switching to: ${theme}`);
        // optionTheme.value = theme;
        setTheme(theme);
    }
    // Set user cosmetics on page load
    for(let i = 1; i < cosmeticsKeys.length; i++) {
        if( settings.cosmetics[ cosmeticsKeys[i] ] == 'default' ) continue;

        setCosmetic(cosmeticsKeys[i], settings.cosmetics[ cosmeticsKeys[i] ]);
    }
    // Switch to previously open panel on page load
    if(settings.openpanel != null) {
        // console.log('openpanel found, switching to: ' + settings.openpanel);
        panelChange(settings.openpanel, true);
    } else {
        panelChange('achievements-panel');
    }
    // Set cosmetics grid mode
    if(settings.cosmetics_grid == true) {
        cosmeticsView.value = 'grid';
        cosmeticsGridMode();
    }
    // Restart unfinished crafting job (Greg)
    if(Gregory.crafting != false) {
        console.log('[Greg] Restarting unfinished craft job');
        try { CreateHoe(...Gregory.crafting); }
        catch (error) { console.error(error); }
        
    }
    
    // OFFLINE EARNINGS
    // Doesn't work, Date.now() is imprecise
    // if(player.time_last_saved != false) {
    //     // Convert to seconds
    //     let ls = (player.time_last_saved / 1000).toFixed(0);
    //     let now = (parseInt(JSON.stringify(Date.now())) / 1000).toFixed(0);
    //     console.log(ls, now);
    //     let difference = now - ls;
    //     let earned = difference * player.cps;
    //     toast('Offline Earnings', `${difference} seconds\n${earned} carrots`);

    //     player.time_last_saved == false;
    // }

    //#endregion
    

    // Figure out how many achievements aren't hidden
    for(let i = 0; i < achievementsKeys.length; i++) {
        let key = achievementsKeys[i];
        let achievement = achievements[key];

        if(achievement.internal == true) {
            internalAchievements++;
            continue;
        };
        if(achievement.mystery.list == true) {
            hiddenAchievements++;
        }
        if(achievement.style == 'challenge') {
            challengeAchievements++;
        }
    }

    // Populate achievements if said tab is open
    if(currentPanel == "achievements-panel") {
        populateAchievements();
    }
    achievementProgress();



    /* --------------- TUTORIAL --------------- */
    // Cookie usage notification
    if(player.flags['cookies_accepted'] != true) {
        let cookieToast = toast(
            'Cookie Usage',
            'By playing Carrot Clicker you agree to the usage of cookies to save your progress.',
            'purple', true, false, false, true,
            () => {
                closeToast(cookieToast);
                player.flags['cookies_accepted'] = true;
                saveGame();
            }, 'Accept'
        );
    }

    // Initial Welcome
    if(player.flags.tutorial0 != true) {
        // Welcome message
        toast("Welcome to Carrot Clicker!",
        "Click the carrot to farm. Spend your carrots on hiring/upgrading new workers. Eventually you will be able to buy them better tools to work with. Good luck!",
        "", true);
        player.flags.tutorial0 = true;
    }

    // Enable unlocked characters
    for(i = 0; i < playerCharKeys.length; i++) {
        let key = playerCharKeys[i];
        if(player.characters[key] == true) {
            unlock('character', key);
        }
    }

    
    // Disable
    optionSoundsDisable(settings.enableSounds);

    // Make golden carrot count visible




    /* -------------------- Fill out page -------------------- */
    // Put things on page
    carrotCount();
    updateCPC(false);
    cashCount(false);
    characterPrices();
    characterButtons();
    updateCharlesShop();
    pagesCount(false);
    calculatePrestigePotential();
    DisplayAllHoes();
    updateHoePrices();
    updateMainIcon();
    populateCarl();
    if(player.new_theme == true) { newIndicator(true, 'theme'); }
    if(player.new_cosmetic == true) { newIndicator(true, 'cosmetic'); }

    // Prestige button visibility
    if(player.prestige_available == true) { seePrestige(); }
    // Has prestiged before
    if(player.lifetime.prestige_count > 0) { showPrestigeStats(); }


    console.log(Date());
    // Finished
})();


loadCheck = true;