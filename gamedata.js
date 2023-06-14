// Message templates
//#region
// Dialog templates
const dialog = {
    prestige_confirm: ['Are you sure you want to Prestige?', 'Your carrots, tools, and upgrades will be lost, but you will gain the ability to buy farm upgrades in the form of tomes.', 'Prestige', 'button_gold', () => { prestige(); closeDialog(); }],
    clearsave: ['Are you sure?', 'Your progress will be lost forever!', 'Delete Save Data', 'button_red', () => { clearSave(); closeDialog(); }],
    settings_reset: ['Are you sure?', 'All settings will be returned to their default values', 'OK', '', () => {
        resetSettings();
        toast('Settings Reset', 'All settings returned to defaults');
        closeDialog();
    }],
    jjcvip: ['Are you sure you want to CARROT?', 'All of your CARROT will be lost.', 'Carrot', 'button_orange', () => { earnCarrots(1, 'bonus'); closeDialog(); }],
}
// Toast templates
const infot = ['', true, true];
const toasts = {
    // Info blurbs
    info_coins: ['Info: Coins', 'While clicking the carrot there is a chance that coins will drop instead of carrots. Make sure to grab them!', ...infot],
    info_pages: ['Info: Tome Pages', 'For every tome page you have you will recieve a +1% (or more) golden carrot bonus when prestiging. Earn additional tome pages by completing achievements!', ...infot],

    info_golden_carrots: ['Info: Golden Carrots', 'Golden carrots are created when you prestige. Use them to buy tomes to give your farmers permanent buffs. Be sure to spend all of your golden carrots before you start farming!', ...infot],

    info_achieve_percent: ['Info: Achievement Progress', 'Secret (or hidden) achievements are not required to reach 100%.', ...infot],
    info_cosmetic_percent: ['Info: Cosmetics Percentage', 'This does not include default cosmetics. Secret cosmetics are not required to reach 100%. A more detailed breakdown is in the cosmetics menu.', ...infot],
    info_boosts: ['Info: Boosts', 'Boosts will not be remembered if the game is closed', ...infot],

    // Tutorials
    tutorial_tools: ["Tutorial: Tools", "You've created your first tool! To equip it, click one of the glowing tools on either Bill or Belle. The character will recieve a permanent buff, but remember that equipping a tools is irreversible (for now).", "", true],
    tutorial_pages: ["Tutorial: Tome pages", "You've earned a tome page! For every tome page you have you will recieve a +1% golden carrot bonus when prestiging. Earn additional tome pages by completing achievements!", "", true],
    tutorial_multibuy: ['Tutorial: Multibuy', 'Press shift, or click the 10x indicator in the boosts bar to cycle multibuy. Multibuy allows you to level up more characters, craft and equip tools more tools at once.', '', true],
    tutorial_prestige_available: ['Tutorial: Prestiging', 'When you\'re ready to prestige, you can click the white carrot button. Try seeing how far you can get before prestiging to maximize your Golden Carrots!', undefined, true],
    tutorial_charles: ['Tutorial: Golden Carrots', 'Now that you\'ve prestiged, you\'ll want to buy some tomes. Visit Charles\' shop to see what tomes are available to you. Be sure to spend all of your golden carrots before you start farming!', '', true, false, false, true],
    // tutorial_golden_carrots is in carrot_clicker.js

    // Misc
    notice_trinkets: ['Trinkets now available', 'Use cash to buy trinkets with special abilities.'],
    error_jared_hire_cost: ['More carrots needed', 'Jared needs at least 10 million carrots to move in.'],
}
//#endregion


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
        "Click the level up arrow to upgrade your characters",
        "Click a character's \"i\" symbol to learn more about them",
        "Greg can craft tools that will buff your other characters",
        "If you see a ? near something you can click it to get a more detailed description of what it does",
        "You can also press amd hold the carrot as a slower alternative to clicking",
    ],
    beginner: [ // 1
        "To equip a tool, you must first craft one, then click the corresponding tool type under Bill or Belle",
        "Each character can only hold up to 1 tool (per type) for every level Greg has reached",
        "By completing achievements you will earn mysterious tome pages",
        "Completing achievements will give you additional themes and cosmetics to buy",
        "When clicking the carrot, cash will sometimes drop. Make sure to grab it!",
    ],
    intermediate: [ // 2
        "When you're ready, click the prestige button. You will start over but gain the ability to buy tomes",
        "Golden carrots can be used to buy tomes, which give you permanent buffs",
        "Every Tome Page you have will give you a +1% golden carrot (or more!) bonus when prestiging",
        "Some achievements will change the game icon in the top left to indicate your progress",
        "The more tools the better!",
    ],
    advanced: [ // 3
        "You've earned more than 1 billion carrots this prestige. That's a lot!",
        "Good luck!", // placeholder?
        "Buy tomes from Charles to buff your farm",
        "Make sure to spend your golden carrots on tomes before you start farming",
        "There is a merchant who sells powerful trinkets",
        // "Unlocking every theme will make a special theme available", // (Referring to theme_custom)
    ],

    // Fun tips
    fun_starter: [
        "Carrots can end world hunger",
        "Only YOU can save the carrots!",
        "Carrots have been proven to improve eyesight by 150%. It's true!",
        "Carrots are your friend",
        "Only the best code", // originally "JJ broke it",
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
        "Sell carrot knicknacks, Jared",
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
    seen: {
        starter: {
            0: true,
        },
        beginner: {},
        intermediate: {},
        advanced: {},
    
        // Fun tips
        fun_starter: {},
        fun_beginner: {},
        fun_intermediate: {},
        fun_advanced: {},
    }
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
        accent:   '#312e2e',
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
    'theme_grey': {
        name:     'Full Grey Theme',
        image:    './assets/theme/theme_grey.png',
        desc:     'Makes brown UI elements use grey instead',
        cosmetic: false,
    },
    'theme_classic': {
        name:     'Carrot Clicker Classic',
        image:    './assets/theme/theme_classic.png',
        desc:     'The original look of carrot clicker',
        cosmetic: false,
        accent:   '#4e3f34',
    },
    'theme_original': {
        name:     'Carrot Clicker CLASSIC-ER',
        image:    './assets/theme/theme_original.png',
        desc:     'The ORIGINAL original look of carrot clicker',
        cosmetic: false,
        accent:   '#291c11',
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
    },
    'theme_chatapp': {
        name:     'Chat App',
        image:    './assets/theme/theme_chatapp.png',
        desc:     '"how do i find #general"',
        cosmetic: false,
        accent:   '#202225',
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
            'jared':    'default',
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

            'bill':     'ugly_sweater',
            'charles':  'santa_charles',
        },
        // Bros
        'plumber': {
            'name': 'Boomer Bros',
            'preview': './assets/theme/plumber_bill.png',
            'image': './assets/theme/plumber_bill.png',
            'desc': 'They\'re carpenters',

            'bill': 'plumber',
            'greg': 'plumber',
        },
        // Developer Art
        'developer_art': {
            'name': 'Developer Art',
            'preview': './assets/theme/developer_art/Bill.png',
            'desc': 'Original artwork',

            // 'farmable': 'default',
            'bill':     'developer_art',
            'belle':    'developer_art',
            'greg':     'developer_art',
            'charles':  'developer_art',
            'carl':     'developer_art',
            'jared':    'developer_art',
            'tools':    'blockgame',
        },
        // All Bill
        'bill': {
            'name': 'All Bill',
            'preview': './assets/characters/Bill.png',
            'image': './assets/characters/Bill.png',
            'desc': 'One of us',

            'farmable': 'bill',
            'bill':     'default',
            'belle':    'bill',
            'greg':     'bill',
            'charles':  'bill',
            'carl':     'bill',
            'jared':    'bill',
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
            'preview': './assets/characters/Bill.png',
            'desc': 'Bill',
            'group': 'bill',

            'farmable': 'Bill',
            'image': './assets/characters/Bill.png',
            'render_type': 'pixel',
        },
        // Tool 6
        "gilded_hoe": {
            'name': 'Gilded Hoe',
            'preview': './assets/tools/tool_5.png',
            'desc': 'This is your God',

            'farmable': 'Idol',
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
            'preview': './assets/theme/alien_carrot.png',
            'desc': 'So strange',

            'farmable': 'Alien Carrot',
            'image': './assets/theme/alien_carrot.png',
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
            'farmable': 'up arrow',
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
            'image': './assets/characters/Bill.png',
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
        'developer_art': {
            'name': 'Developer Art',
            'desc': 'The original Bill in all his glory',
            'group': 'developer_art',

            'rename': false,
            'image': './assets/theme/developer_art/Bill.png',
        },
    },
    belle: {
        'default': {
            'name': 'Belle (Default)',
            'desc': 'Belle is also a fan of carrots, but I think she\'s just here because Bill is.',
            'group': 'default',

            'rename': 'Belle',
            'image': './assets/characters/Belle.png',
        },
        'grandma_belle': {
            'name': 'Grandma Belle',
            'preview': './assets/theme/cookie/grandma_belle.png',
            'desc': 'No you can\'t buy more grandmas, what kind of question is that?',
            'group': 'cookie',

            'rename': 'Grandma Belle',
            'image': './assets/theme/cookie/grandma_belle.png',
        },
        'developer_art': {
            'name': 'Developer Art',
            'desc': 'The original Belle in all her glory',
            'group': 'developer_art',

            'rename': false,
            'image': './assets/theme/developer_art/Belle.png',
        },
        'bill': {
            'name': 'Bill',
            'desc': 'Return to Bill.',
            'group': 'bill',
            
            'rename': 'Bill',
            'image': './assets/characters/Bill.png',
        },
    },
    greg: {
        'default': {
            'name': 'Greg (Default)',
            'desc': 'A professional blacksmith, Greg can turn carrots into farming implements. I\'m not sure how he does it.',
            'group': 'default',

            'rename': 'Greg',
            'image': './assets/characters/Greg.png',
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
        'developer_art': {
            'name': 'Developer Art',
            'desc': 'The original Greg in all his glory',
            'group': 'developer_art',

            'rename': false,
            'image': './assets/theme/developer_art/Greg.png',
        },
        'bill': {
            'name': 'Bill',
            'desc': 'Return to Bill.',
            'group': 'bill',

            'rename': 'Bill',
            'image': './assets/characters/Bill.png',
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
        'developer_art': {
            'name': 'Developer Art',
            'desc': 'The original Charles in all his glory',
            'group': 'developer_art',

            'rename': false,
            'image': './assets/theme/developer_art/Charles.png',
        },
        'bill': {
            'name': 'Bill',
            'desc': 'Return to Bill.',
            'group': 'bill',

            'rename': 'Bill',
            'image': './assets/characters/Bill.png',
        },
    },
    carl: {
        'default': {
            'name': 'Carl (Default)',
            'desc': 'Carl likes to paint almost as much as he likes carrots.',
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
        'developer_art': {
            'name': 'Developer Art',
            'desc': 'The original Carl in all his glory',
            'group': 'developer_art',

            'rename': false,
            'image': './assets/theme/developer_art/Carl.png',
        },
        'bill': {
            'name': 'Bill',
            'desc': 'Return to Bill.',
            'group': 'bill',

            'rename': 'Bill',
            'image': './assets/characters/Bill.png',
        },
    },
    jared: {
        'default': {
            'name': 'Jared (Default)',
            'desc': 'Jared has never been involved in a controversy',
            'group': 'default',

            'rename': 'Jared',
            'image': './assets/characters/Jared.png',
        },
        'developer_art': {
            'name': 'Developer Art',
            'desc': 'The original Jared in all his glory',
            'group': 'developer_art',

            'rename': false,
            'image': './assets/theme/developer_art/Jared.png',
        },
        'bill': {
            'name': 'Bill',
            'desc': 'Return to Bill.',
            'group': 'bill',

            'rename': 'Bill',
            'image': './assets/characters/Bill.png',
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
            'desc': 'Quite fertile',

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
            'desc': 'Best tool in the game',
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
            'preview': './assets/characters/Bill.png',
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
        if(target[target.keys[c]].hidden) continue;
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

class achievement {
    constructor(data) {
        // Stack data
        let combined = {
            ...{ // Defaults
                name: 'name',
                desc: 'description',
                image: false,
                reward: false,
                pages: false,
                conditions: false,

                hide_name: true,
                hide_desc: false,
                hide_image: false,
                hide_toast: false,
                internal: false,
            },
            ...data,
        }
        for(const key in combined) this[key] = combined[key];
    }
}

// For the conditions parameter:
// - First (0) value is the variable you want to test- will also accept a function
// - Second (1) value is the minimum required for the achievement (at the moment it will only test if the FIRST is greater than or equal to the SECOND)
// If you need to test for anything other than if FIRST >= SECOND you can simply use a function and only return a passing number if it comes out to true
const achievements = {
    // Carrots
    '1_carrot': new achievement({
        name: 'Farming is hard',
        desc: 'Your first Carrot!',
        image: './assets/achievements/1_carrot.png',
        conditions: ['player.lifetime.carrots', 1],
        hide_name: false,
    }),
    'bill_lvl_2': new achievement({
        'name': 'Two\'s Company',
        'desc': 'Upgrade Bill and attract the attention of another farmer',
        'image': './assets/achievements/bill_and_belle.png',
        'reward': 'character:belle',
        'conditions': ['Boomer_Bill.lvl', 2],
    }),
    '5000_carrot': new achievement({
        'name': 'Heavy Metal',
        'desc': 'Earn enough carrots to get the attention of a blacksmith',
        'image': './assets/achievements/unlock_greg.png',
        'reward': 'character:greg',

        'conditions': ['player.lifetime.carrots', 5000],
    }),
    'themery': new achievement({
        'name': 'Taking in the Themery',
        'desc': 'Gain the attention of the artist',
        'image': './assets/achievements/themery.png',
        'reward': 'character:carl',
        'conditions': [
            ['carlItemsAvailable()', 3],
            ['player.cash', 6],
        ],
    }),

    // Prestiging
    '1_prestige': new achievement({
        name: 'Prestigious',
        desc: 'Prestige for the first time and attract the attention of the professor',
        image: './assets/achievements/prestige_once.gif',
        reward: [
            'character:charles',
            'shop:theme/theme_bw',
        ],
        pages: 5,
        conditions: ['player.lifetime.prestige_count', 1],
        hide_image: true,
    }),
    'hire_jared': new achievement({
        'name': 'One Man\'s Trash',
        'desc': 'Hire the shopkeep',
        'image': './assets/characters/Jared.png',
        'reward': 'character:jared',
        'pages': 1,
        'conditions': ['player.characters.jared', true],
        hide_image: true,
    }),
    '10_prestiges': new achievement({
        'name': 'Wibbly Wobbly',
        'desc': 'Prestige ten times',
        'image': './assets/achievements/wobbly.gif',
        'reward': () => { mouseConfetti([24,24], confettiColors, 300) },
        'pages': 5,
        'conditions': ['player.lifetime.prestige_count', 10],
        hide_image: true,
    }),
    'use_charles': new achievement({
        'name': 'Raw Knowledge',
        'desc': 'Give Charles a Golden Carrot in exchange for his knowledge',
        'image': './assets/achievements/tome animated.gif',
        'reward': [
            'shop:theme/theme_terminal',
            'shop:cosmetic/farmable/ascii',
            'shop:cosmetic/farmable/ascii_color',
        ],
        'pages': 1,
        'conditions': [`(
            Charles.improveWorkingConditions.value > Default_Charles.improveWorkingConditions.value
            || Charles.betterHoes.value > Default_Charles.betterHoes.value
            || Charles.decreaseWages.value > Default_Charles.decreaseWages.value
            )`, 1],
        hide_image: true,
    }),

    // Tome types
    '1_improve_working_conditions': new achievement({
        'name': 'OSHA Violator',
        'desc': 'Buy a tome that improves working conditions. Your workers are now safe.',
        'image': './assets/achievements/working_conditions.png',
        'reward': 'shop:cosmetic/greg/safety_greg',

        'conditions': ['Charles.improveWorkingConditions.value', 1],
        hide_image: true,
    }),
    '1_improve_hoe_costs': new achievement({
        'name': 'Divine Intervention',
        'desc': 'Buy a tome that improves tool quality. Unholy magic, I say.',
        'image': './assets/achievements/tome_improve_hoe_costs.png',
        'conditions': ['Charles.betterHoes.value', 1],
        hide_image: true,
    }),
    '1_decrease_wages': new achievement({
        'name': 'Dollar Bill',
        'desc': 'Buy a tome that reduces worker wages. Cheapskate.',
        'image': './assets/achievements/tome_decrease_wages.png',
        'reward': 'shop:cosmetic/bill/dollar_bill',
        'conditions': ['Charles.decreaseWages.value', 1],
        hide_image: true,
    }),

    // Number of tomes
    '12_tomes': new achievement({
        'name': 'Tome\'d You so',
        'desc': 'Obtain 12 tomes',
        'image': './assets/achievements/tome animated.gif', // needs unique art
        'reward': 'cosmetic:charles/special_charles',
        'pages': 3,
        'conditions': ['player.lifetime.tomes_bought', 12],
        hide_image: true,
    }),
    '24_tomes': new achievement({
        'name': 'Librarian',
        'desc': 'Obtain 24 tomes',
        'image': './assets/achievements/tome animated.gif', // needs unique art
        'pages': 4,
        'conditions': ['player.lifetime.tomes_bought', 24],
        hide_image: true,
    }),
    '140_tomes': new achievement({
        'name': 'Infinite Library',
        'desc': 'Obtain 140 tomes',
        'image': './assets/achievements/tome animated.gif', // needs unique art
        'pages': 5,
        'conditions': ['player.lifetime.tomes_bought', 140],
        hide_image: true,
    }),

    // Tome pages tutorial message
    'first_tome_page': new achievement({
        'name': 'Paginator',
        'desc': 'Earn a tome page (Tutorial milestone)',
        'image': './assets/achievements/paginator.png',
        'reward': () => {
            toast(...toasts.tutorial_pages);
        },
        'conditions': ['player.pages', 1],
        hide_image: true,
        hide_toast: true,
    }),

    // Character usage
    'upgrade_all_characters_once': new achievement({
        'name': '3 Heads Are Better Than One',
        'desc': 'Upgrade every (upgradeable) character at least once',
        'image': './assets/achievements/3_heads.png',
        'reward': ['shop:theme/theme_red', 'shop:theme/theme_green', 'shop:theme/theme_blue'],
        'conditions': [
            ['Boomer_Bill.lvl',      2],
            ['Gregory.lvl',          1],
            ['Belle_Boomerette.lvl', 1],
        ],

    }),
    // Bill level
    'bill_lvl_10': new achievement({
        'name': 'Here\'s the Bill',
        'desc': 'Upgrade Bill to level 10',
        'image': './assets/achievements/bill_pointer.png', // needs unique art
        'reward': 'shop:cosmetic/bill/biker_bill',
        'conditions': ['Boomer_Bill.lvl', 10],
    }),
    'bill_lvl_100': new achievement({
        'name': 'Bill of the Century',
        'desc': 'Upgrade Bill to level 100',
        'image': './assets/achievements/bill_pointer.png',
        'reward': 'cosmetic:bundle/bill',
        'pages': 1,
        'conditions': ['Boomer_Bill.lvl', 100],
        hide_image: true,
    }),
    'bill_lvl_500': new achievement({
        'name': 'Billtona 500',
        'desc': 'Upgrade Bill to level 500',
        'image': './assets/achievements/bill_pointer.png', // needs unique art
        'pages': 2,
        'conditions': ['Boomer_Bill.lvl', 500],
        hide_image: true,
    }),
    'bill_lvl_1000': new achievement({
        'name': 'Milennial Bill',
        'desc': 'Upgrade Bill to level 1000',
        'image': './assets/achievements/bill_pointer.png', // needs unique art
        'pages': 3,
        'conditions': ['Boomer_Bill.lvl', 1000],
        'style': 'secret',
        hide_image: true,
        hide_list: true,
    }),
    // Belle level
    'belle_lvl_15': new achievement({
        'name': 'Saved by the Belle',
        'desc': 'Upgrade Belle to level 15',
        'image': './assets/characters/Belle.png', // needs unique art
        'conditions': ['Belle_Boomerette.lvl', 15],
    }),
    'belle_lvl_100': new achievement({
        'name': 'Tough Belle',
        'desc': 'Upgrade Belle to level 100',
        'image': './assets/characters/Belle.png', // needs unique art
        'pages': 1,
        'conditions': ['Belle_Boomerette.lvl', 100],
        hide_image: true,
    }),
    'belle_lvl_500': new achievement({
        'name': 'Um-belle-ifer Sellerer',
        'desc': 'Upgrade Belle to level 500',
        'image': './assets/characters/Belle.png', // needs unique art
        'pages': 3,
        'conditions': ['Belle_Boomerette.lvl', 500],
        hide_image: true,
    }),
    // Greg level
    'greg_lvl_25': new achievement({
        'name': 'The Gregs of Defeat', // alternatively "The Gregs of Society"
        'desc': 'Upgrade Gregory to level 25',
        'image': './assets/characters/Greg.png', // needs unique art
        'conditions': ['Gregory.lvl', 25],
    }),
    'greg_lvl_64': new achievement({
        'name': 'Professional Crafter',
        'desc': 'Upgrade Gregory to level 64',
        'image': './assets/achievements/pixel_block.png',
        'reward': [
            'theme:theme_blockgame',
            'cosmetic:bundle/blockgame',
            'shop:cosmetic/farmable/blockgame_potato'
        ],
        'pages': 1,
        'conditions': ['Gregory.lvl', 64],
        hide_image: true,
    }),
    'unlock_all_characters': new achievement({
        'name': 'Carrot Convention',
        'desc': 'Unlock every character',
        'reward': [
            'cash:24',
            'shop:cosmetic/carl/joker_carl',
            'shop:cosmetic/bundle/xmas',
        ],
        'pages': 5,
        'conditions': ['allCharQuery()', true],
    }),

    // Big carrot numbers
    '401000_carrot': new achievement({
        'name': 'Retirement Fund',
        'desc': 'Earn 401k carrots. I don\'t think you know what a 401k is.',
        'image': './assets/achievements/401k.png',
        'reward': [
            'shop:theme/theme_camo',
            () => { mouseConfetti([24,24], confettiColors, 300) },
        ],
        'conditions': ['player.lifetime.carrots', 401000],
    }),
    '1_million_carrots': new achievement({
        'name': 'Me Millionth Carrot',
        'desc': 'Earn your 1 millionth carrot',
        'image': './assets/achievements/1_million_carrots.png',
        'reward': () => { mouseConfetti([24,24], confettiColors, 300) },
        'pages': 1,
        'conditions': ['player.lifetime.carrots', 1000000],
    }),
    '1_billion_carrots': new achievement({
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
        hide_image: true,
    }),
    '1_trillion_carrots': new achievement({
        'name': 'Lifetime Supply',
        'desc': 'Earn your 1 trillionth carrot. Phew!',
        'image': './assets/achievements/carrot_pile.png',
        'reward': [
            'shop:cosmetic/bundle/plumber',
            () => { mouseConfetti([24,24], confettiColors, 300) },
        ],
        'pages': 3,
        'conditions': ['player.lifetime.carrots', 1000000000000],
        hide_image: true,
    }),
    '1_quadrillion_carrots': new achievement({
        'name': 'Carrot Continent',
        'desc': 'Earn your 1 quadrillionth carrot. That\'s a lot!',
        'image': './assets/achievements/Carrot Continent.png',
        'reward': [
            'shop:cosmetic/bundle/developer_art',
            'shop:cosmetic/tools/fertilizer',
            () => { mouseConfetti([24,24], confettiColors, 300) },
        ],
        'pages': 3,
        'conditions': ['player.lifetime.carrots', 1000000000000000],
        hide_image: true,
    }),
    '1_quintillion_carrots': new achievement({
        'name': 'A World Fed',
        'desc': 'Earn your 1 QUINTILLIONTH carrot. Earth\'s hunger problem is now solved.',
        'image': './assets/achievements/earth.png',
        'reward': () => { mouseConfetti([24,24], confettiColors, 300) },
        'pages': 3,
        'conditions': ['player.lifetime.carrots', 1000000000000000000n],
        'style': 'endgame',
        hide_image: true,
    }),
    '1_sextillion_carrots': new achievement({
        'name': 'Carrot Singularity',
        'desc': 'Earn your 1 SEXTILLIONTH carrot. We\'re on the verge of something beautiful.',
        'image': './assets/achievements/singularity.png',
        'reward': () => { mouseConfetti([24,24], confettiColors, 300) },
        'pages': 4,
        'conditions': ['player.lifetime.carrots', 1000000000000000000000n],
        'style': 'secret',
        hide_image: true,
        hide_list: true,
    }),
    '1_septillion_carrots': new achievement({
        'name': 'Carrot Nebula',
        'desc': 'Earn your 1 SEPTILLIONTH carrot. The culmination of our efforts.',
        'reward': () => { mouseConfetti([24,24], confettiColors, 300) },
        'pages': 4,
        'conditions': ['player.lifetime.carrots', 1000000000000000000000000n],
        'style': 'secret',
        hide_image: true,
        hide_list: true,
    }),
    '1_octillion_carrots': new achievement({
        'name': 'Carrot Galaxy',
        'desc': 'Earn your 1 OCTILLIONTH carrot. Something bigger than us has taken notice.',
        'reward': () => { mouseConfetti([24,24], confettiColors, 300) },
        'pages': 4,
        'conditions': ['player.lifetime.carrots', 1000000000000000000000000000n],
        'style': 'secret',
        hide_image: true,
        hide_list: true,
    }),
    '1_nonillion_carrots': new achievement({
        'name': 'Carrot Universe',
        'desc': 'Earn your 1 NONILLIONTH carrot. There is not a single non-carrot molecule in the universe. Besides you of course.',
        'reward': () => { mouseConfetti([24,24], confettiColors, 300) },
        'pages': 5,
        'conditions': ['player.lifetime.carrots', 1000000000000000000000000000000n],
        'style': 'secret',
        hide_image: true,
        hide_list: true,
    }),
    '1_decillion_carrots': new achievement({
        'name': 'Carrot Multiverse',
        'desc': 'Earn your 1 DECILLIONTH carrot. Finding new places to put them I see.',
        'reward': () => { mouseConfetti([24,24], confettiColors, 300)},
        'pages': 5,
        'conditions': ['player.lifetime.carrots', 1000000000000000000000000000000000n],
        'style': 'secret',
        hide_image: true,
        hide_list: true,
    }),
    '1_undecillion_carrots': new achievement({
        'name': 'Carrot God', // Carrot God / Hoe God
        'desc': 'Earn your 1 UNDECILLIONTH carrot. You\'ve surpassed a higher state of being and become something greater...',
        'reward': () => { mouseConfetti([24,24], confettiColors, 300)},
        'pages': 5,
        'conditions': ['player.lifetime.carrots', 1000000000000000000000000000000000000n],
        'style': 'secret',
        hide_image: true,
        hide_list: true,
    }),
    '1_duodecillion_carrots': new achievement({
        'name': 'Carrot Big Bang',
        'desc': 'Earn your 1 DUODECILLIONTH carrot. Must create...',
        'reward': () => { mouseConfetti([24,24], confettiColors, 300)},
        'pages': 6,
        'conditions': ['player.lifetime.carrots', 1000000000000000000000000000000000000000n],
        'style': 'secret',
        hide_list: true,
    }),
    '1_tredecillion_carrots': new achievement({
        'name': 'Carrot Timelines',
        'desc': 'Earn your 1 TREDECILLIONTH carrot. Everywhere and everytime.',
        'reward': () => { mouseConfetti([24,24], confettiColors, 300)},
        'pages': 6,
        'conditions': ['player.lifetime.carrots', 1000000000000000000000000000000000000000000n],
        'style': 'endgame',
        'style': 'secret',
        hide_list: true,
    }),

    // Misc
    '5000000_idle_carrots': new achievement({
        'name': 'On the Clock',
        'desc': 'Earn 5,000,000 carrots with CPS',
        'image': './assets/achievements/clock.png',
        'pages': 2,
        'conditions': ['player.lifetime.idle_carrots', 5000000],
    }),
    '1_trillion_carrots_at_once': new achievement({
        'name': 'Trillionwhere?',
        'desc': 'Have 1 trillion carrots at once',
        'pages': 3,
        'conditions': ['player.carrots', 1000000000000],
    }),
    '1_quadrillion_carrots_at_once': new achievement({
        'name': 'Quadraphonic ',
        'desc': 'Have 1 quadrillion carrots at once',
        'pages': 4,
        'conditions': ['player.carrots', 1000000000000000],
    }),

    // Tips
    'basic_tips': new achievement({
        'name': 'Tip of the Iceberg',
        'desc': 'Read all basic tips. Carrot Clicker Iceberg Explained.',
        'conditions': ['ex_allTips()', 2],
        hide_name: false,
    }),
    'all_tips': new achievement({
        'name': 'Professor',
        'desc': 'Read every tip',
        'pages': 5,
        'conditions': ['ex_allTips()', tl.length],
    }),

    // CPC
    '9000_cpc': new achievement({
        'name': 'There\'s a Joke Here Somewhere',
        'desc': 'Get your Carrots Per Click (Click power level\™️) over 9000',
        'image': './assets/achievements/9000.png',
        'reward': 'shop:theme/theme_chatapp',
        'pages': 1,
        'conditions': ['player.cpc', 9000],
    }),
    '1_billion_cpc': new achievement({
        'name': 'Carrot Printer',
        'desc': 'Get your Carrots Per Click (CPC) to 1 billion',
        'pages': 2,
        'conditions': ['player.cpc', 1000000000],
    }),
    '1_trillion_cpc': new achievement({
        'name': 'Trilobite',
        'desc': 'Get your Carrots Per Click (CPC) to 1 trillion',
        'pages': 3,
        'conditions': ['player.cpc', 1000000000000],
    }),

    // CPS
    '1000_cps': new achievement({
        'name': 'Time is Hungry',
        'desc': 'Produce 1,000 carrots every second',
        'reward': 'shop:cosmetic/bill/business_bill',
        'conditions': ['player.cps', 1000],
    }),
    '100000_cps': new achievement({
        'name': 'Six Figure Income',
        'desc': 'Get your Carrots Per Second above 100,000',
        'pages': 3,
        'conditions': ['player.cps', 100000],
    }),
    'greg_debt': new achievement({
        'name': 'IOU',
        'desc': 'Have fewer than 1000 carrots while Greg is crafting',
        'conditions': ['player.carrots < 1000 && Gregory.crafting !== false', true],
    }),

    // Falling carrots
    '50_falling_carrots': new achievement({
        'name': 'Free Falling',
        'desc': 'Grab 50 falling carrots',
        'image': './assets/achievements/parachute_carrot.png',
        'conditions': ['player.lifetime.falling_carrots_grabbed', 50],
    }),
    '250_falling_carrots': new achievement({
        'name': 'Carrot Rain',
        'desc': 'Grab 250 falling carrots',
        'reward': 'shop:cosmetic/bundle/cookie',
        'pages': 1,
        'conditions': ['player.lifetime.falling_carrots_grabbed', 250],
    }),
    '2048_falling_carrots': new achievement({
        'name': 'Falling Into Place',
        'desc': 'Grab 2048 falling carrots',
        'image': './assets/achievements/tetris.gif',
        'pages': 3,
        'conditions': ['player.lifetime.falling_carrots_grabbed', 2048],
        hide_image: true,
    }),

    // Clicks
    '500_clicks': new achievement({
        'name': 'Click the Carrot, Bill.',
        'desc': 'Click the carrot 500 times',
        'image': './assets/achievements/12_clicks_per_second.png', // needs unique art
        'conditions': ['player.lifetime.clicks', 500],
    }),
    '5000_clicks': new achievement({
        'name': 'Clicker Hero',
        'desc': 'Click the carrot 5,000 times',
        'image': './assets/achievements/12_clicks_per_second.png', // needs unique art
        'reward': 'shop:cosmetic/farmable/pixel_carrot',
        'conditions': ['player.lifetime.clicks', 5000],
    }),
    '50000_clicks': new achievement({
        'name': 'Destroyer of Mice',
        'desc': 'Click the carrot 50,000 times',
        'image': './assets/achievements/12_clicks_per_second.png', // needs unique art
        'conditions': ['player.lifetime.clicks', 50000],
    }),
    '100000_clicks': new achievement({
        'name': '"My Finger Hurts"',
        'desc': 'Click the carrot 100,000 times',
        'image': './assets/achievements/12_clicks_per_second.png', // needs unique art
        'conditions': ['player.lifetime.clicks', 100000],
    }),
    '1000000_clicks': new achievement({
        'name': 'Clicker God',
        'desc': 'Click the carrot 1 million times (Hidden achievement)',
        'image': './assets/achievements/12_clicks_per_second.png', // needs unique art
        'conditions': ['player.lifetime.clicks', 1000000],
        'style': 'secret',
        hide_list: true,
    }),

    // Golden Carrots
    '50_golden_carrots': new achievement({
        'name': 'Golden',
        'desc': 'Earn 50 golden carrots',
        'image': './assets/achievements/golden.png',
        'reward': [
            'cosmetic:farmable/golden_carrot',
            'shop:cosmetic/farmable/pixel_golden_carrot',
            () => { mouseConfetti([24,24], confettiColors, 300) }
        ],
        'conditions': ['player.lifetime.golden_carrots', 50],
        hide_name: false,
    }),
    '500_golden_carrots': new achievement({
        'name': 'M[Au]numental',
        'desc': 'Earn 500 golden carrots',
        'image': './assets/achievements/gold_au.png',
        'pages': 2,
        'conditions': ['player.lifetime.golden_carrots', 500],
        hide_name: false,
    }),
    '1989_golden_carrots': new achievement({
        'name': 'Retro',
        'desc': 'Earn 1989 golden carrots',
        'image': './assets/theme/theme_retro.png',
        'reward': 'theme:theme_retro',
        'pages': 3,
        'conditions': ['player.lifetime.golden_carrots', 1989],
    }),

    // Cash
    '2000_lifetime_cash': new achievement({
        'name': 'Penny Pincher',
        'desc': 'Earn 2000 coins',
        'pages': 1,
        'conditions': ['player.lifetime.cash', 2000],
        hide_name: false,
    }),
    '250_cash': new achievement({
        'name': 'Savings Account',
        'desc': 'Have 250 coins in the bank without spending them',
        'pages': 1,
        'conditions': ['player.cash', 250],
        hide_name: false,
    }),

    // Trinkets
    '1_trinket': new achievement({
        'name': 'Not so Useless',
        'desc': 'Buy your first trinket',
        'image': './assets/achievements/Not So Useless.png',
        'pages': 1,
        'conditions': ['percentage(...player.trinket_completion.split("/"))', 0.001],
        hide_image: true,
    }),
    'all_trinkets': new achievement({
        'name': 'Complete Collection',
        'desc': 'Buy and fully upgrade every trinket',
        'image': './assets/achievements/Complete Collection.png',
        'pages': 10,
        'conditions': ['percentage(...player.trinket_completion.split("/"))', 100],
        'style': 'endgame',
        hide_image: true,
    }),

    // Misc
    '9_clicks_per_second': new achievement({
        'name': 'Gotta Grow Fast',
        'desc': 'Click 9 times in one second',
        'image': './assets/achievements/12_clicks_per_second.png',
        'conditions': ['player.clickSpeedRecord', 9],
    }),
    '13_clicks_per_second': new achievement({
        'name': 'Olympic Clicking Games',
        'desc': 'Click 13 times in one second',
        'image': './assets/achievements/16_clicks_per_second.png',
        'conditions': ['player.clickSpeedRecord', 13],
        hide_image: true,
    }),
    '15_clicks_per_second': new achievement({
        'name': 'I am Seed',
        'desc': 'Click 15 times in one second',
        'image': './assets/achievements/21_clicks_per_second.gif',
        'reward': 'cosmetic:farmable/cursor',
        'conditions': ['player.clickSpeedRecord', 15],
        hide_image: true,
    }),

    // Tools
    'first_tool': new achievement({
        'name': 'The Tools to Victory',
        'desc': 'Craft your first farming tool (Tutorial milestone)',
        'image': './assets/achievements/forge.png',
        'reward': () => { toast(...toasts.tutorial_tools); },
        'pages': 1,
        'conditions': ['player.lifetime.hoes.craftedTotal', 1],
        hide_image: true,
        hide_toast: true,
    }),
    'obtain_tool_six': new achievement({
        'name': 'Extreme Farming',
        'desc': 'Obtain the ultimate farming implement, the Gilded Hoe',
        'image': './assets/achievements/Extreme Farming.png',
        'reward': 'cosmetic:farmable/gilded_hoe',
        'pages': 10,
        'conditions': ['player.lifetime.hoes.crafted[5]', 1],
        hide_image: true,
    }),

    // Themes
    'all_themes': new achievement({
        'name': 'All Themes',
        'desc': 'Unlock every theme',
        'image': './assets/achievements/all_themes.png',
        'pages': 3,
        'conditions': ['player.themes.length', themesKeys.length],
    }),

    // Cosmetics
    'all_cosmetics': new achievement({
        'name': 'All Cosmetics',
        'desc': 'Unlock every cosmetic',
        'pages': 3,
        'conditions': ['percentage(playerCosmeticsCount(), totalCosmetics).toFixed(0)', 100],
    }),

    // Achievement achievements
    '50_percent_achievements': new achievement({
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
        hide_image: true,
    }),
    'all_normal_achievements': new achievement({
        'name': 'All Normal Achievements',
        'desc': 'Unlock every non-challenge achievement',
        'image': './assets/achievements/silver_medal.gif',
        'reward': [
            'shop:theme/theme_original',
            () => {
                let sc = toast("Congrats!", "Thanks for playing!", "cyan", true, false, false, false, () => { startCredits(sc); }, "View credits");
            }
        ],
        'pages': 10,
        'conditions': ['Math.round(percentage(Object.keys(player.achievements).length, achievementsKeys.length - hiddenAchievements - challengeAchievements - 3))', 100],
        // 'style': 'endgame',
        hide_image: true,
    }),

    // Challenge achievements
    '3_falling_consecutive': new achievement({
        'name': 'Match 3',
        'desc': 'Grab 3 falling carrots in a row',
        'reward': 'cash:12',
        'conditions': ['player.fallingConsecRecord', 3],
        'style': 'challenge',
        hide_image: true,
    }),
    '10_falling_consecutive': new achievement({ 
        'name': 'Carrot-ay',
        'desc': 'Grab 10 falling carrots in a row',
        'conditions': ['player.fallingConsecRecord', 10],
        'style': 'secret', // until boosts are added
        hide_list: true,
    }),
    'no_bonus_carrots_challenge': new achievement({
        'name': 'Fall Guy',
        'desc': 'Farm 500,000 carrots in a single prestige without catching a single falling carrot (Challenge achievement)',
        'image': './assets/achievements/no_falling_carrots.png',
        'reward': () => { mouseConfetti([24,24], confettiColors, 300) },
        'pages': 5,
        'conditions': ['(player.prestige.carrots >= 500000 && player.prestige.falling_carrots_grabbed === 0)', true],
        'style': 'challenge',
        hide_image: true,
    }),
    'no_bill_challenge': new achievement({
        'name': 'Have a Seat', // "Patience is free" -> "You\'re Free to Wait"
        'desc': 'Farm 2,500,000 carrots without upgrading Bill (Challenge achievement)',
        'image': './assets/achievements/chair.png',
        'reward': () => { mouseConfetti([24,24], confettiColors, 300)},
        'pages': 5,
        'conditions': ['(Boomer_Bill.lvl === 1 && player.prestige.carrots >= 2500000)', true],
        'style': 'challenge',
        hide_image: true,
    }),
    'no_belle_challenge': new achievement({
        'name': 'Off the Clock',
        'desc': 'Farm 5,000,000 carrots without Belle (Challenge achievement)',
        'image': './assets/achievements/broken_clock.png',
        'reward': () => { mouseConfetti([24,24], confettiColors, 300)},
        'pages': 5,
        'conditions': ['(Belle_Boomerette.lvl === 0 && player.prestige.carrots >= 5000000)', true],
        'style': 'challenge',
        hide_image: true,
    }),
    'no_hoes_challenge': new achievement({
        'name': 'Nonbeliever',
        'desc': 'Farm 5,000,000 carrots without crafting a single tool (Challenge achievement)',
        'reward': () => { mouseConfetti([24,24], confettiColors, 300)},
        'pages': 8,
        'conditions': ['(player.prestige.hoes.craftedTotal === 0 && player.prestige.carrots >= 5000000)', true],
        'style': 'challenge',
        hide_image: true,
    }),

    'all_achievements': new achievement({
        'name': 'Completionist', // Originally "Achievement Hunter"
        'desc': 'Unlock every achievement',
        'image': './assets/achievements/medal_spin_bg.gif',
        'reward': () => { mouseConfetti([24,24], confettiColors, 300) },
        'pages': 15,
        'conditions': ['Math.round(percentage(Object.keys(player.achievements).length, achievementsKeys.length - hiddenAchievements - 1))', 100],
        'style': 'endgame',
        hide_image: true,
    }),

    // Secret Achievements
    '100_falling_consecutive': new achievement({
        'name': 'Juggle Master',
        'desc': 'Grab 100 falling carrots in a row',
        'image': './assets/achievements/parachute_carrot.png', // needs unique art
        'conditions': ['player.fallingConsecRecord', 100],
        'style': 'secret',
        hide_list: true,
    }),
    'easter_egg_hunter': new achievement({
        'name': 'Easter Egg Hunter',
        'desc': 'Enter the Konami code, at least according to Wikipedia. There are multiple versions, apparently. (Hidden achievement)',
        'image': './assets/achievements/easter_egg.png',
        'reward': () => { mouseConfetti([24,24], confettiColors, 300) },
        'conditions': ['keyTrigger[0]', true],
        'style': 'secret',
        hide_desc: true,
        hide_image: true,
        hide_list: true,
    }),
    'pineapple': new achievement({
        'name': 'Pineapple',
        'desc': 'Hey that\'s me (Hidden achievement)',
        'image': './assets/achievements/pineapple_achieve.png',
        'reward': 'cosmetic:farmable/pineapple',
        'conditions': ['keyTrigger[3]', true],
        'style': 'secret',
        hide_desc: true,
        hide_image: true,
        hide_list: true,
    }),
    'egg_confetti': new achievement({
        'name': 'Confetti mode',
        'desc': 'Enable confetti mode by typing "confetti" (Hidden achievement)',
        'image': './assets/achievements/confetti_mode.png',
        'conditions': ['keyTrigger[5]', true],
        'style': 'secret',
        hide_desc: true,
        hide_image: true,
        hide_list: true,
    }),
    'footer_carrot_clicker': new achievement({
        'name': 'Carrot Clicker Clicker',
        'desc': 'Click the carrot in settings 100 times (Hidden achievement)',
        'image': './assets/achievements/footer_carrot.png',
        'conditions': ['easterEgg', 100],
        'style': 'secret',
        hide_desc: true,
        hide_image: true,
        hide_list: true,
    }),
    'not_funny': new achievement({
        'name': 'Not Funny',
        'desc': 'Upgrade Bill, Belle, and Greg to Level 69 (Hidden achievement)',
        'image': './assets/achievements/nice.png',
        'reward': () => {
            mouseConfetti([24,24], confettiColors, 300);
            unlock('cosmetic', 'upvote', 'farmable');
        },
        'conditions': ['(Boomer_Bill.lvl === 69 && Belle_Boomerette.lvl === 69 && Gregory.lvl === 69)', 1],
        'style': 'secret',
        hide_desc: true,
        hide_image: true,
        hide_list: true,
    }),
    'playtester': new achievement({
        'name': 'Early Playtester',
        'desc': 'Thanks for playtesting!',
        'image': './assets/achievements/early_playtester.png',
        'reward': [
            'theme:theme_classic',
            'cash:32',
        ],
        'conditions': ['0', 1],
        'conditions': ['store("playtest") === "yes" || player.flags["playtest"] === true', true],
        'style': 'shine',
        hide_desc: true,
        hide_image: true,
        hide_list: true,
    }),

    // Internal achievements- won't appear in game but it's way easier to use the achievements system to trigger certain events
    'internal_prestige_available': new achievement({
        'internal': true,
        'name': 'internal_prestige_available',
        'reward': () => {
            player.prestige_available = true;
            saveGame();
            seeButton('prestige');
            toast(...toasts.tutorial_prestige_available);
        },
        'conditions': ['(player.lifetime.golden_carrots > 0 || player.prestige_potential > 0)', true],
    }),
    'internal_jared_available': new achievement({
        'internal': true,
        'name': 'internal_jared_available',
        'reward': () => { unlock('character', 'jared', 'ready'); },
        'conditions': ['player.lifetime.carrots >= 5000000', true],
    }),
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
/** All tips (basic_tips, all_tips) */
function ex_allTips() {
    let tally = 0;
    for(i = 0; i < tl.length; i++) {
        let type = tl[i];
        if(Object.keys(tips.seen[type]).length === default_tips[type].length && Object.keys(tips.seen[`fun_${type}`]).length === default_tips[`fun_${type}`].length) {
            tally++;
        }
    }
    return tally;
}

/** Get total cosmetics count */
function playerCosmeticsCount() {
    let a = 0;
    for(i = 0; i < cosmeticsKeys.length; i++) a += player.cosmetics[cosmeticsKeys[i]].length - 1;
    return a;
}
//#endregion







// Static character data
//#region 
// Shop info (Static)
const jaredShop = {
    // 'mp3_player': {
    //     name:      'MP3 Player',
    //     desc:      'Seems to have some old music on it',
    //     img:       './assets/items/trinkets/tome_tools.png',
    //     currency:  'cash',
    //     price:     [50],
    //     value:     [false, true],
    //     written:   '',
    // },
    'clickrate': {
        name:      'Golden Mouse',
        desc:      'Increases hold-to-click speed',
        img:       './assets/items/trinkets/mouse_2.png',
        currency:  'cash',
        price:     [   5, 10, 25, 45, 70, 100, 135],
        value:     [2, 3,  4,  5,  6,  7,   8,   9],
        written:   '@ clicks/s',
    },
    'level_up_discount': {
        name:      'Coupon Book',
        desc:      'Decreases level up prices',
        img:       './assets/items/trinkets/coupon_book.png',
        currency:  'cash',
        price:     [     89, 112, 160, 204, 245, 289, 344, 402, 460, 540],
        value:     [100, 95,  90,  85,  80,  75,  70,  65,  60,  55,  50],
        written:   '@%',
        update:    () => { characterPrices(); }
    },
    'belle_bonus': {
        name:      'Synergy Drink',
        desc:      'Increases Belle\'s output while the carrot is being clicked',
        img:       './assets/items/trinkets/synergy.png',
        currency:  'cash',
        price:     [   24, 32, 40, 50,   65,  80,  95, 120, 150, 185],
        value:     [0, 25, 50, 75, 100, 125, 150, 175, 200, 225, 250],
        written:   '+@%',
    },
    // 'greg_slots': { // scrapped because of how craft speed works- may add later but probably wouldnt be any good
    //     name:      'greg_slots',
    //     desc:      'Gives Greg an additional slot, which allows multiple tools to be crafted at once.',
    //     img:       './assets/achievements/missing.png',
    //     currency:  'cash',
    //     price:     [200],
    //     value:     [2],
    //     written:   '@ slots',
    // },
    'tool_slots': {
        name:      'Tool Box',
        desc:      'Gives all characters additional tool slots on top of Greg\'s level',
        img:       './assets/items/trinkets/tool_box.png',
        currency:  'cash',
        price:     [   76, 86, 96, 106, 120, 144, 196, 218, 242, 328/*, 362, 400*/],
        value:     [0,  1,  2,  3,   4,   5,   6,   7,   8,   9,  10],
        written:   '+@ slots',
        update:    () => { updateAllTools(); },
    },
    'greg_speed': {
        name:      'Propane Tank',
        desc:      'Increases Greg\'s crafting speed',
        img:       './assets/items/trinkets/propane.png',
        currency:  'cash',
        price:     [     12,  20, 38, 53, 68, 86, 121],
        value:     [1, 1.25, 1.5,  2,  3,  5,  7,  10], // Craft - cycles per second divided by 10
        written:   'x@',
    },
    'greg_min_start': {
        name:      'Credit Card',
        desc:      'Allows Greg to craft a tool before you can afford it. Percent value is how much of the tool\'s cost you need to start crafting.',
        img:       './assets/items/trinkets/credit.png',
        currency:  'cash',
        price:     [     40, 47, 54, 61, 68],
        value:     [100, 90, 80, 70, 60, 50],
        written:   '@%',
        update:    () => { updateAllTools(); }
    },
    'falling_bonus': {
        name:      'Cistern',
        desc:      'Increases falling carrot rewards',
        img:       './assets/items/trinkets/cistern.png',
        currency:  'cash',
        price:     [   60, 112, 163, 252, 309],
        value:     [0, 20,  40,  60,  80, 100],
        written:   '+@%',
    },
    'page_bonus': {
        name:      'Origami',
        desc:      'Increases your tome pages\' prestige buff',
        img:       './assets/items/trinkets/origami.png',
        currency:  'cash',
        price:     [   100, 133, 167, 202, 240, 281, 324, 363, 415, 471],
        value:     [1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9,   2],
        written:   '+@%/page',
        update:    () => { calculatePrestigePotential(); }
    },
    'magic_keyboard': {
        name:      'Magic Keyboard',
        desc:      'Allows the use of spacebar and click at the same time. Secondary ability: you can queue equip a tool if Greg has none ready.', // allows you to single-click to craft & equip tools when Greg has none to give
        img:       './assets/items/trinkets/keyboard_2.png',
        currency:  'cash',
        price:     [       100],
        value:     [false, true],
        written:   '',
    },
    // 'paperclip': {
    //     name:      'Paperclip',
    //     desc:      'Seems to be useless, aside from holding your papers together. Why would you buy these?',
    //     img:       './assets/achievements/missing.png',
    //     currency:  'cash',
    //     price:     [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
    //     value:     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    //     written:   '',
    // },
    // 'fake_trophy': {
    //     name:      'Fake Trophy',
    //     desc:      'It\'s plastic.',
    //     img:       './assets/achievements/missing.png',
    //     currency:  'cash',
    //     price:     [350],
    //     value:     [true],
    //     written:   '',
    // },
    // Dreamcatcher?
}
jaredShop.keys = Object.keys(jaredShop);
//#endregion



/* Boosts */
//#region 
const boosts = {
    // CPC
    'cpc_2x': {
        name: 'Click doubler',
        desc: 'Double CPC for 2 minutes',
        img: './assets/pixel_carrot_32x.png',

        type: 'cpc',
        multiplier: 2,
        time: 120, // seconds

        currency: 'gc',
        price: 3,
    },
    'cpc_5x': {
        name: 'Click x5',
        desc: 'desc',
        img: './assets/pixel_carrot_32x.png',

        type: 'cpc',
        multiplier: 5,
        time: 60,

        currency: 'gc',
        price: 6,
    },
    'cpc_15x': {
        name: 'CPC x15',
        desc: '15x CPC for 30 seconds',
        img: './assets/pixel_carrot_32x.png',

        type: 'cpc',
        multiplier: 2,
        time: 30,

        currency: 'gc',
        price: 6,
    },
    // 'cpc_10000x': {
    //     name: 'cpc_10000x',
    //     desc: 'desc',
    //     img: './assets/pixel_carrot_32x.png',

    //     type: 'cpc',
    //     multiplier: 10000,
    //     time: 10,

    //     currency: 'gc',
    //     price: 6000,
    // },

    // CPS
    'cps_2x': {
        name: 'cps_2x',
        desc: 'desc',
        img: './assets/pixel_carrot_32x.png',

        type: 'cps',
        multiplier: 2,
        time: 60,

        currency: 'gc',
        price: 3,
    },
    'cps_10x': {
        name: 'cps_10x',
        desc: 'desc',
        img: './assets/pixel_carrot_32x.png',

        type: 'cps',
        multiplier: 10,
        time: 60,

        currency: 'gc',
        price: 8,
    },
    'cps_1000x': {
        name: 'cps_1000x',
        desc: 'desc',
        img: './assets/pixel_carrot_32x.png',

        type: 'cps',
        multiplier: 10,
        time: 15,

        currency: 'gc',
        price: 300,
    },

    // Falling carrot chance
    'fc_2x': {
        name: 'Rain Song',
        desc: '2x falling carrot chance for 5 minutes',
        img: './assets/boosts/falling.png',

        type: 'fc_chance',
        multiplier: 2,
        time: 300,

        // currency: 'gc',
        // price: 300,
    },
    'fc_5x': {
        name: 'fc_5x',
        desc: '5x falling carrot chance for 2 minutes',
        img: './assets/boosts/falling.png',

        type: 'fc_chance',
        multiplier: 5,
        time: 120,

        // currency: 'gc',
        // price: 300,
    },
    'fc_10x': {
        name: 'Carrot Storm',
        desc: '10x falling carrot chance for 1 minute',
        img: './assets/boosts/falling.png',

        type: 'fc_chance',
        multiplier: 10,
        time: 60,

        // currency: 'gc',
        // price: 300,
    },
    'fc_frenzy': {
        name: 'Falling Frenzy',
        desc: 'Falling Carrots are guaranteed',
        img: './assets/boosts/falling.png',

        type: 'fc_chance',
        multiplier: 1000,
        time: 10,

        // currency: 'gc',
        // price: 1000,
    },
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
