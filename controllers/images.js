const userMiddleware = require('../middleware/users');
const imageMiddleware = require('../middleware/images');
const upload = require('../middleware/upload');
const {ObjectId} = require('mongodb');
const actionMiddleware = require('../middleware/actions');
const fileMiddleware = require('../middleware/files');
const actionType = require('../helpers/actions.type');

const uploadImage = async(req, res) => {
  console.log('imageController[uploadImage]');
  let user_id = req.query.id;
  let file = req.body.file; // {base64, contentType}

  // upload regular post
  let user_uploads = await userMiddleware.updateUserUploads(user_id, file);
  // add upload action
  await actionMiddleware.addAction(actionType.UPLOAD, user_id, undefined, req.file.id);
  res.json(user_uploads);

  // try {
  //   let user_id = req.query.id;
  //   let mode_story = req.query.story;
  //   await upload(req, res);
  //
  //   if (req.file == undefined) {
  //     return res.json(`You must select a file.`);
  //   }
  //
  //   let file_base64 = await fileMiddleware.getFileBase64(req.file);
  //
  //   // req.file - object that upload to photos.files collection
  //   if(mode_story) {
  //     // upload story
  //     let user_story = await userMiddleware.updateUserStory(user_id, req.file, file_base64);
  //     await actionMiddleware.addAction(actionType.UPLOAD_STORY, user_id, undefined, req.file.id);
  //     res.json(user_story);
  //   } else {
  //     // upload regular post
  //     let user_uploads = await userMiddleware.updateUserUploads(user_id, req.file, file_base64);
  //     await actionMiddleware.addAction(actionType.UPLOAD, user_id, undefined, req.file.id);
  //     res.json(user_uploads);
  //   }
  // } catch (error) {
  //   console.log(error);
  //   return res.send(`Error when trying upload image: ${error}`);
  // }
}

const uploadFromCamera = async(req, res) => {
  console.log('imageController[uploadFromCamera]');
  let user_id = req.query.id;
  let file = req.body.file;
  let mode_story = req.query.story;

  if(mode_story) {
    // upload story
    let user_story = await userMiddleware.updateUserStory(user_id, file);
    await actionMiddleware.addAction(actionType.UPLOAD_STORY, user_id, undefined, user_story[user_story.length-1].id);
    res.json(user_story);
  } else {
    let user_uploads = await userMiddleware.updateUserUploads(user_id, file);
    await actionMiddleware.addAction(actionType.UPLOAD, user_id, undefined, user_uploads[user_uploads.length-1].id);
    res.json(user_uploads);
  }

}

const getSingleImage = async(req, res) => {
  console.log('imageController[getSingleImage]');
  let image = {
    id: ObjectId(req.query.id),
    contentType: req.query.type
  }
  let imageData = await imageMiddleware.getImageData(image);
  res.json(imageData);
}

const getImages = async(req, res) => {
  console.log('imageController[getImages]');
  let images_array = req.query.images.split(',');
  let images = [];
  for(let i=0; i<images_array.length; i++) {
    let imageDetails = images_array[i].split(':');
    let image = {
      id: ObjectId(imageDetails[0]),
      contentType: imageDetails[1]
    }
    let imageData = await imageMiddleware.getImageData(image);
    images.push(imageData);
  }
  res.json(images);
}

