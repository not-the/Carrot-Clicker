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

// Percentage of fun tips
// JJ's Slider stuffs (ripping off w3 again)

// Update the current slider value (each time you drag the slider handle)
elFunTipsSlider.oninput = () => {
    // Update percentage
    eInnerText(elFunTipsSlider_label, elFunTipsSlider.value);
    
    // Set modifier
    tips.TypeModifier = parseInt(elFunTipsSlider.value) / 100;
}

// Notification length
function saveOption() {
    let value = notificationLength.value;
    if(value >= 2 && value <= 15) {
        console.log(`[Settings] Notification length set to: ${value}`);
        store("notificationLength", value);
        toast("Notification time set", `Notifications will disappear after ${value} seconds`,
        '', false, true);
    } else {
        toast("Invalid Number", "Must be between 2 and 15 seconds", "red",
        '', false, true);
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
const elEnableMainProgress = dom('enable_main_progress');
function settingMainProgress() {
    let state = elEnableMainProgress.value;
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
    let value = elVolumeMaster.value;

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

    // Close/Accept dialog
    if(dialogOpen) {
        if(event.key == "Escape"){
            closeDialog();
        } else if(event.key == "Enter"){
            closeDialog(true);``
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

var keyCombo = '';
const keyCodes = [
    'ArrowUp ArrowUp ArrowDown ArrowDown ArrowLeft ArrowRight ArrowLeft ArrowRight b a Enter '
]
//defining keybinds
function keybindHandler(event){
    keyCombo += event.key + ' ';
    if(keyCombo.substring(0, keyCodes[0].length) == keyCodes[0]) {
        keyCombo == '';
        console.log('resetting keyCombo');
    }
    // Konami Code
    if(keyCombo == keyCodes[0]) {
        keyCombo = '';
        console.log('Konami Code entered');
        confetti();
    }
    console.log(keyCombo);




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

// For the conditions parameter:
// - First (0) value is the variable you want to test- will also accept a function
// - Second (1) value is the minimum required for the achievement (at the moment it will only test if the FIRST is greater than or equal to the SECOND)
// If you need to test for anything other than if FIRST >= SECOND you can simply use a function and only return a passing number if it comes out to true
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
        'image': './assets/achievements/1_carrot.png',
        'reward': false,
        'conditions': ['player.lifetime.carrots', 1],
        'mystery': {
            'name': false,
            'desc': false,
            'image': false,
            'noToast': false,
        }
    },
    'bill_lvl_2': {
        'name': 'Two\'s Company',
        'desc': 'Upgrade Bill and attract the attention of another farmer',
        'image': './assets/achievements/bill_and_belle.png',
        'reward': 'character:belle',
        'conditions': ['Boomer_Bill.lvl', 2],
        'mystery': {
            'name': true,
            'desc': false,
            'image': false,
            'noToast': false,
        }
    },
    '5000_carrot': {
        'name': 'Heavy Metal',
        'desc': 'Earn enough carrots to get the attention of a blacksmith',
        'image': './assets/achievements/unlock_greg.png',
        'reward': 'character:greg',
        'conditions': ['player.lifetime.carrots', 5000],
        'mystery': {
            'name': true,
            'desc': false,
            'image': false,
            'noToast': false,
        }
    },
    '1_prestige': {
        'name': 'Prestigious',
        'desc': 'Prestige for the first time and attract the attention of the professor',
        'image': './assets/achievements/prestige_once.gif',
        'reward': 'character:charles',
        'conditions': ['player.lifetime.prestige_count', 1],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },
    '10_prestiges': {
        'name': 'Wibbly Wobbly',
        'desc': 'Prestige ten times',
        'image': false,
        'reward': 'function:confetti',
        'conditions': ['player.lifetime.prestige_count', 10],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },
    'own_a_theme': {
        'name': 'Taking in the Themery',
        'desc': 'Obtain a cosmetic! You\'ve gained the attention of an artist.',
        'image': './assets/achievements/themery.png',
        'reward': 'character:carl',
        'conditions': [
            ['player.themes.length', 4],
            ['player.cosmetics.length', 2],
        ],
        'condition_amount': 1,
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },
    '401000_carrot': {
        'name': 'Retirement Fund',
        'desc': 'Earn 401k carrots. I don\'t think you know what a 401k is.',
        'image': './assets/achievements/401k.png',
        'reward': 'function:confetti()',
        'conditions': ['player.lifetime.carrots', 401000],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },
    '1_million_carrots': {
        'name': 'Me Millionth Carrot',
        'desc': 'Earn your 1 millionth carrot',
        'image': './assets/achievements/1_million_carrots.png',
        'reward': 'function:confetti()',
        'conditions': ['player.lifetime.carrots', 1000000],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },
    '1_billion_carrots': {
        'name': 'Boomer Bill Gates',
        'desc': 'Earn your 1 billionth carrot',
        'image': './assets/achievements/boomer_bill_gates.png',
        'reward': 'function:confetti()',
        'conditions': ['player.lifetime.carrots', 1000000000],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },
    '1_trillion_carrots': {
        'name': 'Lifetime Supply',
        'desc': 'Earn your 1 trillionth carrot. Phew!',
        'image': './assets/achievements/carrot_pile.png',
        'reward': 'function:confetti()',
        'conditions': ['player.lifetime.carrots', 1000000000000],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },
    '1_quadrillion_carrots': {
        'name': 'A World Fed',
        'desc': 'Earn your 1 quadrillionth carrot. Earth\'s hunger problem is now solved.',
        'image': './assets/achievements/earth.png',
        'reward': 'function:confetti()',
        'conditions': ['player.lifetime.carrots', 1000000000000000],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },
    '1_quintillion_carrots': {
        'name': 'Carrot Singularity', // 'What Do We Even Do With This Many?'
        'desc': 'Earn your 1 QUINTILLIONTH carrot.',
        'image': false,
        'reward': 'function:confetti()',
        'conditions': ['player.lifetime.carrots', 1000000000000000],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },

    // Misc
    '9000_cpc': {
        'name': 'There\'s a Joke Here Somewhere',
        'desc': 'Get your Carrots Per Click (Click power level™️) over 9000',
        'image': './assets/achievements/9000.png',
        'reward': false,
        'conditions': ['player.cpc', 9000],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },
    '1000_cps': {
        'name': 'Time is Hungry',
        'desc': 'Produce 1000 carrots every second',
        'image': false,
        'reward': false,
        'conditions': ['player.cps', 100000],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },
    '100000_cps': {
        'name': 'Six Figure Income',
        'desc': 'Get your Carrots Per Second above 100,000',
        'image': false,
        'reward': false,
        'conditions': ['player.cps', 100000],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },


    // Golden Carrots
    '50_golden_carrots': {
        'name': 'Golden',
        'desc': 'Earn 50 golden carrots',
        'image': './assets/achievements/golden.png',
        'reward': ['cosmetic:golden_carrot', 'function:confetti()'],
        'conditions': ['player.lifetime.golden_carrots', 50],
        'mystery': {
            'name': true,
            'desc': false,
            'image': false,
            'noToast': false,
        }
    },
    '1989_golden_carrots': {
        'name': 'Retro',
        'desc': 'Earn 1989 golden carrots',
        'image': './assets/theme/theme_retro.png',
        'reward': 'theme:theme_retro',
        'conditions': ['player.lifetime.golden_carrots', 1989],
        'mystery': {
            'name': true,
            'desc': false,
            'image': false,
            'noToast': false,
        }
    },
    // Character usage
    'upgrade_all_characters_once': {
        'name': '3 Heads Are Better Than One',
        'desc': 'Upgrade every (upgradeable) character at least once',
        'image': './assets/achievements/3_heads.png',
        'reward': ['theme:theme_red', 'theme:theme_green', 'theme:theme_blue'],
        'conditions': [
            ['Boomer_Bill.lvl',      2],
            ['Gregory.lvl',          1],
            ['Belle_Boomerette.lvl', 1],
        ],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },
    'bill_lvl_10': {
        'name': 'Here\s the Bill',
        'desc': 'Upgrade Bill 10 times',
        'image': false,
        'reward': 'function:doNothing()',
        'conditions': ['Boomer_Bill.lvl', 10],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },
    'bill_lvl_100': {
        'name': 'Bill of the Century',
        'desc': 'Upgrade Bill 100 times',
        'image': './assets/achievements/bill_pointer.png', // Needs better art, maybe animated
        'reward': 'cosmetic:bill',
        'conditions': ['Boomer_Bill.lvl', 100],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },
    'belle_lvl_15': {
        'name': 'Saved by the Belle',
        'desc': 'Upgrade Belle 15 times',
        'image': false,
        'reward': 'function:doNothing()',
        'conditions': ['Belle_Boomerette.lvl', 15],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },
    'greg_lvl_20': {
        'name': 'The Gregs of Defeat',
        'desc': 'Upgrade Gregory 20 times',
        'image': false,
        'reward': false,
        'conditions': ['Gregory.lvl', 15],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },
    'greg_lvl_64': {
        'name': 'Professional Crafter',
        'desc': 'Upgrade Gregory 64 Times',
        'image': './assets/achievements/pixel_block.png',
        'reward': ['theme:theme_blockgame', 'cosmetic:blockgame', 'cosmetic:blockgame_potato'],
        'conditions': ['Gregory.lvl', 64],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },
    'use_charles': {
        'name': 'Raw Knowledge',
        'desc': 'Give Charles a Golden Carrot in exchange for his knowledge',
        'image': './assets/characters/Charles.png',
        'reward': 'function:doNothing()',
        'conditions': ['ex_charlesUses()', 1],
        'mystery': {
            'name': true,
            'desc': true,
            'image': true,
            'noToast': false,
        }
    },
    // Misc
    '9_clicks_per_second': {
        'name': 'Gotta Grow Fast',
        'desc': 'Click 9 times in one second',
        'image': './assets/achievements/12_clicks_per_second.png',
        'reward': 'function:doNothing()',
        'conditions': ['player.clickSpeedRecord', 9],
        'mystery': {
            'name': true,
            'desc': false,
            'image': false,
            'noToast': false,
        }
    },
    '13_clicks_per_second': {
        'name': 'Olympic Clicking Games',
        'desc': 'Click 13 times in one second',
        'image': './assets/achievements/16_clicks_per_second.png',
        'reward': false,
        'conditions': ['player.clickSpeedRecord', 13],
        'mystery': {
            'name': true,
            'desc': true,
            'image': true,
            'noToast': false,
        }
    },
    '15_clicks_per_second': {
        'name': 'I am Seed',
        'desc': 'Click 15 times in one second',
        'image': './assets/achievements/21_clicks_per_second.gif',
        'reward': 'cosmetic:cursor',
        'conditions': ['player.clickSpeedRecord', 15],
        'mystery': {
            'name': true,
            'desc': true,
            'image': true,
            'noToast': false,
        }
    },

    // Tutorial
    'first_hoe': {
        'name': 'The Tools to Victory',
        'desc': 'Craft your first hoe (Tutorial milestone)',
        'image': './assets/tools/wood_hoe.png',
        'reward': 'function:tutorialHoes()',
        'conditions': ['player.lifetime.hoes.craftedTotal', 1],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },
    '1_netherite_hoe': {
        'name': 'Extreme Farming',
        'desc': 'Netherite',
        'image': './assets/tools/netherite_hoe.png',
        'reward': 'cosmetic:netherite_hoe',
        'conditions': ['player.lifetime.hoes.crafted[5]', 1],
        'mystery': {
            'name': true,
            'desc': true,
            'image': true,
            'noToast': false,
        }
    },

    // Secret Achievements
    'not_funny': {
        'name': 'Not Funny',
        'desc': 'Upgrade all 3 characters to Level 69 (Hidden achievement)',
        'image': './assets/achievements/nice.png',
        'reward': 'function:confetti()',
        'conditions': ['ex_notFunny()', 1],
        'mystery': {
            'name': true,
            'desc': true,
            'image': true,
            'noToast': false,
            'list': true,
        }
    }
}
const achievementsKeys = Object.keys(achievements);
var hiddenAchievements = 0;

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
    // console.log('Unlocked: ' + reward);
    console.log(reward);
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

    // Update achievement list
    if(currentPanel == "achievements-panel") {
        populateAchievements();
    }

    achievementProgress();
}

// Unlock themes/cosmetics
// var playerThemes =    [];
// var playerCosmetics = [];
function unlock(type, thingToUnlock) {
    console.log('unlock(): ' + type + ':' + thingToUnlock);

    // isUnlocked() goes here

    // Theme
    if(type == 'theme') {
        player.themes.push(thingToUnlock);
        populateThemeList();
    }
    // Cosmetic
    else if(type == 'cosmetic') {
        player.cosmetics.push(thingToUnlock);
        populateCosmeticsList();
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
function isUnlocked(type = 'theme', key) {
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
        for(let i = 0; i < player.cosmetics.length; i++) {
            if(key == player.cosmetics[i]) {
                return true;
            }
        }
        return false;
    }
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
    let value = 0;

    if(
    Charles.ImproveWorkingConditions > 0
    || Charles.BetterHoes > 0
    || Charles.DecreaseWages > 0
    ) {
        value = 1;
    }

    return value;
}

// Not funny
function ex_notFunny() {
    if(Boomer_Bill.lvl == 69 && Belle_Boomerette.lvl == 69 && Gregory.lvl == 69) return 1;
    return 0;
}




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



// Unlock on page load
// for(i = 0; i < player.unlockables.length; i++) {
//     console.log(player[unlockables][i]);
// }


/* --------------- On page load --------------- */
// Runs on startup, after JS is loaded
function onLoad() {
    console.log('Running onLoad()');
    
    // Start music
    playMusic('music.m4a');

    // Put things on page
    carrotCount();

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
    ) {
        if(store('old_player_object_fix') !== 'true') {
            toast('Old save file detected', 'Heads up: If you run into any issues you may have to delete your save.', 'orange', true);
            player.lifetime.carrots = player.LifetimeCarrots;
            player.lifetime.golden_carrots = player.LifetimeGoldenCarrots;
            player.lifetime.hoes.equipped[0] = player.LifetimeEquipedHoes;
            
            store('old_player_object_fix', 'true');

            console.warn('Old save file detected: If you run into any issues you may have to delete your save.');
        }
    }
    //#endregion

    /* --------------- SETTINGS --------------- */
    // Set default settings if not found in localstorage

    // Fun tips
    elFunTipsSlider.value = 100 * tips.TypeModifier;
    eInnerText(elFunTipsSlider_label, elFunTipsSlider.value);

    // Notification length
    if(store("notificationLength") !== null) {
        notificationLength.value = parseInt(store("notificationLength"));
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
        store('enableMusic', 'true');
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


    //#region 
    // Set user theme on page load
    if(store('theme') !== null) {
        let theme = store('theme');
        console.log(`Theme setting found, switching to: ${theme}`);
        // optionTheme.value = theme;
        setTheme(theme);
    }
    // Switch to previously open panel on page load
    if(store('openpanel') !== null) {
        console.log('openpanel found, switching to: ' + store('openpanel'));
        panelChange(store('openpanel'), true);
    }
    // Set user cosmetic on page load
    if(store('cosmetic') !== null) {
        let cosmetic = store('cosmetic');
        console.log(`Cosmetic setting found, switching to: ${cosmetic}`);
        // optionCosmetic.value = cosmetic;
        setCosmetic(cosmetic);
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

    // Automute in URL
    if(location.hash == '#automute' || location.has == '#mute') {
        elEnableSounds.checked = false;
        settingSounds();
    } else if(location.hash == '#cheatmode') {
        for(let i = 0; i < achievementsKeys.length; i++) {
           grantAchievement(achievementsKeys[i])
        }
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
        store("tutorial_sample", "done");
        toast("Welcome to Carrot Clicker!",
        "Click the carrot to farm. Spend your carrots on hiring/upgrading new workers. Eventually you will be able to buy them better tools to work with. Good luck!",
        "", true);
    }

    // Enable unlocked characters
    for(i = 0; i < playerCharKeys.length; i++) {
        let key = playerCharKeys[i];
        if(player.characters[key] == true) {
            unlock('character', key);
        }
    }


    // Theme Switcher
    populateThemeList();
    themeSwitcherCheckmark(store('theme'));
    populateCosmeticsList();
    cosmeticSwitcherCheckmark(store('cosmetic'));

    // Disable
    optionSoundsDisable(store('enableSounds') == 'true' ? true : false);
}

onLoad();
