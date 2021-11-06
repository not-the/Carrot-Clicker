/* -------------------------------------------------------------
Users settings, keybind handling, and tutorial handling
------------------------------------------------------------- */

const notificationLength = dom("notificationLength");
const elDisableKeybinds = dom("disable_keybinds");

/*---------------OPTIONS-------------------*/
// Temporary option thing
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

// Disable keybinds setting
function settingDisableKeybinds() {
    let state = elDisableKeybinds.checked;
    console.log(`disableKeybinds set to ${state}`);
    toast("Settings", `Keybinds are now ${state == true ? 'disabled' : 'enabled'}`);

    // localStorage
    if(state == true) {
        store('disableKeybinds', 'true');
    } else {
        store('disableKeybinds', 'false');
    }
}


/*------------EVENT LISTENERS--------------*/
document.addEventListener('keydown', event => {

    // Close/Accept dialog
    if(dialogOpen) {
        if(event.key == "Escape"){
            closeDialog();
        } else if(event.key == "Enter"){
            closeDialog(true);
        }
    }

    // Close theme switcher
    if(themeSwitcherOpen) {
        if(event.key == "Escape"){
            closeDialog();
        }
    }

    // When on main page send to keybind handler
    keybindHandler(event);

});

document.addEventListener('keyup', event => {
    if(
        store("disableKeybinds") == "true"
        || dialogOpen == true
        || document.activeElement.id == 'notificationLength'
    ) return;

        
    if(event.key == " "){
        onClick(false);
    }
});


/*-----------------------Keybinds-------------------*/
//#region


