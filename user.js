/* -------------------------------------------------------------
Users settings, keybind handling, and tutorial handling
------------------------------------------------------------- */

/*---------------OPTIONS-------------------*/

// Page variables
const elFunTipsSlider = dom("FunTipsSlider");
const elFunTipsSlider_label = dom("FunTipsSliderLabel");

const elDisableKeybinds = dom('disable_keybinds');
const elEnableSounds = dom('enable_sounds');
const elEnableMusic = dom('enable_music');
const elEnableCarrotSounds = dom('enable_carrot_sounds');

const elVolumeMaster = dom('volume_master');
const elVolumeMaster_label = dom('volume_master_percent');
const volumeMasterDropdown = dom('volume_master_dropdown');
const vmdImage = dom('volume_master_dropdown_img');

// Percentage of fun tips
// JJ's Slider stuffs (ripping off w3 again)

// Update the current slider value (each time you drag the slider handle)
elFunTipsSlider.oninput = () => {
    // Update percentage
    eInnerText(elFunTipsSlider_label, elFunTipsSlider.value);
    
    // Set modifier
    tips.TypeModifier = parseInt(elFunTipsSlider.value) / 100;
}

// Universal checkbox option updater (not used by everything because some options need extra code)
function setting(option) {
    let state = dom(option).checked;
    console.log(`${option} set to ${state}`);

    toast("Settings", `${capitalizeFL(option.split('_').join(' '))} is now ${state == true ? 'enabled' : 'disabled'}`,
    '', false, true);

    settings[option] = state;
    saveSettings();
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
    let value = 2;

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


// Notification length
notificationLength.addEventListener('input', () => {saveOption('notificationLength')} );
function saveOption() {
    let value = notificationLength.value;
    if(value >= 2 && value <= 15) {
        console.log(`[Settings] Notification length set to: ${value}`);
        store("notificationLength", value);
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

// Disable keybinds setting

function settingDisableKeybinds() {
    let state = elDisableKeybinds.checked;
    console.log(`disableKeybinds set to ${state}`);
    toast("Settings", `Keybinds are now ${state == true ? 'disabled' : 'enabled'}`,
    '', false, true);

    // localStorage
    if(state == true) {
        store('disableKeybinds', 'true');
    } else {
        store('disableKeybinds', 'false');
    }
}

// Interface settings

// Main progress bar
const elEnableMainProgress = dom('enable_main_progress');
function settingMainProgress() {
    let state = elEnableMainProgress.checked;
    console.log(`enableMainProgress set to ${state}`);
    toast("Settings", `Status bar progress is now ${state == true ? 'enabled' : 'disabled'}`,
    '', false, true);

    // localStorage
    if(state == true) {
        store('enableMainProgress', 'true');
    } else {
        store('enableMainProgress', 'false');
    }

    elMainProgressContainer.classList.remove('status_tidbit_in');
}


// Enable sounds
function settingSounds() {
    let state = elEnableSounds.checked;
    console.log(`enableSounds set to ${state}`);
    toast("Settings", `Sounds are now ${state == true ? 'enabled' : 'disabled'}`,
    '', false, true);

    // localStorage
    if(state == true) {
        store('enableSounds', 'true');
    } else {
        store('enableSounds', 'false');
    }

    optionSoundsDisable(state);
    settingMusic(true);
}

// Disable individual sound options
function optionSoundsDisable(state) {
    // Carrot sounds
    if(state == false) {
        elEnableMusic.disabled = true;
        elEnableCarrotSounds.disabled = true;
        stopMusic();
    } else {
        elEnableMusic.disabled = false;
        elEnableCarrotSounds.disabled = false;
    }
}

function settingMusic(noToast = false) {
    let state = elEnableMusic.checked;
    console.log(`enableMusic set to ${state}`);
    if(noToast == false) {
        toast("Settings", `Music is now ${state == true ? 'enabled' : 'disabled'}`,
        '', false, true);
    }

    // localStorage
    if(state == true) {
        store('enableMusic', 'true');
        playMusic();
    } else {
        store('enableMusic', 'false');
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
    if(state == true) {
        store('enableCarrotSounds', 'true');
    } else {
        store('enableCarrotSounds', 'false');
    }
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
        vmdImage.src = './assets/iconography/mute.svg';
    } else if(vmdImage.src != './assets/iconography/volume.svg') {
        vmdImage.src = './assets/iconography/volume.svg';
    }

    volume = value / 100;

    if(music !== undefined) {
        music.volume = volume;
    }

    // Update percentage
    eInnerText(elVolumeMaster_label, value > 0 ? `${value}%` : 'OFF');

    store('master_volume', value / 100);
    // Set modifier
    // tips.TypeModifier = parseInt(elFunTipsSlider.value) / 100;
}



/*------------EVENT LISTENERS--------------*/
document.addEventListener('keydown', event => {

    if(event.key == " ") {
        event.preventDefault();   
    }

    // Close/Accept dialog
    // if(dialogOpen) {
    //     if(event.key == "Escape"){
    //         closeDialog();
    //     } else if(event.key == "Enter"){
    //         closeDialog(true);
    //     }
    // }

    // Close theme switcher
    // if(themeSwitcherOpen || cosmeticSwitcherOpen) {
    //     if(event.key == "Escape"){
    //         closeDialog();
    //     }
    // }

    // When on main page send to keybind handler
    // keybindHandler(event);

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
    if(themeSwitcherOpen || cosmeticSwitcherOpen) {
        if(event.key == "Escape"){
            closeDialog();
        }
        return;
    }

    // When on main page send to keybind handler
    keybindHandler(event, 'keyup');
});


/*-----------------------Keybinds-------------------*/
//#region

var keyTrigger = [0, 0, 0, 0]; // Variable achievement(s) test for
var keyCombo = '';
const keyCodes = [
    'ArrowUp ArrowUp ArrowDown ArrowDown ArrowLeft ArrowRight ArrowLeft ArrowRight B A Enter ',
    'G A M I N G ',
    'J J C V I P ',
    'P I N E A P P L E ',
];
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

    // Stop if keybinds are being ignored
    if(
        store("disableKeybinds") == "true"
        || dialogOpen == true
        || document.activeElement.nodeName == 'TEXTAREA'
        || document.activeElement.nodeName == 'INPUT'
        || keybindsMenuOpen
    ) return;


    keyCombo += key + ' ';
    // Keyboard combos //
    //#region 
    // Konami Code
    if(keyCombo == keyCodes[0]) {
        console.log('Konami Code entered');
        keyCombo = '';
        keyTrigger[0] = 1;
        confetti();
    }
    // gaming
    else if(keyCombo == keyCodes[1]) {
        console.log('gaming Code entered');
        keyCombo = '';
        keyTrigger[1] = 1;
        setTheme('theme_retro');
    }
    // JJCVIP
    else if(keyCombo == keyCodes[2]) {
        console.log('JJ Code entered');
        keyCombo = '';
        keyTrigger[2] = 1;
        openDialog('Are you sure you want to CARROT?', 'All of your CARROT will be lost.', 'Carrot', 'button_orange', 'hello');
    }
    // Pineapple
    else if(keyCombo == keyCodes[3]) {
        console.log('Pineapple Code entered');
        keyCombo = '';
        keyTrigger[3] = 1;
        setCosmetic('pineapple');
    }

    // Check if string is on track to be correct or not
    for(i = 0; i < keyCombo.length; i++) {
        if(keyCombo[i] != keyCodes[0][i]
        && keyCombo[i] != keyCodes[1][i]
        && keyCombo[i] != keyCodes[2][i]
        && keyCombo[i] != keyCodes[3][i]) {
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
    if(store("disableKeybinds") == "true" || dialogOpen == true || document.activeElement.id == 'notificationLength') return;

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
        openDialog('Are you Sure you want to Prestige?', 'Your carrots, characters, and upgrades will be lost, but you will gain a permanent earnings boost.', 'Prestige', 'button_gold', 'prestige');
    }

    // Inventory
    // else if(key == settings.keybinds['key_inventory']) {
    //     console.log('inventory');
    //     openDialog('test', 'test');
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
    localStorage.setObject('settings', settings);
    console.log(action, key);
}


// User-friendly key translation
function interpretKey(key) {
    if(key == ' ') {
        return 'Spacebar';
    }


    return capitalizeFL(key);
}


// var keybindsLS = localStorage.getItem("keybinds");
// if(keybindsLS=="false"){
//     elDisableKeybinds.checked=true;
// }
// //Keyboard Event listener and checkboxing
// function KeyBinds() {
//     //checkbox
  
//     //checking checkbox
//     if (elDisableKeybinds.checked == true){
//         toast("Settings","Keybinds are Disabled","red");
//         window.removeEventListener('keydown',keybinds);
//         localStorage.setItem("keybinds","false");
//         return;
//     }

//     window.addEventListener('keydown',keybinds);
//     localStorage.setItem("keybinds","true");
// }

// KeyBinds();

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

// Reward user
function giveReward(reward) {
    if(reward == false) return;
    console.log('Unlocked: ' + reward);
    let [rewardType, rewardName] = reward.split(':');
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
    if(achieve.hasOwnProperty('reward')) {
        let reward = achieve.reward;

        // Check if there are multiple rewards
        if(Array.isArray(achieve.reward) == true) {
            for(let i = 0; i < achieve.reward.length; i++) {
                giveReward(achieve.reward[i]);
            }
        } else {
            giveReward(reward);
        }
    }

    // Give pages
    if(achieve.pages != false && achieve.pages != null) {
        player.pages += achieve.pages;
        pagesCount();
    }

    // Update achievement list
    if(currentPanel == "achievements-panel") {
        populateAchievements();
    }

    achievementProgress();
}

// Unlock themes/cosmetics
// var playerThemes =    [];
// var playerCosmetics = [];
function unlock(type, thingToUnlock, subtype) {
    if(isUnlocked(type, thingToUnlock, subtype)) {
        console.warn(`${type}:${subtype != false ? '/'+subtype : ''}${thingToUnlock} is already unlocked`);
        return;
    }
    console.log('unlock(): ' + type + ':' + thingToUnlock);

    // Theme
    if(type == 'theme') {
        player.themes.push(thingToUnlock);
        populateThemeList();
    }
    // Cosmetic
    else if(type == 'cosmetic') {
        // For bundles
        if(subtype == 'bundle') {
            console.log('Unlocking a cosmetic bundle! ' + subtype + thingToUnlock);
            // let bundle = cosmetics.bundle[thingToUnlock];

            // for(let i = 0; i < bundle.length; i++) {
            //     let key = bundle.keys[i];
            //     let ntarget = bundle[key];

            //     console.log(`unlock('cosmetic', ${key}, ${ntarget})`);

            //     // if(key == 'name' || key == 'preview' || key == 'desc') continue;
            //     unlock('cosmetic', key, ntarget);
            // }

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

        playerCosmeticsCount();
    }
    // Character
    else if(type == 'character') {
        player.characters[thingToUnlock] = true;
        dom(`${thingToUnlock}_box`).classList.remove('char_locked');
        playerCharKeys = Object.keys(player.characters)

        if(playerCharKeys.length == 5) {
            dom('more_chars_tooltip').classList.add('char_locked');
        }
    }
}

// Test if a character is unlocked
function characterQuery(char) {
    if(player.characters.hasOwnProperty(char)) return true;
    return false;
}

// Test if player has an achievement - True = yes, False = no
function achieveQuery(key) {
    if(player.achievements[key] == true) {
        return true
    } else return false;
}

// Test if theme is unlocked or not
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
            if(key == player.cosmetics[subtype][i]) {
                return true;
            }
        }
        return false;
    }
    // Does not return anything for characters
}


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

// Get cosmetics count
let playerCosmeticsKeys = Object.keys(player.cosmetics);
var playerCosmetics = 0;
var cosmeticsTypes = 0;
function playerCosmeticsCount() {
    for(i = 0; i < playerCosmeticsKeys.length; i++) {
        cosmeticsTypes++;
        let target = player.cosmetics[ playerCosmeticsKeys[i] ];
        for(t = 1; t < target.length; t++) {
            playerCosmetics++;
        }
    }

    return playerCosmetics;
}
playerCosmeticsCount();



/* Item/crafting system */
const items = {
    'carrot_pot_pie': {
        'name': 'Carrot Pot Pie',
        'desc': 'Made with carrot-based meat alternatives of course.',
        'recipe': {
            'carrot': 24,
            'dough': 4,
        }
    },
    'carrot_cookie': {
        'name': 'Carrot Cookie',
        'desc': 'Delicious',
        'recipe': {
            'carrot': 24,
            'dough': 4,
        },
        // Crafting this unlocks Cookie cosmetic, or maybe you can craft the cookie cosmetic with these
    }
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
    toast('Settings', 'Keybinds set to defaults')
}



/* --------------- On page load --------------- */
// Runs on startup, after JS is loaded



function onLoad() {
    console.log('Running onLoad()');

    // Flag for early playtesters
    store('playtest', 'yes');


    // Start music
    // playMusic('music.m4a');


    /* --------------- PLAYER OBJECT --------------- */
    // player object compatibility check (because of the way the player object is created and saved, any new properties added to the player template will not carry over)
    //#region 
    if(player.hasOwnProperty('achievements') == false) {
        console.log('player.achievements check failed, creating property...');
        player.achievements = {};
    }
    if(
    player.hasOwnProperty('themes') == false
    || player.themes == []
    || player.themes.length == 0
    ) {
        console.log('player.themes check failed, creating property...');
        player.themes = [
            'theme_dark',
            'theme_light',
            'theme_oled'
        ];
    }
    if(player.hasOwnProperty('cosmetics') == false
    || player.cosmetics == []
    || player.cosmetics.length == 0
    ) {
        console.log('player.cosmetics check failed, creating property...');
        player.cosmetics = [
            'default'
        ];
    }

    // Old lifetime stats
    // LifetimeCarrots: 0,
    // LifetimeGoldenCarrots: 0,
    // LifetimeEquipedHoes: 0,

    if(
    player.hasOwnProperty('LifetimeCarrots') == true
    || player.hasOwnProperty('LifetimeGoldenCarrots') == true
    || player.hasOwnProperty('LifetimeEquipedHoes') == true
    || player.hasOwnProperty('clickSpeedRecord') == false
    || player.lifetime.hasOwnProperty('clicks') == false
    || player.hasOwnProperty('characters') == false
    || player.hasOwnProperty('achievements') == false
    || player.hasOwnProperty('prestige') == false
    || player.hasOwnProperty('prestige_available') == false
    || player.hasOwnProperty('inventory') == false
    || player.hasOwnProperty('cosmetic') == true
    || typeof player.cosmetics != 'object'
    || settings.hasOwnProperty('full_numbers') == false
    || settings.hasOwnProperty('cosmetics_grid') == false
    ) {
        if(store('old_player_object_fix') !== 'true') {
            toast('Old save file detected', 'Heads up: If you run into any issues you may have to delete your save.', 'orange', true);
            player.lifetime.carrots = player.LifetimeCarrots;
            player.lifetime.golden_carrots = player.LifetimeGoldenCarrots;
            player.lifetime.hoes.equipped[0] = player.LifetimeEquipedHoes;
            
            store('old_player_object_fix', '1.8.3');

            console.warn('Old save file detected: If you run into any issues you may have to delete your save.');
        }
    }
    //#endregion

    /* --------------- SETTINGS --------------- */
    // Set default settings if not found in localstorage
    //#region 

    // > Settings object moved to carrot_clicker.js <

    populateKeybinds();

    // Fun tips
    elFunTipsSlider.value = 100 * tips.TypeModifier;
    eInnerText(elFunTipsSlider_label, elFunTipsSlider.value);

    // Notification length
    if(store("notificationLength") != null) {
        notificationLength.value = parseInt(store("notificationLength"));
    }

    // Autosave
    // Update autosave variable
    if(settings.autosave_interval != 2) {
        dom('autosave_interval').value = settings.autosave_interval;
        clearInterval(autosave);
        autosave = setInterval(() => {
            saveGame();
        }, settings.autosave_interval * 1000);
    }


    // Disable keybinds
    if(store("disableKeybinds") == null) {
        store("disableKeybinds", "false");
    } else {
        if(store("disableKeybinds") == "false") {
            elDisableKeybinds.checked = false;
        } else {
            elDisableKeybinds.checked = true;
        }
    }

    // Full numbers
    dom('full_numbers').checked = settings.full_numbers;

    // Main progress bar
    if(store('enableMainProgress') == null) {
        console.log('enableMainProgress not found in localStorage, creating...')
        store('enableMainProgress', 'true');
    } else {
        console.log('enableMainProgress: ' + store("enableMainProgress"));
        if(store("enableMainProgress") == "true") {
            elEnableMainProgress.checked = true;
        } else {
            elEnableMainProgress.checked = false;
        }
    }

    // Enable Sounds
    if(store('enableSounds') == null) {
        console.log('enableSounds not found in localStorage, creating...')
        store('enableSounds', 'true');
    } else {
        console.log('enableSounds: ' + store("enableSounds"));
        if(store("enableSounds") == "true") {
            elEnableSounds.checked = true;
        } else {
            elEnableSounds.checked = false;
        }
    }

    // Moved to bottom as a test

    // Volume slider
    if(store('master_volume') !== null) {
        elVolumeMaster.value = store('master_volume') * 100;
        eInnerText(elVolumeMaster_label, `${store('master_volume') * 100}%`);
        volume = store('master_volume');
    }

    // Enable Music
    if(store('enableMusic') == null) {
        console.log('enableMusic not found in localStorage, creating...')
        store('enableMusic', 'false');
    } else {
        console.log('enableMusic: ' + store("enableMusic"));
        if(store("enableMusic") == "true") {
            elEnableMusic.checked = true;
        } else {
            elEnableMusic.checked = false;
        }
    }
    // Enable Carrot Sounds
    if(store('enableCarrotSounds') == null) {
        console.log('enableCarrotSounds not found in localStorage, creating...')
        store('enableCarrotSounds', 'true');
    } else {
        console.log('enableCarrotSounds: ' + store("enableCarrotSounds"));
        if(store("enableCarrotSounds") == "true") {
            elEnableCarrotSounds.checked = true;
        } else {
            elEnableCarrotSounds.checked = false;
        }
    }

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
    if(store('openpanel') != null) {
        console.log('openpanel found, switching to: ' + store('openpanel'));
        panelChange(store('openpanel'), true);
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

        if(achievement.mystery.list == true) {
            hiddenAchievements++;
        }
    }

    // Populate achievements if said tab is open
    if(currentPanel == "achievements-panel") {
        populateAchievements();
    }
    achievementProgress();

    // URL hashes
    if(location.hash == '#automute' || location.has == '#mute') {
        elEnableSounds.checked = false;
        settingSounds();
    } else if(location.hash == '#cheatmode') {
        // Achievements
        for(let i = 0; i < achievementsKeys.length; i++) {
           grantAchievement(achievementsKeys[i])
        }

        // Themes
        for(let i = 0; i < themesKeys.length; i++) {
            unlock('theme', themesKeys[i])
        }

        // Cosmetics
        // for(let i = 0; i < cosmeticsKeys.length; i++) {
        //     unlock('cosmetic', cosmeticsKeys[i])
        // }
        for(let t = 0; t < cosmeticsKeys.length; t++) {
            let key = cosmeticsKeys[t];
            let target = cosmetics[key];

            // Loop through cosmetics
            for(let c = 0; c < target['keys'].length; c++) {
                unlock('cosmetic', target.keys[c], key);
            }
        }

        // Characters
        unlock('character', 'belle');
        unlock('character', 'greg');
        unlock('character', 'charles');
        unlock('character', 'carl');
    }
    


    /* --------------- TUTORIAL --------------- */
    // Initial Welcome
    // if(store("tutorial_sample") == null) {
    //     store("tutorial_sample", "done");
    //     toast("Please Wait", "As a temporary fix, the page will refresh after a few seconds. Hang on!", "red", true);
    // } else if(store("tutorial_sample") == "done") {
    //     // Temporary two step until someone fixes the storage issue
    //     store("tutorial_sample", "really_done");
    //     toast("Welcome to Carrot Clicker!", "Click the carrot to farm. Spend your carrots on hiring/upgrading new workers. Eventually you will be able to buy them better tools to work with. Good luck!", "", true);
    // }
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

    // Check that the players' page count is correct
    let pagesIntended = 0;
    for(let i = 0; i < achievementsKeys.length; i++) {
        let key = achievementsKeys[i];
        let achieve = achievements[key];

        if(achieveQuery(key) && achieve.pages != false && achieve.pages != null) {
            pagesIntended += achieve.pages;
        }
    }

    if(player.pages !== pagesIntended) {
        console.warn('Achievement page rewards have been changed');
        toast('Page Rewards Changed', `The page rewards for completing achievements have been changed. Your Page count has been changed to reflect those changes ${player.pages} -> ${pagesIntended})`, 'orange', true);

        if(player.pages)

        player.pages = pagesIntended;
    }

    console.log(pagesIntended);

    
    // Disable
    optionSoundsDisable(store('enableSounds') == 'true' ? true : false);




    /* -------------------- Fill out page -------------------- */
    // Put things on page
    carrotCount();
    characterPrices();
    updateCharlesShop();
    pagesCount();
    DisplayAllHoes();

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
