// Game data

/* ------------------- TIPS ------------------- */
//#region 
const default_tips = {
    number:0,
    random:0,
    tracker:0,
    Type:0,
    TypeModifier:0.5,

    // Practical tips
    basic: [
        "Click the lvl up arrow to level up characters",
        "To buy a Hoe, go to Greg and click the correct type",
        "To equip a Hoe, you must first buy a Hoe, then click the Hoe type under Bill or Belle",
        "Click the carrot",
        "Long hover over a character to view their description",
        "Click here to cycle through available tips!",
    ],
    beginner: [
        "Each character can only hold up to 1 hoe for every level Greg has reached",
        "By completing achievements you will earn mysterious tome pages.",
    ],
    advanced: [
        "When you're ready, click the prestige button. You will start over but gain the ability to buy tomes",
        // "Golden carrots increase your characters by 10%",
        "Golden carrots can be used to buy tomes, which give you permanent buffs",
        "Every Tome Page you have will give you a +1% golden carrot increase when prestiging"
    ],

    // Fun tips
    fun: [
        "Carrots can end world hunger",
        "Only YOU can save the carrots!",
        "Carrots have been proven to improve eyesight by 150%. It's true!",
        "Carrots are your friend",
        "JJ broke it",
        "Carrot Clicker is mobile-friendly!",
        "Click the carrot, Bill.",
        "Wait for the carrot to grow, Belle.",
        "On the internet",
        "Fun fact: baby carrots are just shaved down regular carrots",
        "\"Game development is hard\" clicker game developer says",
        `Only on ${window.location.href.split('#')[0]}`,
        'If you see a ? near something you can click it to get a more detailed dsecription of what it does',
    ],
    funIntermediate: [
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
        "Carrots have been proven to improve eyesight by 9000%. It's true!",
    ],
    
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
        name:     'Carrot Clicker classic',
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
        name:     'Camo Theme',
        image:    './assets/theme/theme_camo.png',
        desc:     'In the trees',
        cosmetic: false,
        // accent:   false
    },
    'theme_retro': {
        name:     'Retro Green Theme',
        image:    './assets/theme/theme_retro.png',
        desc:     ':D',
        cosmetic: false,
        // accent:   false
    },
    'theme_bw': {
        name:     'Black & White',
        image:    false,
        desc:     'Back in my day',
        cosmetic: false,
        // accent:   false
    },
    'theme_blockgame': {
        name:     'Minecraft',
        image:    './assets/theme/blockgame/grass_block_side.png',
        desc:     'Does it violate copyright if this is just a hobby project with no ads? Genuine question',
        cosmetic: false,
        accent:   '#3c2a1d'
    },
    'theme_custom': {
        name: 'Custom',
        image: false,
        desc: 'Make your own theme!',
        cosmetic: false,
        // accent: false
    }
};
const themesKeys = Object.keys(themes);
//#endregion


/* ---------------- COSMETICS ---------------- */
//#region
// const cosmetics = {
//     // Default
//     'default': {
//         'name': 'Carrot (Default)',
//         'image': './assets/Carrot Clicker.png',
//         'farmable': 'Carrot',
//         'desc': 'Good old carrots',

//         'bill_image':    './assets/characters/Boomer_Bill.png',
//         'belle_image':   './assets/characters/BelleBommerette.png',
//         'greg_image':    './assets/characters/Gregory.png',
//         'charles_image': './assets/characters/Charles.png',
//         'carl_image':    './assets/characters/Carl.png',

//         'bill_name':    'Bill',
//         'belle_name':   'Belle',
//         'greg_name':    'Greg',
//         'charles_name': 'Charles',
//         'carl_name':    'Carl',
//     },
//     // Golden Carrot
//     'golden_carrot': {
//         'name': 'Golden Carrot',
//         'image': './assets/golden carrot.png',
//         'farmable': 'Golden Carrot',
//         'desc': 'They are only spray-painted gold. Worthless.'
//     },
//     'pixel_carrot': {
//         'name': 'Pixel Carrot',
//         'image': './assets/theme/pixel_carrot.png',
//         'farmable': 'Carrot',
//         'desc': 'Someone pixelated my carrot'
//     },
//     'cookie': {
//         'name': 'Cookie',
//         'image': './assets/theme/cookie/cookie.png',
//         'farmable': 'Cookie',
//         'desc': 'Delicious',

