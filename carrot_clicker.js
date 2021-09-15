/*
The Base of the Game is the Objects used to easily store data. 
The core Object is the player. The player object Stores Global Variables not Atributed to another character.
The Character Class Object stores information on each Ingame Character. Currently the active Characters are Boomer_Bill, Belle_Boomerette, and Gregory
The main Game Loop occurs in a setInterval, This loop handles anything that needs to be Constantly checked, Displayed, Or Run.
*/
const tips = {
    tips_basic: [
        "Click The Lvl Up Arrow to Level Up Characters",
        "To Buy a Hoe, Go to Greg and Click The Correct Type",
        "To Equip a Hoe, You Must First Buy a Hoe, Then Click The Hoe Type Under Bill or Belle",
        "Click The Carrot"
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

// getElementById shorthand
function dom(id) {return document.getElementById(id);}

// Local Storage shorthand (Strings only)
function store(key, data) {
    if(data) {
        localStorage.setItem(key, data);
    } else {
        return localStorage.getItem(key);
    }
}

//Locally Store Objects
Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}
Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}

//Default Values Stored in a Player Object
const player1 = {
    Carrots:0,
    cpc:0,
    cps:0,
    golden_carrots:0,
    prestige_potential:0,
    LifetimeCarrots:0,
    LifetimeGoldenCarrots:0
}
//Creates Characters 
class Character{
    constructor(Type,lvl,lvlupPrice,Hoes){
        this.Type=Type;
        this.lvl=lvl;
        this.lvlupPrice=lvlupPrice;
        this.Hoes=Hoes;
    }
}

//Creates Bases to Display Large Numbers 
const Bases=[];
for(i=1000;i<99999999999999999999999999999;i=i*1000) {
    Bases.push(i);
}

// Character Defaults
const Boomer_Bill1 = new Character("Farmer",1,100,[0,0,0,0,0,0]);
const Belle_Boomerette1 = new Character("Farmer",0,450,[0,0,0,0,0,0]);
const Gregory1 = new Character("Blacksmith",0,5000,[0,0,0,0,0,0])
Gregory1.HoePrices = [15000,600000,60000000,7000000000,500000000000,100000000000000];
const Charles1 = {
    BetterHoes:1,
    ImproveWorkingConditions:1,
    DecreaseWages:1
}
//Creates the Local storage
const Charles =          localStorage.getObject("Charles");
const player =           localStorage.getObject("player");
const Boomer_Bill =      localStorage.getObject("Bill");
const Belle_Boomerette = localStorage.getObject("Belle");
const Gregory =          localStorage.getObject("Greg");


//Getting InnerHtml
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
}
const elHoePrices = {
    wooden:     dom("wooden_hoe_price"),
    stone:      dom("stone_hoe_price"),
    iron:       dom("iron_hoe_price"),
    gold:       dom("gold_hoe_price"),
    diamond:    dom("diamond_hoe_price"),
    netherite:  dom("netherite_hoe_price")
}

