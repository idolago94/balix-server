const Admin = require('../models/Admin');
const bcryptMiddleware = require('./bcrypt');

const save = async(adminData) => {
    let hashPass = bcryptMiddleware.hash(adminData.password);
    let newAdmin = new Admin({
        full_name: adminData.full_name,
        username: adminData.username,
        password: hashPass
    });
    let result = await newAdmin.save();
    return result;
}

const auth = async(username, password) => {
    let admin = await getAdminByUsername(username);
    console.log(admin);
    if(admin.length <= 0) {
        return false;
    }
    let pass = bcryptMiddleware.checkPassword(password, admin[0].password);
    return pass;
}

const getAdminByUsername = async(username) => {
    let admin = await Admin.find({username: username});
    return admin;
}

const getAll = async() => {
    let response = await Admin.find();
    return response;
}

module.exports = {
    save,
    auth,
    getAdminByUsername,
    getAll
}
