/*
The Base of the Game is the Objects used to easily store data. 
The core Object is the player. The player object Stores Global Variables not Atributed to another character.
The Character Class Object stores information on each Ingame Character. Currently the active Characters are Boomer_Bill, Belle_Boomerette, and Gregory
The main Game Loop occurs in a setInterval, This loop handles anything that needs to be Constantly checked, Displayed, Or Run.
*/

// Error message if game hasnt loaded in 1 second
let loadCheck = false;
setTimeout(() => {
    if(loadCheck == false) {
        toast('Game crash', 'The game has taken more than 2 seconds to load. It\'s likely that an error has occured, causing either a partial or full game crash. Feel free to contact us if you see this.', 'red', true)
    }
}, 1000);

//variables to prevent spamclicking
var n = 0;

/*------------Page Setup---------------*/
//#region

// Hacky solution to carrot not animating on mobile
// https://stackoverflow.com/a/56140328/11039898
document.addEventListener("touchstart", function() {}, true);

// Getting InnerHtml
const elMainPrestigePotential = dom("main_prestige_potential");
const elPrestigePotential = dom('prestige_potential');
const Basic_Info =          dom("Basic_Info");
const elCarrotCount =       dom("Carrot_Count");
const elCPC =               dom("cpc");
const elCPS =               dom("cps");
const elCashCount =         dom("cash_count");
const elGoldenCarrotCount = dom("golden_carrot_count");
const elTips =              dom("Tip");
const elCharacterUpCost = {
    bill:  dom("UpBillCost"),
    belle: dom("UpBelleCost"),
    greg:  dom("UpGregCost")
};
const elCharacterLevel = {
    bill:  dom("Bill_lvl"),
    belle: dom("Belle_lvl"),
    greg:  dom("Greg_lvl") 
};
const elHoes = {
    bill: [
        dom("bill_wooden_hoe"),
        dom("bill_stone_hoe"),
        dom("bill_iron_hoe"),
        dom("bill_gold_hoe"),
        dom("bill_diamond_hoe"),
        dom("bill_netherite_hoe")
    ],
    belle: [
        dom("belle_wooden_hoe"),
        dom("belle_stone_hoe"),
        dom("belle_iron_hoe"),
        dom("belle_gold_hoe"),
        dom("belle_diamond_hoe"),
        dom("belle_netherite_hoe")
    ],
    greg: [
        dom("greg_wooden_hoe"),
        dom("greg_stone_hoe"),
        dom("greg_iron_hoe"),
        dom("greg_gold_hoe"),
        dom("greg_diamond_hoe"),
        dom("greg_netherite_hoe")
    ]
}
const elHoeCount = {
    bill: [
        dom("Bill_Wooden_Hoe_Number"),
        dom("Bill_Stone_Hoe_Number"),
        dom("Bill_Iron_Hoe_Number"),
        dom("Bill_Gold_Hoe_Number"),
        dom("Bill_Diamond_Hoe_Number"),
        dom("Bill_Netherite_Hoe_Number")
    ],
    belle: [
        dom("Belle_Wooden_Hoe_Number"),
        dom("Belle_Stone_Hoe_Number"),
        dom("Belle_Iron_Hoe_Number"),
        dom("Belle_Gold_Hoe_Number"),
        dom("Belle_Diamond_Hoe_Number"),
        dom("Belle_Netherite_Hoe_Number")
    ],
    greg: [
        dom("Greg_Wooden_Hoe_Number"),
        dom("Greg_Stone_Hoe_Number"),
        dom("Greg_Iron_Hoe_Number"),
        dom("Greg_Gold_Hoe_Number"),
        dom("Greg_Diamond_Hoe_Number"),
        dom("Greg_Netherite_Hoe_Number")
    ]
}
const elHoePrices = {
    wooden:     dom("wooden_hoe_price"),
    stone:      dom("stone_hoe_price"),
    iron:       dom("iron_hoe_price"),
    gold:       dom("gold_hoe_price"),
    diamond:    dom("diamond_hoe_price"),
    netherite:  dom("netherite_hoe_price")
};
const elMainProgressContainer = dom('main_progress_container');
const elMainProgressBar = dom('main_progress_bar');
const elGregProgress = dom("Greg_Progress");
const elCharles = {
    charlesTooltip: dom("charlestooltip"),
    prices: {
        improveWorkingConditions: dom("ImproveWorkingConditions"),
        betterHoes:               dom("BetterHoes"),
        decreaseWages:            dom("DecreaseWages"),
    },
    shop: {
        improveWorkingConditions: dom("ImproveWorkingConditions_button"),
        betterHoes:               dom("BetterHoes_button"),
        decreaseWages:            dom("DecreaseWages_button"),
    }
}
const tomeCount = {
    iwc: dom('iwc_count'),
    bh:  dom('bh_count'),
    dww: dom('dww_count'),
}

// Settings elements
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
const elEnableMainProgress = dom('enable_main_progress');
//#endregion

/*-------------Local Storage and Characters-------------*/
//#region


// Creates Characters 
class Character{
    constructor(Type,lvl,lvlupPrice,Hoes){
        this.Type=Type;
        this.lvl=lvl;
        this.lvlupPrice=lvlupPrice;
        this.Hoes=Hoes;
    }
}
// Default Values Stored in a Player Object
const playerPrestigeTemplate = {
    carrots: 0,
    click_carrots: 0,
    idle_carrots: 0,
    bonus_carrots: 0,

    // cash: 0,
    falling_carrots_grabbed: 0,

    // golden_carrots: 0,
    // prestige_count: 0,
    clicks: 0,
    hoes: {
        crafted: [0, 0, 0, 0, 0, 0],
        craftedTotal: 0,
        equipped: [0, 0, 0, 0, 0, 0],
        equippedTotal: 0,
    },
}
const player1 = {
    data_version: 2, // needs to be incremented by 1 any time any game object is changed

    // Progress
    Carrots: 0,
    cpc: 0,
    cps: 0,
    EquippedHoes: 0,
    clickSpeedRecord: 0,
    cash: 0,

    // Prestige
    pages: 0,
    golden_carrots: 0,
    prestige_potential: 0,
    prestige_available: false,

    // Current prestige
    prestige: playerPrestigeTemplate,

    // Lifetime stats
    lifetime: {
        carrots: 0,
        click_carrots: 0,
        idle_carrots: 0,
        bonus_carrots: 0,

        cash: 0,
        falling_carrots_grabbed: 0,

        golden_carrots: 0,
        prestige_count: 0,
        clicks: 0,
        hoes: {
            crafted: [0, 0, 0, 0, 0, 0],
            craftedTotal: 0,
            equipped: [0, 0, 0, 0, 0, 0],
            equippedTotal: 0,
        },
        tomes_bought: 0,
    },

    // Unlocked main buttons
    // main_buttons: {
    //     prestige: false,
    //     inventory: false,
    // },

    // Unlocked characters
    characters: {
        bill: true,
    },

    // Achievements
    achievements: {},

    // Unlockables
    themes: [
        'theme_dark',
        'theme_light',
        'theme_oled'
    ],
    cosmetics: {
        'bundle':   ['default'],
        'farmable': ['default'],
        'bill':     ['default'],
        'belle':    ['default'],
        'greg':     ['default'],
        'charles':  ['default'],
        'carl':     ['default'],
        'tools':    ['default'],
    },
    // New indicators
    new_theme: false,
    new_cosmetic: false,

    // inventory: [
        
    // ],
}


