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
const elGregProgress = dom("Greg_Progress");
const elCharles = {
    improveWorkingConditions: dom("ImproveWorkingConditions"),
    betterHoes:               dom("BetterHoes"),
    decreaseWages:            dom("DecreaseWages"),
    charlesTooltip:           dom("charlestooltip")
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
const player1 = {
    // Progress
    Carrots: 0,
    cpc: 0,
    cps: 0,
    golden_carrots: 0,
    prestige_potential: 0,
    EquipedHoes: 0,

    // Lifetime stats (old)
    // LifetimeCarrots: 0,
    // LifetimeGoldenCarrots: 0,
    // LifetimeEquipedHoes: 0,

    // Lifetime stats
    lifetime: {
        carrots: 0,
        golden_carrots: 0,
        prestige_count: 0,
        hoes: {
            crafted: [0, 0, 0, 0, 0, 0],
            equipped: [0, 0, 0, 0, 0, 0],
        },
    },

    // Achievements
    achievements: {},

    // Unlockables
    themes: [
        'theme_dark',
        'theme_light',
        'theme_oled'
    ],
    cosmetics: [
        'default'
    ]
}


// Character Defaults
const Default_Boomer_Bill      = new Character("Farmer",1,100,[0,0,0,0,0,0]);
const Default_Belle_Boomerette = new Character("Farmer",0,250,[0,0,0,0,0,0]);
const Default_Gregory          = new Character("Blacksmith",0,5000,[0,0,0,0,0,0])
Default_Gregory.HoePrices = [15000,600000,60000000,7000000000,500000000000,100000000000000];

const Default_Charles = {
    BetterHoes:0,
    BetterHoesPrice:1,
    ImproveWorkingConditions:0,
    ImproveWorkingConditionsPrice:1,
    DecreaseWages:0,
    DecreaseWagesPrice:1
}


//Asigns the Local storage
const Charles          = localStorage.getObject("Charles");
const player           = localStorage.getObject("player");
const Boomer_Bill      = localStorage.getObject("Bill");
const Belle_Boomerette = localStorage.getObject("Belle");
const Gregory          = localStorage.getObject("Greg");

//autosaves
setInterval(() => {
    if(player){
        localStorage.setObject("player",player);
        localStorage.setObject("Bill",Boomer_Bill);
        localStorage.setObject("Belle",Belle_Boomerette);
        localStorage.setObject("Greg",Gregory);
        localStorage.setObject("Charles",Charles)
    }else{
        localStorage.setObject("player",player1);
        localStorage.setObject("Bill",Default_Boomer_Bill);
        localStorage.setObject("Belle",Default_Belle_Boomerette);
        localStorage.setObject("Greg",Default_Gregory);
        localStorage.setObject("Charles",Default_Charles);
        location.reload();
    }
}, 2000);
//#endregion


/* ----------------------Functions------------------------*/
//#region
//On Carrots Click
function onClick(useMousePos) {
    player.Carrots += player.cpc;
    player.lifetime.carrots += player.cpc;
    popupHandler(useMousePos);

    // Sound effect
    if(store('enableSounds') == 'false' || store('enableCarrotSounds') == 'false') return;
    randomSound('crunch', 95);
}


// Carrots per second
function CarrotsPerSecond() {
    player.Carrots += player.cps;
}
var cpsInterval = setInterval(CarrotsPerSecond,1000);



//level up characters 
function CharacterLevelUpPrice(character=Boomer_Bill, amount=1, mode="query"){
    var r=character.lvlupPrice;
    var r2=0;

    function multibuyPrice(PriceIncrease){
        r+=((1-DecreaseWagesEffects())*Math.floor(r*PriceIncrease));
        r2+=r;
        if(amount==1){
            r2=r;
        }
    }
    for(i=0; i<amount; i++){
        if(character==Gregory){
            multibuyPrice(0.19);

        }
        if(character==Belle_Boomerette){
            multibuyPrice(0.1);
        }
        if(character==Boomer_Bill){
            multibuyPrice(0.102);
        }
    }

    if(mode=="apply"){
        if(amount==1){
            if(character==Gregory){
                multibuyPrice(0.19);
            }
            if(character==Belle_Boomerette){
                multibuyPrice(0.1);
            }
            if(character==Boomer_Bill){
                multibuyPrice(0.102);
            }
            character.lvlupPrice=Math.floor(r);
        }
    character.lvlupPrice=Math.floor(r2);
    }
    if(amount==1){return character.lvlupPrice}
    return r2;
}
function LevelUp(character=Boomer_Bill, amount=1) {
    if(player.Carrots >= CharacterLevelUpPrice(character, amount, "query")) {
            character.lvl+=amount;
            player.Carrots-=CharacterLevelUpPrice(character,amount,"query");
            CharacterLevelUpPrice(character,amount,"apply");
            
    } else {
        toast(
            'Cannot afford',
            `You need ${DisplayRounded(character.lvlupPrice, 1)} carrots to level up ${ capitalizeFL(characterString(character)) }`
        );
    }
}


// Prestige
function Prestige() {
    console.log("Prestiging...");
    clearInterval(cpsInterval);

    // Give golden carrots
    player.golden_carrots += player.prestige_potential;
    player.lifetime.golden_carrots += player.prestige_potential;

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
    player.EquipedHoes=0;
    player.Carrots = 0;
    cpsInterval = setInterval(CarrotsPerSecond,100);
    tips.tracker=0;
}


// Charles Functions
function IncreaseImproveWorkingConditions(){
    if(player.golden_carrots<Charles.ImproveWorkingConditionsPrice){
        toast(
            'Cannot afford',
            `You need ${Charles.ImproveWorkingConditionsPrice} Golden Carrots to level up Improve Working Conditions`
        );
        return;
    }
    Charles.ImproveWorkingConditionsPrice=Math.ceil(Charles.ImproveWorkingConditionsPrice*1.03);
    player.golden_carrots-=Charles.ImproveWorkingConditionsPrice;
    Charles.ImproveWorkingConditions+=1;
}
function IncreaseBetterHoes(){
    if(player.golden_carrots<Charles.BetterHoesPrice){
        toast(
            'Cannot afford',
            `You need ${Charles.BetterHoesPrice} carrots to level up Better Hoes`
        );
        return;
    }
    Charles.BetterHoesPrice=Math.ceil(Charles.BetterHoesPrice*1.03);
    player.golden_carrots-=Charles.BetterHoesPrice;
    Charles.BetterHoes+=1;
}

function IncreaseDecreaseWages(){
    if(player.golden_carrots<Charles.DecreaseWagesPrice){
        toast(
            'Cannot afford',
            `You need ${Charles.DecreaseWagesPrice} carrots to level up Decrease Wages`
        );
        return;
    }
    Charles.DecreaseWagesPrice=Math.ceil(Charles.DecreaseWagesPrice*1.03);
    player.golden_carrots-=Charles.DecreaseWagesPrice;
    Charles.DecreaseWages+=1;
}

function DecreaseWagesEffects(){
    return (Math.sqrt(Charles.DecreaseWages)/100);
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

function CreateHoe(type=0,amount=1) {
    // Return if a hoe is already in progress
    if(n==1){
        toast("Greg is busy", "Wait until he is done crafting")
        return;
    }

    // Checks if Greg is Experienced Enough to Purchase a Hoe.
    if(Gregory.lvl<=(type*25)-1||Gregory.lvl==0){
        if(type>=1){
            toast("Cant Create Hoe", `Greg too inexperienced. Greg must be at least Level: ${type*25} to create this hoe`);
            return;
        }
        toast("Cant Create Hoe", "Greg too inexperienced. Greg must be at least Level: 1 to create this hoe");
        return;
    }

    // Checks to see if Greg Can Hold more of this Type
    if(Gregory.Hoes[type]+amount-1>= Gregory.lvl){
        toast("Insufficient Upgrades", "You must upgrade Greg to hold more hoes of that type");
        return;
    }
    
    let price = HoeCost(type,amount);
    //Checks if Hoe is Too expensive
    if(price>=(player.Carrots*2)){
        toast("Too Expensive!", "That hoe is currently too expensive.");
        return;
    }
    if(n==0){
        n=1; 
        HoeCost(type,amount,"apply"); 
        //Creates Hoe And Displays Progress Bar
        var i = 0;
        if (i == 0) {
            i = 1;
            var p = 0;
            var id = setInterval(frame,100);
            function frame() {
                if (p >= price) {
                    clearInterval(id);
                    i = 0;
                    player.Carrots+=p-price;
                    p=0;
                    elGregProgress.style.width = 0 + "%";
                    Gregory.Hoes[type]+=amount;
                    n=0;
                } else {
                    p+=(0.01*player.Carrots);
                    player.Carrots-=(0.01*player.Carrots);
                    elGregProgress.style.width = 100*(p/price) + "%";
                }

            }
        } 
    }
}




//Equips A Hoe To a Character
function EquipHoe(character=Boomer_Bill, type=0, amount){
    if(Gregory.Hoes[type]>=amount){
        if(character.Hoes[type]+amount-1>=Gregory.lvl) {
            toast("Insufficient Upgrades", "You Must Upgrade Greg to Hold More Hoes of That Type");
            n=0;
            return;
        }
        player.EquipedHoes+=1;
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

            // If first hoe send tutorial message
            // Replace with achievements system, didn't delete because I might still revert
            // if(store('tutorial_first_hoe') == null) {tutorialHoes();}
        } else {
            img.classList.remove('glowing');
            img.classList.add('blackedout');
        }

        // Character has at least 1 and
        if(character.Hoes[type] >= 1) {
            count.innerText = `x${character.Hoes[type]}`;
            img.classList.remove('blackedout');
        } else {
            count.innerText = '';
        }
    }
    // Greg hoes
    else if(charString == 'greg') {
        // Greg has at least 1
        if(Gregory.Hoes[type] >= 1) {
            count.innerText = `x${Gregory.Hoes[type]}`;
            img.classList.remove('blackedout');
        }
        // Greg can afford one
        else if(player.Carrots >= Gregory.HoePrices[type]) {
            img.classList.remove('blackedout');
            count.innerText = '';
        }
        // Blacked out
        else {
            count.innerText = '';
            img.classList.add('blackedout');
        }
    }
}


//#endregion


/*---------------Main Game Loop---------------- */
//#region

setInterval(() => {
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
    if(Charles.ImproveWorkingConditions>0){
        player.cpc = (player.cpc*(1.1*Charles.ImproveWorkingConditions));
        player.cps = (player.cps*(1.1*Charles.ImproveWorkingConditions));
    }
    

    // Providing updated information to the player

    //// Update numbers on page ////

    // Top bar (Might bring back later - don't delete)
    // Basic_Info.innerText = "Carrots:" + DisplayRounded(Math.floor(player.Carrots)) + " CPC:"+DisplayRounded(Math.floor(player.cpc),2) + " CPS:"+ DisplayRounded(Math.floor(player.cps),2) + " Golden Carrots:" + DisplayRounded(player.golden_carrots,2);

    // New display
    elCarrotCount.innerText = `${DisplayRounded(Math.floor(player.Carrots))}`;
    elCPC.innerText = `${DisplayRounded(Math.floor(player.cpc),2)}`;
    elCPS.innerText = `${DisplayRounded(Math.floor(player.cps),2)}`;

    //The Basic info for the player, Carrots; Cpc; Cps
    if(player.lifetime.golden_carrots>=1 || player.prestige_potential>=1){
        elGoldenCarrotCount.innerText = `Golden Carrots: ${DisplayRounded(player.golden_carrots,2)}`;
    }
    if(player.lifetime.golden_carrots>=1) {
        elGoldenCarrotCount.style.color = "white";
    }
    document.getElementById("multibuy").innerText=multibuy[multibuySelector]+"x";

    // Costs to level up characters
    elCharacterUpCost.bill.innerText = `${DisplayRounded(CharacterLevelUpPrice(Boomer_Bill, multibuy[multibuySelector], "query"), 1)}`;
    elCharacterUpCost.belle.innerText = `${DisplayRounded(CharacterLevelUpPrice(Belle_Boomerette, multibuy[multibuySelector], "query"), 1)}`;
    elCharacterUpCost.greg.innerText = `${DisplayRounded(CharacterLevelUpPrice(Gregory, multibuy[multibuySelector], "query"), 1)}`;

    // Character levels
    elCharacterLevel.bill.innerText  = `Lvl: ${DisplayRounded(Boomer_Bill.lvl,1)}`;
    elCharacterLevel.belle.innerText = `Lvl: ${DisplayRounded(Belle_Boomerette.lvl,1)}`;
    elCharacterLevel.greg.innerText  = `Lvl: ${DisplayRounded(Gregory.lvl)}`;

    // Update Hoes on page
    for(i = 0; i < 6; i++) {
        DisplayHoe(Boomer_Bill, i);
        DisplayHoe(Belle_Boomerette, i);
        DisplayHoe(Gregory, i);
    }

    //The Prestige Potential
    let l = 0.02*(Boomer_Bill.lvl + Belle_Boomerette.lvl + Gregory.lvl);
    let h = 0.01*((Boomer_Bill.Hoes[0])+(2*Boomer_Bill.Hoes[1])+(3*Boomer_Bill.Hoes[2])+(4*Boomer_Bill.Hoes[3])+(5*Boomer_Bill.Hoes[4])+(6*Boomer_Bill.Hoes[5])+(Belle_Boomerette.Hoes[0])+(2*Belle_Boomerette.Hoes[1])+(3*Belle_Boomerette.Hoes[2])+(4*Belle_Boomerette.Hoes[3])+(5*Belle_Boomerette.Hoes[4])+(6*Belle_Boomerette.Hoes[5])+(Gregory.Hoes[0])+(2*Gregory.Hoes[1])+(3*Gregory.Hoes[2])+(4*Gregory.Hoes[3])+(5*Gregory.Hoes[4])+(6*Gregory.Hoes[5]));
    player.prestige_potential=Math.floor(l+h);
    prestige_info.innerText = DisplayRounded(player.prestige_potential,2);

    // Greg's Hoe Prices
    elHoePrices.wooden.innerText    = `${DisplayRounded(HoeCost(0,multibuy[multibuySelector]),1)}`;
    elHoePrices.stone.innerText     = `${DisplayRounded(HoeCost(1,multibuy[multibuySelector]),1)}`;
    elHoePrices.iron.innerText      = `${DisplayRounded(HoeCost(2,multibuy[multibuySelector]),1)}`;
    elHoePrices.gold.innerText      = `${DisplayRounded(HoeCost(3,multibuy[multibuySelector]),1)}`;
    elHoePrices.diamond.innerText   = `${DisplayRounded(HoeCost(4,multibuy[multibuySelector]),1)}`;
    elHoePrices.netherite.innerText = `${DisplayRounded(HoeCost(5,multibuy[multibuySelector]),1)}`;

    if(player.lifetime.golden_carrots>0 || player.prestige_potential>=1){
        dom("prestige-section").style.visibility="visible";
    }
    //Charles Upgrades
    elCharles.improveWorkingConditions.innerHTML =
       `Improve Working Conditions
       Costs: ${Charles.ImproveWorkingConditionsPrice} Golden Carrots`;

    elCharles.betterHoes.innerHTML =
       `Improve all Hoes
       Costs: ${Charles.BetterHoesPrice} Golden Carrots`;

    elCharles.decreaseWages.innerHTML =
      `Decrease Worker Wages
      Costs: ${Charles.DecreaseWagesPrice} Golden Carrots`;

    elCharles.charlesTooltip.innerHTML =
       `IWC: ${Math.floor(100*Charles.ImproveWorkingConditions)}%\n
       BH: ${Math.floor(100*Charles.BetterHoes)}%\n
       DWW: ${Math.floor(100*Charles.DecreaseWages)}%`;
}, 100);
//#endregion

// Lifetime Statistics Panel
const elStatistics = dom('statistics');
const statLoading = elStatistics.innerHTML;
function loadStatistics() {
    if(currentPanel !== "info-panel") return;
    elStatistics.innerHTML =
    `<h3>Lifetime:</h3>
    Carrots earned: <b>${DisplayRounded(player.lifetime.carrots)}</b><br/>
    Golden Carrots earned: <b>${DisplayRounded(player.lifetime.golden_carrots)}</b><br/>
    Prestiges: <b>${DisplayRounded(player.lifetime.prestige_count)}</b><br/><br/>

    Themes:       ${Object.keys(player.themes).length - 3}/${Object.keys(themes).length - 3}<br/>
    Cosmetics:    ${Object.keys(player.cosmetics).length - 1}/${Object.keys(cosmetics).length - 1}<br/><br/>

    Achievements: ${Object.keys(player.achievements).length}/${Object.keys(achievements).length}<br/>`;
}

// Refresh statistics
setInterval(() => {loadStatistics()},2000);

//Music
setInterval(()=>{
    playMusic('music.m4a');
},80000);

/*-----------Tips----------- */
//#region
const default_tips = {
    number:0,
    random:0,
    tracker:0,
    Type:0,
    TypeModifier:0.5,
    basic: [
        "Click the lvl up arrow to level up characters",
        "To buy a Hoe, go to Greg and click the correct type",
        "To equip a Hoe, you must first buy a Hoe, then click the Hoe type under Bill or Belle",
        "Click the carrot",
        "Long hover over a character to view their description",
        "Click here to cycle through available tips!"
    ],
    beginner: [
        "Each character can only hold up to 1 hoe for every level Greg has reached"
    ],
    advanced: [
        "When you're ready, click the prestige button. You will start over but gain a permanent boost", // I swear I wrote a tip for prestiging already, did it get deleted?
        "Golden carrots increase your characters by 10%"
    ],

    fun: [
        "Carrots can end world hunger",
        "Only YOU can save the carrots!",
        "Carrots have been proven to improve eyesight by 150%. It's true!",
        "Carrots are your friend",
        "JJ broke it"
    ],
    funIntermediate: [
        "\"I have night vision now,\" says man who has eaten exclusively carrots for 3 days",
        "Tired of eating carrots? Make carrot cake!",
        "Carrots have been proven to improve eyesight by 1000%. It's true!",
        "Carrots love you ♥",
        "Studies are being done to determine if carrots can cure the common cold"
    ],
    funAdvanced: [
        "World hunger has been cured, but there must be more we can do.",
        "Carrots have never been found at a crime scene because they are the direct cause of peace and friendship.",
        "Carrots have received 7,000,000,000 (★★★★★) 5-star ratings on ebay",
        "Eating carrots cures cancer",
        "Studies done on people eating only carrots for 90 days have proven that they are the only food required for human survival.",
        "Report any anti-carrot propaganda you see on the internet to your local carrot police",
        "Public Service Announcement: Reminder to eat more carrots. That is all.",
        "People who regularly eat carrots have been known to exceed a life expectancy of 200 years",
        "Carrots are people too",
        "Carrots have been proven to improve eyesight by 9000%. It's true!"
    ]
}
const tips= localStorage.getObject("tips");
setInterval(()=>{
    if(tips){
        localStorage.setObject("tips",tips);
    }else{
        localStorage.setObject("tips",default_tips);
        location.reload();
    }
},2000);

function tipchange() {
    
    //Tracker
    if(player.EquipedHoes>0 && tips.tracker==0){
        tips.tracker=1;
    }
    if(player.Carrots>1000000 && tips.tracker==1){
        tips.tracker=2;
    }
    
    //decides if the tip will be real or fun.
    tips.random=Math.random();
    console.log(tips.random);
    if(tips.random<tips.TypeModifier){
        tips.Type="fun";
    }else{tips.Type="real"}
    
    //displays the tip
    if(tips.Type=="fun"){
        switch (tips.tracker){
            case 1:
                tips.number = Math.floor(Math.random()*tips.beginner.length);
                elTips.innerText=tips.beginner[tips.number];
                break;
            case 2:
            case 3:
                tips.number = Math.floor(Math.random()*tips.funAdvanced.length);
                elTips.innerText=tips.funAdvanced[tips.number];
                break;
            default:
                tips.number = Math.floor(Math.random()*tips.fun.length);
                elTips.innerText=tips.fun[tips.number];
        }
    }else{
        switch (tips.tracker){
            case 1:
                tips.number = Math.floor(Math.random()*tips.funIntermediate.length);
                elTips.innerText=tips.funIntermediate[tips.number];
                break;
            case 2:
            case 3:
                tips.number = Math.floor(Math.random()*tips.advanced.length);
                elTips.innerText=tips.advanced[tips.number];
                break;
            default:
                tips.number = Math.floor(Math.random()*tips.basic.length);
                elTips.innerText=tips.basic[tips.number];
        }
    }
}

// Automatically change tips
setInterval(tipchange(), 10000);


//#endregion
