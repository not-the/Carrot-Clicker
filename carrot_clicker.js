/*
The Base of the Game is the Objects used to easily store data. 
The core Object is the player. The player object Stores Global Variables not Atributed to another character.
The Character Class Object stores information on each Ingame Character. Currently the active Characters are Boomer_Bill, Belle_Boomerette, and Gregory
The main Game Loop occurs in a setInterval, This loop handles anything that needs to be Constantly checked, Displayed, Or Run.
*/

//variables to prevent spamclicking
var n = 0;

/*------------Page Setup---------------*/
//#region

// Hacky solution to carrot not animating on mobile
// https://stackoverflow.com/a/56140328/11039898
document.addEventListener("touchstart", function() {}, true);

// Getting InnerHtml
const prestige_info =       dom("Prestige");
const Basic_Info =          dom("Basic_Info");
const elCarrotCount =       dom("Carrot_Count");
const elCPC =               dom("cpc");
const elCPS =               dom("cps");
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
}
const player1 = {
    // Progress
    Carrots: 0,
    cpc: 0,
    cps: 0,
    pages: 0,

    golden_carrots: 0,
    prestige_potential: 0,
    EquippedHoes: 0,
    clickSpeedRecord: 0,

    prestige_available: false,

    // Lifetime stats (old)
    // LifetimeCarrots: 0,
    // LifetimeGoldenCarrots: 0,
    // LifetimeEquippedHoes: 0,

    // Current prestige
    prestige: playerPrestigeTemplate,

    // Lifetime stats
    lifetime: {
        carrots: 0,
        click_carrots: 0,
        idle_carrots: 0,
        bonus_carrots: 0,

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

    inventory: {
        // Item inventory
    },
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
    prices: {
        'theme:theme_classic': {
            currency: 'golden_carrot',
            amount: 1,
            conditions: false,
            available: true,
            bought: false,
        },
        'theme:theme_camo': {
            currency: 'golden_carrot',
            amount: 2,
            conditions: false,
            available: true,
            bought: false,
        },
    },
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

function saveGame() {
    // console.log('Saving game...');
    localStorage.setObject("player", player);
    localStorage.setObject("Bill", Boomer_Bill);
    localStorage.setObject("Belle", Belle_Boomerette);
    localStorage.setObject("Greg", Gregory);
    localStorage.setObject("Charles", Charles);
    localStorage.setObject("Carl", Carl);
}

// Autosave
var autosave = 
setInterval(() => {
    saveGame();
}, 2000);
//#endregion


/* Settings data */

function saveSettings() { localStorage.setObject("settings", settings); }
function resetSettings(dialog = false) {
    settings = settings_default;
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
    notificationLength: 5000,
    disableKeybinds: false,     // boolean

    master_volume: 1,           // Between 0 and 1
    enableSounds: true,         // boolean
    enableMusic: false,         // boolean
    enableCarrotSounds: true,   // boolean

    full_numbers: false,

    // Autosave (in seconds)
    autosave_interval: 2,

    // UI
    theme: 'theme_dark',     // string
    cosmetics: {
        farmable: 'default',
        bill: 'default',
        belle: 'default',
        greg: 'default',
        charles: 'default',
        carl: 'default',
    },
    openpanel: null,            // string
    cosmetics_grid: true,

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


/* ----------------------Functions------------------------*/
//#region


// Store click speed
var clickSpeed = 0;
var clickSpeedBest = 0;
var clickArray = [];

// Earn carrots function
function earnCarrots(amount, type) {
    if(type == 'bonus') {
        popupHandler(true, amount);
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

            player.lifetime.falling_carrots_grabbed++;
            break;
    }
}

//On Carrots Click
// var clickMethodLimit = 'none';
// var clickMethodTimer = 0;
var fallingCarrotPromiser = 0;
function onClick(useMousePos, method = 'click') {
    // Prevent use of spacebar/click at the same time
    // if(method != clickMethodLimit && clickMethodLimit != 'none' && clickMethodTimer < Date.now() - 1000) {
    //     clickMethodLimit = method;
    //     clickMethodTimer = Date.now();

    //     return;
    // }

    // Click method limit
    // if(clickMethodTimer < Date.now - 500) {
    //     clickMethodLimit = 'none';
    // }

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
    if(store('enableSounds') == 'false' || store('enableCarrotSounds') == 'false') return;
    randomSound('crunch', 95);
}

/* ----------------------Page Manipulation------------------------*/
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
}
function showPrestigeStats() {
    elPrestigeStats.classList.add('unremove');
}
const elPageCount = dom('page_count');
function pagesCount() {
    elPageCount.innerText = player.pages;
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


// Carrots per second
function CarrotsPerSecond() {

    earnCarrots(player.cps/20, 'idle');

    // Might want to change this but it seems to be fine   for now
    // Note: this being here is the only reason the counter gets updated immediately, if this gets removed it needs to go in every function that changes carrot count or in the main game loop
    carrotCount();
}
var cpsInterval = setInterval(CarrotsPerSecond,50);



//level up characters 
function CharacterLevelUpPrice(character=Boomer_Bill, amount=1, mode="query"){
    // console.log(`CharacterLevelUpPrice(${characterString(character)}, ${amount}, ${mode})`);
    let r=character.lvlupPrice;
    let r2=0;

    function multibuyPrice(PriceIncrease) {
        r+=((1-DecreaseWagesEffects())*Math.floor(r*PriceIncrease));
        r2+=r;
        if(amount==1){
            r2=r;
        }
    }
    for(i=0; i<amount; i++){
        if(character==Gregory){
            if(Gregory.lvl+i<50){
                multibuyPrice(0.14,"character",r,r2);
            }else{
                multibuyPrice(0.21,"character",r,r2);
            }
        }
        if(character==Belle_Boomerette){
            if(Belle_Boomerette.lvl+i<75){
                multibuyPrice(0.11,"character",r,r2);
            }else if(Belle_Boomerette.lvl+i<100&&Belle_Boomerette.lvl+i>=75){
                multibuyPrice(0.12,"character",r,r2)
            }else{
                multibuyPrice(0.08,"character",r,r2)
            }
            
        }
        if(character==Boomer_Bill){
            if(Boomer_Bill.lvl+i<75){
                multibuyPrice(0.11,"character",r,r2);
            }else if(Boomer_Bill.lvl+i<100&&Boomer_Bill.lvl+i>=75){
                multibuyPrice(0.13,"character",r,r2);
            }else{
                multibuyPrice(0.09,"character",r,r2);
            }
            
        }
    }
    if(mode=="apply"){character.lvlupPrice=Math.floor(r);}
    return Math.floor(r2);
}
function LevelUp(character=Boomer_Bill, amount=1) {
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
    window.scrollTo(0, 0);
    clearInterval(cpsInterval);
    
    player.prestige_available = false;

    // Statistics
    player.prestige = playerPrestigeTemplate;

    // Give golden carrots
    player.golden_carrots += player.prestige_potential;
    player.lifetime.golden_carrots += player.prestige_potential;
    player.lifetime.prestige_count += 1;

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

    // Update page
    characterPrices();
    updateCharlesShop();
    showPrestigeStats();
}


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
            Gregory.HoePrices[type]+=(0.02*p);
        }
        return p;
    }
    for(j=0;j<amount;j++){
        p+=(0.019*p);
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
    // if(characterQuery(characterString('greg')) == false) {
    //    toast('Nice try', 'That character hasn\'t been unlocked yet.');
    //    return;
    // }

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
            elMainProgressContainer.classList.add('status_tidbit_in');
            dom('main_progress_image').src = hoeImg[type];
            
            function frame() {
                if (p >= price) {
                    clearInterval(id);
                    i = 0;
                    player.Carrots+=p-price;
                    p=0;
                    elGregProgress.style.width = 0 + "%";
                    if(store('enableMainProgress') !== 'false') {
                        elMainProgressBar.style.width = 0 + "%";
                        elMainProgressContainer.classList.remove('status_tidbit_in');
                    }

                    Gregory.Hoes[type]+=amount;
                    n=0;
                } else {
                    p+=(0.01*player.Carrots);
                    player.Carrots-=(0.01*player.Carrots);

                    // Progress bar
                    if(store('enableMainProgress') !== 'false') {
                        elGregProgress.style.width = `${100*(p/price)}%`;
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
    }
}




//Equips A Hoe To a Character
function EquipHoe(character=Boomer_Bill, type=0, amount){
    // Greg unlock check
    // if(characterQuery(characterString('greg')) == false) {
    //     toast('Nice try', 'That character hasn\'t been unlocked yet.');
    //     return;
    // }

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

    // Top bar (Might bring back later - don't delete)
    // Basic_Info.innerText = "Carrots:" + DisplayRounded(Math.floor(player.Carrots)) + " CPC:"+DisplayRounded(Math.floor(player.cpc),2) + " CPS:"+ DisplayRounded(Math.floor(player.cps),2) + " Golden Carrots:" + DisplayRounded(player.golden_carrots,2);

    // New display
    // Carrot counter moved to functions that update it
    eInnerText(elCPC, `${DisplayRounded(Math.floor(player.cpc),2)}`);
    eInnerText(elCPS, `${DisplayRounded(Math.floor(player.cps),2)}`);
    //The Basic info for the player, Carrots; Cpc; Cps
    eInnerText(dom("multibuy"), multibuy[multibuySelector] + "x");

    // Costs to level up characters

    // > Moved to onload() and levelup() functions <

    // Hoes
    DisplayAllHoes()

    //The Prestige Potential
    // let achieve_percent = Math.round(percentage(Object.keys(player.achievements).length, Object.keys(achievements).length));
    player.prestige_potential = Math.pow(0.0000001*player.Carrots, 0.38) * (1 + (player.pages/100));
    eInnerText(prestige_info, DisplayRounded(player.prestige_potential.toFixed(1),2));

    // Greg's Hoe Prices
    eInnerText(elHoePrices.wooden, `${DisplayRounded(HoeCost(0,multibuy[multibuySelector]),1)}`);
    eInnerText(elHoePrices.stone, `${DisplayRounded(HoeCost(1,multibuy[multibuySelector]),1)}`);
    eInnerText(elHoePrices.iron, `${DisplayRounded(HoeCost(2,multibuy[multibuySelector]),1)}`);
    eInnerText(elHoePrices.gold, `${DisplayRounded(HoeCost(3,multibuy[multibuySelector]),1)}`);
    eInnerText(elHoePrices.diamond, `${DisplayRounded(HoeCost(4,multibuy[multibuySelector]),1)}`);
    eInnerText(elHoePrices.netherite, `${DisplayRounded(HoeCost(5,multibuy[multibuySelector]),1)}`);

    // Prestige info
    if(player.lifetime.golden_carrots >= 1 || player.prestige_potential >= 1) {
        eInnerText(elGoldenCarrotCount, 'Golden Carrots: ' + DisplayRounded(player.golden_carrots, 2));
    }
    if(player.lifetime.golden_carrots > 0 || player.prestige_potential >= 1){
        dom("prestige-section").classList.add('visible');
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
    lifetime_carrots:            dom('lifetime_carrots'),
    lifetime_carrots_clicked:    dom('lifetime_carrots_clicked'),
    lifetime_carrots_idled:      dom('lifetime_carrots_idled'),
    lifetime_carrots_bonus:      dom('lifetime_carrots_bonus'),
    lifetime_golden_carrots:     dom('lifetime_golden_carrots'),
    lifetime_golden_carrots_spent: dom('lifetime_golden_carrots_spent'),
    lifetime_prestige:           dom('lifetime_prestige'),
    lifetime_clicks:             dom('lifetime_clicks'),
    lifetime_falling_carrots_grabbed: dom('lifetime_falling_carrots_grabbed'),
    lifetime_hoes_crafted_total: dom('lifetime_hoes_crafted_total'),
    lifetime_hoes_crafted_0:     dom('lifetime_hoes_crafted_0'),
    lifetime_hoes_crafted_1:     dom('lifetime_hoes_crafted_1'),
    lifetime_hoes_crafted_2:     dom('lifetime_hoes_crafted_2'),
    lifetime_hoes_crafted_3:     dom('lifetime_hoes_crafted_3'),
    lifetime_hoes_crafted_4:     dom('lifetime_hoes_crafted_4'),
    lifetime_hoes_crafted_5:     dom('lifetime_hoes_crafted_5'),
    lifetime_clickspeedrecord:   dom('lifetime_clickspeedrecord'),
    stat_themes:                 dom('stat_themes'),
    stat_cosmetics:              dom('stat_cosmetics'),
    stat_achievements:           dom('stat_achievements'),
}
function loadStatistics() {
    if(currentPanel !== "info-panel") return;

    // Prestige
    eInnerText(prestige_carrots, numCommas(player.prestige.carrots) );
    eInnerText(prestige_carrots_clicked, numCommas(player.prestige.click_carrots) );
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
    eInnerText(statsNumbers.lifetime_carrots_clicked, numCommas(player.lifetime.click_carrots));
    eInnerText(statsNumbers.lifetime_carrots_idled, numCommas(player.lifetime.idle_carrots.toFixed(0)));
    eInnerText(statsNumbers.lifetime_carrots_bonus, numCommas(player.lifetime.bonus_carrots.toFixed(0)));

    eInnerText(statsNumbers.lifetime_golden_carrots, numCommas(player.lifetime.golden_carrots));
    eInnerText(statsNumbers.lifetime_golden_carrots_spent, numCommas(player.lifetime.golden_carrots - player.golden_carrots));
    eInnerText(statsNumbers.lifetime_prestige, numCommas(player.lifetime.prestige_count));
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
    eInnerText(statsNumbers.stat_themes, `${Object.keys(player.themes).length - 3}/${Object.keys(themes).length - 3}`);
    // eInnerText(statsNumbers.stat_cosmetics, `${Object.keys(player.cosmetics).length - 1}/${Object.keys(cosmetics).length - 1} (${cosmeticsPercent()}%)`);
    eInnerText(statsNumbers.stat_cosmetics, `${playerCosmetics}/${totalCosmetics} (${percentage(playerCosmetics, totalCosmetics).toFixed(0)}%)`);
    
    let unlockedAchievements = Object.keys(player.achievements);
    eInnerText(
        statsNumbers.stat_achievements,
        `${unlockedAchievements.length}/${achievementsKeys.length - hiddenAchievements} (${Math.round(percentage(Object.keys(player.achievements).length, achievementsKeys.length - hiddenAchievements))}%)`
    );
    
}

// Refresh statistics
setInterval(() => {loadStatistics()}, 1000);

//Music
// setInterval(()=>{
//     playMusic('music.m4a');
// },80000);

/*-----------Tips----------- */
//#region
var tips = default_tips;

// const tips = localStorage.getObject("tips");
// setInterval(()=>{
//     if(tips){
//         localStorage.setObject("tips",tips);
//     }else{
//         localStorage.setObject("tips",default_tips);
//         // location.reload();
//     }
// }, 2000);

// const tips;

// if(localStorage.getObject("tips") == null) {
//     localStorage.setObject("tips", default_tips);
// } else {
//     tips = localStorage.getObject("tips");
// }

// Automatically change tips
var tipInterval = setInterval(() => {tipchange()}, 15000);

function tipchange() {
    clearInterval(tipInterval);
    tipInterval = setInterval(() => {tipchange()}, 15000);
    
    //Tracker
    if(player.EquippedHoes>0 && tips.tracker==0){
        tips.tracker=1;
    }
    if(player.Carrots>1000000 && tips.tracker==1){
        tips.tracker=2;
    }
    
    //decides if the tip will be real or fun.
    tips.random = Math.random();
    // console.log(tips.random);
    if(tips.random<tips.TypeModifier){
        tips.Type="fun";
    }else{tips.Type="real";}
    
    //displays the tip
    if(tips.Type=="fun"){
        switch (tips.tracker){
            case 1:
                tips.number = Math.floor(Math.random()*tips.beginner.length);
                eInnerText(elTips, tips.beginner[tips.number]);
                break;
            case 2:
            case 3:
                tips.number = Math.floor(Math.random()*tips.funAdvanced.length);
                eInnerText(elTips, tips.funAdvanced[tips.number]);
                break;
            default:
                tips.number = Math.floor(Math.random()*tips.fun.length);
                eInnerText(elTips, tips.fun[tips.number]);
        }
    }else{
        switch (tips.tracker){
            case 1:
                tips.number = Math.floor(Math.random()*tips.funIntermediate.length);
                eInnerText(elTips, tips.funIntermediate[tips.number]);
                break;
            case 2:
            case 3:
                tips.number = Math.floor(Math.random()*tips.advanced.length);
                eInnerText(elTips, tips.advanced[tips.number]);
                break;
            default:
                tips.number = Math.floor(Math.random()*tips.basic.length);
                eInnerText(elTips, tips.basic[tips.number]);
        }
    }
}



//#endregion
