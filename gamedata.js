// Game data

// Game version
(() => {
    const game_version = 'dev beta v1.13.7';

    dom('page_title').innerText = `Carrot Clicker ${game_version}`;
    dom('footer_version').innerText = `Version ${game_version} - Unstable`;
})()


/* ------------------- TIPS ------------------- */
//#region 
const tl = ['starter', 'beginner', 'intermediate', 'advanced'];
const default_tips = {
    number: 0,
    // random:0,
    tracker: 0, // Tip level
    best: 0, // highest tip level reached
    type: false,

    // Practical tips
    starter: [ // 0
        "Tip: Click the carrot",
        "Click here to cycle through available tips!",
        "Click the lvl up arrow to level up characters",
        "Click a character's \"i\" symbol to learn more about them",
        "Greg can craft tools that will buff your other characters",
        "If you see a ? near something you can click it to get a more detailed description of what it does",
    ],
    beginner: [ // 1
        "To equip a tool, you must first craft one, then click the corresponding tool type under Bill or Belle",
        "Each character can only hold up to 1 tool (per type) for every level Greg has reached",
        "By completing achievements you will earn mysterious tome pages.",
        "Completing achievements will give you additional themes and cosmetics to buy",
        "When clicking the carrot, cash will sometimes drop. Make sure to grab it!",
    ],
    intermediate: [ // 2
        "When you're ready, click the prestige button. You will start over but gain the ability to buy tomes",
        // "Golden carrots increase your characters by 10%", // old tip, don't delete
        "Golden carrots can be used to buy tomes, which give you permanent buffs",
        "Every Tome Page you have will give you a +1% golden carrot increase when prestiging",
        "Earning a few special achievements will update the game icon in the top left",
        "The more tools the better!",
    ],
    advanced: [ // 3
        "Unlocking every theme will make a special theme available",
        "You've earned more than 1 billion carrots this prestige. That's a lot!",
    ],

    // Fun tips
    fun_starter: [
        "Carrots can end world hunger",
        "Only YOU can save the carrots!",
        "Carrots have been proven to improve eyesight by 150%. It's true!",
        "Carrots are your friend",
        "JJ broke it", // "Only the best code",
        "Carrot Clicker is mobile-friendly!",
        "Click the carrot, Bill.",
        "Wait for the carrot to grow, Belle.",
        `Only on ${window.location.href.split('#')[0]}`,
        "Now in HD",
    ],
    fun_beginner: [
        "On the internet",
        "Fun fact: baby carrots are just shaved down regular carrots",
        "\"Game development is hard\" clicker game developer says",
        "Carrot?!",
        "Drink carrot juice",
        "Spaghetti code!",
    ],
    fun_intermediate: [
        "\"I have night vision now,\" says man who has eaten exclusively carrots for 3 days",
        "Tired of eating carrots? Make carrot cake!",
        "Carrots have been proven to improve eyesight by 1000%. It's true!",
        "Carrots love you ♥",
        "Studies are being done to determine if carrots can cure the common cold",
        "Also play Cookie Clicker",
        "Also play Egg, Inc.",
        "Craft the carrot, Greg.",
        "Study the carrot, Charles.",
        "Paint the carrot, Carl.",
    ],
    fun_advanced: [
        "World hunger has been cured, but there must be more we can do.",
        "Carrots have never been found at a crime scene because they are the direct cause of peace and friendship.",
        "Carrots have received 7,000,000,000 (★★★★★) 5-star ratings on ebay",
        "Eating carrots cures cancer",
        "Studies done on people eating only carrots for 90 days have proven that they are the only food required for human survival.",
        "Report any anti-carrot propaganda you see on the internet to your local carrot police",
        "Public Service Announcement: Reminder to eat more carrots. That is all.",
        "People who regularly eat carrots have been known to exceed a life expectancy of 200 years",
        "Carrots are people too",
        "Carrots have been proven to improve eyesight by 9000%. It's true!",
    ],



    // Mark as seen
    s_starter: {
        0: true,
    },
    s_beginner: {},
    s_intermediate: {},
    s_advanced: {},

    // Fun tips
    s_fun_starter: {},
    s_fun_beginner: {},
    s_fun_intermediate: {},
    s_fun_advanced: {},
    
}
//#endregion



/* ----------------- THEMES ----------------- */
//#region 
const themes = {
    // Default
    'theme_dark': {
        name:     'Dark Theme',
        image:    './assets/theme/theme_dark.png',
        desc:     'Default dark',
        cosmetic: false,
    },
    'theme_light': {
        name:     'Light Theme',
        image:    './assets/theme/theme_light.png',
        desc:     'Default light',
        cosmetic: false,
        accent:   '#FFFFFF',
    },
    'theme_oled': {
        name:     'OLED Dark Theme',
        image:    './assets/theme/theme_oled.png',
        desc:     'Don\'t play Carrot Clicker after midnight',
        cosmetic: false,
        accent:   '#000000',
    },
    'theme_classic': {
        name:     'Carrot Clicker Classic',
        image:    './assets/theme/theme_classic.png',
        desc:     'The original look of carrot clicker',
        cosmetic: false,
        accent:   '#4e3f34',
    },
    'theme_red': {
        name:     'Red Theme',
        image:    './assets/theme/theme_red.png',
        desc:     'Town painted.',
        cosmetic: false,
        accent:   '#913535'
    },
    'theme_green': {
        name:     'Green Theme',
        image:    './assets/theme/theme_green.png',
        desc:     'Don\'t be jealous',
        cosmetic: false,
        accent:   '#4c6949'
    },
    'theme_blue': {
        name:     'Blue Theme',
        image:    './assets/theme/theme_blue.png',
        desc:     'For when you get tired of gray',
        cosmetic: false,
        accent:   '#455779'
    },
    'theme_camo': {
        name:     'Camo',
        image:    './assets/theme/theme_camo.png',
        desc:     'In the trees',
        cosmetic: false,
        // accent:   false,
    },
    'theme_bw': {
        name:     'Black & White',
        image:    './assets/theme/theme_bw.png',
        desc:     'Back in my day',
        cosmetic: false,
        accent:   '#2f2f2f',
    },
    'theme_retro': {
        name:     'Retro Green',
        image:    './assets/theme/theme_retro.png',
        desc:     ':D',
        cosmetic: false,
        accent:   '#4c5c49',
    },
    'theme_terminal': {
        name:     'Terminal',
        image:    './assets/theme/theme_terminal.png',
        desc:     'Become 1337 hax0r',
        cosmetic: 'farmable/ascii',
        accent:   '#0c0c0c',
        no_backdrop_click: true,
    },
    'theme_chatapp': {
        name:     'Chat App',
        image:    './assets/theme/theme_chatapp.png',
        desc:     '"how do i find #general"',
        cosmetic: false,
        accent:   '#202225',
        no_backdrop_click: true,
    },
    // 'theme_xp': {
    //     name:     'Doors Experience',
    //     image:    './assets/theme/theme_xp.png',
    //     desc:     'placeholder',
    //     cosmetic: false,
    //     accent:   '#FFFFFF',
    // },
    'theme_blockgame': {
        name:     'Minecraft',
        image:    './assets/theme/blockgame/grass_block_side.png',
        desc:     'Does it violate copyright if this is just a hobby project with no ads? Genuine question',
        cosmetic: 'bundle/blockgame',
        accent:   '#3c2a1d',
        no_backdrop_click: true,
    },
    // 'theme_custom': {
    //     name: 'Custom Theme',
    //     image: './assets/Carrot Clicker.png',
    //     desc: 'Make your own theme!',
    //     cosmetic: false,
    //     // accent: false
    // }
};
const themesKeys = Object.keys(themes);
//#endregion