// Character Defaults
const Default_Boomer_Bill      = new Character("Farmer",1,100,[0,0,0,0,0,0]);
const Default_Belle_Boomerette = new Character("Farmer",0,250,[0,0,0,0,0,0]);
const Default_Gregory          = new Character("Blacksmith",0,5000,[0,0,0,0,0,0]);
Default_Gregory.HoePrices = [15000,600000,60000000,7000000000,500000000000,100000000000000];
const Default_Charles = {
    name:"Charles",
    type:"Scholar",
    tome:{
        improveWorkingConditions:{
            value:0,
            price:1
        },
        decreaseWages:{
            value:0,
            price:1
        },
        betterHoes:{
            value:0,
            price:1
        }
    }
}
const Default_Carl = {
    // shop_order: [
    //     'theme_classic',
    // ],
    shop: {
        theme: {
            'theme_classic': {
                currency: 'cash',
                price: 20,
                available: true,
                bought: false,
            },
            'theme_bw': {
                currency: 'cash',
                price: 32,
                available: false,
                bought: false,
            },
            'theme_terminal': {
                currency: 'cash',
                price: 16,
                available: false,
                bought: false,
            },
            'theme_chatapp': {
                currency: 'cash',
                price: 5,
                available: false,
                bought: false,
            },
            'theme_camo': {
                currency: 'cash',
                price: 4,
                available: false,
                bought: false,
            },
            'theme_red': {
                currency: 'cash',
                price: 6,
                available: false,
                bought: false,
            },
            'theme_green': {
                currency: 'cash',
                price: 6,
                available: false,
                bought: false,
            },
            'theme_blue': {
                currency: 'cash',
                price: 6,
                available: false,
                bought: false,
            },
            'theme_custom': {
                currency: 'cash',
                price: 80,
                available: false,
                bought: false,
            },
        },
        cosmetic: {
            // Bundle
            'bundle/cookie': {
                currency: 'cash',
                price: 32,
                available: false,
                bought: false,
            },
            'bundle/xmas': {
                currency: 'cash',
                price: 25,
                available: false,
                bought: false,
            },
            'bundle/plumber': {
                currency: 'cash',
                price: 20,
                available: false,
                bought: false,
            },

            // Farmable
            'farmable/pixel_carrot': {
                currency: 'cash',
                price: 16,
                available: false,
                bought: false,
            },
            'farmable/pixel_golden_carrot': {
                currency: 'cash',
                price: 12,
                available: false,
                bought: false,
            },
            'farmable/blockgame_potato': {
                currency: 'cash',
                price: 12,
                available: false,
                bought: false,
            },
            'farmable/pineapple': {
                currency: 'cash',
                price: 24,
                available: false,
                bought: false,
            },
            'farmable/ascii_color': {
                currency: 'cash',
                price: 2,
                available: false,
                bought: false,
            },
            'farmable/ascii': {
                currency: 'cash',
                price: 2,
                available: false,
                bought: false,
            },

            // Carrot variants
            'farmable/alien_carrot': {
                currency: 'cash',
                price: 3,
                available: false,
                bought: false,
            },
            'farmable/demon_carrot': {
                currency: 'cash',
                price: 3,
                available: false,
                bought: false,
            },
            'farmable/ghost_carrot': {
                currency: 'cash',
                price: 3,
                available: false,
                bought: false,
            },
            'farmable/rainbow_carrot': {
                currency: 'cash',
                price: 3,
                available: false,
                bought: false,
            },

            // Bill
            'bill/business_bill': {
                currency: 'cash',
                price: 12,
                available: false,
                bought: false,
            },
            'bill/biker_bill': {
                currency: 'cash',
                price: 6,
                available: false,
                bought: false,
            },
            
            // Carl
            'carl/joker_carl': {
                currency: 'cash',
                price: 12,
                available: false,
                bought: false,
            },
        }
    },
}
Default_Carl.shop.theme.keys =    Object.keys(Default_Carl.shop.theme);
Default_Carl.shop.cosmetic.keys = Object.keys(Default_Carl.shop.cosmetic);
// Return number of available shop items
function carlItemsAvailable() {
    let c = 0;
    // Themes
    let theme_keys = Default_Carl.shop.theme.keys;
    for(i = 0; i < theme_keys.length; i++) { if(Carl.shop.theme[theme_keys[i]].available == true) c++; }
    // Cosmetics
    let cosm_keys = Default_Carl.shop.cosmetic.keys;
    for(i = 0; i < cosm_keys.length; i++) { if(Carl.shop.cosmetic[cosm_keys[i]].available == true) c++; }
    return c;
}
// Returns true if available or bought
function carlShopQuery(type, item) {
    console.warn(`carlShopQuery(${type}, ${item})`);
    try {
        if(Carl.shop[type][item].available == true
            || Carl.shop[type][item].bought == true
        ) { return true; }
        else { return false};
    } catch (error) {
        console.log('carlShopQuery: invalid query- item or type not found');
        return false;
    }

}

//Asigns the Local storage
var player;
var playerCharKeys;
var Boomer_Bill;
var Belle_Boomerette;
var Gregory;
var Charles;
var Carl;

// Determine if player has savedata
if(localStorage.getObject("player") != null ) {
    // Import savedata
    console.log('[Autosave] Player has savedata, importing...');
    player           = localStorage.getObject("player");
    Boomer_Bill      = localStorage.getObject("Bill");
    Belle_Boomerette = localStorage.getObject("Belle");
    Gregory          = localStorage.getObject("Greg");
    Charles          = localStorage.getObject("Charles");
    Carl             = localStorage.getObject("Carl");
} else {
    // New game, use defaults
    console.log('[Autosave] New game, creating savedata...');
    player           = player1;
    Boomer_Bill      = Default_Boomer_Bill;
    Belle_Boomerette = Default_Belle_Boomerette;
    Gregory          = Default_Gregory;
    Charles          = Default_Charles;
    Carl             = Default_Carl;
}

var preventSaveGame = false;
function saveGame() {
    if(preventSaveGame == true) return;
    // console.log('Saving game...');
    localStorage.setObject("player", player);
    localStorage.setObject("Bill", Boomer_Bill);
    localStorage.setObject("Belle", Belle_Boomerette);
    localStorage.setObject("Greg", Gregory);
    localStorage.setObject("Charles", Charles);
    localStorage.setObject("Carl", Carl);
    localStorage.setObject("tips_seen", tips);
}

// Autosave
var autosave = 
setInterval(() => {
    saveGame();
}, 5000);

// Save before unload (does not work for some browsers/devices)
window.onbeforeunload = () => {
    saveGame();
}

//#endregion

/*--------------Settings----------------*/
//#region 

