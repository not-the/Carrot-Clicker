class tome {
    constructor(value,price,max,scaling){
        this.value=value;
        this.price=price;
        this.max=max;
        this.scaling=scaling;
    }
    add(amount){
        if(typeof(amount)!=Number) return console.error(TypeError);
        let target=this.value+amount;
        let sum=this.price;
        Purchase();
        function Purchase(){
            if(this.value<=50) this.scaling=1.001;
            if(this.value>50) this.scaling=1.04;
            if(target===this.value) return sum;
            if(this.value<=50)sum+=Math.ceil(sum*this.scaling);
            if(this.value>50)sum+=Math.floor(sum*this.scaling);
            this.value+=1;
            Purchase();
        }
    }
    priceQuery(ammont){
        if(typeof(amount)!=Number) return console.error(TypeError);
        let valueDummy=this.value;
        let target=valueDummy+amount;
        let sum=this.price;
        return query();
        function query(){
            if(valueDummy<=50) this.scaling=1.001;
            if(valueDummy>50) this.scaling=1.04;
            if(target===valueDummy) return sum;
            if(valueDummy<=50)sum+=Math.ceil(sum*this.scaling);
            if(valueDummy>50)sum+=Math.floor(sum*this.scaling);
            valueDummy+=1;
            query();
        }
    }
       
}
//#region 
/** Calculates and optionally sets the prices for Charles' tomes
 * @param {*} tome Example: Charles.improveWorkingConditions
 * @param {number} amount 
 * @param {string} mode Options: "query" or "apply"
 * @returns The calculated price
 */
 function CharlesUpgradePrices(tome=Charles.improveWorkingConditions, amount=1, mode="query"){
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
    if(amount==1){
        //decreaseWages
        if(tome==Charles.decreaseWages){
            if(Charles.decreaseWages.price+i<=50){
                multibuyPrice(0.001);
            }else{
                multibuyPrice(0.039);
            }
        }
        //improveWorkingConditions
        else if(tome==Charles.improveWorkingConditions){
            if(Charles.improveWorkingConditions.price+i<50){
                multibuyPrice(0.001);
            }else{
                multibuyPrice(0.039);
            }
        }
        //betterHoes
        else if(tome==Charles.betterHoes){
            if(Charles.betterHoes.price+i<75){
                multibuyPrice(0.001);
            }else{
                multibuyPrice(0.039);
            }
            
        }
    }else{
        for(i=1; i<amount; i++){
        
    }
    }

    if(mode=="apply"){tome.price=r2}
    if(amount==1){return tome.price}
    return r2;
}

/** Buy tome
 * @param {Object} tome Example: Charles.improveWorkingConditions
 * @param {Number} amount 
 * @returns 
 */
function BuyTome(tome=Charles.improveWorkingConditions, amount=1) {
    // Tome maximum
    if(tome.max != undefined && tome.max != false && tome.value + amount > tome.max) {
        toast('Maximum tomes reached', 'You can only have 22025 Decrease Wages tomes', '', false, true);
        return;
    }

    // Can't afford
    if(player.golden_carrots < CharlesUpgradePrices(tome,amount)) return;

    // Give tome(s)
    player.golden_carrots -= CharlesUpgradePrices(tome,amount);
    tome.value += amount;
    player.lifetime.tomes_bought ++;
    CharlesUpgradePrices(tome, amount, "apply");

    // Recalculate CPC/CPS/level up prices
    player.cpc = Calculate_Carrots(Boomer_Bill);
    player.cps = Calculate_Carrots(Belle_Boomerette);
    recalculatePrices();

    // Update page
    updateCharlesShop();
    updateCPC();
    updateGC();
    mouseConfetti([3, 8], ccWhite);
}
/** Recalculate lvl up prices */
function recalculatePrices() {
    const levelable = [Boomer_Bill, Belle_Boomerette, Gregory];
    for(i = 0; i < levelable.length; i++) {
        let char = levelable[i];
        char.lvlupPrice = getLevelPrice(char, char.lvl-1);
    }
    characterPrices();
    characterButtons();
}

/** Calculates Decrease Wages Effect
 * @returns Percentage of wage off
 */
