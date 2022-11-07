/**
 * 
 * @param {object} character 
 * @param {number} total Items in Array
 * @returns PriceArray
 */
 function createPriceArray(character, totalItems){
    let priceArray = new Array;
    
    let modifier = 0;
    let dw_modifier = 1 - decreaseWagesEffects(); // Decrease wages
    let scaling = defaultChar[character.nickname].scaling;

    priceArray.push(defaultChar[character.nickname].lvlupPrice*((Jared.data.level_up_discount.value || 100)/100));
    for(let i=1; i<totalItems;i++){
        for(let si = scaling.length-1; si >= 0; si--) {
            let item = scaling[si];
            if(i >= item.min) {
                modifier = 1 + item.modifier;
                break;
            }
        }
       priceArray.push(dw_modifier * Math.floor(priceArray[i-1] * modifier));
    }
    return priceArray;
}
function getLevelPrice(character,level,amount,initial){
    const priceArray=createPriceArray(character,level+amount)
    return priceArray[15];
}

function getLevelPrice(character=Boomer_Bill, level=1, amount=1, initial=true) {
    if(amount != 1) return getMultiLevelPrice(character, amount); // Multibuy
    if(level <= 0 || (level <= 1 && character == Boomer_Bill)) { // Stop recursion
        let dp = defaultChar[character.nickname].lvlupPrice;
        return initial ? dp * ((Jared.data.level_up_discount.value || 100) / 100) : dp;
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
    let dw_modifier = 1 - decreaseWagesEffects(); // Decrease wages
    price += dw_modifier * Math.floor(price * modifier);
    // return price;
    return initial ? price * ((Jared.data.level_up_discount.value || 100) / 100) : price;

    /** Multibuy price */
    function getMultiLevelPrice(character, amount) {
        let current = character.lvl;
        let target = current + amount;
        // console.log(current, target);
        let multi_price = 0;
        for(let i = current; i <= target; i++) {
            let add = getLevelPrice(character, current + i);
            // console.log(`${i} - ${add}`);
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
function levelUp(character=Boomer_Bill, amount=1) {
    if(characterQuery(character.nickname) == false) return;

    // Check if can afford
    let price = getLevelPrice(character, character.lvl, amount);
    if(player.carrots >= price) {
        player.carrots -= price; // Charge player
        character.lvl += amount;
        character.lvlupPrice = getLevelPrice(character, character.lvl); // Set next lvlupprice

        // Recalculate
        recalculateCarrotsPer(character);
        // Update page
        carrotCount();
        characterPrices();
        characterButtons();
        updateCPC();
        updateAllTools();
        // Animation
        mouseConfetti([2, 3], ccGold);
    }
}