//variables to prevent spamclicking
var n = 0;
//On Carrots Click
function onClick() {
    player.Carrots+=player.cpc;
    player.LifetimeCarrots+=player.cpc;
    popupHandler();
}
//level up characters 
function LevelUp(character){
    if(player.Carrots>=character.lvlupPrice) {
        character.lvl+=1;
        player.Carrots-=character.lvlupPrice;
        if(character==Gregory){
            character.lvlupPrice=Math.floor(character.lvlupPrice*1.195);
            return;
        }
        if(character==Belle){
            character.lvlupPrice=Math.floor(character.lvlupPrice*1.10109);
            return;
        }
        character.lvlupPrice=Math.floor(character.lvlupPrice*1.102);
    }
}
//Hoes
function CreateHoe(type) {
    if(n==1){
        toast("Greg is busy", "Wait until the current hoe is done crafting before crafting another")
        return;
    }
    //Checks if Greg is Experienced Enough to Purchase a Hoe.
    if(Gregory.lvl<=(type*25)){
        if(type>=1){
            toast("Cant Create Hoe", "Greg too inexperienced. Greg must be at least Level: " + (type*25) + " to create this hoe");
            return;
        }
        toast("Cant Create Hoe", "Greg too inexperienced. Greg must be at least Level: 1 to create this hoe");
        return;
    }
    //Checks to see if Greg Can Hold more of this Type
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
                var elem = dom("Wooden_Hoe_Progress");
                var p = 0;
                var id = setInterval(frame,100);
                function frame() {
                    if (p >= price) {
                        clearInterval(id);
                        i = 0;
                        player.Carrots+=p-price;
                        p=0;
                        elem.style.width = 0 + "%";
                        Gregory.Hoes[type]+=1;
                        Gregory.HoePrices[type]+=(0.05*Gregory.HoePrices[type]);
                        n=0;
                    }else{
                        p+=(0.01*player.Carrots);
                        player.Carrots-=(0.01*player.Carrots);
                        elem. style.width = 100*(p/price) + "%";
                    }
                    
                }
            } 
        } else {
            n=0;
        }
    }
}
//Equips A Hoe To a Character
function EquipHoe(character=Boomer_Bill,type=0){
    if(Gregory.Hoes[type]>=1){
        if(character.Hoes[type]>=Gregory.lvl){
            toast("Insufficient Upgrades", "You Must Upgrade Greg to Hold More Hoes of That Type");
            n=0;
            return;
    }
        character.Hoes[type]+=1;
        Gregory.Hoes[type]-=1;
    }
}
function DisplayHoes(character = Boomer_Bill){
    for (i=0; i<character.Hoes.length;i++){  
        if (character==Boomer_Bill){
            var hoetypes = ["Bill_Wooden_Hoe_Number","Bill_Stone_Hoe_Number","Bill_Iron_Hoe_Number","Bill_Gold_Hoe_Number","Bill_Diamond_Hoe_Number","Bill_Netherite_Hoe_Number"]
        }else if(character==Belle_Boomerette){
            var hoetypes = ["Belle_Wooden_Hoe_Number","Belle_Stone_Hoe_Number","Belle_Iron_Hoe_Number","Belle_Gold_Hoe_Number","Belle_Diamond_Hoe_Number","Belle_Netherite_Hoe_Number"]
        }else if(character==Gregory){
            var hoetypes = ["Greg_Wooden_Hoe_Number","Greg_Stone_Hoe_Number","Greg_Iron_Hoe_Number","Greg_Gold_Hoe_Number","Greg_Diamond_Hoe_Number","Greg_Netherite_Hoe_Number"]
        }
        if (typeof character.Hoes[i] == undefined || character.Hoes[i]==0){
            dom(hoetypes[i]).innerText="";
        }else{
            dom(hoetypes[i]).innerText = `x${character.Hoes[i]}`;
        }
        
    }
}

// Displaying Roundced Numbers example"100m 140b
function DisplayRounded(Value,Fixedto=3){
    var units = ["k","m","b","t","q","Q","s","S"];
    for(i=0;i<units.length;i++){
        if(Value<Bases[i+1] && Value>Bases[0]){
            return (Value/Bases[i]).toFixed(Fixedto)+units[i];
        }
    }
    return Value;
}

// Carrots per second
function CarrotsPerSecond(){
    player.Carrots += player.cps / 10;
}
var cpsInterval = setInterval(CarrotsPerSecond,100);

// Prestige
function Prestige() {
    clearInterval(cpsInterval);
    player.golden_carrots += player.prestige_potential;
    player.LifetimeGoldenCarrots += player.prestige_potential;
    Boomer_Bill.lvlupPrice = 100;
    Belle_Boomerette.lvlupPrice = 500;
    Gregory.lvlupPrice = 5000;
    [Boomer_Bill.lvl, Belle_Boomerette.lvl, Gregory.lvl] = [1,0,0];
    Gregory.HoePrices = [15000,600000,60000000,7000000000,500000000000,100000000000000];
    Boomer_Bill.Hoes = [0,0,0,0,0,0];
    Belle_Boomerette.Hoes = [0,0,0,0,0,0];
    Gregory.Hoes = [0,0,0,0,0,0];
    player.Carrots = 0;
    cpsInterval = setInterval(CarrotsPerSecond,100);
    closeDialog();
}
//// Charles Functions
function BetterHoes(){
    if(Math.floor(Math.pow(Charles.BetterHoes,1.25))<=player.golden_carrots){
        player.golden_carrots-=Math.floor(Math.pow(Charles.BetterHoes,1.25));
        Charles.BetterHoes=(Charles.BetterHoes*1.1);
        return;
    }
    toast("Cant Afford That Upgrade", "It costs "+(Math.floor(Math.pow(Charles.BetterHoes,1.25)))+" golden carrots to purchase that.");
}
function DecreaseWages(){
    if(Math.floor(Math.pow(Charles.DecreaseWages,1.25))<=player.golden_carrots){
        player.golden_carrots-=Math.pow(Charles.DecreaseWages,1.25);
        Charles.DecreaseWages=(Charles.DecreaseWages*1.1);
        return;
    }
    toast("Cant Afford That Upgrade", "It costs "+(Math.floor(Math.pow(Charles.DecreaseWages,1.25))) + " golden carrots to purchase that.");
}
function ImproveWorkingConditions(){
    console.log("f");
    if(Math.floor(Math.pow(Charles.ImproveWorkingConditions,1.25)) <= player.golden_carrots) {
        player.golden_carrots -= Math.pow(Charles.ImproveWorkingConditions, 1.25);
        Charles.ImproveWorkingConditions = (Charles.ImproveWorkingConditions * 1.1);
        return;
    }
    toast("Cant Afford That Upgrade", "It costs " + (Math.floor(Math.pow(Charles.ImproveWorkingConditions,1.25))) + " golden carrots To purchase that.");
}

