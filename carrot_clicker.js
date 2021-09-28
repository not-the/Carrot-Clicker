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
// getElementById shorthand
function dom(id) {return document.getElementById(id);}


// Getting InnerHtml
const prestige_info = dom("Prestige");
const Basic_Info = dom("Basic_Info");
const elCarrotCount = dom("Carrot_Count");
const elCPC = dom("cpc");
const elCPS = dom("cps");
const elGoldenCarrotCount = dom("golden_carrot_count");
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


// Local Storage shorthand (Strings only)
function store(key, data) {
    if(data) {
        localStorage.setItem(key, data);
    } else {
        return localStorage.getItem(key);
    }
}


// Locally Store Objects
Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}
Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}



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
    Carrots:0,
    cpc:0,
    cps:0,
    golden_carrots:0,
    prestige_potential:0,
    LifetimeCarrots:0,
    LifetimeGoldenCarrots:0
}


// Character Defaults
const Default_Boomer_Bill      = new Character("Farmer",1,100,[0,0,0,0,0,0]);
const Default_Belle_Boomerette = new Character("Farmer",0,450,[0,0,0,0,0,0]);
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

//#endregion


/* ----------------------Functions------------------------*/
//#region
//On Carrots Click
function onClick() {
    player.Carrots+=player.cpc;
    player.LifetimeCarrots+=player.cpc;
    popupHandler();
}


// Carrots per second
function CarrotsPerSecond() {
    player.Carrots += player.cps / 10;
}
var cpsInterval = setInterval(CarrotsPerSecond,100);



//level up characters 
function LevelUp(character) {
    if(player.Carrots>=character.lvlupPrice) {
        character.lvl+=1;
        player.Carrots-=character.lvlupPrice;
        if(character==Gregory){
            let UpGregPercent =((1-DecreaseWagesEffects())*Math.floor(character.lvlupPrice*0.195));
            character.lvlupPrice+=UpGregPercent;
            return;
        }
        if(character==Belle_Boomerette){
            let UpBellePercent = ((1-DecreaseWagesEffects())*Math.floor(character.lvlupPrice*0.10109));
            character.lvlupPrice+=UpBellePercent;
            return;
        }
        let UpBillPercent =((1-DecreaseWagesEffects())*Math.floor(character.lvlupPrice*0.102));
        character.lvlupPrice+=UpBillPercent;
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
    player.golden_carrots += player.prestige_potential;
    player.LifetimeGoldenCarrots += player.prestige_potential;
    [Boomer_Bill.lvlupPrice,Belle_Boomerette.lvlupPrice, Gregory.lvlupPrice] = [Default_Boomer_Bill.lvlupPrice,Default_Belle_Boomerette.lvlupPrice,Default_Gregory.lvlupPrice];
    [Boomer_Bill.lvl, Belle_Boomerette.lvl, Gregory.lvl] = [Default_Boomer_Bill.lvl,Default_Belle_Boomerette.lvl,Default_Gregory.lvl];
    for(i=0;i>6;i++){
        Boomer_Bill.HoePrices[i]=Default_Boomer_Bill.HoePrices[i];
        Belle_Boomerette.HoePrices[i]=Default_Belle_Boomerette.HoePrices[i];
        Gregory.HoePrices[i]=Default_Gregory.HoePrices[i];
    }

    player.Carrots = 0;
    cpsInterval = setInterval(CarrotsPerSecond,100);
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
function CreateHoe(type) {
    // Return if a hoe is already in progress
    if(n==1){
        toast("Greg is busy", "Wait until the current hoe is done crafting before crafting another")
        return;
    }

    // Checks if Greg is Experienced Enough to Purchase a Hoe.
    if(Gregory.lvl<=(type*25)){
        if(type>=1){
            toast("Cant Create Hoe", `Greg too inexperienced. Greg must be at least Level: ${type*25} to create this hoe`);
            return;
        }
        toast("Cant Create Hoe", "Greg too inexperienced. Greg must be at least Level: 1 to create this hoe");
        return;
    }

    // Checks to see if Greg Can Hold more of this Type
    if(Gregory.Hoes[type] >= Gregory.lvl){
        toast("Insufficient Upgrades", "You must upgrade greg to hold more hoes of that type");
        return;
    } 

    //Stores The Correct Hoe Price
    function HoeCost(){
        for(i=0;i<Gregory.HoePrices.length;i++){
            if(type==i){
                return Gregory.HoePrices[i];
            }
        }
    }
    let price = HoeCost();
    //Checks if Hoe is Too expensive
    if(price>=(player.Carrots*2)){
        toast("Too Expensive!", "That hoe is currently too expensive.");
        return;
    }
    if(n==0){
        n=1;   
        //Creates Hoe And Displays Progress Bar
        var i = 0;
        if(Gregory.lvl>=(type*10)&&Gregory.lvl>=1){
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
                        Gregory.Hoes[type]+=1;
                        Gregory.HoePrices[type]+=(0.05*Gregory.HoePrices[type]);
                        n=0;
                    } else {
                        p+=(0.01*player.Carrots);
                        player.Carrots-=(0.01*player.Carrots);
                        elGregProgress.style.width = 100*(p/price) + "%";
                    }

                }
            } 
        } else {
            n=0;
        }
    }
}



//Equips A Hoe To a Character
function EquipHoe(character=Boomer_Bill, type=0){
    if(Gregory.Hoes[type]>=1){
        if(character.Hoes[type]>=Gregory.lvl) {
            toast("Insufficient Upgrades", "You Must Upgrade Greg to Hold More Hoes of That Type");
            n=0;
            return;
        }
        character.Hoes[type]+=1;
        Gregory.Hoes[type]-=1;
    }
}