//defining keybinds
function keybindHandler(event){
    // End function if keybinds are disabled, a dialog box is open, or an input field is focused
    if(
        store("disableKeybinds") == "true"
        || dialogOpen == true
        || document.activeElement.id == 'notificationLength')
        return;

    // Multibuy
    if(event.key == "Shift"){
        multibuySpin();
    }
    // Carrot click
    else if(event.key == " "){
        event.preventDefault();
    }

    //Level up
    else if(event.key=="1" && event.altKey==false && event.ctrlKey==false){
        LevelUp(Boomer_Bill,multibuy[multibuySelector]);
    }
    else if(event.key=="2" && event.altKey==false && event.ctrlKey==false){
        LevelUp(Belle_Boomerette,multibuy[multibuySelector]);
    }
    else if(event.key=="3" && event.altKey==false && event.ctrlKey==false){
        LevelUp(Gregory,multibuy[multibuySelector]);
    }

    // Hoes
    else if(event.key=="4" && event.altKey==false && event.ctrlKey==false){
        CreateHoe(0,multibuy[multibuySelector]);
    }
    else if(event.key=="5" && event.altKey==false && event.ctrlKey==false){
        CreateHoe(1,multibuy[multibuySelector]);
    }
    else if(event.key=="6" && event.altKey==false && event.ctrlKey==false){
        CreateHoe(2,multibuy[multibuySelector]);
    }
    else if(event.key=="7" && event.altKey==false && event.ctrlKey==false){
        CreateHoe(3,multibuy[multibuySelector]);
    }
    else if(event.key=="8" && event.altKey==false && event.ctrlKey==false){
        CreateHoe(4,multibuy[multibuySelector]);
    }
    else if(event.key=="9" && event.altKey==false && event.ctrlKey==false){
        CreateHoe(5,multibuy[multibuySelector]);
    }


    else if(event.key=="4" && event.altKey==true && event.ctrlKey==false){
        EquipHoe(Boomer_Bill,0,multibuy[multibuySelector]);
    }
    else if(event.key=="5" && event.altKey==true && event.ctrlKey==false){
        EquipHoe(Boomer_Bill,1,multibuy[multibuySelector]);
    }
    else if(event.key=="6" && event.altKey==true && event.ctrlKey==false){
        EquipHoe(Boomer_Bill,2,multibuy[multibuySelector]);
    }
    else if(event.key=="7" && event.altKey==true && event.ctrlKey==false){
        EquipHoe(Boomer_Bill,3,multibuy[multibuySelector]);
    }
    else if(event.key=="8" && event.altKey==true && event.ctrlKey==false){
        EquipHoe(Boomer_Bill,4,multibuy[multibuySelector]);
    }
    else if(event.key=="9" && event.altKey==true && event.ctrlKey==false){
        EquipHoe(Boomer_Bill,5,multibuy[multibuySelector]);
    }

    else if(event.key=="4" && event.altKey==false && event.ctrlKey==true){
        event.preventDefault();
        EquipHoe(Belle_Boomerette,0,multibuy[multibuySelector]);
    }
    else if(event.key=="5" && event.altKey==false && event.ctrlKey==true){
        event.preventDefault();
        EquipHoe(Belle_Boomerette,1,multibuy[multibuySelector]);
    }
    else if(event.key=="6" && event.altKey==false && event.ctrlKey==true){
        event.preventDefault();
        EquipHoe(Belle_Boomerette,2,multibuy[multibuySelector]);
    }
    else if(event.key=="7" && event.altKey==false && event.ctrlKey==true){
        event.preventDefault();
        EquipHoe(Belle_Boomerette,3,multibuy[multibuySelector]);
    }
    else if(event.key=="8" && event.altKey==false && event.ctrlKey==true){
        event.preventDefault();
        EquipHoe(Belle_Boomerette,4,multibuy[multibuySelector]);
    }
    else if(event.key=="9" && event.altKey==false && event.ctrlKey==true){
        event.preventDefault();
        EquipHoe(Belle_Boomerette,5,multibuy[multibuySelector]);
    }

    // Close all Toasts
    else if(event.key == 'x') {
        event.preventDefault();
        clearToasts();
    }
    
    //settings and prestige
    else if(event.key=="Backspace" && event.altKey==false && event.ctrlKey==true){
        event.preventDefault();
        openDialog('Are you sure?', 'Your progress will be lost forever!', 'Delete Save Data', 'button_red', 'clearsave');
    }
    else if(event.key=="p"){
        openDialog('Are you Sure you want to Prestige?', 'Your carrots, characters, and upgrades will be lost, but you will gain a permanent earnings boost.', 'Prestige', 'button_gold', 'prestige');
    }
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




// Runs on startup
//#region
// Set default settings if not found in localstorage
if(store("notificationLength") !== null) {
    notificationLength.value = parseInt(store("notificationLength"));
}

if(store("disableKeybinds") == null) {
    store("disableKeybinds", "false");
} else {
    if(store("disableKeybinds") == "false") {
        elDisableKeybinds.checked = false;
    } else {
        elDisableKeybinds.checked = true;
    }
}


/* --------------- TUTORIAL --------------- */
// Initial Welcome
if(store("tutorial_sample") == null) {
    store("tutorial_sample", "done");
    toast("Please Wait", "As a temporary fix, the page will refresh after a few seconds. Hang on!", "red", true);
} else if(store("tutorial_sample") == "done") {
    // Temporary two step until someone fixes the storage issue
    store("tutorial_sample", "really_done");
    toast("Welcome to Carrot Clicker!", "Click the carrot to farm. Spend your carrots on hiring/upgrading new workers. Eventually you will be able to buy them better tools to work with. Good luck!", "", true);
}

// After Greg crafts a hoe for the first time (Called in carrot_clicker.js)
function tutorialHoes() {
    store('tutorial_first_hoe', "done");
    toast("You've created your first hoe!", "To equip it, click one of the glowing hoes on either Bill or Belle. The character will recieve a permanent buff, but remember that equipping a hoe is irreversible (for now).", "", true);
}
//#endregion







/* --------------- ACHIEVEMENTS --------------- */
// class achievement {
//     constructor(name, desc, image, reward, requirement) {
//         this.name = name;
//         this.desc = desc;
//         this.requirement = requirement;
//     }
// }

// Loop through achievements
// for(let entry in achievements) {
//     console.log(`${entry}:${achievements[entry]}`);
// }

const achievements = {

    // Template
    // 'template': {
    //     'name': 'Achievement',
    //     'desc': 'Description',
    //     'image': './assets/achievements/generic.png',
    //     'reward': 'Reward',
    //     'conditions': '',
    //     'rarity': '0'
    // },

    // Carrots
    '1_carrot': {
        'name': 'First Carrot',
        'desc': 'Farming is hard',
        'image': '',
        'reward': 'function:confetti',
        'conditions': ['player.LifetimeCarrots', 1]
    },
    // Golden Carrots
    '50_golden_carrots': {
        'name': 'Golden',
        'desc': 'Earn at least 50 golden carrots',
        'image': false,
        'reward': ['cosmetic:golden_carrot', 'function:confetti'],
        'conditions': ['player.LifetimeGoldenCarrots', 50]
    },
    // Character usage
    'upgrade_all_characters_once': {
        'name': '3 heads are better than one',
        'desc': 'Upgrade every (upgradeable) character at least once',
        'image': false,
        'reward': ['theme:theme_red', 'theme:theme_green', 'theme:theme_blue'],
        'conditions': [
            ['Boomer_Bill.lvl',      2],
            ['Gregory.lvl',          1],
            ['Belle_Boomerette.lvl', 1],
        ]
    },
    'bill_lvl_100': {
        'name': 'Bill of the Century',
        'desc': 'Upgrade Bill 100 times',
        'image': '',
        'reward': false,
        'conditions': ['Boomer_Bill.lvl', 100]
    },
    'greg_lvl_64': {
        'name': 'Professional Crafter',
        'desc': 'Upgrade Greg 64 Times',
        'image': './assets/tools/diamond_hoe.png',
        'reward': 'theme:theme_blockgame',
        'conditions': ['Gregory.lvl', 64]
    },
    'use_charles': {
        'name': 'Raw Knowledge',
        'desc': 'Give Charles a Golden Carrot in exchange for his knowledge',
        'image': './assets/characters/Charles.png',
        'reward': false,
        'conditions': ['external.charles_uses', 1]
    },

    // Tutorial
    'first_hoe': {
        'name': 'First Hoe',
        'desc': 'Tutorial',
        'image': false,
        'reward': 'function:tutorialHoes',
        'conditions': ['Gregory.Hoes[0]', 1],
        'noToast': true
    },
    '1_netherite_hoe': {
        'name': '1_netherite_hoe',
        'desc': 'Netherite',
        'image': './assets/tools/netherite_hoe.png',
        'reward': false,
        'conditions': ['Gregory.Hoes[5]', 1],
    }
}
const achievementsKeys = Object.keys(achievements);

// Test achievement conditions every 5 seconds
setInterval(() => {
    // if(achieve.hasOwnProperty('conditions') || achieve.conditions !== false) {
    //     console.log( achieve.conditions.split('/') );
    // }

    // Loop through achievements test if player has earned them
    for(let i = 0; i < achievementsKeys.length; i++) {
        let key = achievementsKeys[i];
        let achievement = achievements[key];

        // console.log(achievement.name);
        evaluateConditions(key, achievement);
    }
}, 5000);

// Achievement Conditions converter
function evaluateConditions(key, achievement) {
    let multicondition = false;
    var multiamount = 0;
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

            if(multicondition == true && multiamount == multifulfilled) {
                grantAchievement(key);
            } else if(multicondition == false) {
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
        for(let i = 0; i < achievement.conditions.length; i++) {
            // console.log(achievement.conditions[i]);
            multiamount++;
            tests(key, achievement.conditions[i]);
        }
        // console.log(`${key}: ${multifulfilled}/${multiamount}`);
    }
}

// Reward user
function giveReward(reward) {
    // console.log('Unlocked: ' + reward);
    let rewardType = reward.split(':')[0];
    let rewardName = reward.split(':')[1];
    // console.log(rewardType, rewardName);

    // Theme or Cosmetic reward
    if(rewardType == 'theme' || rewardType == 'cosmetic') {
        unlock(rewardType, rewardName);
    }
    // Function reward
    else if(rewardType == 'function') {
        // Run specified function
        var rewardFunction = Function(`${rewardName}()`);
        rewardFunction();
    }
}

// Grant Achievement (Takes in object key)
function grantAchievement(key) {
    let achieve = achievements[key];

    // Notification
    console.log(`Achievement earned: ${achieve.name} (${key})`);
    if(achieve.noToast !== true) {
        toast(`Achievement earned: ${achieve.name}`, achieve.desc);
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

}

// Unlock themes/cosmetics
// var playerThemes =    [];
// var playerCosmetics = [];
function unlock(type, thingToUnlock) {
    console.log('unlock(): ' + type + ':' + thingToUnlock);

    // isUnlocked() goes here

    if(type == 'theme') {
        player.themes.push(thingToUnlock);

        populateThemeList();
    } else if(type == 'cosmetic') {
        player.cosmetics.push(thingToUnlock);
    }
}

// Test if player has an achievement - True = yes, False = no
function achieveQuery(key) {
    if(player.achievements[key] == true) {
        return true
    } else return false;
}

// Test if theme is unlocked or not
function isUnlocked(testfor) {
    for(let i = 0; i < player.themes.length; i++) {
        if(testfor == player.themes[i]) {
            return true;
        }
    }
    return false;
}

// Unlock on page load
// for(i = 0; i < player.unlockables.length; i++) {
//     console.log(player[unlockables][i]);
// }



// On page load
populateThemeList();
themeSwitcherCheckmark(store('theme'));


// player object compatibility check (because of the way the player object is created and saved, any new properties added to the player template will not carry over)
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