/* Settings data */
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
// Fill out settings page options
function fillSettingsPage() {
    // console.log("fillSettingsPage()");

    // Gameplay
    dom('cosmetic_auto_equip').checked = settings.cosmetic_auto_equip;
    dom('carl_shop_toasts').checked = settings.carl_shop_toasts;
    // Fun tips
    elFunTipsSlider.value = settings.fun_tip_percentage;
    eInnerText(elFunTipsSlider_label, elFunTipsSlider.value + '%');

    dom('full_numbers').checked = settings.full_numbers;
    dom('compact_achievements').checked = settings.compact_achievements;
    dom('achievements_grid').checked = settings.achievements_grid;
    elEnableMainProgress.checked = settings.enableMainProgress;
    elEnableSounds.checked = settings.enableSounds;
    optionSoundsDisable(settings.enableSounds);
    elVolumeMaster.value = settings.master_volume * 100;
    elEnableMusic.checked = settings.enableMusic;
    elEnableCarrotSounds.checked = settings.enableCarrotSounds;
    eInnerText(elVolumeMaster_label, `${settings.master_volume * 100}%`);
    volume = settings.master_volume;

    // Autosave
    // Update autosave variable
    if(settings.autosave_interval != settings_default.autosave_interval) {
        dom('autosave_interval').value = settings.autosave_interval;
        clearInterval(autosave);
        autosave = setInterval(() => {
            saveGame();
        }, settings.autosave_interval * 1000);
    }

    // Notification time
    if(settings.notificationLength != settings_default.notificationLength) {
        dom('notificationLength').value = settings.notificationLength;
    }

    // Disable keybinds
    if(settings.disableKeybinds != settings_default.disableKeybinds) {
        elDisableKeybinds.checked = settings.disableKeybinds;
    }
}

function saveSettings() { localStorage.setObject("settings", settings); }
function resetSettings(dialog = false) {
    settings = settings_default;
    saveSettings();
    fillSettingsPage();

    if(!dialog) return;
    toast('Settings Reset', 'All settings returned to defaults');
}

// Defining Keybinds
const keybinds_default = {
    // Gameplay
    key_carrot: 'Spacebar',
    key_multibuy: 'Shift',
    key_bill_lvlup: '1',
    key_belle_lvlup: '2',
    key_greg_lvlup: '3',
    key_craft_0: '4',
    key_craft_1: '5',
    key_craft_2: '6',
    key_craft_3: '7',
    key_craft_4: '8',
    key_craft_5: '9',

    // Interface
    key_cleartoasts: 'X',
    key_prestige: 'P',
    key_inventory: 'E',

    // Make object loopable
    keys: [],
}
keybinds_default['keys'] = Object.keys(keybinds_default);
keybinds_default['keys'].pop();

// Default settings object
const settings_default = {
    notificationLength: 5,      // number - Time in seconds
    disableKeybinds: false,     // boolean
    autosave_interval: 5,

    cosmetic_auto_equip: false, // boolean
    carl_shop_toasts: true,     // boolean

    master_volume: 1,           // number - Between 0 and 1
    enableSounds: true,         // boolean
    enableMusic: false,         // boolean
    enableCarrotSounds: false,  // boolean

    full_numbers: false,        // boolean
    enableMainProgress: true,   // boolean

    // UI
    theme: 'theme_dark',        // string
    cosmetics: {
        farmable: 'default',
        bill: 'default',
        belle: 'default',
        greg: 'default',
        charles: 'default',
        carl: 'default',
        tools: 'default',
    },
    openpanel: null,            // string
    cosmetics_grid: true,       // boolean
    achievements_grid: false,   // boolean
    compact_achievements: true, // boolean
    fun_tip_percentage: 50,     // number - between 0 and 100

    keybinds: keybinds_default, // object
}

var settings;

playerCharKeys   = Object.keys(player.characters);

// Settings object
if(localStorage.getObject("settings") != null) {
    // Save found
    console.log('[Settings] SETTINGS localStorage object found!');
    settings = localStorage.getObject('settings');
} else {
    // Create from default
    console.log('[Settings] No localStorage object found, creating...');
    localStorage.setObject("settings", settings_default);
    settings = settings_default;
    resetSettings();
}


// Clear localStorage
function clearSave() {
    preventSaveGame = true;
    ClearLocalStorage();
}

//#endregion

/* ----------------------Functions------------------------*/
//#region

//multibuy
const multibuy = [1,10,100];
var multibuySelector = 0;
function multibuySpin(){
    if(multibuy[multibuy.length-1]>multibuy[multibuySelector]){
        multibuySelector++;
    } else {
        multibuySelector=0;
    }

    characterPrices();
    updateHoePrices();
    DisplayAllHoes();
}


// Store click speed
var clickSpeed = 0;
var clickSpeedBest = 0;
var clickArray = [];

// Earn carrots function
function earnCarrots(amount, type, useMousePos = false) {
    if(type == 'bonus') {
        popupHandler(useMousePos, amount, 'falling');
    }

    player.Carrots += amount;
    player.prestige.carrots += amount;
    player.lifetime.carrots += amount;

    // Type
    switch(type) {
        // Click
        case 'click':
            player.prestige.click_carrots += amount
            player.prestige.clicks ++;

            player.lifetime.click_carrots += amount;
            player.lifetime.clicks ++;
            break;
        // Idle
        case 'idle':
            player.prestige.idle_carrots += amount;
            player.lifetime.idle_carrots += amount;
            break;
        // Bonus
        case 'bonus':
            player.prestige.bonus_carrots += amount;
            player.lifetime.bonus_carrots += amount;

            player.prestige.falling_carrots_grabbed++;
            player.lifetime.falling_carrots_grabbed++;
            break;
    }

    carrotCount();
}

// Earn currency
function earnCash(amount, type) {
    if(type == 'bonus') {
        popupHandler(true, amount, 'cash');
    } else {
        popupHandler(false, amount, 'cash');
    }

    player.cash += amount;
    player.lifetime.cash += amount;

    cashCount();
    updateCarlsShop();
}

//On Carrots Click
// var clickMethodLimit = 'none';
// var clickMethodTimer = 0;
var fallingCarrotPromiser = 0;
function onClick(useMousePos, method = 'click') {
    // Grant carrots
    earnCarrots(player.cpc, 'click');

    // Page stuff
    carrotCount();
    popupHandler(useMousePos, DisplayRounded(Math.floor(player.cpc,2), 1, 10000, unitsShort));

    // Click speed
    clickSpeedHandler(true);

    // Falling carrots
    let roll = Math.floor((Math.random() * 50));
    if(roll == 1 && fallingActive < 4 || fallingFrenzy == true || fallingCarrotPromiser > 50) {
        fallingCarrotPromiser = 0;
        fallingCarrot();
    } else {
        fallingCarrotPromiser++;
    }

    // Sound effect
    if(
        settings.enableSounds == false
        || settings.enableCarrotSounds == false
    ) return;
    randomSound('crunch', 95);
}

/* ----------------------Page Manipulation Functions------------------------*/
//#region 
const elPrestigeStats = dom('this_prestige_stats');

