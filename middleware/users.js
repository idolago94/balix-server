
const User = require('../models/User');
const fileMiddleware = require('./files');
const convert = require('./convert');
const URL = require('../helpers/path');
const bcryptMiddleware = require('./bcrypt');

const usernameExist = async(username) => {
    console.log('userMiddleware[usernameExist]');
    let user = await User.findOne({username: username});
    if(user) {
        return user;
    }
    return false;
}

const emailExist = async(email) => {
    console.log('userMiddleware[emailExist]');
    let user = await User.findOne({email: email});
    if(user) {
        return user;
    }
    return false;
}

const authUser = async(loginData) => {
    console.log('userMiddleware[authUser]');

    let authUser = await usernameExist(loginData.username);
    if(authUser && bcryptMiddleware.checkPassword(loginData.password, authUser.password)) {
        return authUser;
    }
    return false;
}

const getUser = async(id) => {
    console.log('userMiddleware[getUser]');
    return User.findById(id);
}

const getAllUsers = async() => {
    console.log('userMiddleware[getAllUsers]');
    let allUsers = await User.find();
    return allUsers;
}

const getUserData = async(id) => {
    console.log('userMiddleware[getUserData]');

    let user = await getUser(id);
    return user;
}

const getProfileImage = async(imageData) => {
    console.log('userMiddleware[getProfileImage]');
    let profileImage = await fileMiddleware.getFileData(imageData);
    return profileImage;
}

const saveUser = async(userData, profileFile, file_base64) => {
    console.log('users_middleware[saveUser]');
    let hashPassword = bcryptMiddleware.hash(userData.password);
    let newUser = new User({
        first_name: userData.first_name,
        last_name: userData.last_name,
        username: userData.username,
        password: hashPassword,
        email: userData.email,
        gender: userData.gender,
        profileImage: undefined,
        uploads: [],
        following: [],
        followers: [],
        cash: 0,
        hearts: 0,
        conversations: [],
        keywords: [],
        live: undefined,
        lastContentUpdate: new Date()
    });
    let response = await newUser.save();
    return response;
}

const updateUser = async(user_id, field_to_update) => {
    console.log('usersMiddleware[updateUser]');
    let response = await User.findByIdAndUpdate(user_id, { $set: field_to_update });
    return response;
}

const updateUserUploads = async(user_id, content_id, file_base64) => {
    console.log('users_middleware[updateUserUploads]');
    // update the user uploads array
    let user = await getUser(user_id);
    let user_uploads_ids = user.uploads;

    user_uploads_ids.push({
        content_id,
        lastUpdate: new Date(),
        uploadDate: new Date()
    });
    // update the user's uploads with the updated array + lastContentUpdate
    let response = await updateUser(user_id, {uploads: user_uploads_ids, lastContentUpdate: new Date()});
    if(response._id) {
        console.log('user uploads updated!!');
        return user_uploads_ids;
    }
}

const updateUserStory = async(user_id, file, file_base64) => {
    console.log('users_middleware[updateUserStory]');

    let user = await getUser(user_id);
    let user_story = user.story;
    let newFile = {
        ...file,
        base64: (file_base64) ? (file_base64):(file.base64)
    };
    user_story.push(convert.toFileData(newFile));
    let response = await updateUser(user_id, {story: user_story});
    if(response.ok) {
        return user_story;
    }
}

const updateUserProfileImage = async(user_id, file, file_base64) => {
    console.log('usersMiddleware[updateUserProfileImage]');

    // save profile image to Content collection
    console.log('profile image saved!!');
    // update user with the profile image id
    let response = await updateUser(user_id, {profileImage: URL.generateUrl(file.mimetype, file.path)});
    if(response._id) {
        return response;
    } else {
        // profile image id NOT saved at the user profile image
    }
}

const updateUserKeywords = async(user_id, keywords) => {
    console.log('users_middleware[updateUserKeywords]');
    let response = await updateUser(user_id, {keywords: keywords});
    if(response._id) {
        console.log(`user's keywords updated!!`);
        return keywords;
    }
}

const updateUserSecrets = async(user_id, secret_id) => {
    console.log('users_middleware[updateUserSecrets]');
    // update the user uploads array
    let user = await getUser(user_id);
    let user_secrets_ids = user.secrets;

    user_secrets_ids.push({
        content_id: secret_id,
        lastUpdate: new Date(),
        uploadDate: new Date()
    });
    // update the user's uploads with the updated array + lastContentUpdate
    let response = await updateUser(user_id, {secrets: user_secrets_ids});
    if(response._id) {
        console.log('user secrets updated!!');
        return user_secrets_ids;
    }
}

const deleteUser = async(id) => {
    let response = await User.findByIdAndDelete(id);
    return response;
}

module.exports = {
    getUser: getUser,
    saveUser: saveUser,
    getUserData: getUserData,
    getAllUsers: getAllUsers,
    updateUser: updateUser,
    updateUserUploads: updateUserUploads,
    authUser: authUser,
    getProfileImage: getProfileImage,
    updateUserStory: updateUserStory,
    usernameExist: usernameExist,
    emailExist: emailExist,
    updateUserProfileImage: updateUserProfileImage,
    updateUserKeywords: updateUserKeywords,
    updateUserSecrets: updateUserSecrets,
    deleteUser
}