/* ---------------- COSMETICS ---------------- */
//#region
// Version 2
const cosmetics = {
    bundle: {
        // Default
        'default': {
            'name': 'Carrot Clicker (Default)',
            'preview': './assets/Carrot Clicker.png',

            'desc': 'The carrot and characters you know and love',

            'farmable': 'default',
            'bill':     'default',
            'belle':    'default',
            'greg':     'default',
            'charles':  'default',
            'carl':     'default',
            'tools':    'default',
        },
        // Cookie
        'cookie': {
            'name': 'Cookie',
            'preview': './assets/theme/cookie/cookie.png',
            'image': './assets/theme/cookie/cookie.png',
            'desc': 'Cookies and cookie-related outfits',

            'farmable': 'cookie',
            'bill': 'baker_bill',
            'belle': 'grandma_belle',
        },
        // Blockgame
        'blockgame': {
            'name': 'Minecraft',
            'preview': './assets/theme/blockgame/carrot.png',
            'image': './assets/theme/blockgame/carrot.png',
            'desc': 'This probably won\'t make it to Carrot Clicker 1.0',

            // 'theme': 'theme_blockgame',
            'farmable': 'blockgame',
            'tools': 'blockgame',
        },
        // Christmas
        'xmas': {
            'name': 'Festive',
            'preview': './assets/theme/santa_charles.png',
            'image': './assets/theme/santa_charles.png',
            'desc': 'Christmas themed cosmetics',

            // 'farmable': 'default',
            'bill':     'ugly_sweater',
            // 'belle':    'bill',
            // 'greg':     'bill',
            'charles':  'santa_charles',
            // 'carl':     'bill',
        },
        // Bros
        'plumber': {
            'name': 'Boomer Bros',
            'preview': './assets/theme/plumber_bill.png',
            'image': './assets/theme/plumber_bill.png',
            'desc': 'They\'re carpenters',

            'bill': 'plumber',
            // 'belle': 'grandma_belle',
            'greg': 'plumber',
        },
        // All Bill
        'bill': {
            'name': 'All Bill',
            'preview': './assets/characters/Boomer_Bill.png',
            'image': './assets/characters/Boomer_Bill.png',
            'desc': 'One of us',

            'farmable': 'bill',
            'bill':     'default',
            'belle':    'bill',
            'greg':     'bill',
            'charles':  'bill',
            'carl':     'bill',
            'tools':    'bill',
        },
    },
    farmable: {
        // Default
        'default': {
            'name': 'Carrot (Default)',
            'preview': './assets/Carrot Clicker.png',
            'desc': 'Good old carrots',
            'group': 'default',

            'farmable': 'Carrot',
            'image': './assets/Carrot Clicker.png',
        },
        'pixel_carrot': {
            'name': 'Pixel Carrot',
            'preview': './assets/theme/pixel_carrot.png',
            'desc': 'Someone pixelated my carrot',

            'farmable': 'Carrot',
            'image': './assets/theme/pixel_carrot.png',
            'render_type': 'pixel',
        },
        // Golden Carrot
        'golden_carrot': {
            'name': 'Golden Carrot',
            'preview': './assets/golden carrot.png',
            'desc': 'They are only spray-painted gold. Worthless.',

            'farmable': 'Golden Carrot',
            'image': './assets/golden carrot.png',
        },
        'pixel_golden_carrot': {
            'name': 'Golden Pixel Carrot',
            'preview': './assets/theme/pixel_golden_carrot.png',
            'desc': 'An entirely original concept',

            'farmable': 'Golden Carrot',
            'image': './assets/theme/pixel_golden_carrot.png',
            'render_type': 'pixel',
        },
        'cookie': {
            'name': 'Cookie',
            'preview': './assets/theme/cookie/cookie.png',
            'desc': 'Delicious',
            'group': 'cookie',

            'farmable': 'Cookie',
            'image': './assets/theme/cookie/cookie.png',
        },
        // Ascii Carrot
        'ascii_color': {
            'name': 'Ascii Carrot (Color)',
            'preview': './assets/theme/ascii_carrot.png',
            'desc': 'surfing the web, in color',
            // 'group': 'ascii',

            'farmable': 'Carrot',
            'image': './assets/theme/ascii_carrot.png',
            // 'render_type': 'pixel',
        },
        'ascii': {
            'name': 'Ascii Carrot',
            'preview': './assets/theme/ascii_white.png',
            'desc': 'surfing the web',
            // 'group': 'ascii',

            'farmable': 'Carrot',
            'image': './assets/theme/ascii_white.png',
            // 'render_type': 'pixel',
        },
        // Minecraft
        'blockgame': {
            'name': 'Carrot (Minecraft)',
            'preview': './assets/theme/blockgame/carrot.png',
            'desc': 'Hrm',
            'group': 'blockgame',

            'farmable': 'Carrot',
            'image': './assets/theme/blockgame/carrot.png',
            'render_type': 'pixel',
        },
        'blockgame_potato': {
            'name': 'Potato (Minecraft)',
            'preview': './assets/theme/blockgame/potato.png',
            'desc': 'Knishes',

            'farmable': 'Potatoe',
            'image': './assets/theme/blockgame/potato.png',
            'render_type': 'pixel',
        },
        // Pineapple
        'pineapple': {
            'name': 'Pineapple',
            'preview': './assets/theme/pineapple/pineapple.png',
            'desc': 'My favorite',

            'farmable': 'Pineapple',
            'image': './assets/theme/pineapple/pineapple.png',
        },
        // Bill clicker
        'bill': {
            'name': 'Bill',
            'preview': './assets/characters/Boomer_Bill.png',
            'desc': 'Bill',
            'group': 'bill',

            'farmable': 'Bill',
            'image': './assets/characters/Boomer_Bill.png',
            'render_type': 'pixel',
        },
        // Netherite hoe
        "netherite_hoe": {
            'name': 'Netherite hoe',
            'preview': './assets/tools/tool_5.png',
            'desc': 'All hail',

            'farmable': 'Netherite hoe',
            'image': './assets/tools/tool_5.png',
            'render_type': 'pixel',
        },
        // Cursor
        "cursor": {
            'name': 'Cursor',
            'preview': './assets/theme/cursor/cursor.png',
            'desc': 'Cursorception',

            'farmable': 'Cursor',
            'image': './assets/theme/cursor/cursor.png',
            // 'image_hover': './assets/theme/cursor/pointer.png',
            'render_type': 'pixel',
        },
        // Alien Carrot
        "alien_carrot": {
            'name': 'Alien Carrot',
            'preview': './assets/theme/alien carrot/alien_carrot.png',
            'desc': 'So strange',

            'farmable': 'Alien Carrot',
            'image': './assets/theme/alien carrot/alien_carrot.png',
        },
        // Demon Carrot
        "demon_carrot": {
            'name': 'Demon Carrot',
            'preview': './assets/theme/evil_carrot.png',
            'desc': 'Eeevil!',

            'farmable': 'Demon Carrot',
            'image': './assets/theme/evil_carrot.png',
        },
        "ghost_carrot": {
            'name': 'Ghost Carrot',
            'preview': './assets/theme/ghost_carrot.png',
            
            'desc': 'Spooky',
            'farmable': 'Ghost Carrot',
            'image': './assets/theme/ghost_carrot.png',
        },
        "rainbow_carrot": {
            'name': 'Rainbow Carrot',
            'preview': './assets/theme/rainbow_carrot.png',
            
            'desc': 'Tastes like candy',
            'farmable': 'Rainbow Carrot',
            'image': './assets/theme/rainbow_carrot.png',
        },
    
    
        // Upvote
        "upvote": {
            'name': 'Orange Arrow',
            'preview': './assets/theme/orange_arrow/upvote.png',

            'desc': 'This is better than going outside',
            'farmable': 'Arrow',
            'image': './assets/theme/orange_arrow/upvote.png',
            'hidden': true,
        },
        // huh whuh meme
        "huhwhuh": {
            'name': 'huh',
            'preview': 'https://i.imgur.com/ELs31g5.jpg',

            'desc': 'huh whuh',
            'farmable': 'huh',
            'image': 'https://i.imgur.com/ELs31g5.jpg',
            'hidden': true,
        },
    },
    bill: {
        'default': {
            'name': 'Bill (Default)',
            'desc': 'A fan of carrots, Bill is ready for any carrot-related challenges you throw at him.',
            'group': 'default',

            'rename': 'Bill',
            'image': './assets/characters/Boomer_Bill.png',
        },
        'biker_bill': {
            'name': 'Biker Bill',
            'preview': './assets/theme/biker_bill.png',
            'desc': 'Actual motorcycle not included',

            'rename': false,
            'image': './assets/theme/biker_bill.png',
        },
        'fancy_bill': {
            'name': 'Fancy Bill',
            'preview': './assets/theme/boomer_bill_gates.png',
            'desc': 'He still doesn\'t get invited to social gatherings',

            'rename': false,
            'image': './assets/theme/boomer_bill_gates.png',
        },
        'baker_bill': {
            'name': 'Baker Bill',
            'preview': './assets/theme/cookie/baker_bill.png',
            'desc': 'Care for a cookie?',
            'group': 'cookie',

            'rename': false,
            'image': './assets/theme/cookie/baker_bill.png',
        },
        'dollar_bill': {
            'name': 'Dollar Bill',
            'preview': './assets/theme/dollar_bill.png',
            'desc': 'Yall',

            'rename': 'Dollar Bill',
            'image': './assets/theme/dollar_bill.png',
        },
        'business_bill': {
            'name': 'Business Bill',
            'preview': './assets/theme/business_bill.png',
            'desc': '"I earn more carrots in a minute than you do in an entire year"',

            'rename': false,
            'image': './assets/theme/business_bill.png',
        },
        'ugly_sweater': {
            'name': 'Ugly Sweater Bill',
            'preview': './assets/theme/bill_ugly_sweater.png',
            'desc': 'Very cozy',
            'group': 'xmas',

            'rename': false,
            'image': './assets/theme/bill_ugly_sweater.png',
        },
        'plumber': {
            'name': 'Plumber Bill',
            'preview': './assets/theme/plumber_bill.png',
            'desc': 'Yahoo',
            'group': 'plumber',

            'rename': false,
            'image': './assets/theme/plumber_bill.png',
        },
    },
    belle: {
        'default': {
            'name': 'Belle (Default)',
            'desc': 'Belle is also a fan of carrots, but I think she\'s just here because Bill is.',
            'group': 'default',

            'rename': 'Belle',
            'image': './assets/characters/BelleBommerette.png',
        },
        'grandma_belle': {
            'name': 'Grandma Belle',
            'preview': './assets/theme/cookie/grandma_belle.png',
            'desc': 'No you can\'t buy more grandmas, what kind of question is that?',
            'group': 'cookie',

            'rename': 'Grandma Belle',
            'image': './assets/theme/cookie/grandma_belle.png',
        },
        'bill': {
            'name': 'Bill',
            'desc': 'Return to Bill.',
            'group': 'bill',
            
            'rename': 'Bill',
            'image': './assets/characters/Boomer_Bill.png',
        },
    },
    greg: {
        'default': {
            'name': 'Greg (Default)',
            'desc': 'A professional blacksmith, Greg can turn carrots into farming implements. I\'m not sure how he does it.',
            'group': 'default',

            'rename': 'Greg',
            'image': './assets/characters/Gregory.png',
        },
        'safety_greg': {
            'name': 'High Vis Greg',
            'desc': 'Can\'t have you dying on the job now can we',

            'rename': false,
            'image': './assets/theme/safety_greg.png',
        },
        'plumber': {
            'name': 'Plumber Greg',
            'preview': './assets/theme/plumber_greg.png',
            'desc': 'Greg ain\'t afraid of no ghosts',
            'group': 'plumber',

            'rename': false,
            'image': './assets/theme/plumber_greg.png',
        },
        'bill': {
            'name': 'Bill',
            'desc': 'Return to Bill.',
            'group': 'bill',

            'rename': 'Bill',
            'image': './assets/characters/Boomer_Bill.png',
        },
    },
    charles: {
        'default': {
            'name': 'Charles (Default)',
            'desc': 'Don\'t tell anyone, but Charles doesn\'t actually know how to read.',
            'group': 'default',

            'rename': 'Charles',
            'image': './assets/characters/Charles.png',
        },
        'santa_charles': {
            'name': 'Santa Charles',
            'desc': 'He accidentally left the gifts at home',
            'group': 'xmas',

            'rename': 'Santa Charles',
            'image': './assets/theme/santa_charles.png',
        },
        'special_charles': {
            'name': 'Potato Charles',
            'desc': 'God is he alright?',

            'rename': 'chrles',
            'image': './assets/theme/special_charles.png',
        },
        'bill': {
            'name': 'Bill',
            'desc': 'Return to Bill.',
            'group': 'bill',

            'rename': 'Bill',
            'image': './assets/characters/Boomer_Bill.png',
        },
    },
    carl: {
        'default': {
            'name': 'Carl (Default)',
            'desc': 'Carl likes to paint almost as much as he likes carrots. (The person writing this description was unable to come up with something to positive to say, so just made something up. It is unknown if he actually likes carrots.)',
            'group': 'default',

            'rename': 'Carl',
            'image': './assets/characters/Carl.png',
        },
        'joker_carl': {
            'name': 'Jokester Carl',
            'desc': 'Carl lives in a society',

            'rename': false,
            'image': './assets/theme/joker_carl.png',
        },
        'bill': {
            'name': 'Bill',
            'desc': 'Return to Bill.',
            'group': 'bill',

            'rename': 'Bill',
            'image': './assets/characters/Boomer_Bill.png',
        },
    },
    six: {
        'default': {
            'name': 'six (Default)',
            'desc': 'placeholder',
            'group': 'default',

            'rename': 'six',
            'image': './assets/achievements/missing.png',
        },
    },
    tools: {
        'default': {
            'name': 'Tools (Default)',
            'preview': './assets/tools/tool_0.png',
            'desc': 'Default tools',
            'group': 'default',

            '0': './assets/tools/tool_0.png',
            '1': './assets/tools/tool_1.png',
            '2': './assets/tools/tool_2.png',
            '3': './assets/tools/tool_3.png',
            '4': './assets/tools/tool_4.png',
            '5': './assets/tools/tool_5.png',
        },
        'fertilizer': {
            'name': 'Fertilizer',
            'preview': './assets/tools/fertilizer/tool_0.png',
            'desc': 'placeholder',

            '0': './assets/tools/fertilizer/tool_0.png',
            '1': './assets/tools/fertilizer/tool_1.png',
            '2': './assets/tools/fertilizer/tool_2.png',
            '3': './assets/tools/fertilizer/tool_3.png',
            '4': './assets/tools/fertilizer/tool_4.png',
            '5': './assets/tools/fertilizer/tool_5.png',
        },
        'blockgame': {
            'name': 'Minecraft Hoes',
            'preview': './assets/tools/blockgame/tool_0.png',
            'desc': 'Default tools',
            'group': 'blockgame',

            '0': './assets/tools/blockgame/tool_0.png',
            '1': './assets/tools/blockgame/tool_1.png',
            '2': './assets/tools/blockgame/tool_2.png',
            '3': './assets/tools/blockgame/tool_3.png',
            '4': './assets/tools/blockgame/tool_4.png',
            '5': './assets/tools/blockgame/tool_5.png',
        },
        'bill': {
            'name': 'Bill',
            'preview': './assets/characters/Boomer_Bill.png',
            'desc': 'Return to Bill',
            'group': 'bill',

            '0': './assets/theme/transparent_bill.png',
            '1': './assets/theme/transparent_bill.png',
            '2': './assets/theme/transparent_bill.png',
            '3': './assets/theme/transparent_bill.png',
            '4': './assets/theme/transparent_bill.png',
            '5': './assets/theme/transparent_bill.png',
        },
    }
}
// Get keys
const cosmeticsKeys = Object.keys(cosmetics);
var totalCosmetics = 0;
for(let i = 0; i < cosmeticsKeys.length; i++) {
    let key = cosmeticsKeys[i];
    let target = cosmetics[key];

    target['keys'] = Object.keys(target);

    // Figure out how many cosmetics there are
    for(let c = 1; c < target.keys.length; c++) {
        if(target[target.keys[c]].hidden == true) continue;
        totalCosmetics++;
    }
}
// console.log(cosmetics.bundle.keys);