// Update carrot count on page
function carrotCount() {
    if(settings.full_numbers != true) {
        count = DisplayRounded(Math.floor(player.Carrots), 3, 1000000);
    } else {
        count = numCommas(Math.floor(player.Carrots));
    }

    eInnerText(elCarrotCount, count);
}
function cashCount() {
    eInnerText(elCashCount, DisplayRounded(player.cash));
}
function characterPrices() {
    // Update page
    eInnerText(elCharacterUpCost.bill, `${DisplayRounded(CharacterLevelUpPrice(Boomer_Bill, multibuy[multibuySelector], "query"), 1)}`);
    eInnerText(elCharacterUpCost.belle, `${DisplayRounded(CharacterLevelUpPrice(Belle_Boomerette, multibuy[multibuySelector], "query"), 1)}`);
    eInnerText(elCharacterUpCost.greg, `${DisplayRounded(CharacterLevelUpPrice(Gregory, multibuy[multibuySelector], "query"), 1)}`);
    
    // Character levels
    eInnerText(elCharacterLevel.bill, `Lvl: ${DisplayRounded(Boomer_Bill.lvl,1)}`);
    eInnerText(elCharacterLevel.belle, `Lvl: ${DisplayRounded(Belle_Boomerette.lvl,1)}`);
    eInnerText(elCharacterLevel.greg, `Lvl: ${DisplayRounded(Gregory.lvl)}`);
}
function updateHoePrices() {
    eInnerText(elHoePrices.wooden, `${DisplayRounded(HoeCost(0,multibuy[multibuySelector]),1)}`);
    eInnerText(elHoePrices.stone, `${DisplayRounded(HoeCost(1,multibuy[multibuySelector]),1)}`);
    eInnerText(elHoePrices.iron, `${DisplayRounded(HoeCost(2,multibuy[multibuySelector]),1)}`);
    eInnerText(elHoePrices.gold, `${DisplayRounded(HoeCost(3,multibuy[multibuySelector]),1)}`);
    eInnerText(elHoePrices.diamond, `${DisplayRounded(HoeCost(4,multibuy[multibuySelector]),1)}`);
    eInnerText(elHoePrices.netherite, `${DisplayRounded(HoeCost(5,multibuy[multibuySelector]),1)}`);
}
function updateCharlesShop() {
    // Highlight when affordable
    if(Charles.tome.improveWorkingConditions.price <= player.golden_carrots) {
        elCharles.shop.improveWorkingConditions.classList.remove('cant_afford');
    } else {
        elCharles.shop.improveWorkingConditions.classList.add('cant_afford');
    }

    if(Charles.tome.betterHoes.price <= player.golden_carrots) {
        elCharles.shop.betterHoes.classList.remove('cant_afford');
    } else {
        elCharles.shop.betterHoes.classList.add('cant_afford');
    }

    if(Charles.tome.decreaseWages.price <= player.golden_carrots) {
        elCharles.shop.decreaseWages.classList.remove('cant_afford');
    } else {
        elCharles.shop.decreaseWages.classList.add('cant_afford');
    }

    // Update tome prices
    eInnerText(elCharles.prices.improveWorkingConditions, `${CharlesUpgradePrices(Charles.tome.improveWorkingConditions,multibuy[multibuySelector],"query")} Golden Carrots`);
    eInnerText(elCharles.prices.betterHoes, `${CharlesUpgradePrices(Charles.tome.betterHoes,multibuy[multibuySelector],"query")} Golden Carrots`);
    eInnerText(elCharles.prices.decreaseWages, `${CharlesUpgradePrices(Charles.tome.decreaseWages,multibuy[multibuySelector],"query")} Golden Carrots`);

    // Update tome counts
    eInnerText(tomeCount.iwc, `x${Charles.tome.improveWorkingConditions.value}`);
    eInnerText(tomeCount.bh, `x${Charles.tome.betterHoes.value}`);
    eInnerText(tomeCount.dww, `x${Charles.tome.decreaseWages.value}`);
}
var carlShopData = {};
function updateCarlsShop() {
    let keys = Object.keys(carlShopData);
    
    for(let sd = 0; sd < keys.length; sd++) {
        let id = `carl_shop_${keys[sd]}`;
        let element = dom(id);
        let price = carlShopData[keys[sd]];

        if(player.cash >= price) {
            element.classList.remove('cant_afford');
        } else {
            element.classList.add('cant_afford');
        }
    }
}
function showPrestigeStats() {
    elPrestigeStats.classList.add('unremove');
}
const elPageCount = dom('page_count');
function pagesCount() {
    elPageCount.innerText = player.pages;
}
const elMainIcon = dom('main_icon');
function updateMainIcon() {
    // Gold Medal
    if(achieveQuery('all_achievements')) {
        elMainIcon.src = './assets/medal_spin.gif';
        elMainIcon.title = '100% Completion';
    }
    // Silver Medal
    else if(achieveQuery('all_normal_achievements')) {
        elMainIcon.src = './assets/medal_silver_transparent.gif';
        elMainIcon.title = 'All normal achievements complete';
    }
    // Bronze Medal
    else if(achieveQuery('50_percent_achievements')) {
        elMainIcon.src = './assets/medal_bronze_transparent.gif';
        elMainIcon.title = '50% Completion';
    }
    // Golden Carrot
    else if(achieveQuery('1_prestige')) {
        elMainIcon.src = './assets/theme/pixel_golden_carrot.png';
        elMainIcon.title = 'Prestiged';
    }
}
const elPrestigeMenuGCCount = dom('prestige_menu_gc_count');
const elPrestigeMenuTPCount = dom('prestige_menu_tp_count');
function updatePrestigeMenu() {
    eInnerText(elPrestigeMenuGCCount, numCommas(player.golden_carrots));
    eInnerText(elPrestigeMenuTPCount, numCommas(player.pages));
}


// Click speed handler
setInterval(() => {
    clickSpeedHandler(false);
}, 1000);
function clickSpeedHandler(clicked = false) {
    if(clicked == true) {
        clickArray.push(Date.now());
    }

    // Purge clicks older than 1 second
    for(let i = 0; i < clickArray.length; i++) {
        if(clickArray[i] < Date.now() - 1000) {
            // Check if there is only 1 left or not because splice doesn't work with arrays with 1 value
            if(clickArray.length !== 1) {
                clickArray.splice(i, i);
            } else {
                clickArray = [];
            }
        };
    }

    // Update click speed
    clickSpeed = clickArray.length;
    if(clickSpeedBest < clickSpeed) {
        clickSpeedBest = clickSpeed;
        player.clickSpeedRecord = clickSpeed;
    }

    // Reset best on 0
    if(clickSpeed == 0) {
        clickSpeedBest = 0;
    }

    // Update page
    eInnerText(dom('click_speed'), clickSpeed + '/' + clickSpeedBest);
}

//#endregion

// Carrots per second
function CarrotsPerSecond() {

    earnCarrots(player.cps/20, 'idle');

    // Might want to change this but it seems to be fine   for now
    // Note: this being here is the only reason the counter gets updated immediately, if this gets removed it needs to go in every function that changes carrot count or in the main game loop
    carrotCount();
}
var cpsInterval = setInterval(CarrotsPerSecond,50);


