const searchMiddleware = require('../middleware/search');
const contentMiddleware = require('../middleware/content');

const handleSearch = async(req, res) => {
    console.log('searchController[handleSearch]');
    let str = req.query.word;
    let results = await searchMiddleware.search(str);
    results = await addProfile(results);
    console.log('Founded: '+results.length);
    res.json(results);
}

const addProfile = (arrUsers) => {
    return new Promise(async(resolve) => {
        let newArr = [];
        await arrUsers.map(async(user, i) => {
            let profileUser = await contentMiddleware.getSingleContent(user.profileImage);
            newArr.push(Object.assign(user, {profileImage: profileUser}));
            if(i == arrUsers.length-1) {
                resolve(newArr);
            }
        });
    })
}

module.exports = {
    handleSearch: handleSearch
}
