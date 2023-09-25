var boostEffects = {
    'cpc': 1,
    'cps': 1,

    'fc_chance': 1,
}


class Farmer extends Character{
    /**
     * Produces Carrots
     * @param {String} nickname Shortened Name
     * @param {String} img The image of the character
     * @param {Number} lvl starting level
     * @param {Number} lvlupPrice the starting level price
     * @param {Array} scaling the way the level up prices scale
     * @param {Array} Hoes Blank hoe array
     */
    constructor(nickname,img,lvl,lvlupPrice,scaling,Hoes){
        super(nickname,img);
        this.lvl=lvl;
        this.lvlupPrice=lvlupPrice;
        this.scaling=scaling;
        this.Hoes=Hoes;
    }

    /** Calculates Carrots Per Click or Per Second Based on inputing Bill or Belle
     * @param {Object} character 
     * @returns Carrots per Click or Carrots per Second
     */
    calculateCarrots(scholar, boostModifer) {

        //A special bonus impelemented only if you have 10 gilded_hoes, It uses the power of the other hoes to give massive buffs
        //If the player does not have 10 gilded_hoes the multiplied defaults to 1
        let SpecialGildedHoeBonus = Math.floor(
            //finds how many gilded_hoes the player has. Each multiple of ten gives increases the buff
            Math.floor(this.Hoes[5]/10) * 
            
            //calculates the buff(Might want to make more powerful, is currently the cuberoot of all the other hoes multiplied together )
            Math.floor(
                Math.pow(this.Hoes[0]*this.Hoes[1]*this.Hoes[2]*this.Hoes[3]*this.Hoes[4],0.3)
            )
        ) || 1;
        

        //Charles Stuff


        //holy book Buff, Currently takes the tome value + 1 and cubes it, so a level 1 tome would give 9 and a level two tome would give 64..
        const holyBookBuff = math.pow(scholar.bibleTome.value+1,3)
        
        
        //cheaper steel, currently uses a rational function to get a value(equivelent to a percentage) to multiply the better hoes by. 
        //curve at https://www.desmos.com/calculator/jh78yzukji  
        const cheaperSteelDebuff = 1/(0.03*scholar.cheaperSteelTome.value+1);

        //salary management
        //same curve as cheaper steel
        const salaryManagementDebuff = 1/(0.03*scholar.salaryManagementTome.value+1);
        
        //improved farming practices
        const farmingPracticeBuffs = 1 + scholar.improvedFarmingPracticeTome.value/20;

        //improved craftsmenship
        const craftsmenshipBuff = 1 + scholar.improveCraftsmanshipTome.value/20;


        /* Calculates the Hoe modifier by creating a shallow copy of this.Hoes and multiplying
           each entry by 10 to the power of that hoes index. Example 1, 10, 100, 1000
           then that shallow array is summed up with the base multiplier of 1
        */
        const hoeModifier = 1+this.Hoes.map((hoe,index)=> hoe*betterHoes*Math.pow(10,index)).reduce((a,b) => a+b);
        

        // // Boost handler
        // let boosted = 1;
        // if(this === Boomer_Bill) boosted = boostEffects.cpc;
        // else if(this === Belle_Boomerette) boosted = boostEffects.cps;




        // Returns the correct value
        return this.lvl * specialGildedHoeBonus * boostModifer * hoeModifier * cheaperSteelDebuff * salaryManagementDebuff * farmingPracticeBuffs * craftsmenshipBuff;
    }
}







function decreaseWagesEffects(){
   }

//improved farming Practice
/**
 * 
 * @param {Boolean} bool If True the positive modifier is given, If False the negative modifer is given
 * @returns 
 */
function improvedFarmingPractices(bool){
   //boosts farmer output
   return Charles.improveWorkingConditions.value ? Math.pow(Math.log(Charles.improveWorkingConditions.value+100),0.5)-2.146 : 0
}

//Better Craftsmenship
function improveCraftsmenship (){
   //improves tools
   //increase tool cost
}

//Cheaper steel
function cheaperSteel(){
   //decreases hoe cost
   //decreases hoe quality
}

//salaryManagement
function salaryManagement(){
    return Charles.decreaseWages.value ? Math.pow(Math.log(Charles.decreaseWages.value+100),0.5)-2.146 : 0; 

   //decreases charcter upgrade cost
   //decreases farmer output
}

//the Bible
function holyBook(){
   //GOATED but expensive
}