// Individual Bundle keys
for(let i = 0; i < cosmetics.bundle.keys.length; i++) {
    cosmetics.bundle[cosmetics.bundle.keys[i]]['keys'] = Object.keys(cosmetics.bundle[cosmetics.bundle.keys[i]]);
}
//#endregion


/* --------------- ACHIEVEMENTS --------------- */
//#region 
// class achievement {
//     constructor(name, desc, image, reward, requirement) {
//         this.name = name;
//         this.desc = desc;
//         this.requirement = requirement;
//     }
// }

// Loop through achievements
// for(let entry in achievements) {
//     console.log(`${entry}:${achievements[entry]}`);
// }

// For the conditions parameter:
// - First (0) value is the variable you want to test- will also accept a function
// - Second (1) value is the minimum required for the achievement (at the moment it will only test if the FIRST is greater than or equal to the SECOND)
// If you need to test for anything other than if FIRST >= SECOND you can simply use a function and only return a passing number if it comes out to true
const achievements = {

    // OLD Template
    // 'template': {
    //     'name': 'Achievement',
    //     'desc': 'Description',
    //     'image': './assets/achievements/generic.png',
    //     'reward': 'Reward',
    //     'conditions': '',
    //     'rarity': '0'
    // },

    // Template
    // 'template': {
    //     'name': 'Achievement',
    //     'desc': 'Description',
    //     'image': './assets/achievements/generic.png',
    //     'reward': 'rewardtype:reward', // accepts one string or an array of strings
    //     'conditions': [
    //         ['player.themes.length', 4],
    //         ['player.cosmetics.length', 2],
    //     ],
    //     // 'condition_amount': 1, // when there are multiple conditions, minimum required (or don't specify for all)
    //     'style': false,
    //     'mystery': { // parts of the achievement to hide before it's unlocked
    //         'name': true,
    //         'desc': false,
    //         'image': true,
    //         'noToast': false,
    //     }
    // },

    // Carrots
    '1_carrot': {
        'name': 'Farming is hard',
        'desc': 'Your first Carrot!',
        'image': './assets/achievements/1_carrot.png',
        'reward': false,
        'pages': false,
        'conditions': ['player.lifetime.carrots', 1],
        'mystery': {
            'name': false,
            'desc': false,
            'image': false,
            'noToast': false,
        }
    },
    'bill_lvl_2': {
        'name': 'Two\'s Company',
        'desc': 'Upgrade Bill and attract the attention of another farmer',
        'image': './assets/achievements/bill_and_belle.png',
        'reward': 'character:belle',
        'pages': false,
        'conditions': ['Boomer_Bill.lvl', 2],
        'mystery': {
            'name': true,
            'desc': false,
            'image': false,
            'noToast': false,
        }
    },
    '5000_carrot': {
        'name': 'Heavy Metal',
        'desc': 'Earn enough carrots to get the attention of a blacksmith',
        'image': './assets/achievements/unlock_greg.png',
        'reward': 'character:greg',
        'pages': false,
        'conditions': ['player.lifetime.carrots', 5000],
        'mystery': {
            'name': true,
            'desc': false,
            'image': false,
            'noToast': false,
        }
    },

    // Prestiging
    '1_prestige': {
        'name': 'Prestigious',
        'desc': 'Prestige for the first time and attract the attention of the professor',
        'image': './assets/achievements/prestige_once.gif',
        'reward': [
            'character:charles',
            'shop:theme/theme_bw',
        ],
        'pages': 5,
        'conditions': ['player.lifetime.prestige_count', 1],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },
    '10_prestiges': {
        'name': 'Wibbly Wobbly',
        'desc': 'Prestige ten times',
        'image': './assets/achievements/wobbly.gif',
        'reward': () => { mouseConfetti([24,24], confettiColors, 300) },
        'pages': 5,
        'conditions': ['player.lifetime.prestige_count', 10],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },
    'use_charles': {
        'name': 'Raw Knowledge',
        'desc': 'Give Charles a Golden Carrot in exchange for his knowledge',
        'image': './assets/achievements/tome animated.gif',
        'reward': [
            'shop:theme/theme_terminal',
            'shop:cosmetic/farmable/ascii',
            'shop:cosmetic/farmable/ascii_color',
        ],
        'pages': 1,
        'conditions': ['ex_charlesUses()', 1],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },

    // Tome types
    '1_improve_working_conditions': {
        'name': 'OSHA Violator',
        'desc': 'Buy a tome that improves working conditions. Your workers are now safe.',
        'image': './assets/achievements/working_conditions.png',
        'reward': 'shop:cosmetic/greg/safety_greg',
        'pages': 2,
        'conditions': ['Charles.tome.improveWorkingConditions.value', 1],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },
    '1_improve_hoe_costs': {
        'name': 'Divine Intervention',
        'desc': 'Buy a tome that improves tool quality. Unholy magic, I say.',
        'image': './assets/achievements/tome_improve_hoe_costs.png',
        'reward': false,
        'pages': 2,
        'conditions': ['Charles.tome.betterHoes.value', 1],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },
    '1_decrease_wages': {
        'name': 'Dollar Bill',
        'desc': 'Buy a tome that reduces worker wages. Cheapskate.',
        'image': './assets/achievements/tome_decrease_wages.png',
        'reward': 'shop:cosmetic/bill/dollar_bill',
        'pages': 2,
        'conditions': ['Charles.tome.decreaseWages.value', 2],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },

    // Number of tomes
    '12_tomes': {
        'name': 'Tome\'d You so',
        'desc': 'Obtain 12 tomes',
        'image': false,
        'reward': 'cosmetic:charles/special_charles',
        'pages': 3,
        'conditions': [
            'player.lifetime.tomes_bought',
            12
        ],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },
    '24_tomes': {
        'name': 'Librarian',
        'desc': 'Obtain 24 tomes',
        'image': false,
        'reward': false,
        'pages': 4,
        'conditions': [
            'player.lifetime.tomes_bought',
            24
        ],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },
    '140_tomes': {
        'name': 'Infinite Library',
        'desc': 'Obtain 140 tomes',
        'image': false,
        'reward': false,
        'pages': 5,
        'conditions': [
            'player.lifetime.tomes_bought',
            140
        ],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },

    // Tome pages tutorial message
    'first_tome_page': {
        'name': 'Paginator',
        'desc': 'Earn a tome page (Tutorial milestone)',
        'image': './assets/achievements/paginator.png',
        'reward': () => {
            toast(
                "You've earned a tome page!",
                "For every tome page you have you will recieve a +1% golden carrot bonus when prestiging. Earn additional tome pages by completing achievements!",
                "", true
            );
        },
        'pages': false,
        'conditions': ['player.pages', 1],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': true,
        }
    },

    'own_a_theme': {
        'name': 'Taking in the Themery',
        'desc': 'Gain the attention of the artist',
        'image': './assets/achievements/themery.png',
        'reward': 'character:carl',
        'pages': false,
        'conditions': [
            ['carlItemsAvailable()', 2],
            ['player.cash', 6],
        ],
        // 'condition_amount': 1,
        'mystery': {
            'name': true,
            'desc': false,
            'image': false,
            'noToast': false,
        }
    },
    // Character usage
    'upgrade_all_characters_once': {
        'name': '3 Heads Are Better Than One',
        'desc': 'Upgrade every (upgradeable) character at least once',
        'image': './assets/achievements/3_heads.png',
        'reward': ['shop:theme/theme_red', 'shop:theme/theme_green', 'shop:theme/theme_blue'],
        'pages': 3,
        'conditions': [
            ['Boomer_Bill.lvl',      2],
            ['Gregory.lvl',          1],
            ['Belle_Boomerette.lvl', 1],
        ],
        'mystery': {
            'name': true,
            'desc': false,
            'image': false,
            'noToast': false,
        }
    },
    'bill_lvl_10': {
        'name': 'Here\'s the Bill',
        'desc': 'Upgrade Bill 10 times',
        'image': false,
        'reward': 'shop:cosmetic/bill/biker_bill',
        'pages': false,
        'conditions': ['Boomer_Bill.lvl', 10],
        'mystery': {
            'name': true,
            'desc': false,
            'image': false,
            'noToast': false,
        }
    },
    'bill_lvl_100': {
        'name': 'Bill of the Century',
        'desc': 'Upgrade Bill 100 times',
        'image': './assets/achievements/bill_pointer.png', // Needs better art, maybe animated
        'reward': 'cosmetic:bundle/bill',
        'pages': 5,
        'conditions': ['Boomer_Bill.lvl', 100],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },
    'belle_lvl_15': {
        'name': 'Saved by the Belle',
        'desc': 'Upgrade Belle 15 times',
        'image': false,
        'reward': false,
        'pages': false,
        'conditions': ['Belle_Boomerette.lvl', 15],
        'mystery': {
            'name': true,
            'desc': false,
            'image': false,
            'noToast': false,
        }
    },
    'belle_lvl_100': {
        'name': 'Tough Belle',
        'desc': 'Upgrade Belle 100 times',
        'image': false,
        'reward': false,
        'pages': 5,
        'conditions': ['Belle_Boomerette.lvl', 100],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },
    'greg_lvl_20': {
        'name': 'The Gregs of Defeat', // alternatively "The Gregs of Society"
        'desc': 'Upgrade Gregory 20 times',
        'image': false,
        'reward': false,
        'pages': 2,
        'conditions': ['Gregory.lvl', 20],
        'mystery': {
            'name': true,
            'desc': false,
            'image': false,
            'noToast': false,
        }
    },
    'greg_lvl_64': {
        'name': 'Professional Crafter',
        'desc': 'Upgrade Gregory 64 Times',
        'image': './assets/achievements/pixel_block.png',
        'reward': [
            'theme:theme_blockgame',
            'cosmetic:bundle/blockgame',
            'shop:cosmetic/farmable/blockgame_potato'
        ],
        'pages': 5,
        'conditions': ['Gregory.lvl', 64],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },
    'unlock_all_characters': {
        'name': 'Carrot Convention',
        'desc': 'Unlock every character',
        'image': false,
        'reward': [
            'cash:24',
            'shop:cosmetic/carl/joker_carl',
            'shop:cosmetic/bundle/xmas',
        ],
        'pages': 5,
        'conditions': ['allCharQuery()', true],
        'mystery': {
            'name': true,
            'desc': false,
            'image': false,
            'noToast': false,
        }
    },

    // Big carrot numbers
    '401000_carrot': {
        'name': 'Retirement Fund',
        'desc': 'Earn 401k carrots. I don\'t think you know what a 401k is.',
        'image': './assets/achievements/401k.png',
        'reward': [
            'shop:theme/theme_camo',
            () => { mouseConfetti([24,24], confettiColors, 300) },
        ],
        'pages': 2,
        'conditions': ['player.lifetime.carrots', 401000],
        'mystery': {
            'name': true,
            'desc': false,
            'image': false,
            'noToast': false,
        }
    },
    '1_million_carrots': {
        'name': 'Me Millionth Carrot',
        'desc': 'Earn your 1 millionth carrot',
        'image': './assets/achievements/1_million_carrots.png',
        'reward': () => { mouseConfetti([24,24], confettiColors, 300) },
        'pages': 2,
        'conditions': ['player.lifetime.carrots', 1000000],
        'mystery': {
            'name': true,
            'desc': false,
            'image': false,
            'noToast': false,
        }
    },
    '1_billion_carrots': {
        'name': 'Boomer Bill Gates',
        'desc': 'Earn your 1 billionth carrot',
        'image': './assets/theme/boomer_bill_gates.png',
        'reward': [
            'shop:cosmetic/bill/fancy_bill',
            'shop:cosmetic/farmable/pineapple',
            () => { mouseConfetti([24,24], confettiColors, 300) },
        ],
        'pages': 2,
        'conditions': ['player.lifetime.carrots', 1000000000],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },
    '1_trillion_carrots': {
        'name': 'Lifetime Supply',
        'desc': 'Earn your 1 trillionth carrot. Phew!',
        'image': './assets/achievements/carrot_pile.png',
        'reward': [
            'shop:cosmetic/bundle/plumber',
            () => { mouseConfetti([24,24], confettiColors, 300) },
        ],
        'pages': 3,
        'conditions': ['player.lifetime.carrots', 1000000000000],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },
    '1_quadrillion_carrots': {
        'name': 'Carrot Continent',
        'desc': 'Earn your 1 quadrillionth carrot. That\'s a lot!',
        'image': false,
        'reward': [
            'shop:cosmetic/tools/fertilizer',
            () => { mouseConfetti([24,24], confettiColors, 300) },
        ],
        'pages': 3,
        'conditions': ['player.lifetime.carrots', 1000000000000000],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },
    '1_quintillion_carrots': {
        'name': 'A World Fed',
        'desc': 'Earn your 1 QUINTILLIONTH carrot. Earth\'s hunger problem is now solved.',
        'image': './assets/achievements/earth.png',
        'reward': () => { mouseConfetti([24,24], confettiColors, 300) },
        'pages': 3,
        'conditions': ['player.lifetime.carrots', 1000000000000000000n],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },
    '1_sextillion_carrots': {
        'name': 'Carrot Singularity',
        'desc': 'Earn your 1 SEXTILLIONTH carrot. We\'re on the verge of something beautiful.',
        'image': './assets/achievements/singularity.png',
        'reward': () => { mouseConfetti([24,24], confettiColors, 300) },
        'pages': 4,
        'conditions': ['player.lifetime.carrots', 1000000000000000000000n],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },
    '1_septillion_carrots': {
        'name': 'Carrot Nebula',
        'desc': 'Earn your 1 SEPTILLIONTH carrot. The culmination of our efforts.',
        'image': false,
        'reward': () => { mouseConfetti([24,24], confettiColors, 300) },
        'pages': 4,
        'conditions': ['player.lifetime.carrots', 1000000000000000000000000n],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },
    '1_octillion_carrots': {
        'name': 'Carrot Galaxy',
        'desc': 'Earn your 1 OCTILLIONTH carrot. Something bigger than us has taken notice.',
        'image': false,
        'reward': () => { mouseConfetti([24,24], confettiColors, 300) },
        'pages': 4,
        'conditions': ['player.lifetime.carrots', 1000000000000000000000000000n],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },
    '1_nonillion_carrots': {
        'name': 'Carrot Universe',
        'desc': 'Earn your 1 NONILLIONTH carrot. There is not a single non-carrot molecule in the universe. Besides you of course.',
        'image': false,
        'reward': () => { mouseConfetti([24,24], confettiColors, 300) },
        'pages': 5,
        'conditions': ['player.lifetime.carrots', 1000000000000000000000000000000n],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },
    '1_decillion_carrots': {
        'name': 'Carrot Multiverse',
        'desc': 'Earn your 1 DECILLIONTH carrot. Finding new places to put them I see.',
        'image': false,
        'reward': () => { mouseConfetti([24,24], confettiColors, 300)},
        'pages': 5,
        'conditions': ['player.lifetime.carrots', 1000000000000000000000000000000000n],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },
    '1_undecillion_carrots': {
        'name': 'Carrot God',
        'desc': 'Earn your 1 UNDECILLIONTH carrot. You\'ve surpassed a higher state of being and become some greater...',
        'image': false,
        'reward': () => { mouseConfetti([24,24], confettiColors, 300)},
        'pages': 5,
        'conditions': ['player.lifetime.carrots', 1000000000000000000000000000000000000n],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },
    '1_duodecillion_carrots': {
        'name': 'Carrot Big Bang',
        'desc': 'Earn your 1 DUODECILLIONTH carrot. Must create...',
        'image': false,
        'reward': () => { mouseConfetti([24,24], confettiColors, 300)},
        'pages': 6,
        'conditions': ['player.lifetime.carrots', 1000000000000000000000000000000000000000n],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },
    '1_tredecillion_carrots': {
        'name': 'Carrot Timelines',
        'desc': 'Earn your 1 TREDECILLIONTH carrot. Everywhere and everytime.',
        'image': false,
        'reward': () => { mouseConfetti([24,24], confettiColors, 300)},
        'pages': 6,
        'conditions': ['player.lifetime.carrots', 1000000000000000000000000000000000000000000n],
        'style': 'endgame',
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },

    // Misc
    '5000000_idle_carrots': {
        'name': 'On the Clock',
        'desc': 'Earn 5,000,000 carrots with CPS',
        'image': './assets/achievements/clock.png',
        'reward': false,
        'pages': 2,
        'conditions': ['player.lifetime.idle_carrots', 5000000],
        'mystery': {
            'name': true,
            'desc': false,
            'image': false,
            'noToast': false,
        }
    },
    '1_trillion_carrots_at_once': {
        'name': 'Trillionwhere?',
        'desc': 'Have 1 trillion carrots at once',
        'image': false,
        'reward': false,
        'pages': 3,
        'conditions': ['player.carrots', 1000000000000],
        'mystery': {
            'name': true,
            'desc': false,
            'image': false,
            'noToast': false,
        }
    },

    // Tips
    'basic_tips': {
        'name': 'Tip of the Iceberg',
        'desc': 'Read all basic tips. Carrot Clicker Iceberg Explained.',
        'image': false,
        'reward': false,
        'pages': false,
        'conditions': ['ex_allTips()', 1],
        'mystery': {
            'name': false,
            'desc': false,
            'image': false,
            'noToast': false,
        }
    },
    'all_tips': {
        'name': 'Professor',
        'desc': 'Read every tip',
        'image': false,
        'reward': false,
        'pages': 5,
        'conditions': ['ex_allTips()', tl.length],
        'mystery': {
            'name': true,
            'desc': false,
            'image': false,
            'noToast': false,
        }
    },

    // CPC
    '9000_cpc': {
        'name': 'There\'s a Joke Here Somewhere',
        'desc': 'Get your Carrots Per Click (Click power level™️) over 9000',
        'image': './assets/achievements/9000.png',
        'reward': 'shop:theme/theme_chatapp',
        'pages': 2,
        'conditions': ['player.cpc', 9000],
        'mystery': {
            'name': true,
            'desc': false,
            'image': false,
            'noToast': false,
        }
    },
    '1_billion_cpc': {
        'name': '1_billion_cpc',
        'desc': 'Get your Carrots Per Click (CPC) to 1 billion',
        'image': false,
        'reward': false,
        'pages': 3,
        'conditions': ['player.cpc', 1000000000],
        'mystery': {
            'name': true,
            'desc': false,
            'image': false,
            'noToast': false,
        }
    },

    // CPS
    '1000_cps': {
        'name': 'Time is Hungry',
        'desc': 'Produce 1,000 carrots every second',
        'image': false,
        'reward': 'shop:cosmetic/bill/business_bill',
        'pages': 2,
        'conditions': ['player.cps', 100000],
        'mystery': {
            'name': true,
            'desc': false,
            'image': false,
            'noToast': false,
        }
    },
    '100000_cps': {
        'name': 'Six Figure Income',
        'desc': 'Get your Carrots Per Second above 100,000',
        'image': false,
        'reward': false,
        'pages': 3,
        'conditions': ['player.cps', 100000],
        'mystery': {
            'name': true,
            'desc': false,
            'image': false,
            'noToast': false,
        }
    },

    // Falling carrots
    '50_falling_carrots': {
        'name': 'Free Falling',
        'desc': 'Grab 50 falling carrots',
        'image': './assets/achievements/parachute_carrot.png',
        'reward': false,
        'pages': false,
        'conditions': ['player.lifetime.falling_carrots_grabbed', 50],
        'mystery': {
            'name': true,
            'desc': false,
            'image': false,
            'noToast': false,
        }
    },
    '250_falling_carrots': {
        'name': 'Carrot Rain',
        'desc': 'Grab 250 falling carrots',
        'image': false,
        'reward': 'shop:cosmetic/bundle/cookie',
        'pages': 2,
        'conditions': ['player.lifetime.falling_carrots_grabbed', 250],
        'mystery': {
            'name': true,
            'desc': false,
            'image': false,
            'noToast': false,
        }
    },
    '2048_falling_carrots': {
        'name': 'Falling Into Place',
        'desc': 'Grab 2048 falling carrots',
        'image': './assets/achievements/tetris.gif',
        'reward': false,
        'pages': 3,
        'conditions': ['player.lifetime.falling_carrots_grabbed', 2048],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },
    '3_falling_consecutive': {
        'name': 'Match 3',
        'desc': 'Grab 3 falling carrots in a row',
        'image': false,
        'reward': 'cash:12',
        'pages': false,
        'conditions': ['player.fallingConsecRecord', 3],
        'mystery': {
            'name': true,
            'desc': false,
            'image': false,
            'noToast': false,
        }
    },
    // Commented out for now since it's not doable without fallingFrenzy
    // '10_falling_consecutive': { 
    //     'name': '10_falling_consecutive',
    //     'desc': 'Grab 10 falling carrots in a row',
    //     'image': false,
    //     'reward': false,
    //     'pages': false,
    //     'conditions': ['player.fallingConsecRecord', 10],
    //     'mystery': {
    //         'name': true,
    //         'desc': false,
    //         'image': false,
    //         'noToast': false,
    //     }
    // },

    // Clicks
    '500_clicks': {
        'name': 'Click the Carrot, Bill.',
        'desc': 'Click the carrot 500 times',
        'image': false,
        'reward': false,
        'pages': false,
        'conditions': ['player.lifetime.clicks', 500],
        'mystery': {
            'name': true,
            'desc': false,
            'image': false,
            'noToast': false,
        }
    },
    '5000_clicks': {
        'name': 'Clicker Hero',
        'desc': 'Click the carrot 5,000 times',
        'image': false,
        'reward': 'shop:cosmetic/farmable/pixel_carrot',
        'pages': false,
        'conditions': ['player.lifetime.clicks', 5000],
        'mystery': {
            'name': true,
            'desc': false,
            'image': false,
            'noToast': false,
        }
    },
    '50000_clicks': {
        'name': 'Destroyer of Mice',
        'desc': 'Click the carrot 50,000 times',
        'image': false,
        'reward': false,
        'pages': false,
        'conditions': ['player.lifetime.clicks', 50000],
        'mystery': {
            'name': true,
            'desc': false,
            'image': false,
            'noToast': false,
        }
    },
    '100000_clicks': {
        'name': '"My Finger Hurts"',
        'desc': 'Click the carrot 100,000 times',
        'image': false,
        'reward': false,
        'pages': false,
        'conditions': ['player.lifetime.clicks', 100000],
        'mystery': {
            'name': true,
            'desc': false,
            'image': false,
            'noToast': false,
        }
    },
    // 'too_many_clicks': {
    //     'name': 'Destroyer of Mice',
    //     'desc': 'Click the carrot 10,000,000 times',
    //     'image': false,
    //     'reward': false,
    //     'pages': 4,
    //     'conditions': ['player.lifetime.clicks', 10000000],
    //     'mystery': {
    //         'name': true,
    //         'desc': false,
    //         'image': false,
    //         'noToast': false,
    //     }
    // },


    // Golden Carrots
    '50_golden_carrots': {
        'name': 'Golden',
        'desc': 'Earn 50 golden carrots',
        'image': './assets/achievements/golden.png',
        'reward': [
            'cosmetic:farmable/golden_carrot',
            'shop:cosmetic/farmable/pixel_golden_carrot',
            () => { mouseConfetti([24,24], confettiColors, 300) }
        ],
        'pages': false,
        'conditions': ['player.lifetime.golden_carrots', 50],
        'mystery': {
            'name': false,
            'desc': false,
            'image': false,
            'noToast': false,
        }
    },
    '500_golden_carrots': {
        'name': 'M[Au]numental',
        'desc': 'Earn 500 golden carrots',
        'image': './assets/achievements/gold_au.png',
        'reward': false,
        'pages': 2,
        'conditions': ['player.lifetime.golden_carrots', 500],
        'mystery': {
            'name': false,
            'desc': false,
            'image': false,
            'noToast': false,
        }
    },
    '1989_golden_carrots': {
        'name': 'Retro',
        'desc': 'Earn 1989 golden carrots',
        'image': './assets/theme/theme_retro.png',
        'reward': 'theme:theme_retro',
        'pages': 3,
        'conditions': ['player.lifetime.golden_carrots', 1989],
        'mystery': {
            'name': true,
            'desc': false,
            'image': false,
            'noToast': false,
        }
    },

    // Cash
    '100_lifetime_cash': {
        'name': 'Penny Pincher',
        'desc': 'Earn 100 cash',
        'image': false,
        'reward': false,
        'pages': 1,
        'conditions': ['player.lifetime.cash', 100],
        'mystery': {
            'name': false,
            'desc': false,
            'image': false,
            'noToast': false,
        }
    },
    '50_cash': {
        'name': 'Savings Account',
        'desc': 'Have 50 cash in the bank without spending it',
        'image': false,
        'reward': false,
        'pages': 1,
        'conditions': ['player.cash', 50],
        'mystery': {
            'name': false,
            'desc': false,
            'image': false,
            'noToast': false,
        }
    },

    // Misc
    '9_clicks_per_second': {
        'name': 'Gotta Grow Fast',
        'desc': 'Click 9 times in one second',
        'image': './assets/achievements/12_clicks_per_second.png',
        'reward': false,
        'pages': false,
        'conditions': ['player.clickSpeedRecord', 9],
        'mystery': {
            'name': true,
            'desc': false,
            'image': false,
            'noToast': false,
        }
    },
    '13_clicks_per_second': {
        'name': 'Olympic Clicking Games',
        'desc': 'Click 13 times in one second',
        'image': './assets/achievements/16_clicks_per_second.png',
        'reward': false,
        'pages': false,
        'conditions': ['player.clickSpeedRecord', 13],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },
    '15_clicks_per_second': {
        'name': 'I am Seed',
        'desc': 'Click 15 times in one second',
        'image': './assets/achievements/21_clicks_per_second.gif',
        'reward': 'cosmetic:farmable/cursor',
        'pages': false,
        'conditions': ['player.clickSpeedRecord', 15],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },

    // Hoes
    'first_hoe': {
        'name': 'The Tools to Victory',
        'desc': 'Craft your first farming tool (Tutorial milestone)',
        'image': './assets/achievements/forge.png',
        'reward': () => {
            toast("You've created your first tool!", "To equip it, click one of the glowing tools on either Bill or Belle. The character will recieve a permanent buff, but remember that equipping a tools is irreversible (for now).", "", true);
        },
        'pages': 1,
        'conditions': ['player.lifetime.hoes.craftedTotal', 1],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': true,
        }
    },
    '1_netherite_hoe': {
        'name': 'Extreme Farming',
        'desc': 'Obtain the ultimate farming implement (Netherite Hoe)',
        'image': './assets/tools/tool_5.png',
        'reward': 'cosmetic:farmable/netherite_hoe',
        'pages': 10,
        'conditions': ['player.lifetime.hoes.crafted[5]', 1],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },
    '50_percent_achievements': {
        'name': 'Half Way There',
        'desc': 'Reach 50% achievements unlocked',
        'image': './assets/achievements/bronze_medal.gif',
        'reward': [
            'shop:cosmetic/farmable/alien_carrot',
            'shop:cosmetic/farmable/demon_carrot',
            'shop:cosmetic/farmable/ghost_carrot',
            'shop:cosmetic/farmable/rainbow_carrot',
            () => { mouseConfetti([24,24], confettiColors, 300)},
        ],
        'pages': 5,
        'conditions': ['Math.round(percentage(Object.keys(player.achievements).length, achievementsKeys.length - hiddenAchievements - 1))', 50],

        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },
    'all_normal_achievements': {
        'name': 'All Normal Achievements',
        'desc': 'Unlock every non-challenge achievement',
        'image': './assets/achievements/silver_medal.gif',
        'reward': () => {
            let sc = toast("Congrats!", "Thanks for playing!", "cyan", true, false, false, false, () => { startCredits(sc); }, "View credits");
        },
        'pages': 10,
        'conditions': ['Math.round(percentage(Object.keys(player.achievements).length, achievementsKeys.length - hiddenAchievements - challengeAchievements - 3))', 100],
        // 'style': 'endgame',
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },

    // Challenge achievements
    'no_bonus_carrots_challenge': {
        'name': 'Fall Guy',
        'desc': 'Farm 500,000 carrots in a single prestige without catching a single falling carrot (Challenge achievement)',
        'image': './assets/achievements/no_falling_carrots.png',
        'reward': () => { mouseConfetti([24,24], confettiColors, 300) },
        'pages': 5,
        'conditions': ['ex_noBonusCarrots()', true],
        'style': 'challenge',
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },
    'no_bill_challenge': {
        'name': 'You\'re Free to Wait', // Renamed from "Patience is free"
        'desc': 'Farm 2,500,000 carrots without upgrading Bill (Challenge achievement)',
        'image': false,
        'reward': () => { mouseConfetti([24,24], confettiColors, 300)},
        'pages': 5,
        'conditions': ['ex_noBill()', true],
        'style': 'challenge',
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },
    'no_belle_challenge': {
        'name': 'Off the Clock',
        'desc': 'Farm 5,000,000 carrots without Belle (Challenge achievement)',
        'image': './assets/achievements/broken_clock.png',
        'reward': () => { mouseConfetti([24,24], confettiColors, 300)},
        'pages': 5,
        'conditions': ['ex_noBelle()', true],
        'style': 'challenge',
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },
    'no_hoes_challenge': {
        'name': 'Nonbeliever',
        'desc': 'Farm 5,000,000 carrots without crafting a single tool (Challenge achievement)',
        'image': false,
        'reward': () => { mouseConfetti([24,24], confettiColors, 300)},
        'pages': 8,
        'conditions': ['ex_noHoes()', true],
        'style': 'challenge',
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },

    'all_achievements': {
        'name': 'Completionist', // Originally "Achievement Hunter"
        'desc': 'Unlock every achievement',
        'image': './assets/achievements/medal_spin_bg.gif',
        'reward': () => { mouseConfetti([24,24], confettiColors, 300) },
        'pages': 15,
        'conditions': ['Math.round(percentage(Object.keys(player.achievements).length, achievementsKeys.length - hiddenAchievements - 1))', 100],
        'style': 'endgame',
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },

    // Secret Achievements
    '1000000_clicks': {
        'name': 'Clicker God',
        'desc': 'Click the carrot 1 million times (Hidden achievement)',
        'image': false,
        'reward': false,
        'pages': false,
        'conditions': ['player.lifetime.clicks', 1000000],
        'style': 'secret',
        'mystery': {
            'name': true,
            'desc': false,
            'image': false,
            'noToast': false,
            'list': true,
        }
    },
    'easter_egg_hunter': {
        'name': 'Easter Egg Hunter',
        'desc': 'Enter the Konami code, at least according to Wikipedia. There are multiple versions, apparently. (Hidden achievement)',
        'image': './assets/achievements/easter_egg.png',
        'reward': () => { mouseConfetti([24,24], confettiColors, 300) },
        'pages': false,
        'conditions': ['keyTrigger[0]', 1],
        'style': 'secret',
        'mystery': {
            'name': true,
            'desc': true,
            'image': true,
            'noToast': false,
            'list': true,
        }
    },
    'footer_carrot_clicker': {
        'name': 'Carrot Clicker Clicker',
        'desc': 'Click the carrot in settings 100 times (Hidden achievement)',
        'image': './assets/achievements/footer_carrot.png',
        'reward': false,
        'pages': false,
        'conditions': ['easterEgg', 100],
        'style': 'secret',
        'mystery': {
            'name': true,
            'desc': true,
            'image': true,
            'noToast': false,
            'list': true,
        }
    },
    'pineapple': {
        'name': 'Pineapple',
        'desc': 'Hey that\'s me (Hidden achievement)',
        'image': './assets/achievements/pineapple_achieve.png',
        'reward': 'cosmetic:farmable/pineapple',
        'pages': false,
        'conditions': ['keyTrigger[3]', 1],
        'style': 'secret',
        'mystery': {
            'name': true,
            'desc': true,
            'image': true,
            'noToast': false,
            'list': true,
        }
    },
    'not_funny': {
        'name': 'Not Funny',
        'desc': 'Upgrade all 3 characters to Level 69 (Hidden achievement)',
        'image': './assets/achievements/nice.png',
        'reward': () => { mouseConfetti([24,24], confettiColors, 300) },
        'pages': false,
        'conditions': ['ex_notFunny()', 1],
        'style': 'secret',
        'mystery': {
            'name': true,
            'desc': true,
            'image': true,
            'noToast': false,
            'list': true,
        }
    },
    'playtester': {
        'name': 'Early Playtester',
        'desc': 'Thanks for playtesting!',
        'image': './assets/achievements/early_playtester.png',
        'reward': [
            'theme:theme_classic',
            'cash:32',
        ],
        'pages': false,
        'conditions': ['0', 1],
        // 'conditions': ['store("playtest")', 'yes'],
        'style': 'shine',
        'mystery': {
            'name': true,
            'desc': true,
            'image': true,
            'noToast': false,
            'list': true,
        }
    },

    // Internal achievements- won't appear in game but it's way easier to use the achievements system to trigger certain events
    'internal_prestige_available': {
        'internal': true,
        'name': 'internal_prestige_available',
        'reward': () => {
            player.prestige_available = true;
            saveGame();
            seeButton('prestige');
        },
        'pages': false,
        'conditions': ['(player.lifetime.golden_carrots > 0 || player.prestige_potential > 0)', true],
    },
    // 'internal_custom_theme_available': {
    //     'internal': true,
    //     'name': 'internal_custom_theme_available',
    //     'reward': 'shop:theme/theme_custom',
    //     'pages': false,
    //     'conditions': ['player.themes.length', Object.keys(themes).length - 1],
    // },

}
const achievementsKeys = Object.keys(achievements);
var hiddenAchievements = 0;
var challengeAchievements = 0;
var internalAchievements = 0;
//#endregion