// delete save
function ClearLocalStorage(){
    localStorage.clear();
    location.reload();
}

// main Game loop
setInterval(()=>{
    // calculates the Cpc
    var cpcHoes = (Boomer_Bill.Hoes[0])+(10*Boomer_Bill.Hoes[1])+(100*Boomer_Bill.Hoes[2])+(1000*Boomer_Bill.Hoes[3])+(10000*Boomer_Bill.Hoes[4])+(100000*Boomer_Bill.Hoes[5]);
    if(Boomer_Bill.Hoes[0]+cpcHoes>0){
        player.cpc=(Boomer_Bill.lvl+Boomer_Bill.lvl*(cpcHoes));
    }else{
        player.cpc=Boomer_Bill.lvl;
    }
    var cpsHoes = (Belle_Boomerette.Hoes[0] + (10*Belle_Boomerette.Hoes[1]) + (100*Belle_Boomerette.Hoes[2]) + (1000*Belle_Boomerette.Hoes[3]) + (10000*Belle_Boomerette.Hoes[4]) + (100000*Belle_Boomerette.Hoes[5]));
    player.cpc=(0.1*(player.golden_carrots+10))*player.cpc;
    //calculates the Cps
    if(Belle_Boomerette.Hoes[0]+cpsHoes>0){
        player.cps=(Belle_Boomerette.lvl+Belle_Boomerette.lvl*(cpsHoes));
    }else{
        player.cps=Belle_Boomerette.lvl;
    }
    player.cps=(0.1*(player.golden_carrots+10))*player.cps;
    //providing updated information to the player

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

    //Farmers Upgrade Cost
    elCharacterUpCost.bill.innerText = `Cost to upgrade Bill: ${DisplayRounded(Boomer_Bill.lvlupPrice,1)}`;
    elCharacterUpCost.belle.innerText = `Cost to upgrade Belle: ${DisplayRounded(Belle_Boomerette.lvlupPrice,1)}`;

    //Bill's Level
    elCharacterLevel.bill.innerText ="Lvl: "+DisplayRounded(Boomer_Bill.lvl,1);

    //Belle's level
    elCharacterLevel.belle.innerText="Lvl: "+DisplayRounded(Belle_Boomerette.lvl,1);

    //Greg's Level
    elCharacterLevel.greg.innerText="Lvl: "+DisplayRounded(Gregory.lvl);

    //Blacksmiths Upgrade Cost
    elCharacterUpCost.greg.innerText="Cost to Upgrade Greg: "+DisplayRounded(Gregory.lvlupPrice,1)+"";

    //Hoe Counts
    DisplayHoes(Boomer_Bill);
    DisplayHoes(Belle_Boomerette);
    DisplayHoes(Gregory);

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
    dom("ImproveWorkingConditions").innerHTML=
        `Improve Working Conditions
        Costs: ${Math.floor(Math.pow(Charles.ImproveWorkingConditions,1.25))} Golden Carrots`;

    dom("BetterHoes").innerHTML=
        `Improve all Hoes
        Costs: ${Math.floor(Math.pow(Charles.BetterHoes,1.25))} Golden Carrots`;

    dom("DecreaseWages").innerHTML=
        `Decrease Worker Wages
        Costs: ${Math.floor(Math.pow(Charles.DecreaseWages,1.25))} Golden Carrots`;

    dom("charlestooltip").innerHTML=
        `IWC:${Math.floor(100*Charles.ImproveWorkingConditions)}% BH:${Math.floor(100*Charles.BetterHoes)}% DWW:${Math.floor(100*Charles.DecreaseWages)}%`;
},100);
// Autosave
setInterval(() => {
    if(player){
        localStorage.setObject("player",player);
        localStorage.setObject("Bill",Boomer_Bill);
        localStorage.setObject("Belle",Belle_Boomerette);
        localStorage.setObject("Greg",Gregory);
        localStorage.setObject("Charles",Charles)
    }else{
        localStorage.setObject("player",player1);
        localStorage.setObject("Bill",Boomer_Bill1);
        localStorage.setObject("Belle",Belle_Boomerette1);
        localStorage.setObject("Greg",Gregory1);
        localStorage.setObject("Charles",Charles1);
        location.reload();
    }
}, 2000);
// Tips
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