//Values Stored in a Player Object
const player ={
    Carrots:0,
    cpc:0,
    cps:0,
    golden_carrots:0
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
let Boomer_Bill = new Character("Farmer",1,100,[0,0,0,0,0,0]);
let Belle_Boomerette = new Character("Farmer",0,500,[0,0,0,0,0,0]);
let Gregory = new Character("Blacksmith",0,5000,[0,0,0,0,0,0])
Gregory.HoePrices = [10000,200000,4000000,60000000,70000000000000000,8000000000000000];
var prestige_potential;
var prestige_info = document.getElementById("");
//Getting InnerHtml
var Basic_Info = document.getElementById("Basic_Info");
const CharacterUpCost = [document.getElementById("UpBillCost"),document.getElementById("UpBelleCost"),document.getElementById("UpGregCost")];
const CharacterLevel = [document.getElementById("Bill_lvl"),document.getElementById("Belle_lvl"),document.getElementById("Greg_lvl")];
//On Carrots Click
function onClick(){
    player.Carrots+=player.cpc;
    }

//level up characters 
function LevelUp(character){
    if(player.Carrots>=character.lvlupPrice){
        character.lvl+=1;
        player.Carrots-=character.lvlupPrice;
        character.lvlupPrice=Math.floor(character.lvlupPrice*1.15);
        }
}
//Hoes
function CreateHoe(type){
function HoeCost(){
    for(i=0;i<Gregory.HoePrices.length;i++){
        if(type==i){
            return Gregory.HoePrices[i];
        }
    }
}
var price = HoeCost();

var i = 0;
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
    Gregory.HoePrices[type]+=Gregory.HoePrices[type]+(0.01*Gregory.HoePrices[type]);
    } else {
    p+=(0.0333*player.Carrots);
    player.Carrots-=(0.0333*player.Carrots);
    console.log(p)
    elem. style.width = 100*(p/price) + "%";
    }
    
}
}
  
}
function EquipHoe(character,type){
    if(Gregory.Hoes[type>=1]){
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
        [Boomer_Bill.lvl,Belle_Boomerette.lvl,Gregory.lvl,Carrots]=[1,0,0,0];
        for(i=0;i<Boomer_Bill.Hoes.length;i++){
            Boomer_Bill.Hoes[i]=0;
            Belle_Boomerette.Hoes[i]=0;
            Gregory.Hoes[i]=0;
            
        }    
    }
//main Game loop
setInterval(function(){
    //calculates the Cpc
    player.cpc=Boomer_Bill.lvl+Boomer_Bill.lvl*(Boomer_Bill.Hoes[0]+(10*Boomer_Bill.Hoes[1])+(100*Boomer_Bill.Hoes[2])+(1000*Boomer_Bill.Hoes[3])+(10000*Boomer_Bill.Hoes[4])+(100000*Boomer_Bill.Hoes[5]));

    //calculates the Cps
    player.cps=Belle_Boomerette.lvl+Belle_Boomerette.lvl*(Belle_Boomerette.Hoes[0]+(10*Belle_Boomerette.Hoes[1])+(100*Belle_Boomerette.Hoes[2])+(1000*Belle_Boomerette.Hoes[3])+(10000*Belle_Boomerette.Hoes[4])+(100000*Belle_Boomerette.Hoes[5]));
  
    //providing updated information to the player
    //The Basic info for the player, Carrots; Cpc; Cps
    Basic_Info.innerText ="Carrots:"+DisplayRounded(Math.floor(player.Carrots))+" CPC:"+DisplayRounded(player.cpc,2)+" CPS:"+DisplayRounded(player.cps,2);
    //Farmers Upgrade Cost
    CharacterUpCost[0].innerText = "Cost to upgrade Bill:"+DisplayRounded(Boomer_Bill.lvlupPrice,1)+"";
    CharacterUpCost[1].innerText = "Cost to upgrade Belle:"+DisplayRounded(Belle_Boomerette.lvlupPrice,1)+"";
    //Bill's Level
    CharacterLevel[0].innerText ="Lvl:"+DisplayRounded(Boomer_Bill.lvl,1);
    //Belle's level
    CharacterLevel[1].innerText="Lvl:"+DisplayRounded(Belle_Boomerette.lvl,1);
    //Greg's Level
    CharacterLevel[2].innerText="Lvl:"+DisplayRounded(Gregory.lvl);
    //Blacksmiths Upgrade Cost
    CharacterUpCost[2].innerText="Cost to Upgrade Greg:"+DisplayRounded(Gregory.lvlupPrice,1)+"";
    //Hoe Counts
    DisplayHoes(Boomer_Bill);
    DisplayHoes(Belle_Boomerette);
    DisplayHoes(Gregory);
    //The Prestige Potential
    let l = 0.04*(Boomer_Bill.lvl + Belle_Boomerette.lvl + Gregory.lvl);
    let h = 0.01*(Boomer_Bill.Hoes[0]+(2*Boomer_Bill.Hoes[1])+(3*Boomer_Bill.Hoes[2])+(4*Boomer_Bill.Hoes[3])+(5*Boomer_Bill.Hoes[4])+(6*Boomer_Bill.Hoes[5])+Belle_Boomerette.Hoes[0]+(2*Belle_Boomerette.Hoes[1])+(3*Belle_Boomerette.Hoes[2])+(4*Belle_Boomerette.Hoes[3])+(5*Belle_Boomerette.Hoes[4])+(6*Belle_Boomerette[5])+(Gregory.Hoes[0])+(2*Gregory.Hoes[1])+(3*Gregory.Hoes[2])+(4*Gregory.Hoes[3])+(5*Gregory.Hoes[4])+(6*Gregory.Hoes[5]));
    prestige_potential=h;
    let q = 0.1*((Boomer_Bill.Hoes[0])+(2*Boomer_Bill.Hoes[1])+(3*Boomer_Bill.Hoes[2])+(4*Boomer_Bill.Hoes[3])+(5*Boomer_Bill.Hoes[4])+(6*Boomer_Bill.Hoes[5])+(Belle_Boomerette.Hoes[0])+(2*Belle_Boomerette.Hoes[1])+(3*Belle_Boomerette.Hoes[2])+(4*Belle_Boomerette.Hoes[3])+(5*Belle_Boomerette.Hoes[4])+(6*Belle_Boomerette.Hoes[5])+(Gregory.Hoes[0])+(2*Gregory.Hoes[1])+(3*Gregory.Hoes[2])+(4*Gregory.Hoes[3])+(5*Gregory.Hoes[4])+(6*Gregory.Hoes[5]));
    
    
    document.getElementById("Prestige").innerText = "Prestiging now will result in "+DisplayRounded(q+l,2)+" Golden Carrots";
},25);
