/*
The Base of the Game is the Objects used to easily store data. 
The core Object is the player. The player object Stores Global Variables not Atributed to another character.
The Character Class Object stores information on each Ingame Character. Currently the active Characters are Boomer_Bill, Belle_Boomerette, and Gregory
The main Game Loop occurs in a setInterval, This loop handles anything that needs to be Constantly checked, Displayed, Or Run.
*/
const tips =[
    "Tip: Click The Lvl Up Arrow to Level Up Characters",
    "Tip: To Buy a Hoe, Go to Greg and Click The Correct Type",
    "Tip: To Equip a Hoe, You Must First Buy a Hoe, Then Click The Hoe Type Under Bill or Belle",
    "Tip: Click The Carrot","Golden Carrots Increase Your Characters by 10%"
];

Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}

//Values Stored in a Player Object
const player1 ={
    Carrots:0,
    cpc:0,
    cps:0,
    golden_carrots:0,
    prestige_potential:0,
    LifetimeCarrots:0,
    LifetimeGolenCarrots:0
}


//Creates Bases to Display Large Numbers 
const Bases=[];
for(i=1000;i<99999999999999999999999999999;i=i*1000) {
    Bases.push(i);
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

let Boomer_Bill1 = new Character("Farmer",1,100,[0,0,0,0,0,0]);
let Belle_Boomerette1 = new Character("Farmer",0,500,[0,0,0,0,0,0]);
let Gregory1 = new Character("Blacksmith",0,5000,[0,0,0,0,0,0])
Gregory1.HoePrices = [15000,600000,10000000,900000000,50000000000,10000000000000];

const player=localStorage.getObject("player");
const Boomer_Bill=localStorage.getObject("Bill");
const Belle_Boomerette=localStorage.getObject("Belle");
const Gregory =localStorage.getObject("Greg");

//Getting InnerHtml
let prestige_info = document.getElementById("");
let Basic_Info = document.getElementById("Basic_Info");
const CharacterUpCost = [document.getElementById("UpBillCost"),document.getElementById("UpBelleCost"),document.getElementById("UpGregCost")];
const CharacterLevel = [document.getElementById("Bill_lvl"),document.getElementById("Belle_lvl"),document.getElementById("Greg_lvl")];

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
        character.lvlupPrice=Math.floor(character.lvlupPrice*1.102);
    }
}
//Hoes
function CreateHoe(type) {
    //Stores The Correct Hoe Price
    function HoeCost(){
        for(i=0;i<Gregory.HoePrices.length;i++){
            if(type==i){
                return Gregory.HoePrices[i];
            }
        }
    }
    let price = HoeCost();
    if(price>=(player.Carrots*2)){
        alert("That Hoe is Currently Too Expensive");
        return;
    }
    if(Gregory.lvl>=(type*10)&&Gregory.lvl>=1){
        if (i == 0) {
            i = 1;
            var elem = document.getElementById("Wooden_Hoe_Progress");
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
                } else {
                    p+=(0.01*player.Carrots);
                    player.Carrots-=(0.01*player.Carrots);
                    elem. style.width = 100*(p/price) + "%";
                }
            }
        } 
    }

    //Creates Hoe And Displays Progress Bar
    var i = 0;

}

//Equips A Hoe To a Character
function EquipHoe(character=Boomer_Bill,type=0){
    if(Gregory.Hoes[type]>=1){
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
        document.getElementById(hoetypes[i]).innerText="";
        }else{
            document.getElementById(hoetypes[i]).innerText=character.Hoes[i];
        }
        
    }
}

//Displaying Roundced Numbers example"100m 140b
function DisplayRounded(Value,Fixedto=3){
    var units = ["k","m","b","t","q","Q","s","S"];
    for(i=0;i<units.length;i++){
        if(Value<Bases[i+1] && Value>Bases[0]){
            return (Value/Bases[i]).toFixed(Fixedto)+units[i];
        }
    }
    return Value;
}

//Carrots per second
setInterval(function(){
player.Carrots+=player.cps/25;
},25);

//Prestige
function Prestige(){
    let cnfrm = confirm("Are you Sure you want to Presige?");
    if(cnfrm==true){
        player.golden_carrots+=player.prestige_potential;
        player.LifetimeGolenCarrots+=player.prestige_potential;
        Boomer_Bill.lvlupPrice=100;
        Belle_Boomerette.lvlupPrice=500;
        [Boomer_Bill.lvl,Belle_Boomerette.lvl,Gregory.lvl,player.Carrots]=[1,0,0,0];
        Gregory.HoePrices = [15000,600000,10000000,900000000,50000000000,10000000000000];
        Boomer_Bill.Hoes=[0,0,0,0,0,0];
        Belle_Boomerette.Hoes=[0,0,0,0,0,0];
        Gregory.Hoes=[0,0,0,0,0,0];
    }  
}