function createPriceArray(character, totalItems){
    //creates new array
    let priceArray = new Array;
    
    //scalling modifer
    let modifier = 0;
    let scaling = defaultChar[character.nickname].scaling;

    //decrease wages modifier
    //let dw_modifier = 1 - decreaseWagesEffects(); // Decrease wages

    //setting the price for the first level
    priceArray.push(defaultChar[character.nickname].lvlupPrice*((Jared.data.level_up_discount.value || 100)/100));
    
    let originalIvalue = 1;
    //since Bill's pricee curve starts at lvl 1 instead of zero we push original value twice so priceArray[1] is the price at lvl 1.
    if(character==Boomer_Bill){
        priceArray.push(defaultChar[character.nickname].lvlupPrice*((Jared.data.level_up_discount.value || 100)/100));
        originalIvalue = 2;
    }
    //selects the correct scalling modifer and than pushes a new price onto the array
    for(let i=originalIvalue; i<totalItems;i++){
        for(let si = scaling.length-1; si >= 0; si--) {
            let item = scaling[si];
            if(i >= item.min) {
                modifier = 1 + item.modifier;
                break;
            }
        }
       priceArray.push(dw_modifier * Math.floor(priceArray[i-1] * modifier));
    }

    //returns the price array
    return priceArray;
}


function updateCharlesShop() {
    // Highlight when affordable
    style(elCharles.shop.improveWorkingConditions, 'cant_afford', (Charles.improveWorkingConditions.priceQuery(multibuy[mbsel]) >= player.golden_carrots));
    style(elCharles.shop.betterHoes, 'cant_afford', (Charles.betterHoes.priceQuery(multibuy[mbsel]) >= player.golden_carrots));
    style(elCharles.shop.decreaseWages, 'cant_afford', (Charles.decreaseWages.priceQuery(multibuy[mbsel]) >= player.golden_carrots));

    // Update tome prices
    if(Charles.improveWorkingConditions.priceQuery(multibuy[mbsel])>99999){
        eInnerText(elCharles.prices.improveWorkingConditions, `${DisplayRounded(Charles.improveWorkingConditions.priceQuery(multibuy[mbsel]),2)} Golden Carrots`);
    }else{
        eInnerText(elCharles.prices.improveWorkingConditions, `${numCommas(Charles.improveWorkingConditions.priceQuery(multibuy[mbsel]))} Golden Carrots`);
    }
    if(Charles.betterHoes.priceQuery(multibuy[mbsel])>99999){
        eInnerText(elCharles.prices.betterHoes, `${DisplayRounded(Charles.betterHoes.priceQuery(multibuy[mbsel]),2)} Golden Carrots`);
    }else{
        eInnerText(elCharles.prices.betterHoes, `${numCommas(Charles.betterHoes.priceQuery(multibuy[mbsel]))} Golden Carrots`);
    }
    if(Charles.decreaseWages.priceQuery(multibuy[mbsel])>99999){
        eInnerText(elCharles.prices.decreaseWages, `${DisplayRounded(Charles.decreaseWages.priceQuery(multibuy[mbsel]),2)} Golden Carrots`);
    }else{
        eInnerText(elCharles.prices.decreaseWages, `${numCommas(Charles.decreaseWages.priceQuery(multibuy[mbsel]))} Golden Carrots`);
    }

    // Update tome effects
    eInnerText(tomeEffect.iwc, `+${Charles.improveWorkingConditions.value * 10}%`);
    eInnerText(tomeEffect.bh,  `+${Charles.betterHoes.value}%`);
    eInnerText(tomeEffect.dww, `-${(decreaseWagesEffects()*100).toFixed(2)}%`);

    // Update tome counts
    
    eInnerText(tomeCount.iwc, `Owned: ${numCommas(Charles.improveWorkingConditions.value)}`);
    eInnerText(tomeCount.bh,  `Owned: ${numCommas(Charles.betterHoes.value)}`);
    eInnerText(tomeCount.dww, `Owned: ${numCommas(Charles.decreaseWages.value)}`);
    
    // Make Characters glow
    style(dom('charles_box'), 'glowing', (
        Charles.improveWorkingConditions.price <= player.golden_carrots
        || Charles.betterHoes.price <= player.golden_carrots
        || Charles.decreaseWages.price <= player.golden_carrots
    ));

    // Debugging tooltip
    eInnerText(elCharles.debug,
        `${Math.floor(Charles.improveWorkingConditions.value)}%\n
        BH: ${Math.floor(Charles.betterHoes.value)}%\n
        DWW: ${(decreaseWagesEffects()*100).toFixed(2)}%`);
}