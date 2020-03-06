const userMiddleware = require('../middleware/users');
const upload = require("../middleware/upload");
const actionMiddleware = require('../middleware/actions');
const actionType = require('../helpers/actions.type');
const fileMiddleware = require('../middleware/files');
const bufferConvert = require('../helpers/buffer.convert');
const contentMiddleware = require('../middleware/content');

const getSingleUser = async(req, res) => {
    console.log('usersController[getSingleUser]');
    let id = req.query.id;
  let user = await userMiddleware.getUserData(id);
  res.json(user);
}

const getUsers = async(req, res) => {
    console.log('usersController[getUsers]');
    let id_array = req.query.ids.split(',');
  let following_users = [];
  if(id_array[0] != '') {
      for(let i=0; i< id_array.length; i++) {
          let user = await userMiddleware.getUserData(id_array[i]);
          let userProfile = await contentMiddleware.getSingleContent(user.profileImage);
          user.profileImage = userProfile;
          following_users.push(user);
      }
  }
  res.json(following_users);
}

const getAllUsers = async(req, res) => {
  console.log('usersController[getAllUsers]');

  let allUsers = await userMiddleware.getAllUsers();
  res.json(allUsers);
}

const login = async(req, res, next) => {
    console.log('usersController[login]');
    let user = req.body;
    console.log('body request', user);

  let auth = await userMiddleware.authUser(user);
  if(!auth) {
    let error =  new Error();
    error.message = 'username or password wrong';
    next(error);
  } else {
    res.json(auth);
  }
}

const signup = async(req, res) => {
    console.log('usersController[signup]');

    let usernameExist = await userMiddleware.usernameExist(req.body.username);
    if(usernameExist) {
        return res.json({error: 'Username exist.'});
    }

    let emailExist = await userMiddleware.emailExist(req.body.email);
    if(emailExist) {
        return res.json({error: 'Email allready in use.'});
    }
    let user = await userMiddleware.saveUser(req.body);

    await actionMiddleware.addAction(actionType.SIGNUP, user._id);

    res.json(user);
}

const startFollow = async(req, res) => {
    console.log('usersController[startFollow]');

    // client id
  let user_id = req.query.id;
  // update array of users id following
  let following_ids = req.body.follow;

  //update the followers users of the user that the client start follow
  let follow_user_id = following_ids[following_ids.length-1];
  let follow_user = await userMiddleware.getUser(follow_user_id);
  let followers_ids = follow_user.followers;
  followers_ids.push(user_id);
  await userMiddleware.updateUser(follow_user_id, {followers: followers_ids});

  // update the following users of the client user
  let response = await userMiddleware.updateUser(user_id, {following: following_ids});

  // store new action
  await actionMiddleware.addAction(actionType.FOLLOW, user_id, follow_user_id);

  res.json(response);
}

const stopFollow = async(req, res) => {
    console.log('usersController[stopFollow]');

    console.log('stop follow');
    // client id
    let user_id = req.query.id;
    // user to stop follow id
    let user_stop_follow_id = req.body.user_stop;
    // update array of users id following
    let following_ids = req.body.follow;
    console.log('my update following', following_ids);

    //update the followers users of the user that the client start follow
    let stop_follow_user = await userMiddleware.getUser(user_stop_follow_id);
    console.log(stop_follow_user.username);
    let followers_ids = stop_follow_user.followers;
    followers_ids.filter(user_id => user_id != user_stop_follow_id);
    await userMiddleware.updateUser(user_stop_follow_id, {followers: followers_ids});

    // update the following users of the client user
    let response = await userMiddleware.updateUser(user_id, {following: following_ids});

    // store new action
    await actionMiddleware.addAction(actionType.STOP_FOLLOW, user_id, user_stop_follow_id);

    res.json(response);
}

const buyPackage = async(req, res) => {
    console.log('usersController[buyPackage]');

    let client = await userMiddleware.getUser(req.query.id);
    let recieveValues = req.body.recieve;

    client.cash = client.cash + recieveValues.cash;
    client.hearts = client.hearts + recieveValues.hearts;

    await userMiddleware.updateUser(client._id, {cash: client.cash, hearts: client.hearts});
    await actionMiddleware.addAction(actionType.DEPOSIT, client._id);

    res.json(client);
}

const updateProfileImage = async(req, res) => {
    console.log('userController[updateProfileImage]');
    let user_id = req.query.id;
    let file = req.body;

        let user_profile = await userMiddleware.updateUserProfileImage(user_id, file);
        console.log(user_profile);
        if(!user_profile.err) {
            console.log('user profile image updated!!');
            await actionMiddleware.addAction(actionType.PROFILE_IMAGE, user_id, undefined);
            res.json(user_profile);
        }

    // try {
    //     let user_id = req.query.id;
    //     await upload(req, res);
    //
    //     if (req.file == undefined) {
    //         return res.json({error: `You must select a file.`});
    //     }
    //
    //     let file_base64 = await fileMiddleware.getFileBase64(req.file);
    //
    //     let user_profile = await userMiddleware.updateUserProfileImage(user_id, req.file, file_base64);
    //     await actionMiddleware.addAction(actionType.PROFILE_IMAGE, user_id, undefined, req.file.id);
    //     res.json(user_profile);
    // } catch (error) {
    //     console.log(error);
    //     return res.send(`Error when trying upload image: ${error}`);
    // }
}

const updateKeywords = async(req, res) => {
    console.log('userController[updateKeywords]');

    let user_id = req.query.id;
    let keywords_arr = req.body.keywords;

    let keywords = await userMiddleware.updateUserKeywords(user_id, keywords_arr);
    res.json(keywords);
}

module.exports = {
    getSingleUser: getSingleUser,
    signup: signup,
    login: login,
    getAllUsers: getAllUsers,
    getUsers: getUsers,
    startFollow: startFollow,
    stopFollow: stopFollow,
    buyPackage: buyPackage,
    updateProfileImage: updateProfileImage,
    updateKeywords: updateKeywords
}
