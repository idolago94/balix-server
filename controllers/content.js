const userMiddleware = require('../middleware/users');
const actionMiddleware = require('../middleware/actions');
const actionType = require('../helpers/actions.type');
const contentMiddleware = require('../middleware/content');
const uploadMiddleware = require('../middleware/upload');
const animationMiddlware = require('../middleware/animations');

const uploadContent = async(req, res, next) => {
    console.log('contentController[uploadContent]');
    let user_id = req.headers.user;
    let secret_mode = req.query.secret;
    let file = {...req.file, ...req.body, path: req.filePath};
    console.log('file upload: ', req.file);
    let fileUploaded = await contentMiddleware.saveContent(user_id, file, secret_mode ? ('secret'):('post'));
    if(fileUploaded._id) {
        if(secret_mode) {
            await userMiddleware.updateUserSecrets(user_id, fileUploaded._id);
        } else {
            await userMiddleware.updateUserUploads(user_id, fileUploaded._id);
        }
        await actionMiddleware.addAction(actionType.UPLOAD, user_id, undefined, file);
        res.json(fileUploaded);
    } else {
        // the file NOT saved to the Content collection
    }
}

const addSecretView = async(req, res, next) => {
    let user_id = req.headers.user;
    let content = req.body.content;
    let cost = req.body.content.entrance;
    console.log('contentController[addSecretView]', {cost});

    let user = await userMiddleware.getUser(user_id);
    if(user.cash*1 < cost) {
        next('You do not have enough money to unlock this secret.');
    } else {
        let user_cash = user.cash*1 - cost;
        let buyResponse = await userMiddleware.updateUser(user_id, {cash: user_cash});
        if(buyResponse._id) {
            let owner = await userMiddleware.getUser(content.user_id);
            let field_to_update = {
                cash: owner.cash*1 + cost,
                cash_earned: owner.cash_earned*1 + cost
            };
            let ownerResponse = await userMiddleware.updateUser(content.user_id, field_to_update);
            let update_views = content.views;
            let update_cash = content.cash;
            update_cash = update_cash*1 + cost;
            update_views.push(user_id);
            let contentResponse = await contentMiddleware.updateContent(content._id, {views: update_views, cash: update_cash});
            if(contentResponse._id) {
                await actionMiddleware.addAction(actionType.SECRET_VIEW, user_id, owner._id, content);
                res.json({views: update_views, cash: update_cash});
            }
        }
        // payment not happened
    }
}

const getAll = async(req, res) => {
    console.log('contentCpntroller[getAll]');
    let response = await contentMiddleware.getAllContents();
    res.json(response);
}

