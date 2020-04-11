const bcrypt = require('bcrypt');

const hash = password => {
    console.log('bcryptMiddleware[hash]');
    let salt = bcrypt.genSaltSync(5);
    let hashPass = bcrypt.hashSync(password, salt);
    return hashPass;
}

const checkPassword = (password, hashPassword) => {
    console.log('bcryptMiddleware[checkPassword]');
    let check = bcrypt.compareSync(password, hashPassword);
    return check;
}

module.exports = {hash, checkPassword};