// Temporary fix thing, going to just add their names to their objects probably
function characterString(character, type) {
    switch(character) {
        case Boomer_Bill:
            return charString = 'bill';
        case Belle_Boomerette:
            return charString = 'belle';
        case Gregory:
            return charString = 'greg';
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
            if(store('tutorial_first_hoe') == null) {tutorialHoes();}
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


/* ----------------Quality of Life Functions --------------*/
//#region

//Creates Bases to Display Large Numbers 
const Bases=[];
for(i=1000;i<99999999999999999999999999999;i=i*1000) {
    Bases.push(i);
}

// Displaying Roundced Numbers example"100m 140b
function DisplayRounded(Value, Fixedto=3) {
    var units = ["k","m","b","t","q","Q","s","S"];
    for(i=0;i<units.length;i++){
        if(Value<Bases[i+1] && Value>Bases[0]){
            return (Value/Bases[i]).toFixed(Fixedto)+units[i];
        }
    }
    return Value;
}



// delete save
function ClearLocalStorage(){
    console.log('Clearing local storage');
    
    localStorage.clear();
    location.reload();
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
    //Add improve working conditions bonus
    if(Charles.ImproveWorkingConditions>0){
        player.cpc = (player.cpc*(1.1*Charles.ImproveWorkingConditions));
        player.cps=(player.cps*(1.1*Charles.ImproveWorkingConditions));
    }
    

    // Providing updated information to the player

    //// Update numbers on page ////

    // Top bar (Might bring back later - don't delete)
    // Basic_Info.innerText = "Carrots:" + DisplayRounded(Math.floor(player.Carrots)) + " CPC:"+DisplayRounded(Math.floor(player.cpc),2) + " CPS:"+ DisplayRounded(Math.floor(player.cps),2) + " Golden Carrots:" + DisplayRounded(player.golden_carrots,2);

    // New display
    elCarrotCount.innerText = `${DisplayRounded(Math.floor(player.Carrots))} Carrots`;
    elCPC.innerText = `Carrots per click: ${DisplayRounded(Math.floor(player.cpc),2)}`;
    elCPS.innerText = `Carrots per second: ${DisplayRounded(Math.floor(player.cps),2)}`;

    //The Basic info for the player, Carrots; Cpc; Cps
    if(player.LifetimeGoldenCarrots>=1 || player.prestige_potential>=1){
        elGoldenCarrotCount.innerText = `Golden Carrots: ${DisplayRounded(player.golden_carrots,2)}`
    }
    if(player.LifetimeGoldenCarrots>=1) {
        elGoldenCarrotCount.style.color = "white";
    }

    // Costs to level up characters
    elCharacterUpCost.bill.innerText = `Cost to upgrade Bill: ${DisplayRounded(Boomer_Bill.lvlupPrice,1)}`;
    elCharacterUpCost.belle.innerText = `Cost to upgrade Belle: ${DisplayRounded(Belle_Boomerette.lvlupPrice,1)}`;
    elCharacterUpCost.greg.innerText="Cost to Upgrade Greg: "+DisplayRounded(Gregory.lvlupPrice,1)+"";

    // Character levels
    elCharacterLevel.bill.innerText ="Lvl: "+DisplayRounded(Boomer_Bill.lvl,1);
    elCharacterLevel.belle.innerText="Lvl: "+DisplayRounded(Belle_Boomerette.lvl,1);
    elCharacterLevel.greg.innerText="Lvl: "+DisplayRounded(Gregory.lvl);

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
    elHoePrices.wooden.innerText    = `${DisplayRounded(Gregory.HoePrices[0],1)}`;
    elHoePrices.stone.innerText     = `${DisplayRounded(Gregory.HoePrices[1],1)}`;
    elHoePrices.iron.innerText      = `${DisplayRounded(Gregory.HoePrices[2],1)}`;
    elHoePrices.gold.innerText      = `${DisplayRounded(Gregory.HoePrices[3],1)}`;
    elHoePrices.diamond.innerText   = `${DisplayRounded(Gregory.HoePrices[4],1)}`;
    elHoePrices.netherite.innerText = `${DisplayRounded(Gregory.HoePrices[5],1)}`;

    if(player.LifetimeGoldenCarrots>0 || player.prestige_potential>=1){
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


/*---------Auto Saves----------*/
//#region

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


/*-----------Tips----------- */
//#region
const tips = {
    tips_basic: [
        "Click The Lvl Up Arrow to Level Up Characters",
        "To Buy a Hoe, Go to Greg and Click The Correct Type",
        "To Equip a Hoe, You Must First Buy a Hoe, Then Click The Hoe Type Under Bill or Belle",
        "Click The Carrot",
        "Long hover over a character to view their description"
    ],
    tips_beginner: [
        "Each Hoe Can only Be stacked up to Gregs Lvl",
        
    ],
    tips_Advanced: [
        "Golden Carrots Increase Your Characters by 10%",
    ],
    tips_fun: [
        "Carrots Can End World Hunger",
        "Only You Can save the Carrots!"
    ]
}

var tipTracker = 1;
var tipType = 0
var TipTypeModifier = 1;


tipchange = function(){
    tipType=Math.random*TipTypeModifier;
    if(tipType<0.9){
       tipnumber = Math.floor(Math.random()*tips_Basic.length);
        if(tipnumber == tipTracker) {
            tipchange();
            return;
        }
        dom("Tip").innerText=tips_Basic[tipnumber];
        tipTracker = tipnumber;
        return;
    } 
    tipnumber = Math.floor(Math.random()*tips.tips_fun.length);
    if(tipnumber == tipTracker) {
        tipchange();
        return;
    }
    dom("Tip").innerText=tips.tips_fun[tipnumber];
    tipTracker = tipnumber;
    return;
}

// Automatically change tips
setInterval(tipchange(), 10000);

//#endregion