//         'bill_image':    './assets/theme/cookie/baker_bill.png',
//         'belle_image':   './assets/theme/cookie/grandma_belle.png',
//         'greg_image':    './assets/characters/Gregory.png',
//         'charles_image': './assets/characters/Charles.png',
//         'carl_image':    './assets/characters/Carl.png',

//         'bill_name':    'Baker Bill',
//         'belle_name':   'Grandma Belle',
//         'greg_name':    'Greg',
//         'charles_name': 'Charles',
//         'carl_name':    'Carl',
//     },
//     // Minecraft
//     'blockgame': {
//         'name': 'Minecraft Carrot',
//         'image': './assets/theme/blockgame/carrot.png',
//         'desc': 'Hrm',
//     },
//     'blockgame_potato': {
//         'name': 'Minecraft Potato',
//         'image': './assets/theme/blockgame/potato.png',
//         'farmable': 'Potatoe',
//         'desc': 'Knishes'
//     },
//     // Pineapple
//     'pineapple': {
//         'name': 'Pineapple',
//         'image': './assets/theme/pineapple/pineapple.png',
//         'farmable': 'Pineapple',
//         'desc': 'My favorite'
//     },
//     // Bill clicker
//     'bill': {
//         'name': 'Bill',
//         'image': './assets/characters/Boomer_Bill.png',
//         'farmable': 'Bill',
//         'desc': 'Bill',

//         'bill_image':    './assets/characters/Boomer_Bill.png',
//         'belle_image':   './assets/characters/Boomer_Bill.png',
//         'greg_image':    './assets/characters/Boomer_Bill.png',
//         'charles_image': './assets/characters/Boomer_Bill.png',
//         'carl_image':    './assets/characters/Boomer_Bill.png',

    
//         'bill_name':    'Bill',
//         'belle_name':   'Bill',
//         'greg_name':    'Bill',
//         'charles_name': 'Bill',
//         'carl_name':    'Bill',
//     },
//     // Netherite hoe
//     "netherite_hoe": {
//         'name': 'Netherite hoe',
//         'image': './assets/tools/netherite_hoe.png',
//         'farmable': 'Netherite hoe',
//         'desc': 'All hail'
//     },
//     // Cursor
//     "cursor": {
//         'name': 'Cursor',
//         'image': './assets/theme/cursor/cursor.png',
//         'image_hover': './assets/theme/cursor/pointer.png',
//         'farmable': 'Cursor',
//         'desc': 'Cursorception'
//     },
//     // Alien Carrot
//     "alien_carrot": {
//         'name': 'Alien Carrot',
//         'image': './assets/theme/alien carrot/alien_carrot.png',
//         'farmable': 'Alien Carrot',
//         'desc': 'So strange'
//     },
//     // Demon Carrot
//     "demon_carrot": {
//         'name': 'Demon Carrot',
//         'image': './assets/theme/evil_carrot.png',
//         'farmable': 'Demon Carrot',
//         'desc': 'Eeevil!',
//     },
//     "ghost_carrot": {
//         'name': 'Ghost Carrot',
//         'image': './assets/theme/Ghost_carrot.png',
//         'farmable': 'Ghost Carrot',
//         'desc': 'description',
//     },
//     "rainbow_carrot": {
//         'name': 'Rainbow Carrot',
//         'image': './assets/theme/rainbow_carrot.png',
//         'farmable': 'Rainbow Carrot',
//         'desc': 'Tastes like candy',
//     },


//     // Updoot
//     "upvote": {
//         'name': 'Orange Arrow',
//         'image': './assets/theme/orange_arrow/upvote.png',
//         'farmable': 'Updoot',
//         'desc': 'This is better than going outside'
//     },


//     // Character cosmetics (temporary)
//     'fancy_bill': {
//         'name': 'Fancy Bill',
//         'desc': 'description',
//         'bill_image':    './assets/theme/boomer_bill_gates.png',
//     },
//     'safety_greg': {
//         'name': 'High Vis Greg',
//         'desc': 'Can\'t have you dying on the job now can we',
//         'greg_image':    './assets/theme/safety_greg.png',
//     },
// }
// const cosmeticsKeys = Object.keys(cosmetics);

