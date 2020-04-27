const searchMiddleware = require('../middleware/search');
const contentMiddleware = require('../middleware/content');

const handleSearch = async(req, res) => {
    console.log('searchController[handleSearch]');
    let str = req.query.word;
    let results = await searchMiddleware.search(str);
    console.log('Founded: '+results.length);
    res.json(results);
}

module.exports = {
    handleSearch: handleSearch
}