// Level up characters
function CharacterLevelUpPrice(character=Boomer_Bill, amount=1, mode="query"){
    // console.log(`CharacterLevelUpPrice(${characterString(character)}, ${amount}, ${mode})`);
    // console.log(mode + ' !!!!!!');
    let r=character.lvlupPrice; 
    let r2=0;

    function multibuyPrice(PriceIncrease) {
        r += (1 - DecreaseWagesEffects()) * Math.floor(r * PriceIncrease);
        r2 += r;
        if(amount==1){
            r2=r;
        }
        // console.log(`multibuyPrice(${PriceIncrease})\nr = ${r}\nr2 = ${r2}`);
    }
    // Multibuy loop
    for(i=0; i<amount; i++){
        // Gregory
        if(character==Gregory){
            if(Gregory.lvl+i<50){
                multibuyPrice(0.14, "character", r, r2);
            }else{
                multibuyPrice(0.21, "character", r, r2);
            }
        }
        // Belle
        else if(character==Belle_Boomerette){
            if(Belle_Boomerette.lvl+i<75){
                multibuyPrice(0.11, "character", r, r2);
            }else if(Belle_Boomerette.lvl+i<100&&Belle_Boomerette.lvl+i>=75){
                multibuyPrice(0.12, "character", r, r2)
            }else{
                multibuyPrice(0.08, "character", r, r2)
            }   
        }
        // Bill
        else if(character==Boomer_Bill){
            if(Boomer_Bill.lvl+i<75){
                multibuyPrice(0.11, "character", r, r2);
            }else if(Boomer_Bill.lvl+i<100&&Boomer_Bill.lvl+i>=75){
                multibuyPrice(0.13, "character", r, r2);
            }else{
                multibuyPrice(0.09, "character", r, r2);
            }
            
        }
    }
    // Apply
    if(mode=="apply") character.lvlupPrice=Math.floor(r);
    // return Math.floor(r2);
    return character.lvlupPrice;
}
function LevelUp(character=Boomer_Bill, amount=1) {
    if(characterQuery(characterString(character)) == false) {
        // toast('Nice Try', 'That character has not been unlocked');
        return;
    }

    if(player.Carrots >= CharacterLevelUpPrice(character, amount)) {
        character.lvl+=amount;
        player.Carrots-=CharacterLevelUpPrice(character,amount);
        CharacterLevelUpPrice(character,amount,"apply");

        // Update page
        characterPrices();
    } else {
        toast(
            'Cannot afford',
            `You need ${DisplayRounded(character.lvlupPrice, 1)} carrots to level up ${ capitalizeFL(characterString(character))}`,
            '', false, true
        );
    }
}


// Prestige
function Prestige() {
    console.log('Prestiging...');

    if(player.prestige_potential < 1) {
        console.warn('Insufficient prestige potential');
        toast('Cannot Prestige', 'Insufficient prestige potential. Try again later.');
        return;
    }

    window.scrollTo(0, 0);
    clearInterval(cpsInterval);

    // Statistics
    player.prestige = playerPrestigeTemplate;

    // Give golden carrots
    player.golden_carrots += player.prestige_potential;
    player.lifetime.golden_carrots += player.prestige_potential;
    player.lifetime.prestige_count += 1;

    // Reset prestige potential
    player.prestige_potential = 0;
    player.prestige_available = false;

    // Reset characters to default
    [
        Boomer_Bill.lvlupPrice,
        Belle_Boomerette.lvlupPrice,
        Gregory.lvlupPrice
    ] = [
        Default_Boomer_Bill.lvlupPrice,
        Default_Belle_Boomerette.lvlupPrice,
        Default_Gregory.lvlupPrice
    ];
    [
        Boomer_Bill.lvl,
        Belle_Boomerette.lvl,
        Gregory.lvl
    ] = [
        Default_Boomer_Bill.lvl,
        Default_Belle_Boomerette.lvl,
        Default_Gregory.lvl
    ];
    for(i=0;i<6;i++){
        Boomer_Bill.Hoes[i] = 0;
        Belle_Boomerette.Hoes[i] = 0;
        Gregory.Hoes[i]=0;
        Gregory.HoePrices[i] = Default_Gregory.HoePrices[i];
    }
    player.EquippedHoes=0;
    player.Carrots = 0;
    cpsInterval = setInterval(CarrotsPerSecond,100);
    tips.tracker=0;

    // Tutorial message
    if(player.lifetime.prestige_count == 0) {
        toast('Golden Carrots', 'Now that you\'ve prestiged, you\'ll want to buy some tomes. Visit Charles\' shop to see what tomes are available to you.');
    }

    // Update page
    characterPrices();
    updateCharlesShop();
    // updatePrestigeMenu();
    showPrestigeStats();
}

//#endregion

/*---------------------Charles Functions------------------*/
//#region 
// Charles Functions
//Needs commenting

function CharlesUpgradePrices(tome=Charles.tome.improveWorkingConditions, amount=1, mode="query"){
    let r = tome.price;
    let r2 = tome.price;
    
    function multibuyPrice(PriceIncrease) {
        // console.log(r+=Math.ceil(r*PriceIncrease));

        if(Math.floor(r*PriceIncrease)==0){
            r+=Math.ceil(r*PriceIncrease);
        }else{
            r+=Math.floor(r*PriceIncrease);
        }
       
        r2+=r;
        if(amount==1){
            r2=r;
        }   
    }
    
    for(i=0;i<=amount;i++){
        if(tome==Charles.tome.decreaseWages){
           multibuyPrice(0.01); 
        }
        if(tome==Charles.tome.improveWorkingConditions){
            multibuyPrice(0.01);
        }
        if(tome==Charles.tome.betterHoes){
            multibuyPrice(0.01);
        }
    }
    if(mode=="apply"){tome.price=r2}
    if(amount==1){return tome.price}
    return r2;
}

function BuyTome(tome=Charles.tome.improveWorkingConditions, amount=1) {
    if(player.golden_carrots >= CharlesUpgradePrices(tome,amount)) {
        tome.value += amount;
        player.lifetime.tomes_bought ++;
        player.golden_carrots -= CharlesUpgradePrices(tome,amount);
        CharlesUpgradePrices(tome,amount,"apply");

        updateCharlesShop();    
    } else {
        toast(
            'Cannot afford',
            `You need ${DisplayRounded(tome.price, 1)} Golden Carrots to buy this Tome`,
            '', false, true
        );
    }

    if(tome == Charles.tome.betterHoes) {
        updateHoePrices();
    }
}


function DecreaseWagesEffects(){
    return (Math.sqrt(Charles.tome.decreaseWages.value)/100);
}


//#endregion
/*-----------Hoe Functions--------------*/
//#region

//Stores The Correct Hoe Price
function HoeCost(type=0,amount=1,mode="query"){
    var p = Gregory.HoePrices[type];
    var p2 = 0;
    if(amount==1){
        if(mode=="apply"){
            Gregory.HoePrices[type]+=(0.01*p);
        }
        return p;
    }
    for(j=0;j<amount;j++){
        p+=(0.09*p);
        p2+=p;     
    }

    if(mode=="apply"){
        Gregory.HoePrices[type]=p2;
    }
    return p2;
}

// Hoe images
const hoeImg = [
    './assets/tools/wood_hoe.png',
    './assets/tools/stone_hoe.png',
    './assets/tools/iron_hoe.png',
    './assets/tools/gold_hoe.png',
    './assets/tools/diamond_hoe.png',
    './assets/tools/netherite_hoe.png',
]

function gregLevelTest(type, minusone = true, debug) {
    let modifier = -1;
    if(minusone == false) modifier = 0;

    // if(debug == true) {
    //     console.log((type*25) -modifier);
    // }

    if(type == 0) {
        // console.log('n: ' + Gregory.lvl);
        if(Gregory.lvl == 0) {
            return true;
        }
        return false;
    }
    else if(Gregory.lvl >= (type*25)) {
        // console.log('n B');
        return false;
    }
    return true;
}