const updateAchievement = async(req, res) => {
    console.log('contentController[updateAchievement]');

    // id of the client
    let client_id = req.headers.user;
    // id of the image
    let content_id = req.body.content_id;
    // achievements data({cash, hearts})
    let achievements = req.body.achievements;
    console.log(achievements);

    // update the client achievements
    // get the client data.
    let client = await userMiddleware.getUser(client_id);
    // check if client have enough achievements
    if(client.cash < achievements.cash) {
        console.log('client do not have enough cash');
        res.json({error: 'You do not have enough cash'});
    }
    if(client.hearts < achievements.hearts) {
        console.log('client do not have enough hearts');
        res.json({error: 'You do not have enough hearts'});
    }
    console.log('client have enough achievements');
    // update client achievements
    client_fields_update = {
        cash: client.cash - achievements.cash,
        hearts: client.hearts - achievements.hearts
    }
    let clientUpdateResponse = await userMiddleware.updateUser(client_id, client_fields_update);
    if(clientUpdateResponse._id){
        console.log('client updated!!');

        // add the achievements to the content
        // get the content data
        let updateContent = await contentMiddleware.getSingleContent(content_id);
        // update the content achievements + last update
        let content_field_update = {
            cash: updateContent.cash + achievements.cash,
            hearts: updateContent.hearts + achievements.hearts,
            lastUpdate: new Date()
        };
        let updateContentResponse = await contentMiddleware.updateContent(content_id, content_field_update);
        if(updateContentResponse._id) {
            console.log('content updated!!');
            // add the achievements to the content owner
            // get the owner data
            let owner = await userMiddleware.getUser(updateContent.user_id);
            let owner_uploads = null;
            if(updateContent.type == 'post') {
                owner_uploads = owner.uploads;
            } else if(updateContent == 'secret') {
                owner_uploads = owner.secrets;
            }
            owner_uploads = owner_uploads.map(up => up.content_id == content_id ? ({...up, lastUpdate: new Date()}):(up));
            // update the owner achievements and uploads array
            let owner_fields_update = {
                cash: owner.cash + achievements.cash,
                cash_earned: (owner.cash_earned) ? (owner.cash_earned + achievements.cash):(achievements.cash),
                hearts: owner.hearts + achievements.hearts,
                hearts_earned: (owner.hearts_earned) ? (owner.hearts_earned + achievements.hearts):(achievements.hearts),
                [updateContent.type == 'post' ? ('uploads'):('secrets')]: owner_uploads,
                lastContentUpdate: new Date()
            };
            let ownerUpdateResponse = await userMiddleware.updateUser(updateContent.user_id, owner_fields_update);
            console.log(ownerUpdateResponse);
            if(ownerUpdateResponse._id) {
                console.log('content owner updated!!');
                let animation = null;
                if(achievements.cash > 0) {
                    let randomNumber = Math.floor(Math.random() * achievements.emoji.animations.length);
                    animation = await animationMiddlware.getById(achievements.emoji.animations[randomNumber]);
                    await actionMiddleware.addAction(
                        updateContent.type == 'post' ? (actionType.EMOJI):(actionType.SECRET_EMOJI), 
                        client_id, 
                        updateContent.user_id, 
                        updateContent, 
                        achievements.emoji
                    );
                }
                if(achievements.hearts > 0) {
                    await actionMiddleware.addAction(
                        updateContent.type == 'post' ? (actionType.HEART):(actionType.SECRET_HEART), 
                        client_id, 
                        updateContent.user_id, 
                        updateContent
                    );
                }
                res.json({user: client_fields_update, owner: owner_fields_update, content: content_field_update, animationJson: animation ? animation.url : null});
            } else {
                console.log('owner NOT updated');
            }
        } else {
            console.log('content NOT updated');
        }
    } else {
        console.log('client NOT updated');
    }
}

// const getUserContent = async(req, res) => {
//     console.log('contentController[getUserContent]');
//     let user_id = req.query.id;
//     let userContents = await contentMiddleware.getUserContent(user_id);
//     res.json(userContents);
// }

const getSomeContents = async(req, res) => {
    console.log('contentController[getSomeContents]');
    let content_ids = req.query.ids.split(',');
    console.log(content_ids);
    let contents = [];
    if(content_ids[0] != '') {
        for(let i=0; i< content_ids.length; i++) {
            let content = await contentMiddleware.getSingleContent(content_ids[i]);
            contents.push(content);
        }
        res.json(contents);
    } else {
        res.json([]);
    }
}

const getTop = async(req, res) => {
    console.log('contentCpntroller[getTop]');
    let response = await contentMiddleware.getTopContents();
    res.json(response);
}

const deleteContent = async(req, res) => {
    let user_id = req.headers.user;
    let secret = req.query.secret;
    let delete_ids = req.body;

    let user = await userMiddleware.getUser(user_id);
    let updateArr = user[secret ? ('secrets'):('uploads')];
    updateArr = updateArr.filter(c => !delete_ids.includes(c.content_id.toString()));
    let updateResponse = await userMiddleware.updateUser(user_id, {[secret ? ('secrets'):('uploads')]: updateArr});

    if(updateResponse._id) {
        delete_ids.map(async(id) => {
            let content = await contentMiddleware.getSingleContent(id);
            uploadMiddleware.deleteFromStorage(content.url);
            await contentMiddleware.deleteById(content._id);
            res.json(updateArr);
        })
    }
}


module.exports = {
    uploadContent: uploadContent,
    getAll: getAll,
    updateAchievement: updateAchievement,
    // getUserContent: getUserContent,
    getSomeContents: getSomeContents,
    addSecretView: addSecretView,
    getTop: getTop,
    deleteContent: deleteContent
}
