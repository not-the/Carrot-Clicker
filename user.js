/* -------------------------------------------------------------
Users settings, keybind handling, and tutorial handling
------------------------------------------------------------- */

/*---------------AUDIO HANDLING-------------------*/
// Volume variable
var volume = 1;

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

function menuOpen() {
    if(dialogOpen || themeSwitcherOpen || cosmeticSwitcherOpen /*|| keybindsMenuOpen*/ || prestigeMenuOpen || inventoryOpen || tipsMenuOpen)
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

// Universal checkbox option updater (not used by everything because some options need extra code)
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
function resetOption() {
    notificationLength.value = 5;
    localStorage.removeItem("notificationLength");
    toast("Notification time reset", `Notifications will disappear after 5 seconds`,
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
    let value = settings_default.autosave_interval;

    console.log(`[Settings] Autosave interval reset to: ${value}`);
    dom('autosave_interval').value = value;

    settings.autosave_interval = value;
    saveSettings();

    toast("Autosave interval reset", `Game will save every 2 seconds`,
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
    toast()

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
document.addEventListener('keydown', event => {

    if(event.key == " ") {
        event.preventDefault();   
    }


});

document.addEventListener('keyup', event => {
    // Close/Accept dialog
    if(dialogOpen) {
        if(event.key == "Escape"){
            closeDialog();
        } else if(event.key == "Enter"){
            closeDialog(true);``
        }
        return;
    }
    // Close theme switcher
    if(menuOpen()) {
        if(event.key == "Escape"){
            closeDialog();
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
function eggUp() { easterEgg++; }

function keybindHandler(event, state) {
    let key = interpretKey(event.key);

    // Custom keybinds
    if(keyWaiting[0] == true) {
        let element = dom(keyWaiting[1])

        if(key == 'Escape') key = 'Not set';

        element.innerText = key;
        element.blur();

        // Set and reset
        setKeybind(keyWaiting[1], key);
        keyWaiting = [false, 'none'];
        return;
    }

    // Stop if keybinds need to be ignored
    if(
        settings.disableKeybinds == "true"
        || dialogOpen == true
        || document.activeElement.nodeName == 'TEXTAREA'
        || document.activeElement.nodeName == 'INPUT'
        || keybindsMenuOpen
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
                confetti();
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
    // for(i = 0; i < keyCombo.length; i++) {
    //     if(keyCombo[i] != keyCodes[0][i]
    //     && keyCombo[i] != keyCodes[1][i]
    //     && keyCombo[i] != keyCodes[2][i]
    //     && keyCombo[i] != keyCodes[3][i]) {
    //         keyCombo = '';
    //         break;
    //     }
    // }
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
        document.activeElement.click();
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
        onClick(false, 'key');

        // Prevent spacebar scrolling (for some reason this works even if the parent if statement resolves to false)
        if(key == "Spacebar") {
            event.preventDefault();
        }
    }

    //Level up
    else if(
        key == settings.keybinds['key_bill_lvlup']
        && event.altKey==false
        && event.ctrlKey==false)
        {
        LevelUp(Boomer_Bill,multibuy[multibuySelector]);
    }
    else if(
        key == settings.keybinds['key_belle_lvlup']
        && event.altKey==false
        && event.ctrlKey==false)
    {
        LevelUp(Belle_Boomerette,multibuy[multibuySelector]);
    }
    else if(
        key == settings.keybinds['key_greg_lvlup']
        && event.altKey==false
        && event.ctrlKey==false)
    {
        LevelUp(Gregory,multibuy[multibuySelector]);
    }

    // Hoes
    else if(
        key == settings.keybinds['key_craft_0']
        && event.altKey==false
        && event.ctrlKey==false)
    {
        CreateHoe(0,multibuy[multibuySelector]);
    }
    else if(
        key == settings.keybinds['key_craft_1']
        && event.altKey==false
        && event.ctrlKey==false)
    {
        CreateHoe(1,multibuy[multibuySelector]);
    }
    else if(
        key == settings.keybinds['key_craft_2']
        && event.altKey==false
        && event.ctrlKey==false)
    {
        CreateHoe(2,multibuy[multibuySelector]);
    }
    else if(
        key == settings.keybinds['key_craft_3']
        && event.altKey==false
        && event.ctrlKey==false)
    {
        CreateHoe(3,multibuy[multibuySelector]);
    }
    else if(
        key == settings.keybinds['key_craft_4']
        && event.altKey==false
        && event.ctrlKey==false)
    {
        CreateHoe(4,multibuy[multibuySelector]);
    }
    else if(
        key == settings.keybinds['key_craft_5']
        && event.altKey==false
        && event.ctrlKey==false)
    {
        CreateHoe(5,multibuy[multibuySelector]);
    }


    else if(key=="4" && event.altKey==true && event.ctrlKey==false){
        EquipHoe(Boomer_Bill,0,multibuy[multibuySelector]);
    }
    else if(key=="5" && event.altKey==true && event.ctrlKey==false){
        EquipHoe(Boomer_Bill,1,multibuy[multibuySelector]);
    }
    else if(key=="6" && event.altKey==true && event.ctrlKey==false){
        EquipHoe(Boomer_Bill,2,multibuy[multibuySelector]);
    }
    else if(key=="7" && event.altKey==true && event.ctrlKey==false){
        EquipHoe(Boomer_Bill,3,multibuy[multibuySelector]);
    }
    else if(key=="8" && event.altKey==true && event.ctrlKey==false){
        EquipHoe(Boomer_Bill,4,multibuy[multibuySelector]);
    }
    else if(key=="9" && event.altKey==true && event.ctrlKey==false){
        EquipHoe(Boomer_Bill,5,multibuy[multibuySelector]);
    }

    else if(key=="4" && event.altKey==false && event.ctrlKey==true){
        event.preventDefault();
        EquipHoe(Belle_Boomerette,0,multibuy[multibuySelector]);
    }
    else if(key=="5" && event.altKey==false && event.ctrlKey==true){
        event.preventDefault();
        EquipHoe(Belle_Boomerette,1,multibuy[multibuySelector]);
    }
    else if(key=="6" && event.altKey==false && event.ctrlKey==true){
        event.preventDefault();
        EquipHoe(Belle_Boomerette,2,multibuy[multibuySelector]);
    }
    else if(key=="7" && event.altKey==false && event.ctrlKey==true){
        event.preventDefault();
        EquipHoe(Belle_Boomerette,3,multibuy[multibuySelector]);
    }
    else if(key=="8" && event.altKey==false && event.ctrlKey==true){
        event.preventDefault();
        EquipHoe(Belle_Boomerette,4,multibuy[multibuySelector]);
    }
    else if(key=="9" && event.altKey==false && event.ctrlKey==true){
        event.preventDefault();
        EquipHoe(Belle_Boomerette,5,multibuy[multibuySelector]);
    }

    // Close all Toasts
    else if(key == settings.keybinds['key_cleartoasts']) {
        event.preventDefault();
        clearToasts();
    }
    
    // Settings and prestige
    else if(key=="Backspace" && event.altKey==false && event.ctrlKey==true){
        event.preventDefault();
        openDialog('Are you sure?', 'Your progress will be lost forever!', 'Delete Save Data', 'button_red', 'clearsave');
    }
    else if(key == settings.keybinds['key_prestige']){
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


// Custom Keybinds
var keyWaiting = [false, 'none'];
function detectKey(bind) {
    keyWaiting = [true, bind];
}
function setKeybind(action, key) {
    console.log(`[Settings] Set ${action} to key: ${key}`)
    settings.keybinds[action] = key;
    console.log(action, key);
    saveSettings();
    // populateKeyConflicts();
}


// User-friendly key translation
function interpretKey(key) {
    if(key == ' ') {
        return 'Spacebar';
    }


    return capitalizeFL(key);
}


//#endregion

// Test achievement conditions every 5 seconds
setInterval(() => {
    // if(achieve.hasOwnProperty('conditions') || achieve.conditions !== false) {
    //     console.log( achieve.conditions.split('/') );
    // }

    // Loop through achievements test if player has earned them
    for(let i = 0; i < achievementsKeys.length; i++) {
        let key = achievementsKeys[i];
        let achievement = achievements[key];

        // Skip if already unlocked
        if(achieveQuery(key) == true) continue;

        // console.log(achievement.name);
        evaluateConditions(key, achievement);
    }
}, 1000);

// Achievement Conditions converter
function evaluateConditions(key, achievement) {
    let multicondition = false;
    var multiamount = 1;
    var multifulfilled = 0;

    // Run tests
    function tests(key, conditions) {

        // console.log(`Running tests on [${key}]`)
        let getVar =        Function(`return ${conditions[0]}`);
        let variable =      getVar();
        let requirement =   conditions[1];
        // let operator =    achievement.conditions[2];
        let alreadyEarned = achieveQuery(key);

        // Grant achievement if reached requirement
        // console.log(`${key}: ${variable} >= ${requirement}`);
        if(variable >= requirement && alreadyEarned == false) {
            // console.log(key + ' passed tests!');
            multifulfilled++;

            if(multicondition == true && multiamount <= multifulfilled) {
                // console.log('Multicondition: ' + multifulfilled + ' / ' + multiamount);
                grantAchievement(key);
            } else if(multicondition == false) {
                // console.log(`${key}: not multi - ${multifulfilled} / ${multiamount}`);
                grantAchievement(key);
            }
        }

    }

    // Check if there are multiple conditions
    if(Array.isArray(achievement.conditions[0])) {
        // console.log('Multicondition: ' + key);
        multicondition = true;
    }
    
    // 1 condition
    if(multicondition == false) {
        tests(key, achievement.conditions);
    }

    // Multiple conditions
    else if(multicondition == true) {
        // Amount that need to be fulfilled
        if(achievement.hasOwnProperty('condition_amount')) {
            multiamount = achievement.condition_amount;
        } else {
            multiamount = achievement.conditions.length;
        }

        for(let i = 0; i < achievement.conditions.length; i++) {
            // console.log(achievement.conditions[i]);
            tests(key, achievement.conditions[i]);
        }
        // console.log(`${key}: ${multifulfilled}/${multiamount}`);
    }
}

function rewardBreakdown(achieve, retroactive = false) {
    console.log(`rewardBreakdown(${achieve}, ${retroactive})`);
    if(achieve.hasOwnProperty('reward')) {
        let reward = achieve.reward;

        // Check if there are multiple rewards
        if(Array.isArray(achieve.reward) == true) {
            for(let i = 0; i < achieve.reward.length; i++) {
                giveReward(achieve.reward[i], retroactive);
            }
        } else {
            giveReward(reward, retroactive);
        }
    }
}

// Reward user
function giveReward(reward, retroactive = false) {
    // console.log(reward);
    let [rewardType, rewardName] = reward.split(':');
    if(
        retroactive == true
        &&
        (rewardType   == 'cash'
        || rewardType == 'function'
        || rewardType == 'character')
    ) { return; }
    if(reward == false) return;
    console.log('giveReward(): ' + reward);
    // console.log(rewardType, rewardName);

    // Theme reward
    if(rewardType == 'theme') {
        unlock(rewardType, rewardName);
    }
    // Cosmetic reward
    else if(rewardType == 'cosmetic') {
        let [target, cosmetic] = rewardName.split('/');
        console.log(rewardName.split('/'));
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
        // Run specified function
        var rewardFunction = Function(`${rewardName}`);
        rewardFunction();
    }

    // Character reward
    else if(rewardType == 'character') {
        console.log('Character unlocked: ' + rewardName);
        unlock('character', rewardName);
    }
}

// Grant Achievement (Takes in object key)
function grantAchievement(key) {
    if(achieveQuery(key)) {
        console.warn(key + ' achievement already unlocked');
        return;
    }

    console.log('grant: ' + key);
    let achieve = achievements[key];

    // Notification
    console.log(`Achievement earned: ${achieve.name} (${key})`);
    if(achieve.mystery.noToast !== true) {
        // Normal toast
        // toast(`Achievement earned: ${achieve.name}`, `${achieve.desc}\nUnlocked:\n${achieve.reward.toString().split(',').join('\n')}`);

        // New toast
        toast('', '', '', false, false, key);
    }

    // Add achievement to player.achievements
    player.achievements[key] = true;

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
        player.characters[thingToUnlock] = true;
        dom(`${thingToUnlock}_box`).classList.remove('char_locked');
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
            console.log(`${target}/${cosmetic}`);
            try {
                Carl.shop['cosmetic'][`${target}/${cosmetic}`].available = true;
                console.log(`[Shop] New ${subtype}: "${target}/${cosmetic}" now available (Carl)}`);
            } catch (error) {
                console.warn(error);
            }
        }

        // Toast
        if(settings.carl_shop_toasts == true) {
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
    console.log(`isUnlocked(${type}, ${item}, ${subtype})`);
    if(isUnlocked(type, item, subtype) || Carl.shop[type][raw].bought == true) {
        console.warn(`${type}:${subtype != false ? '/'+subtype : ''}${item} is already unlocked`);
        toast('Whoops', 'You already own this');

        Carl.shop[type][raw].bought = true;
        populateCarl();
        return;
    }
    console.log('purchase(): ' + type + ':' + raw);

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

                cashCount();
                populateCarl();
                toast('', `Item bought: ${raw} (${type})`);
            }
            // Can't afford
            else {
                toast('Can\'t Afford', `Carl wouldn\'t dare let this piece go for less than ₪${defaultCarlListing.price}`, '', false, true);
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
    ) {
        return true;
    }
    return false;
}

// Test if player has an achievement - True = yes, False = no
function achieveQuery(key) {
    if(player.achievements[key] == true) {
        return true
    } else return false;
}

// Test if theme is unlocked or not
                    'cosmetic', 'biker_bill', 'bill'
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
// After Greg crafts a hoe for the first time ~~(Called in carrot_clicker.js)~~ Called by first hoe achievement
function doNothing() {
    // Temporary fix because I can't figure out an achievement related bug
    console.log('doNothing runs');
}
function tutorialHoes() {
    // store('tutorial_first_hoe', "done");
    toast(
        "You've created your first hoe!",
        "To equip it, click one of the glowing hoes on either Bill or Belle. The character will recieve a permanent buff, but remember that equipping a hoe is irreversible (for now).",
        "", true);
}
function tutorialPages() {
    toast(
        "You've earned a tome page!",
        "For every tome page you have you will recieve a +1% golden carrot bonus when prestiging. Earn additional tome pages by completing achievements!",
        "", true);
}
// use_charles
function ex_charlesUses() {
    if(
    Charles.tome.improveWorkingConditions.value > 0
    || Charles.tome.betterHoes.value > 0
    || Charles.tome.decreaseWages.value > 0
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
function isDebug() {
    if(location.hash == '#dev' || location.hash == '#developer' || location.hash == '#cheatmode' || store('debug') == 'true') return true;
}
/* --------------- On page load --------------- */
// Runs on startup, after JS is loaded
function onLoad() {
    // console.log('Running onLoad()');

    // Flag for early playtesters
    store('playtest', 'yes');


    // Start music
    // playMusic('music.m4a');


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
        player1,
        playerPrestigeTemplate,
        player1.lifetime,

        settings_default,
        settings_default.cosmetics,
        settings_default.keybinds,

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
        player1.data_version > player.data_version
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
                        obj[key] = template[key];
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
                    console.log(`Re-granting reward for ${key}: ${achieve.reward}`);
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
            console.log(`Player object has been updated (Version ${player.data_version} -> ${player1.data_version})`);
            if(isDebug() == true && player.data_version != player1.data_version) {
                toast('', `Player object has been updated (Version ${player.data_version} -> ${player1.data_version})`, '', true);
            }

            player.data_version = player1.data_version;
            saveGame();
        } catch (error) {
            console.error('An object update was attempted but failed. Error info below:');
            console.error(error);
            toast('Save file update failed', 'If you run into any issues you may have to delete your save.');
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
    themeSwitcherCheckmark(settings.theme);

    // Set user theme on page load
    if(settings.theme != 'theme_dark') {
        let theme = settings.theme;
        console.log(`Theme setting found, switching to: ${theme}`);
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

    // URL hashes
    if(location.hash == '#automute' || location.hash == '#mute') {
        elEnableSounds.checked = false;
        settingSounds();
    }
    // Dev tools
    else if(location.hash == '#dev' || location.hash == '#developer' || location.hash == 'cheatmode') {
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
        window.allUnlocks = () => {
            allCharacters();
            allAchievements();
            allThemes();
            allCosmetics();
        }
        window.updateValues = () => {
            if(parseInt(setCarrotsEl.value)>-0.01){
                player.Carrots = parseInt(setCarrotsEl.value);
                player.lifetime.carrots = parseInt(setCarrotsEl.value);
            }
            if(parseInt(setGoldenCarrotsEl.value)>-0.01){player.golden_carrots=parseInt(setGoldenCarrotsEl.value)}
            if(parseInt(setBillLvlEl.value)>-0.01){Boomer_Bill.lvl=parseInt(setBillLvlEl.value)}
        }
        //#endregion
        
        // Put dev panel in settings
        $('#dev').innerHTML = /* html */
        `<div class="footer_bottom" style="display: block; padding: 16px 24px;">
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
            </button><br/>
            
            <h4>Set Values</h4>
            <table>
                <tr>
                    <td>
                        <label for="setting Carrots">
                            Carrots:
                        </label>
                    </td>
                    <td>
                        <input id="setCarrot" class="dev_input" type="number" value="500000">
                    </td>
                    <td id="setCarrotRounded" class="secondary_text"></td>
                </tr>

                <tr>
                    <td>
                        <label for="setting Golden Carrots">
                            Golden Carrots:
                        </label>
                    </td>
                    <td>
                        <input id="setGoldenCarrot" class="dev_input" type="number">
                    </td>
                </tr>

                <tr>
                    <td>
                        <label for="setting Bill's level">
                            Bill's Level:
                        </label>
                    </td>
                    <td>
                        <input id="setBillLvl" class="dev_input" type="number">
                    </td>
                </tr>
            </table>
            
            <button onclick="updateValues()">Update Values</button>
        </div><br>`;

        setCarrotsEl =          dom("setCarrot");
        setGoldenCarrotsEl =    dom("setGoldenCarrot");
        setBillLvlEl =          dom("setBillLvl");
        elSetCarrotRounded =    dom('setCarrotRounded')

        // Enter key updates values
        document.querySelector('.dev_input').addEventListener('keyup', e => {
            if(e.key == 'Enter') {
                updateValues();
            }
        });

        // DisplayRounded preview
        setCarrotsEl.addEventListener('input', () => {
            if(setCarrotsEl.value == '') return;
            elSetCarrotRounded.innerText = `(${DisplayRounded(setCarrotsEl.value)})`;
        });

        // toast('Dev Tools enabled', false);
    }
    


    /* --------------- TUTORIAL --------------- */
    // Initial Welcome
    if(store("tutorial_sample") == null) {
        // Welcome message
        toast("Welcome to Carrot Clicker!",
        "Click the carrot to farm. Spend your carrots on hiring/upgrading new workers. Eventually you will be able to buy them better tools to work with. Good luck!",
        "", true);
        store("tutorial_sample", "done");

        // Cookie notification
        toast('Cookie Usage', 'By playing Carrot Clicker you agree to the usage of cookies to save your progress.', 'purple', true);
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
    cashCount();
    characterPrices();
    updateCharlesShop();
    pagesCount();
    DisplayAllHoes();
    updateHoePrices();
    updateMainIcon();
    populateCarl();
    if(player.new_theme == true) { newIndicator(true, 'theme'); }
    if(player.new_cosmetic == true) { newIndicator(true, 'cosmetic'); }

    if(player.lifetime.prestige_count > 0) {
        showPrestigeStats();
    }




    // Finished
//     console.log(`                                                                
//                                          (( #%@@@           
//                                         @/@#//*%            
//                                         %(&//*&   @//&      
//                                        @/&/(*@  %//**#      
//                                        %//(/@@///**@        
//                                       @((((#//**%    /@%(((/
//                              @#######((((((**(@&#((((%@     
//                            %#####(###((((/(((((*******@     
//                          %########((((((/(//@               
//                        %(#######((((((((////@               
//                      @((#####((((((*((/////&                
//                    @#(###(#((((((((//////&                  
//                  @((####((((((((/*/////@                    
//                &((###(((((((((//////&                       
//              &((##(/(((((/(//////@                          
//            @((#(((((((/(//////#                             
//           #(#(((((((((//////&                               
//         @((((((((((//////#(                                 
//       @(((((((/(//////%(                                    
//     (((((((((/////#@                                        
//    @((((((//////@                                           
//   &/((((/////&                                              
//  %///////(@                                                 
// %////(@                                                     

//   _____                     _      _____ _ _      _             
//  / ____|                   | |    / ____| (_)    | |            
// | |     __ _ _ __ _ __ ___ | |_  | |    | |_  ___| | _____ _ __ 
// | |    / _\` | '__| '__/ _ \\| __| | |    | | |/ __| |/ / _ \\ '__|
// | |___| (_| | |  | | | (_) | |_  | |____| | | (__|   <  __/ |   
//  \\_____\\__,_|_|  |_|  \\___/ \\__|  \\_____|_|_|\\___|_|\\_\\___|_|   
                                                                 
                                                                  

                                                               
                                                               
// `)

}

onLoad();
loadCheck = true;