//main Game loop
setInterval(()=>{
    //calculates the Cpc
    if(((1*Boomer_Bill.Hoes[0])+(10*Boomer_Bill.Hoes[1])+(100*Boomer_Bill.Hoes[2])+(1000*Boomer_Bill.Hoes[3])+(10000*Boomer_Bill.Hoes[4])+(100000*Boomer_Bill.Hoes[5]))>0){
        player.cpc=(Boomer_Bill.lvl*((1*Boomer_Bill.Hoes[0])+(10*Boomer_Bill.Hoes[1])+(100*Boomer_Bill.Hoes[2])+(1000*Boomer_Bill.Hoes[3])+(10000*Boomer_Bill.Hoes[4])+(100000*Boomer_Bill.Hoes[5])));
    }else{
        player.cpc=Boomer_Bill.lvl;
    }
    player.cpc=(0.1*(player.golden_carrots+10))*player.cpc;
    //calculates the Cps
    if((Belle_Boomerette.Hoes[0]+(1*Belle_Boomerette.Hoes[1])+(10*Belle_Boomerette.Hoes[2])+(100*Belle_Boomerette.Hoes[3])+(1000*Belle_Boomerette.Hoes[4])+(10000*Belle_Boomerette.Hoes[5]))>0){
        player.cps=(Belle_Boomerette.lvl+Belle_Boomerette.lvl*(Belle_Boomerette.Hoes[0]+(10*Belle_Boomerette.Hoes[1])+(100*Belle_Boomerette.Hoes[2])+(1000*Belle_Boomerette.Hoes[3])+(10000*Belle_Boomerette.Hoes[4])+(100000*Belle_Boomerette.Hoes[5])));
    }else{
        player.cps=Belle_Boomerette.lvl;
    }
    player.cps=(0.1*(player.golden_carrots+10))*player.cps;
    //providing updated information to the player
    
    //The Basic info for the player, Carrots; Cpc; Cps
    if(player.LifetimeGolenCarrots>=1 || player.prestige_potential>=1){
        Basic_Info.innerText ="Carrots:"+DisplayRounded(Math.floor(player.Carrots))+" CPC:"+DisplayRounded(Math.floor(player.cpc),2)+" CPS:"+DisplayRounded(Math.floor(player.cps),2)+" Golden Carrots:"+DisplayRounded(player.golden_carrots,2);
    }
    else{
        Basic_Info.innerText ="Carrots: "+DisplayRounded(Math.floor(player.Carrots))+" | CPC: "+DisplayRounded(Math.floor(player.cpc),2)+" | CPS: "+DisplayRounded(Math.floor(player.cps),2);
    }
    
    //Farmers Upgrade Cost
    CharacterUpCost[0].innerText = "Cost to upgrade Bill: "+DisplayRounded(Boomer_Bill.lvlupPrice,1)+"";
    CharacterUpCost[1].innerText = "Cost to upgrade Belle: "+DisplayRounded(Belle_Boomerette.lvlupPrice,1)+"";
    //Bill's Level
    CharacterLevel[0].innerText ="Lvl: "+DisplayRounded(Boomer_Bill.lvl,1);
    //Belle's level
    CharacterLevel[1].innerText="Lvl: "+DisplayRounded(Belle_Boomerette.lvl,1);
    //Greg's Level
    CharacterLevel[2].innerText="Lvl: "+DisplayRounded(Gregory.lvl);
    //Blacksmiths Upgrade Cost
    CharacterUpCost[2].innerText="Cost to Upgrade Greg: "+DisplayRounded(Gregory.lvlupPrice,1)+"";
    //Hoe Counts
    DisplayHoes(Boomer_Bill);
    DisplayHoes(Belle_Boomerette);
    DisplayHoes(Gregory);
    //The Prestige Potential
    let l = 0.02*(Boomer_Bill.lvl + Belle_Boomerette.lvl + Gregory.lvl);
    let h = 0.005*((Boomer_Bill.Hoes[0])+(2*Boomer_Bill.Hoes[1])+(3*Boomer_Bill.Hoes[2])+(4*Boomer_Bill.Hoes[3])+(5*Boomer_Bill.Hoes[4])+(6*Boomer_Bill.Hoes[5])+(Belle_Boomerette.Hoes[0])+(2*Belle_Boomerette.Hoes[1])+(3*Belle_Boomerette.Hoes[2])+(4*Belle_Boomerette.Hoes[3])+(5*Belle_Boomerette.Hoes[4])+(6*Belle_Boomerette.Hoes[5])+(Gregory.Hoes[0])+(2*Gregory.Hoes[1])+(3*Gregory.Hoes[2])+(4*Gregory.Hoes[3])+(5*Gregory.Hoes[4])+(6*Gregory.Hoes[5]));
    player.prestige_potential=Math.floor(l+h);
    document.getElementById("Prestige").innerText = "Prestiging now will result in "+DisplayRounded(player.prestige_potential,2)+" Golden Carrots";
    document.getElementById("Hoe_Prices").innerText=DisplayRounded(Gregory.HoePrices[0],1)+" "+DisplayRounded(Gregory.HoePrices[1],1)+" "+DisplayRounded(Gregory.HoePrices[2],1)+" "+DisplayRounded(Gregory.HoePrices[3],1)+" "+DisplayRounded(Gregory.HoePrices[4],1)+" "+DisplayRounded(Gregory.HoePrices[5],1);
    if(player.golden_carrots>=0.01 || player.prestige_potential>=1){
        console.log("o");
        document.getElementById("prestige-section").style.visibility="visible";
        
    }
},25);

// Autosave
setInterval(() => {
    if(player){
        localStorage.setObject("player",player);
        localStorage.setObject("Bill",Boomer_Bill);
        localStorage.setObject("Belle",Belle_Boomerette);
        localStorage.setObject("Greg",Gregory);
    }
    else{
        localStorage.setObject("player",player1);
        localStorage.setObject("Bill",Boomer_Bill1);
        localStorage.setObject("Belle",Belle_Boomerette1);
        localStorage.setObject("Greg",Gregory1);
    }
}, 2000);

// Tips
var tipTracker = 1;
tipchange = function(){
    tipnumber = Math.floor(Math.random()*tips.length);
    if(tipnumber == tipTracker) {
        tipchange();
        return;
    } else {
        document.getElementById("Tip").innerText=tips[tipnumber];
        tipTracker = tipnumber;
    }
    
}
// Automatically change tips
setInterval(() => {
    tipchange();
}, 10000);
