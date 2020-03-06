const User = require('../models/User');

const search = async(word) => {
    console.log('searchMiddleware[search]');
    let response = await User.find({ $or: [{keywords: {$regex:`.*${word}.*`}}, {username: {$regex:`.*${word}.*`}}]});
    return response;
}

module.exports = {
    search: search
}