function CreateHoe(type=0, amount=1) {
    console.log(type);
    // Greg unlock check
    if(characterQuery('greg') == false) {
        // toast('Nice try', 'That character hasn\'t been unlocked yet.', 'rgb');
       return;
    }

    // Return if a hoe is already in progress
    if(n==1){
        toast("Greg is busy", "Wait until he is done crafting",
        '', false, true);
        return;
    }

    // Checks if Greg is Experienced Enough to Purchase a Hoe.
    if(gregLevelTest(type)){
        if(type>=1){
            toast("Cant Create Hoe", `Greg too inexperienced. Greg must be at least Level: ${type*25} to create this hoe`,
            '', false, true);
            return;
        }
        toast("Cant Create Hoe", "Greg too inexperienced. Greg must be at least Level: 1 to create this hoe",
        '', false, true);
        return;
    }

    // Checks to see if Greg Can Hold more of this Type
    if(Gregory.Hoes[type]+amount-1>= Gregory.lvl){
        toast("Insufficient Upgrades", "You must upgrade Greg to hold more hoes of that type",
        '', false, true);
        return;
    }
    
    let price = HoeCost(type,amount);
    //Checks if Hoe is Too expensive
    if(price>=(player.Carrots*2)){
        toast("Too Expensive!", "That hoe is currently too expensive.",
        '', false, true);
        return;
    }

    // Craft hoe
    if(n==0){
        n=1; 
        HoeCost(type,amount,"apply"); 
        //Creates Hoe And Displays Progress Bar
        var i = 0;
        if (i == 0) {
            i = 1;
            var p = 0;
            var id = setInterval(frame,100);

            // Main progress bar
            if(settings.enableMainProgress == true) {
                elMainProgressContainer.classList.add('status_tidbit_in');
            }
            dom('main_progress_image').src = hoeImg[type];
            
            // Greg info
            dom('greg_progress_image').src = hoeImg[type];
            dom('greg_crafting_info').classList.remove('inactive');
            dom('greg_crafting_info').title = 'Crafting...';

            function frame() {
                if (p >= price) {
                    clearInterval(id);
                    i = 0;
                    player.Carrots+=p-price;
                    p=0;
                    elGregProgress.style.width = 0 + "%";
                    if(settings.enableMainProgress == true) {
                        elMainProgressBar.style.width = 0 + "%";
                    }
                    elMainProgressContainer.classList.remove('status_tidbit_in');
                    dom('greg_crafting_info').classList.add('inactive');
                    dom('greg_crafting_info').title = 'Idle';

                    Gregory.Hoes[type]+=amount;
                    n=0;
                } else {
                    let adjust = 0.01 * player.Carrots
                    p += adjust;
                    player.Carrots -= adjust;

                    // Progress bar
                    elGregProgress.style.width = `${100*(p/price)}%`;
                    if(settings.enableMainProgress == true) {
                        elMainProgressBar.style.width  = `${100*(p/price)}%`;
                    }

                }

            }
        }

        // Statistics
        player.prestige.hoes.crafted[type] += amount;
        player.prestige.hoes.craftedTotal += amount;

        player.lifetime.hoes.crafted[type] += amount;
        player.lifetime.hoes.craftedTotal += amount;

        // Update page
        DisplayAllHoes();
        updateHoePrices();
    }
}




//Equips A Hoe To a Character
function EquipHoe(character=Boomer_Bill, type=0, amount){
    // Greg unlock check
    if(characterQuery('greg') == false) {
        // toast('Nice try', 'That character hasn\'t been unlocked yet.', 'rgb');
       return;
    }

    if(Gregory.Hoes[type]>=amount){
        if(character.Hoes[type]+amount-1>=Gregory.lvl) {
            toast("Insufficient Upgrades", "You Must Upgrade Greg to Hold More Hoes of That Type",
            '', false, true);
            n=0;
            return;
        }
        player.EquippedHoes+=1;
        player.prestige.hoes.equipped+=1;
        player.lifetime.hoes.equipped+=1;
        character.Hoes[type]+=amount;
        Gregory.Hoes[type]-=amount;
    }
}

// Temporary fix thing, going to just add their names to their objects probably
function characterString(character, reverse = false) {
    if(reverse == false) {
        switch(character) {
            case Boomer_Bill:
                return charString = 'bill';
            case Belle_Boomerette:
                return charString = 'belle';
            case Gregory:
                return charString = 'greg';
        }
    }
    else {
        switch(character) {
            case 'bill':
                return charString = 'Boomer_Bill';
            case 'belle':
                return charString = 'Belle_Boomerette';
            case 'greg':
                return charString = 'Gregory';
        }
    }
}


// Update hoe on page
function DisplayAllHoes() {
    for(i = 0; i < 6; i++) {
        DisplayHoe(Boomer_Bill, i);
        DisplayHoe(Belle_Boomerette, i);
        DisplayHoe(Gregory, i);
    }
}
function DisplayHoe(character, type) {
    let charString = characterString(character);
    let count = elHoeCount[charString][type];
    let img = elHoes[charString][type];

    // Bill & Belle hoes
    if(charString == 'bill' || charString == 'belle') {
        // Remove blackout and set innertext
        // Greg has a hoe to give
        if(Gregory.Hoes[type] >= 1) {
            img.classList.remove('blackedout');
            img.classList.add('glowing');
        } else {
            img.classList.remove('glowing');
            img.classList.add('blackedout');
        }
    }
    // Greg hoes
    else if(charString == 'greg') {
        // Can afford and is unlocked
        if(
            !gregLevelTest(type, false)
            && player.Carrots / 0.8 >= Gregory.HoePrices[type]
        ) {
            // console.log(type + ': unlocked and CAN afford');
            img.classList.remove('blackedout');
            img.classList.remove('grayedout');
            eInnerText(count, '');
        }
        // Greg's lvl is sufficient but can't afford
        else if(
            !gregLevelTest(type, false)
        ) {
            // console.log(type + ': unlocked but can\'t afford');
            img.classList.add('grayedout');
            img.classList.remove('blackedout');
        }
        // Blacked out
        else {
            // console.log(type + ': other');
            img.classList.add('blackedout');
        }
    }


    // Number
    if(character.Hoes[type] == Gregory.lvl && Gregory.lvl != 0) {
        eInnerText(count, 'MAX');
        count.classList.add('toolfull');
    }
    else if(character.Hoes[type] >= 1) {
        // Not full, show number
        count.classList.remove('toolfull');
        eInnerText(count, `x${character.Hoes[type]}`);
    } else {
        // Hide number
        count.classList.remove('toolfull');
        eInnerText(count, '');
    }
}


//#endregion

/*---------------Main Game Loop---------------- */
//#region

