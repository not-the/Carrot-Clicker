/* Carrot Utilities - Created by JJCVIP and not-the */

/** getElementById shorthand
 * @param {string} id 
 * @returns Document Element Id
 */
function dom(id) { return document.getElementById(id); }
/** document.querySelector shorthand
 * @param {string} sel 
 * @returns Document Query Selector
 */
function $(sel) { return document.querySelector(sel); }
/** Efficient innerText, checks to see if the variable has changed before manipulating the page.
 * @param {element} element
 * @param {string} text
 */
function eInnerText(element, text) { if(element.innerText != text) element.innerText = text; }
/** Efficient innerHTML, checks to see if the variable has changed before manipulating the page.
 * @param {element} element
 * @param {string} text
 * @returns undefined
 */
function eInnerHTML(element, html) { if(element.innerHTML != html) element.innerHTML = html; }

// Localstorage
//#region 
/** localStorage shorthand. Providing only a key will getItem, providing a value will setItem
 * @param {string} key 
 * @param {string} value 
 * @returns Value found in localStorage
 */
function store(key, value) { if(value) localStorage.setItem(key, value); else return localStorage.getItem(key); }
/**
 * sessionStorage shorthand. Providing only a key will getItem, providing a value will setItem
 * @param {string} key 
 * @param {string} value 
 * @returns Value found in sessionStorage
 */
function sessionStorage(key, value) { if(value) sessionStorage.setItem(key, value); else return sessionStorage.getItem(key); }
/** Get/write numbers in localStorage. Providing only a key will getItem, providing a value will setItem
 * @param {string} key 
 * @param {number} value 
 * @returns {number} Value found in localStorage, converted to a number
 */
function storeNum(key, value) { if(value) localStorage.setItem(key, JSON.stringify(value)); else { let v=localStorage.getItem(key); return v && Number(v); } }
/** Stores Objects in localStorage
 * @param {string} key 
 * @param {object} value 
 */
Storage.prototype.setObject = function (key, value) {
    this.setItem(key, JSON.stringify(value));
}
/** Retrives Stored Objects
 * @param {string} key 
 * @returns {object} Stored Object
 */
Storage.prototype.getObject = function (key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}
//#endregion

// Creates bases to display large numbers 
const bases = [1000, 1000000, 1000000000, 1000000000000, 1000000000000000, 1000000000000000000, 1e+21, 1e+24, 1e+27, 1e+30, 1.0000000000000001e+33, 1e+36, 1.0000000000000001e+39, 1e+42, 1.0000000000000001e+45, 1e+48, 1e+51, 1e+54, 1e+57, 1.0000000000000001e+60, 1e+63, 1.0000000000000001e+66];
// const bases = [];
// for (i = 1000; i < 1000000000000000000000000000000000000000000000000000000000000000000000n; i = i * 1000) {
//     bases.push(i);
// }
const unitsShort = ["k", "m", "b", "t", "q", "Q", "s", "S", "o", "n", "d", "u", "D", "T", "qu", "Qu", "se", "Se", "O", "N", "V"];
const unitsLong = [" thousand", " million", " billion", " trillion", " quadrillion", " quintillion", " sextillion", " septillion", " octillion", " nonillion", " decillion", " undecillion", " duodecillion", " tredecillion", " quattuordecillion", " quindecillion", " sexdecillion", " septendecillion", " octodecillion", " novemdecillion", " vigintillion"]
/** Displaying rounded numbers. Example 10,231 -> 10.23k
 * @param {Number} value Number to round
 * @param {Number} Fixedto Decimal place to cut off at
 * @param {Number} min Anything lower than this minimum won't be rounded
 * @param {Array} units Array of big number units
 * @returns Rounded number
 */
function DisplayRounded(value, Fixedto=3, min=0, units=unitsShort, ignore_full_nums=false) {
    if(typeof value != 'number') value = Number(value);
    let fixed = value % 1 == 0 ? 0 : Fixedto;
    if(value < min || (settings.full_numbers && !ignore_full_nums)) return numCommas(value.toFixed(fixed)); // Return with commas instead if min is specified
    for(i = 0; i < units.length; i++) {
        fixed = value / bases[i] % 1 == 0 ? 0 : Fixedto;
        if(value < bases[i + 1] && value > bases[0]) return (value / bases[i]).toFixed(fixed) + units[i];
    }
    return value;
}

// Add commas to full number
// From: https://stackoverflow.com/a/2901298/11039898
/** Adds commas to numbers
 * @param {Number} number 
 * @returns A number seperated with commas
 */
function numCommas(num) {
    if(!num && num!=0) return console.error(TypeError);
    var parts = num.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}
/** Percentage calculator from https://stackoverflow.com/a/48841348/11039898
 * Finds a Percentage
 * @param {Number} number 
 * @param {Number} total 
 * @returns (100 * number)/total
 */
function percentage(num, total) { return (100 * num) / total;}
/** Clears local storage
 * @param {Boolean} disableReload If not specified the page will reload
 */
function ClearLocalStorage(disableReload) {
    console.log('Clearing local storage');
    window.scrollTo(0, 0);

    localStorage.clear();
    if (disableReload) return;
    location.reload();
}

// Capitalize first letter of string
// https://stackoverflow.com/a/1026087
function capitalizeFL(string) { return string.charAt(0).toUpperCase() + string.slice(1); }

// Volume variable
var volume = 0.8;
var music;

/** Plays a sound from the sounds folder
 * @param {string} file Filename
 * @param {string} path Only specify if file is outside of './assets/sounds/'
 * @returns 
 */
function playSound(file, path = './assets/sounds/') {
    if(!settings.enableSounds) return;
    var audio = new Audio(path + file);
    audio.play();
}
/** Plays music from file
 * @param {string} file Filename
 * @param {string} loop Whether or not to loop the song
 * @param {*} path Folder the file is in
 * @returns 
 */
function playMusic(file='music.m4a', path='./assets/music/', loop=false) {
    if(settings.enableSounds == false || settings.enableMusic == false) return; // Return if sounds are disabled
    music = new Audio(path + file); // Create
    music.volume = volume;
    music.loop = loop;
    console.log('playMusic() - Playing track 1...');
    music.play();
}
/** Stops music */
function stopMusic() {
    if(!music) return console.log('stopMusic(): No music is playing');
    music.pause();
    music.currentTime = 0;
} 