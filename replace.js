const replace = require('replace-in-file');
const options = {
    files: 'smzdm_mission.js',
    from: /let clickFavArticleMaxTimes = 7;/,
    to: `clickGoBuyMaxTimes = 10 + Math.floor(Math.random() * 6);
clickLikeProductMaxTimes = 5 + Math.floor(Math.random() * 8);
clickLikeArticleMaxTimes = 5 + Math.floor(Math.random() * 8);
let clickFavArticleMaxTimes = 5 + Math.floor(Math.random() * 8);`
};
const options2 = {
    files: 'smzdm_*.js',
    from: /magicJS.read\(smzdmCookieKey\);/,
    to: `process.env.COOKIE;`
};

(async () => {
    try {
        let results = await replace(options)
        console.log('Replacement results:', results);
        results = await replace(options2)
        console.log('Replacement results:', results);
    }
    catch (error) {
        console.error('Error occurred:', error);
    }
})();