function gameLoop() {
    // Calculates the CPC
    var cpcHoes;
    var cpsHoes;
    if(Charles.BetterHoes>0){
        cpcHoes = 
            (Charles.BetterHoes*1.15)*(Boomer_Bill.Hoes[0])
            + (10*Boomer_Bill.Hoes[1])
            + (100*Boomer_Bill.Hoes[2])
            + (1000*Boomer_Bill.Hoes[3])
            + (10000*Boomer_Bill.Hoes[4])
            + (100000*Boomer_Bill.Hoes[5]);
        
        cpsHoes =
            (Charles.BetterHoes*1.15)*(Belle_Boomerette.Hoes[0] 
            + (10*Belle_Boomerette.Hoes[1])
            + (100*Belle_Boomerette.Hoes[2])
            + (1000*Belle_Boomerette.Hoes[3])
            + (10000*Belle_Boomerette.Hoes[4])
            + (100000*Belle_Boomerette.Hoes[5])
            );
    }else{
        cpcHoes=
            (Boomer_Bill.Hoes[0])
            + (10*Boomer_Bill.Hoes[1])
            + (100*Boomer_Bill.Hoes[2])
            + (1000*Boomer_Bill.Hoes[3])
            + (10000*Boomer_Bill.Hoes[4])
            + (100000*Boomer_Bill.Hoes[5]);
        cpsHoes=
            (Belle_Boomerette.Hoes[0] 
            + (10*Belle_Boomerette.Hoes[1])
            + (100*Belle_Boomerette.Hoes[2])
            + (1000*Belle_Boomerette.Hoes[3])
            + (10000*Belle_Boomerette.Hoes[4])
            + (100000*Belle_Boomerette.Hoes[5])
            );
    }
    
    if(Boomer_Bill.Hoes[0]+cpcHoes>0) {
        player.cpc=(Boomer_Bill.lvl+Boomer_Bill.lvl*(cpcHoes));
    } else {
        player.cpc=Boomer_Bill.lvl;
    }
   
    // Calculates the CPS
    if(Belle_Boomerette.Hoes[0]+cpsHoes>0) {
        player.cps=(Belle_Boomerette.lvl+Belle_Boomerette.lvl*(cpsHoes));
    } else {
        player.cps=Belle_Boomerette.lvl;
    }
    // Add improve working conditions bonus
    if(Charles.tome.improveWorkingConditions.value>0) {
        player.cpc = (player.cpc * (1.1 * Charles.tome.improveWorkingConditions.value));
        player.cps = (player.cps * (1.1 * Charles.tome.improveWorkingConditions.value));
    }
    

    // Providing updated information to the player

    //// Update numbers on page ////

    // New display
    // Carrot counter moved to functions that update it
    eInnerText(elCPC, `${DisplayRounded(Math.floor(player.cpc),2)}`);
    eInnerText(elCPS, `${DisplayRounded(Math.floor(player.cps),2)}`);
    //The Basic info for the player, Carrots; Cpc; Cps
    eInnerText(dom("multibuy"), multibuy[multibuySelector] + "x");

    // Costs to level up characters

    // > Moved to onload() and levelup() functions <

    // Hoes
    DisplayAllHoes();

    //The Prestige Potential
    // let achieve_percent = Math.round(percentage(Object.keys(player.achievements).length, Object.keys(achievements).length));
    player.prestige_potential = Math.floor( 5 * Math.pow(0.0000001 * player.prestige.carrots, 0.37) * (1 + (player.pages/100)) );
    eInnerText(elMainPrestigePotential, DisplayRounded(player.prestige_potential.toFixed(0),2));
    if(prestigeMenuOpen) {
        eInnerText(elPrestigePotential, DisplayRounded(player.prestige_potential.toFixed(0),2));
    }

    // Greg's Hoe Prices
    // updateHoePrices();

    // Prestige info
    if(player.lifetime.golden_carrots > 0 || player.prestige_potential > 0) {
        eInnerText(elGoldenCarrotCount, 'Golden Carrots: ' + DisplayRounded(player.golden_carrots, 2));
        dom("prestige-section").classList.add('visible');
        dom('prestige_menu_button').disabled = false;
        dom('prestige_menu_button').title = "Prestige";
        dom('prestige_menu_button_img').src = `./assets/icons/pixel_carrot_white.png`;
        player.prestige_available = true;
    }

    eInnerText(elCharles.charlesTooltip,
        `IWC: ${Math.floor(Charles.tome.improveWorkingConditions.value)}%\n
        BH: ${Math.floor(Charles.tome.betterHoes.value)}%\n
        DWW: ${Math.floor(Charles.tome.decreaseWages.value)}%`);
}

setInterval(() => {
    // Yes I know this looks silly but it prevents the rest of the code from stopping if the game loop throws an error
    gameLoop();
}, 100);
//#endregion

/*-----------------Statistics-----------------*/
//#region 