const updateAchievement = async(req, res) => {
  console.log('imageController[updateAchievement]');

  // id of the client
  let client_id = req.query.id;
  // id of the image owner
  let owner_id = req.body.owner_id;
  // id of the image
  let image_id = req.body.image_id
  // achievements data({cash, hearts})
  let achievements = req.body.achievements;

  let story = req.query.story;

  // decrease the achievements from the client
  let client = await userMiddleware.getUser(client_id);
  // check if client have enough achievements
  if(client.cash < achievements.cash) {
    res.json({error: 'You do not have enough cash'});
  }
  if(client.hearts < achievements.hearts) {
    res.json({error: 'You do not have enough hearts'});
  }
  // update client achievements
  let client_update_cash = client.cash - achievements.cash;
  let client_update_hearts = client.hearts - achievements.hearts;
  await userMiddleware.updateUser(client_id, {cash: client_update_cash, hearts: client_update_hearts});

  // add the achievements to the image and the image owner
  let user = await userMiddleware.getUser(owner_id);
  let user_cash = user.cash + achievements.cash;
  let user_cash_earned = (user.cash_earned) ? (user.cash_earned + achievements.cash):(achievements.cash);
  let user_hearts = user.hearts + achievements.hearts;
  let user_hearts_earned = (user.hearts_earned) ? (user.hearts_earned + achievements.hearts):(achievements.hearts);

  let fields_update = {
    cash: user_cash,
    cash_earned: user_cash_earned,
    hearts: user_hearts,
    hearts_earned: user_hearts_earned,
  };

  if(story) {
    let user_story = user.story.map(story => {
      if(story.id == imsge_id) {
        return {
                ...story,
                hearts: (story.hearts) ? (story.hearts + achievements.hearts) : (achievements.hearts),
                cash: (story.cash) ? (story.cash + achievements.cash) : (achievements.cash)
        };
      } else return story;
    });
    fields_update.story = user_story;
  } else {
    let user_uploads = user.uploads.map(up => {
      if(up.id == image_id) {
        return {
          ...up,
                  hearts: (up.hearts) ? (up.hearts + achievements.hearts) : (achievements.hearts),
                  cash: (up.cash) ? (up.cash + achievements.cash) : (achievements.cash)
        };
      } else return up;
    });
    fields_update.uploads = user_uploads;
  }

    let response = await userMiddleware.updateUser(owner_id, fields_update);
    if(response.ok) {
      if(achievements.cash > 0) {
        await actionMiddleware.addAction(actionType.EMOJI, client_id, owner_id, image_id, achievements.emoji);
      }
      if(achievements.hearts > 0) {
        await actionMiddleware.addAction(actionType.HEART, client_id, owner_id, image_id);
      }
      res.json(fields_update);
    }
    res.json(response);
  // if(story) {
  //   let user_story = [];
  //   for(let i=0; i<user.story.length; i++) {
  //     if(user.story[i].id == image_id) {
  //       user_story.push({
  //         ...user.story[i],
  //         hearts: (user.story[i].hearts) ? (user.story[i].hearts + achievements.hearts) : (achievements.hearts),
  //         cash: (user.story[i].cash) ? (user.story[i].cash + achievements.cash) : (achievements.cash)
  //       });
  //     } else user_story.push(user.story[i]);
  //   }
  //   let response = await userMiddleware.updateUser(owner_id, {
  //     cash: user_cash,
  //     cash_earned: user_cash_earned,
  //     hearts: user_hearts,
  //     hearts_earned: user_hearts_earned,
  //     story: user_story
  //   });
  //   if(response.ok) {
  //     if(achievements.cash > 0) {
  //       await actionMiddleware.addAction(actionType.EMOJI_STORY, client_id, owner_id, image_id, achievements.emoji);
  //     }
  //     if(achievements.hearts > 0) {
  //       await actionMiddleware.addAction(actionType.HEART_STORY, client_id, owner_id, image_id, achievements.hearts);
  //     }
  //     res.json({
  //       cash: user_cash,
  //       cash_earned: user_cash_earned,
  //       hearts: user_hearts,
  //       hearts_earned: user_hearts_earned,
  //       story: user_story
  //     });
  //   }
  //   res.json(response);
  // } else {
  //   let user_uploads = [];
  //   for(let i=0; i<user.uploads.length; i++) {
  //     if(user.uploads[i].id == image_id) {
  //       user_uploads.push({
  //         ...user.uploads[i],
  //         hearts: (user.uploads[i].hearts) ? (user.uploads[i].hearts + achievements.hearts) : (achievements.hearts),
  //         cash: (user.uploads[i].cash) ? (user.uploads[i].cash + achievements.cash) : (achievements.cash)
  //       });
  //     } else user_uploads.push(user.uploads[i]);
  //   }
  //   let response = await userMiddleware.updateUser(owner_id, {
  //     cash: user_cash,
  //     cash_earned: user_cash_earned,
  //     hearts: user_hearts,
  //     hearts_earned: user_hearts_earned,
  //     uploads: user_uploads
  //   });
  //   if(response.ok) {
  //     if(achievements.cash > 0) {
  //       await actionMiddleware.addAction(actionType.EMOJI, client_id, owner_id, image_id, achievements.emoji);
  //     }
  //     if(achievements.hearts > 0) {
  //       await actionMiddleware.addAction(actionType.HEART, client_id, owner_id, image_id, achievements.hearts);
  //     }
  //     res.json({
  //       cash: user_cash,
  //       cash_earned: user_cash_earned,
  //       hearts: user_hearts,
  //       hearts_earned: user_hearts_earned,
  //       uploads: user_uploads
  //     });
  //   }
  //   res.json(response);
  // }
}

module.exports = {
  uploadImage: uploadImage,
  getSingleImage: getSingleImage,
  getImages: getImages,
  updateAchievement: updateAchievement,
  uploadFromCamera: uploadFromCamera
}
