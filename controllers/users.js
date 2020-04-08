const userMiddleware = require('../middleware/users');
const actionMiddleware = require('../middleware/actions');
const actionType = require('../helpers/actions.type');
const generateUrl = require('../helpers/path');

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
    next('Username or password wrong.');
  } else {
    res.json(auth);
  }
}

const signup = async(req, res, next) => {
    console.log('UsersController[signup]');

    let usernameExist = await userMiddleware.usernameExist(req.body.username);
    if(usernameExist) {
        next('Username allready exist.');
    }

    let emailExist = await userMiddleware.emailExist(req.body.email);
    if(emailExist) {
        next('Email allready in use.')
    }
    let user = await userMiddleware.saveUser(req.body);

    await actionMiddleware.addAction(actionType.SIGNUP, user._id);

    res.json(user);
}

const startFollow = async(req, res) => {
    console.log('usersController[startFollow]');

    // client id
  let user_id = req.query.id;
  // user to start follow
  let start_follow_user_id = req.body.user;

  //update the followers users of the user that the client start follow
  let follow_user = await userMiddleware.getUser(start_follow_user_id);
  let followers_ids = follow_user.followers;
  followers_ids.push(user_id);
  await userMiddleware.updateUser(start_follow_user_id, {followers: followers_ids});

  // update the following users of the client user
  let follower_user = await userMiddleware.getUser(user_id);
  let following_ids = follower_user.following;
  following_ids.push(start_follow_user_id);
  let response = await userMiddleware.updateUser(user_id, {following: following_ids});

  // store new action
  await actionMiddleware.addAction(actionType.FOLLOW, user_id, start_follow_user_id);
  console.log('response: ', following_ids);
  res.json(following_ids);
}

const stopFollow = async(req, res) => {
    console.log('usersController[stopFollow]');
    // client id
    let user_id = req.query.id;
    // user to stop follow id
    let user_stop_follow_id = req.body.user;

    //update the followers users of the user that the client start follow
    let stop_follow_user = await userMiddleware.getUser(user_stop_follow_id);
    console.log(stop_follow_user.username);
    let followers_ids = stop_follow_user.followers;
    followers_ids = followers_ids.filter(id => id != user_id);
    await userMiddleware.updateUser(user_stop_follow_id, {followers: followers_ids});

    // update the following users of the client user
    let follower_user = await userMiddleware.getUser(user_id);
    let following_ids = follower_user.following;
    following_ids = following_ids.filter(id => id != user_stop_follow_id);
    let response = await userMiddleware.updateUser(user_id, {following: following_ids});

    // store new action
    await actionMiddleware.addAction(actionType.STOP_FOLLOW, user_id, user_stop_follow_id);

    res.json(following_ids);
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
    let file = req.file;

        let updatedProfile = await userMiddleware.updateUserProfileImage(user_id, file);
        console.log(updatedProfile);
        if(!updatedProfile.err) {
            console.log('user profile image updated!!');
            await actionMiddleware.addAction(actionType.PROFILE_IMAGE, user_id, undefined, file);
            res.json(generateUrl(file.mimetype, file.path));
        }
}

const updateKeywords = async(req, res) => {
    console.log('userController[updateKeywords]');

    let user_id = req.query.id;
    let keywords_arr = req.body.keywords;

    let keywords = await userMiddleware.updateUserKeywords(user_id, keywords_arr);
    res.json(keywords);
}

const updateUser = async(req, res) => {
  let id = req.query.id;
  let fields = req.body;

  let response = await userMiddleware.updateUser(id, fields);
  res.json(response);
}

const addExtra = async(req, res, next) => {
  let user_id = req.query.id;
  let cost = req.body.cost;

  let user = await userMiddleware.getUser(user_id);
  if(user.cash < cost) {
    next('You do not have enough money.');
  } else {
    let cash = user.cash - cost;
    let limit_of_contents = (user.limit_of_contents*1) + 3;
    let updatedUser = await userMiddleware.updateUser(user_id, {cash, limit_of_contents});
    updatedUser._id && res.json({cash, limit_of_contents});
  }
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
    updateKeywords: updateKeywords,
    updateUser: updateUser,
    addExtra: addExtra
}