// Lifetime Statistics Panel
const elStatistics = dom('statistics');
// const statLoading = elStatistics.innerHTML;
const statsNumbers = {
    // Prestige
    prestige_carrots:            dom('prestige_carrots'),
    prestige_carrots_clicked:    dom('prestige_carrots_clicked'),
    prestige_carrots_idled:      dom('prestige_carrots_idled'),
    prestige_carrots_bonus:      dom('prestige_carrots_bonus'),
    prestige_clicks:             dom('prestige_clicks'),
    prestige_hoes_crafted_total: dom('prestige_hoes_crafted_total'),
    prestige_hoes_crafted_0:     dom('prestige_hoes_crafted_0'),
    prestige_hoes_crafted_1:     dom('prestige_hoes_crafted_1'),
    prestige_hoes_crafted_2:     dom('prestige_hoes_crafted_2'),
    prestige_hoes_crafted_3:     dom('prestige_hoes_crafted_3'),
    prestige_hoes_crafted_4:     dom('prestige_hoes_crafted_4'),
    prestige_hoes_crafted_5:     dom('prestige_hoes_crafted_5'),

    // Lifetime
    lifetime_carrots:                 dom('lifetime_carrots'),
    lifetime_carrots_clicked:         dom('lifetime_carrots_clicked'),
    lifetime_carrots_idled:           dom('lifetime_carrots_idled'),
    lifetime_carrots_bonus:           dom('lifetime_carrots_bonus'),
    lifetime_golden_carrots:          dom('lifetime_golden_carrots'),
    lifetime_golden_carrots_spent:    dom('lifetime_golden_carrots_spent'),
    lifetime_prestige:                dom('lifetime_prestige'),
    lifetime_cash:                    dom('lifetime_cash'),
    lifetime_cash_spent:              dom('lifetime_cash_spent'),
    lifetime_clicks:                  dom('lifetime_clicks'),
    lifetime_falling_carrots_grabbed: dom('lifetime_falling_carrots_grabbed'),
    lifetime_hoes_crafted_total:      dom('lifetime_hoes_crafted_total'),
    lifetime_hoes_crafted_0:          dom('lifetime_hoes_crafted_0'),
    lifetime_hoes_crafted_1:          dom('lifetime_hoes_crafted_1'),
    lifetime_hoes_crafted_2:          dom('lifetime_hoes_crafted_2'),
    lifetime_hoes_crafted_3:          dom('lifetime_hoes_crafted_3'),
    lifetime_hoes_crafted_4:          dom('lifetime_hoes_crafted_4'),
    lifetime_hoes_crafted_5:          dom('lifetime_hoes_crafted_5'),
    lifetime_clickspeedrecord:        dom('lifetime_clickspeedrecord'),

    stat_themes:                      dom('stat_themes'),
    stat_cosmetics:                   dom('stat_cosmetics'),
    // stat_cosmetics_bundle:            dom('stat_cosmetics_bundle'),
    // stat_cosmetics_farmable:          dom('stat_cosmetics_farmable'),
    // stat_cosmetics_bill:              dom('stat_cosmetics_bill'),
    // stat_cosmetics_belle:             dom('stat_cosmetics_belle'),
    // stat_cosmetics_greg:              dom('stat_cosmetics_greg'),
    // stat_cosmetics_charles:           dom('stat_cosmetics_charles'),
    // stat_cosmetics_carl:              dom('stat_cosmetics_carl'),
    // stat_cosmetics_tools:             dom('stat_cosmetics_tools'),

    stat_achievements:                dom('stat_achievements'),
}
function loadStatistics() {

    // Prestige
    eInnerText(prestige_carrots, numCommas(player.prestige.carrots) );
    eInnerText(prestige_carrots_clicked, numCommas(player.prestige.click_carrots.toFixed(0)) );
    eInnerText(prestige_carrots_idled, numCommas(player.prestige.idle_carrots.toFixed(0)) );
    eInnerText(prestige_carrots_bonus, numCommas(player.prestige.bonus_carrots.toFixed(0)) );
    eInnerText(prestige_clicks, numCommas(player.prestige.clicks) );
    eInnerText(prestige_hoes_crafted_total, numCommas(player.prestige.hoes.craftedTotal) );
    eInnerText(prestige_hoes_crafted_0, numCommas(player.prestige.hoes.crafted[0]) );
    eInnerText(prestige_hoes_crafted_1, numCommas(player.prestige.hoes.crafted[1]) );
    eInnerText(prestige_hoes_crafted_2, numCommas(player.prestige.hoes.crafted[2]) );
    eInnerText(prestige_hoes_crafted_3, numCommas(player.prestige.hoes.crafted[3]) );
    eInnerText(prestige_hoes_crafted_4, numCommas(player.prestige.hoes.crafted[4]) );
    eInnerText(prestige_hoes_crafted_5, numCommas(player.prestige.hoes.crafted[5]) );

    // Lifetime
    eInnerText(statsNumbers.lifetime_carrots, numCommas(player.lifetime.carrots.toFixed(0)));
    eInnerText(statsNumbers.lifetime_carrots_clicked, numCommas(player.lifetime.click_carrots.toFixed(0)) );
    eInnerText(statsNumbers.lifetime_carrots_idled, numCommas(player.lifetime.idle_carrots.toFixed(0)));
    eInnerText(statsNumbers.lifetime_carrots_bonus, numCommas(player.lifetime.bonus_carrots.toFixed(0)));

    eInnerText(statsNumbers.lifetime_golden_carrots, numCommas(player.lifetime.golden_carrots));
    eInnerText(statsNumbers.lifetime_golden_carrots_spent, numCommas(player.lifetime.golden_carrots - player.golden_carrots));
    eInnerText(statsNumbers.lifetime_prestige, numCommas(player.lifetime.prestige_count));
    
    eInnerText(statsNumbers.lifetime_cash, numCommas(player.lifetime.cash));
    eInnerText(statsNumbers.lifetime_cash_spent, numCommas(player.lifetime.cash - player.cash));
    eInnerText(statsNumbers.lifetime_clicks, numCommas(player.lifetime.clicks));
    eInnerText(statsNumbers.lifetime_falling_carrots_grabbed, numCommas(player.lifetime.falling_carrots_grabbed));
    eInnerText(statsNumbers.lifetime_hoes_crafted_total, player.lifetime.hoes.craftedTotal);
    eInnerText(statsNumbers.lifetime_hoes_crafted_0, player.lifetime.hoes.crafted[0]);
    eInnerText(statsNumbers.lifetime_hoes_crafted_1, player.lifetime.hoes.crafted[1]);
    eInnerText(statsNumbers.lifetime_hoes_crafted_2, player.lifetime.hoes.crafted[2]);
    eInnerText(statsNumbers.lifetime_hoes_crafted_3, player.lifetime.hoes.crafted[3]);
    eInnerText(statsNumbers.lifetime_hoes_crafted_4, player.lifetime.hoes.crafted[4]);
    eInnerText(statsNumbers.lifetime_hoes_crafted_5, player.lifetime.hoes.crafted[5]);
    eInnerText(statsNumbers.lifetime_clickspeedrecord, player.clickSpeedRecord);

    eInnerText(statsNumbers.stat_themes, `${Object.keys(player.themes).length - 3}/${Object.keys(themes).length - 3} (${percentage(Object.keys(player.themes).length - 3, Object.keys(themes).length - 3).toFixed(0)}%)`);
    eInnerText(statsNumbers.stat_cosmetics, `${playerCosmeticsCount()}/${totalCosmetics} (${percentage(playerCosmeticsCount(), totalCosmetics).toFixed(0)}%)`);
    let unlockedAchievements = Object.keys(player.achievements);
    achievementProgress(statsNumbers.stat_achievements);
}

// Refresh statistics
var statsInterval;
//#endregion

/*-----------Tips----------- */
//#region
var tips = default_tips;
try {
    let tips_seen = localStorage.getObject('tips_seen');
    [
        tips.best,
        tips.s_basic,
        tips.s_beginner,
        tips.s_intermediate,
        tips.s_fun_basic,
        tips.s_fun_beginner,
        tips.s_fun_intermediate,
    ] = [
        tips_seen.best,
        tips_seen.s_basic,
        tips_seen.s_beginner,
        tips_seen.s_intermediate,
        tips_seen.s_fun_basic,
        tips_seen.s_fun_beginner,
        tips_seen.s_fun_intermediate,
    ];
} catch (error) {
    console.warn(error);
}


// Automatically change tips
var tipInterval = setInterval(() => {tipchange()}, 15000);

function tipchange() {
    if(menuOpen()) return;
    
    clearInterval(tipInterval);
    tipInterval = setInterval(() => {tipchange()}, 15000);
    
    // Tracker - determine tips level
    if(player.EquippedHoes > 0 || player.prestige.carrots > 100000 && tips.tracker == 0) {
        tips.tracker = 1;
    } else if(player.prestige.carrots > 1000000 && tips.tracker == 1) {
        tips.tracker = 2;
    } else if(player.prestige.carrots > 1000000000 && tips.tracker == 2) {
        tips.tracker = 3;
    }

    // Update best
    if(tips.tracker > tips.best) { tips.best = tips.tracker; }

    // 20% chance a lower level tip will appear (and another chance within that that a current-level tip will appear)
    // console.log(tips.tracker);
    let roll = Math.floor(Math.random() * 5);
    if(roll == 0) {
        let t_roll = Math.floor(Math.random() * tips.tracker);
        tips.tracker = t_roll;
    }
    // console.log(tips.tracker);
    
    // Decides if the tip will be real or fun.
    tips.random = Math.random();
    tips.Type = tips.random < settings.fun_tip_percentage / 100 ? "fun" : "real";

    // Determine and display the tip
    let type = tips.Type == "fun" ? 'fun_' : '';
    type += tl[tips.tracker];

    // Roll tip
    var rmax = 0;
    function tiproll() {
        let r = Math.floor(Math.random() * tips[type].length);
        // Repeat, reroll- prevent recursion by stopping at 10 rolls
        if(tips.number == r && rmax < 3) {
            rmax++;
            tiproll();
            return;
        };
        tips.number = r;
        rmax = 0;
    }
    tiproll();


    // Page
    eInnerText(elTips, tips[type][tips.number]);

    // Mark tip as seen
    if(tips[`s_${type}`][tips.number] != true) {
        tips[`s_${type}`][tips.number] = true;
        localStorage.setObject("tips_seen", tips);
    }
    tipsHTMLupdate = true;
}

/*------Dev Tools---------*/
var setCarrotsEl;
var setGoldenCarrotsEl;
var setBillLvlEl;



//#endregion