function DecreaseWagesEffects(){
    if(Charles.decreaseWages.value<1000){
        return((Math.pow(Math.log(Charles.decreaseWages.value+1),3)/318.114));
    }else if(Charles.decreaseWages.value<1000){
        return((Math.pow(Math.log(Charles.decreaseWages.value+1),2)/69.077553));
    }else{
        return (Math.log(Charles.decreaseWages.value+1)/10);
    }
}
//#endregion


/** Calculates and returns a character's level up price at a given level
 * @param {object} character Character object
 * @param {number} level Intended level
 * @returns New character level up price
 */
 function getLevelPrice(character=Boomer_Bill, level=1, amount=1, initial=true) {
    if(amount != 1) return getMultiLevelPrice(character, amount); // Multibuy
    if(level <= 0 || (level <= 1 && character == Boomer_Bill)) {  // Stop recursion
        let dp = defaultChar[character.nickname].lvlupPrice;
        return initial ? dp * ((Six.data.level_up_discount.value || 100) / 100) : dp;
    }

    let price = getLevelPrice(character, level-1, amount, false);
    let modifier = 0;
    let scaling = defaultChar[character.nickname].scaling;
    for(let si = scaling.length-1; si >= 0; si--) {
        let item = scaling[si];
        if(level >= item.min) {
            modifier = item.modifier;
            break;
        }
    }

    // Calculate
    let dw_modifier = 1 - DecreaseWagesEffects(); // Decrease wages
    price += dw_modifier * Math.floor(price * modifier);
    // return price;
    return initial ? price * ((Six.data.level_up_discount.value || 100) / 100) : price;

    /** Multibuy price */
    function getMultiLevelPrice(character, amount) {
        let current = character.lvl;
        let target = current + amount;
        let multi_price = 0;
        for(let i = current; i <= target; i++) {
            let add = getLevelPrice(character, current + i);
            multi_price += add;
        }
        return multi_price;
    }
}

/** Levels up characters
 * @param {Object} character Character object
 * @param {Number} amount Multibuy amount
 * @returns If unable to level up
 */
function LevelUp(character=Boomer_Bill, amount=1) {
    if(characterQuery(character.nickname) == false) return;

    // Check if can afford
    let price = getLevelPrice(character, character.lvl, amount);
    if(player.carrots >= price) {
        player.carrots -= price; // Charge player
        character.lvl += amount;
        character.lvlupPrice = getLevelPrice(character, character.lvl+1); // Set next lvlupprice

        // Update page
        carrotCount();
        characterPrices();
        characterButtons();
        updateCPC();
        if(character==Boomer_Bill){player.cpc=Calculate_Carrots(Boomer_Bill);}
        if(character==Belle_Boomerette){player.cps=Calculate_Carrots(Belle_Boomerette);}

        // Animation
        mouseConfetti([2, 3], ccGold);
    }
}






function getLevelPrice(character=Boomer_Bill, amount=1, initial=true) {
    if(amount != 1) return getMultiLevelPrice(character, amount); // Multibuy
    if(character.level <= 0 || (character.level <= 1 && character == Boomer_Bill)) {  // Stop recursion
        let dp = defaultChar[character.nickname].lvlupPrice;
        return initial ? dp * ((Six.data.level_up_discount.value || 100) / 100) : dp;
    }

    let price = getLevelPrice(character, character.level-1, amount, false);
    let modifier = 0;
    let scaling = defaultChar[character.nickname].scaling;
    for(let si = scaling.length-1; si >= 0; si--) {
        let item = scaling[si];
        if(level >= item.min) {
            modifier = item.modifier;
            break;
        }
    }

    // Calculate
    let dw_modifier = 1 - DecreaseWagesEffects(); // Decrease wages
    price += dw_modifier * Math.floor(price * modifier);
    // return price;
    return initial ? price * ((Six.data.level_up_discount.value || 100) / 100) : price;

    /** Multibuy price */
    function getMultiLevelPrice(character, amount) {
        let current = character.lvl;
        let target = current + amount;
        let multi_price = 0;
        for(let i = current; i <= target; i++) {
            let add = getLevelPrice(character, current + i);
            multi_price += add;
        }
        return multi_price;
    }
}