// Version 2
const cosmetics = {
    bundle: {
        // Cookie
        'default': {
            'name': 'Default',
            'preview': './assets/Carrot Clicker.png',
            'desc': 'The carrot and characters you know and love',

            'farmable': 'default',
            'bill':     'default',
            'belle':    'default',
            'greg':     'default',
            'charles':  'default',
            'carl':     'default',
        },
        'cookie': {
            'name': 'Cookie',
            'preview': './assets/theme/cookie/cookie.png',
            'desc': 'Cookies and cookie-related outfits',

            'farmable': 'cookie',
            'bill': 'baker_bill',
            'belle': 'grandma_belle',
        },
        'bill': {
            'name': 'All Bill',
            'preview': './assets/characters/Boomer_Bill.png',
            'desc': 'One of us',

            'farmable': 'bill',
            'bill':     'default',
            'belle':    'bill',
            'greg':     'bill',
            'charles':  'bill',
            'carl':     'bill',
        },
        'blockgame': {
            'name': 'Minecraft',
            'preview': './assets/theme/blockgame/grass_block_side.png',
            'desc': 'This probably won\'t make it to Carrot Clicker 1.0 to be honest',

            'theme': 'theme_blockgame',
            'farmable': 'blockgame',
        },
    },
    farmable: {
        // Default
        'default': {
            'name': 'Carrot (Default)',
            'preview': './assets/Carrot Clicker.png',
            'desc': 'Good old carrots',

            'farmable': 'Carrot',
            'image': './assets/Carrot Clicker.png',
        },
        // Golden Carrot
        'golden_carrot': {
            'name': 'Golden Carrot',
            'preview': './assets/golden carrot.png',
            'desc': 'They are only spray-painted gold. Worthless.',

            'farmable': 'Golden Carrot',
            'image': './assets/golden carrot.png',
        },
        'pixel_carrot': {
            'name': 'Pixel Carrot',
            'preview': './assets/theme/pixel_carrot.png',
            'desc': 'Someone pixelated my carrot',

            'farmable': 'Carrot',
            'image': './assets/theme/pixel_carrot.png',
        },
        'cookie': {
            'name': 'Cookie',
            'preview': './assets/theme/cookie/cookie.png',
            'desc': 'Delicious',

            'farmable': 'Cookie',
            'image': './assets/theme/cookie/cookie.png',
        },
        // Minecraft
        'blockgame': {
            'name': 'Minecraft Carrot',
            'preview': './assets/theme/blockgame/carrot.png',
            'desc': 'Hrm',

            'farmable': 'Minecraft Carrot',
            'image': './assets/theme/blockgame/carrot.png',
        },
        'blockgame_potato': {
            'name': 'Minecraft Potato',
            'preview': './assets/theme/blockgame/potato.png',
            'desc': 'Knishes',

            'farmable': 'Potatoe',
            'image': './assets/theme/blockgame/potato.png',
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

            'farmable': 'Bill',
            'image': './assets/characters/Boomer_Bill.png',
        },
        // Netherite hoe
        "netherite_hoe": {
            'name': 'Netherite hoe',
            'preview': './assets/tools/netherite_hoe.png',
            'desc': 'All hail',

            'farmable': 'Netherite hoe',
            'image': './assets/tools/netherite_hoe.png',
        },
        // Cursor
        "cursor": {
            'name': 'Cursor',
            'preview': './assets/theme/cursor/cursor.png',
            'desc': 'Cursorception',

            'farmable': 'Cursor',
            'image': './assets/theme/cursor/cursor.png',
            // 'image_hover': './assets/theme/cursor/pointer.png',
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
            'preview': './assets/theme/Ghost_carrot.png',
            
            'desc': 'description',
            'farmable': 'Ghost Carrot',
            'image': './assets/theme/Ghost_carrot.png',
        },
        "rainbow_carrot": {
            'name': 'Rainbow Carrot',
            'preview': './assets/theme/rainbow_carrot.png',
            
            'desc': 'Tastes like candy',
            'farmable': 'Rainbow Carrot',
            'image': './assets/theme/rainbow_carrot.png',
        },
    
    
        // Updoot
        "upvote": {
            'name': 'Orange Arrow',
            'preview': './assets/theme/orange_arrow/upvote.png',

            'desc': 'This is better than going outside',
            'farmable': 'Updoot',
            'image': './assets/theme/orange_arrow/upvote.png',
        },
    },
    bill: {
        'default': {
            'name': 'Bill',
            'desc': 'write something here please',

            'rename': 'Bill',
            'image': './assets/characters/Boomer_Bill.png',
        },
        'fancy_bill': {
            'name': 'Fancy Bill',
            'preview': './assets/theme/boomer_bill_gates.png',
            'desc': 'description',

            'rename': false,
            'image': './assets/theme/boomer_bill_gates.png',
        },
        'baker_bill': {
            'name': 'Baker Bill',
            'preview': './assets/theme/cookie/baker_bill.png',
            'desc': 'Care for a cookie?',

            'rename': false,
            'image': './assets/theme/cookie/baker_bill.png',
        },
    },
    belle: {
        'default': {
            'rename': 'Belle',
            'image': './assets/characters/BelleBommerette.png',
        },
        'grandma_belle': {
            'name': 'Grandma Belle',
            'preview': './assets/theme/cookie/grandma_belle.png',
            'desc': 'No you can\'t buy more grandmas, what kind of question is that?',

            'rename': 'Grandma Belle',
            'image': './assets/theme/cookie/grandma_belle.png',
        },
        'bill': {
            'rename': 'Bill',
            'image': './assets/characters/Boomer_Bill.png',
        },
    },
    greg: {
        'default': {
            'rename': 'Greg',
            'image': './assets/characters/Gregory.png',
        },
        'safety_greg': {
            'name': 'High Vis Greg',
            'preview': './assets/theme/safety_greg.png',
            'desc': 'Can\'t have you dying on the job now can we',

            'rename': false,
            'image': './assets/theme/safety_greg.png',
        },
        'bill': {
            'rename': 'Bill',
            'image': './assets/characters/Boomer_Bill.png',
        },
    },
    charles: {
        'default': {
            'rename': 'Charles',
            'image': './assets/characters/Charles.png',
        },
        'bill': {
            'rename': 'Bill',
            'image': './assets/characters/Boomer_Bill.png',
        },
    },
    carl: {
        'default': {
            'rename': 'Carl',
            'image': './assets/characters/Carl.png',
        },
        'bill': {
            'rename': 'Bill',
            'image': './assets/characters/Boomer_Bill.png',
        },
    },
    tools: {
        'default': {
            '0': './',
            '1': './',
            '2': './',
            '3': './',
            '4': './',
            '5': './',
        }
    }
}
// Get keys
const cosmeticsKeys = Object.keys(cosmetics);
for(let i = 0; i < cosmeticsKeys.length; i++) {
    let key = cosmeticsKeys[i];
    let target = cosmetics[key];

    target['keys'] = Object.keys(target);
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
        'pages': 1,
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
        'pages': 2,
        'conditions': ['player.lifetime.carrots', 5000],
        'mystery': {
            'name': true,
            'desc': false,
            'image': false,
            'noToast': false,
        }
    },
    '1_prestige': {
        'name': 'Prestigious',
        'desc': 'Prestige for the first time and attract the attention of the professor',
        'image': './assets/achievements/prestige_once.gif',
        'reward': 'character:charles',
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
        'image': false,
        'reward': 'function:confetti',
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
        'reward': 'function:doNothing()',
        'pages': 3,
        'conditions': ['ex_charlesUses()', 1],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },
    '1_improve_working_conditions': {
        'name': 'OSHA Violator',
        'desc': 'Buy a tome that improves working conditions. Your workers are now safe.',
        'image': './assets/theme/safety_greg.png',
        // 'reward': 'cosmetic:safety_greg',
        'reward': false,
        'pages': 3,
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
        'desc': 'Buy a tome that improves hoe costs. Unholy magic, I say.',
        'image': './assets/achievements/tome_improve_hoe_costs.png',
        'reward': 'function:doNothing()',
        'pages': 3,
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
        'reward': 'function:doNothing()',
        'pages': 3,
        'conditions': ['Charles.tome.decreaseWages.value', 1],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },
    'own_a_theme': {
        'name': 'Taking in the Themery',
        'desc': 'Obtain a cosmetic and a theme! You\'ve gained the attention of an artist.',
        'image': './assets/achievements/themery.png',
        'reward': 'character:carl',
        'pages': 2,
        'conditions': [
            ['player.themes.length', 4],
            ['player.cosmetics.length', 2],
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
        'reward': ['theme:theme_red', 'theme:theme_green', 'theme:theme_blue'],
        'pages': 5,
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
        'reward': 'function:doNothing()',
        'pages': 2,
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
        'reward': 'cosmetic:bill',
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
        'reward': 'function:doNothing()',
        'pages': 2,
        'conditions': ['Belle_Boomerette.lvl', 15],
        'mystery': {
            'name': true,
            'desc': false,
            'image': false,
            'noToast': false,
        }
    },
    'greg_lvl_20': {
        'name': 'The Gregs of Defeat',
        'desc': 'Upgrade Gregory 20 times',
        'image': false,
        'reward': 'function:doNothing()',
        'pages': 3,
        'conditions': ['Gregory.lvl', 15],
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
        'reward': ['theme:theme_blockgame', 'cosmetic:blockgame', 'cosmetic:blockgame_potato'],
        'pages': 5,
        'conditions': ['Gregory.lvl', 64],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },
    '401000_carrot': {
        'name': 'Retirement Fund',
        'desc': 'Earn 401k carrots. I don\'t think you know what a 401k is.',
        'image': './assets/achievements/401k.png',
        'reward': 'function:confetti()',
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
        'reward': 'function:confetti()',
        'pages': 3,
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
            'cosmetic:fancy_bill',
            'function:confetti()',
        ],
        'pages': 3,
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
        'reward': 'function:confetti()',
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
        'name': 'A World Fed',
        'desc': 'Earn your 1 quadrillionth carrot. Earth\'s hunger problem is now solved.',
        'image': './assets/achievements/earth.png',
        'reward': 'function:confetti()',
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
        'name': 'Carrot Singularity',
        'desc': 'Earn your 1 QUINTILLIONTH carrot. We\'re on the verge of something beautiful.',
        'image': './assets/achievements/singularity.png',
        'reward': 'function:confetti()',
        'pages': 4,
        'conditions': ['player.lifetime.carrots', 1000000000000000000n],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },
    '1_sextillion_carrots': {
        'name': 'Carrot Nebula',
        'desc': 'Earn your 1 SEXTILLIONTH carrot. The culmination of our efforts.',
        'image': false,
        'reward': 'function:confetti()',
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
        'name': 'Carrot Galaxy',
        'desc': 'Earn your 1 SEPTILLIONTH carrot. Something bigger than us has taken notice.',
        'image': false,
        'reward': 'function:confetti()',
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
        'name': 'Carrot Universe',
        'desc': 'Earn your 1 OCTILLIONTH carrot. There is not a single non-carrot molecule in the universe. Besides you of course.',
        'image': false,
        'reward': 'function:confetti()',
        'pages': 5,
        'conditions': ['player.lifetime.carrots', 1000000000000000000000000000n],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },
    '1_nonillion_carrots': {
        'name': 'Carrot Multiverse',
        'desc': 'Earn your 1 NONILLIONTH carrot. Finding new places to put them I see.',
        'image': false,
        'reward': 'function:confetti()',
        'pages': 5,
        'conditions': ['player.lifetime.carrots', 1000000000000000000000000000000n],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },

    // Misc
    '9000_cpc': {
        'name': 'There\'s a Joke Here Somewhere',
        'desc': 'Get your Carrots Per Click (Click power level™️) over 9000',
        'image': './assets/achievements/9000.png',
        'reward': 'function:doNothing()',
        'pages': 3,
        'conditions': ['player.cpc', 9000],
        'mystery': {
            'name': true,
            'desc': false,
            'image': false,
            'noToast': false,
        }
    },
    '1000_cps': {
        'name': 'Time is Hungry',
        'desc': 'Produce 1000 carrots every second',
        'image': false,
        'reward': 'function:doNothing()',
        'pages': 3,
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
        'reward': 'function:doNothing()',
        'pages': 4,
        'conditions': ['player.cps', 100000],
        'mystery': {
            'name': true,
            'desc': false,
            'image': false,
            'noToast': false,
        }
    },

    // Clicks
    '500_clicks': {
        'name': 'Click the Carrot, Bill.',
        'desc': 'Click the carrot 500 times',
        'image': false,
        'reward': 'function:doNothing()',
        'pages': false,
        'conditions': ['player.lifetime.clicks', 500],
        'mystery': {
            'name': true,
            'desc': false,
            'image': false,
            'noToast': false,
        }
    },
    '10000_clicks': {
        'name': 'Clicker Hero',
        'desc': 'Click the carrot 10,000 times',
        'image': false,
        'reward': 'function:doNothing()',
        'pages': 1,
        'conditions': ['player.lifetime.clicks', 100000],
        'mystery': {
            'name': true,
            'desc': false,
            'image': false,
            'noToast': false,
        }
    },
    '100000_clicks': {
        'name': 'Destroyer of Mice',
        'desc': 'Click the carrot 100,000 times',
        'image': false,
        'reward': 'function:doNothing()',
        'pages': 3,
        'conditions': ['player.lifetime.clicks', 100000],
        'mystery': {
            'name': true,
            'desc': false,
            'image': false,
            'noToast': false,
        }
    },
    '500000_clicks': {
        'name': '"My Finger Hurts"',
        'desc': 'Click the carrot 500,000 times',
        'image': false,
        'reward': 'function:doNothing()',
        'pages': 4,
        'conditions': ['player.lifetime.clicks', 500000],
        'mystery': {
            'name': true,
            'desc': false,
            'image': false,
            'noToast': false,
        }
    },
    '1000000_clicks': {
        'name': 'Clicker God',
        'desc': 'Click the carrot 1,000,000 times',
        'image': false,
        'reward': 'function:doNothing()',
        'pages': 5,
        'conditions': ['player.lifetime.clicks', 1000000],
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
    //     'reward': 'function:doNothing()',
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
        'reward': ['cosmetic:golden_carrot', 'function:confetti()'],
        'pages': 3,
        'conditions': ['player.lifetime.golden_carrots', 50],
        'mystery': {
            'name': true,
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
        'pages': 5,
        'conditions': ['player.lifetime.golden_carrots', 1989],
        'mystery': {
            'name': true,
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
        'reward': 'function:doNothing()',
        'pages': 1,
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
        'reward': 'function:doNothing()',
        'pages': 1,
        'conditions': ['player.clickSpeedRecord', 13],
        'mystery': {
            'name': true,
            'desc': true,
            'image': true,
            'noToast': false,
        }
    },
    '15_clicks_per_second': {
        'name': 'I am Seed',
        'desc': 'Click 15 times in one second',
        'image': './assets/achievements/21_clicks_per_second.gif',
        'reward': 'cosmetic:cursor',
        'pages': 2,
        'conditions': ['player.clickSpeedRecord', 15],
        'mystery': {
            'name': true,
            'desc': true,
            'image': true,
            'noToast': false,
        }
    },

    // Hoes
    'first_hoe': {
        'name': 'The Tools to Victory',
        'desc': 'Craft your first hoe (Tutorial milestone)',
        'image': './assets/tools/wood_hoe.png',
        'reward': 'function:tutorialHoes()',
        'pages': 1,
        'conditions': ['player.lifetime.hoes.craftedTotal', 1],
        'mystery': {
            'name': true,
            'desc': false,
            'image': true,
            'noToast': false,
        }
    },
    '1_netherite_hoe': {
        'name': 'Extreme Farming',
        'desc': 'Obtain the ultimate farming implement (Netherite Hoe)',
        'image': './assets/tools/netherite_hoe.png',
        'reward': 'cosmetic:netherite_hoe',
        'pages': 10,
        'conditions': ['player.lifetime.hoes.crafted[5]', 1],
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
        'image': false,
        'reward': 'function:confetti()',
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
        'desc': 'Farm 5,000,000 carrots without crafting a single hoe (Challenge achievement)',
        'image': false,
        'reward': 'function:confetti()',
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
        'name': 'Achievement hunter',
        'desc': 'Unlock every achievement',
        'image': false,
        'reward': 'function:confetti()',
        'pages': 10,
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
    'easter_egg_hunter': {
        'name': 'Easter Egg Hunter',
        'desc': 'Enter the Konami code. According to Wikipedia. There are multiple versions apparently. (Hidden achievement)',
        'image': './assets/achievements/easter_egg.png',
        'reward': 'function:confetti()',
        'pages': 1,
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
    'pineapple': {
        'name': 'Pineapple',
        'desc': 'Hey that\'s me (Hidden achievement)',
        'image': './assets/theme/pineapple/pineapple.png',
        'reward': 'cosmetic:pineapple',
        'pages': 1,
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
        'reward': 'function:confetti()',
        'pages': 3,
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
        'desc': 'Thanks for playtesting! Have a theme.',
        'image': false,
        'reward': 'theme:theme_classic',
        'pages': false,
        'conditions': ['0', 1],
        'style': 'shine',
        'mystery': {
            'name': true,
            'desc': true,
            'image': true,
            'noToast': false,
            'list': true,
        }
    },
}
const achievementsKeys = Object.keys(achievements);
var hiddenAchievements = 0;
//#endregion