// External achievement checks
//#region 
/** use_charles */
function ex_charlesUses() {
    if(
    Charles.tome.improveWorkingConditions.value > Default_Charles.tome.improveWorkingConditions.value
    || Charles.tome.betterHoes.value > Default_Charles.tome.betterHoes.value
    || Charles.tome.decreaseWages.value > Default_Charles.tome.decreaseWages.value
    ) return true;
    return false;
}
/** No falling carrots challenge */
function ex_noBonusCarrots() {
    if(player.prestige.carrots >= 500000 && player.prestige.falling_carrots_grabbed == 0) return true;
    return false;
}
/** No Bill challenge */
function ex_noBill() {
    if(Boomer_Bill.lvl == 1 && player.prestige.carrots >= 2500000) return true;
    return false;
}
/** No Belle challenge */
function ex_noBelle() {
    if(Belle_Boomerette.lvl == 0 && player.prestige.carrots >= 5000000) return true;
    return false;
}
/** No hoes challenge */
function ex_noHoes() {
    if(player.prestige.hoes.craftedTotal == 0 && player.prestige.carrots >= 5000000) return true;
    return false;
}

/** Not funny */
function ex_notFunny() {
    if(Boomer_Bill.lvl == 69 && Belle_Boomerette.lvl == 69 && Gregory.lvl == 69) return 1;
    return 0;
}
/** All tips (basic_tips, all_tips) */
function ex_allTips() {
    let tally = 0;
    for(i = 0; i < tl.length; i++) {
        let type = tl[i];
        if(Object.keys(tips[`s_${type}`]).length == default_tips[type].length && Object.keys(tips[`s_fun_${type}`]).length == default_tips[`fun_${type}`].length
        ) {
            tally++;
        }
    }
    return tally;
}

/** Get total cosmetics count */
function playerCosmeticsCount() {
    let a = 0;
    for(i = 0; i < cosmeticsKeys.length; i++) {
        a += player.cosmetics[cosmeticsKeys[i]].length - 1;
    }
    return a;
}
//#endregion







/* Item/crafting system */
//#region 
// const items = {
//     'carrot_pot_pie': {
//         'name': 'Carrot Pot Pie',
//         'desc': 'Made with carrot-based meat alternatives of course.',
//         'recipe': {
//             'carrot': 24,
//             'dough': 4,
//         }
//     },
//     'carrot_cookie': {
//         'name': 'Carrot Cookie',
//         'desc': 'Delicious',
//         'recipe': {
//             'carrot': 24,
//             'dough': 4,
//         },
//         // Crafting this unlocks Cookie cosmetic, or maybe you can craft the cookie cosmetic with these
//     }
// }
//#endregion