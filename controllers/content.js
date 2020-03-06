const userMiddleware = require('../middleware/users');
const {ObjectId} = require('mongodb');
const actionMiddleware = require('../middleware/actions');
const actionType = require('../helpers/actions.type');
const contentMiddleware = require('../middleware/content');

const uploadContent = async(req, res) => {
    console.log('contentController[uploadContent]');
    let user_id = req.query.id; // String
    let file = req.body.file; // {base64, contentType}

    // upload file to Content collection
    let fileUploaded = await contentMiddleware.saveContent(user_id, file, 'post');
    if(fileUploaded._id) {
        let user_uploads_ids = await userMiddleware.updateUserUploads(user_id, fileUploaded._id);
        let user_uploads = await contentMiddleware.getUserContent(user_id);
        res.json(user_uploads);
    } else {
        // the file NOT saved to the Content collection
    }
}

const getAll = async(req, res) => {
    console.log('imageController[getAll]');
    let response = await contentMiddleware.getAllContents();
    res.json(response);
}

const updateAchievement = async(req, res) => {
    console.log('contentController[updateAchievement]');

    // id of the client
    let client_id = req.query.id;
    // id of the image owner
    let owner_id = req.body.owner_id;
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
    let client_update_cash = client.cash - achievements.cash;
    let client_update_hearts = client.hearts - achievements.hearts;
    let clientUpdateResponse = await userMiddleware.updateUser(client_id, {cash: client_update_cash, hearts: client_update_hearts});
    if(clientUpdateResponse._id){
        console.log('client updated!!');

        // add the achievements to the content
        // get the content data
        let updateContent = await contentMiddleware.getSingleContent(content_id);
        // update the content achievements + last update
        updateContent.cash = updateContent.cash + achievements.cash;
        updateContent.hearts = updateContent.hearts + achievements.hearts;
        let updateContentResponse = await contentMiddleware.updateContent(content_id, {
            cash: updateContent.cash,
            hearts: updateContent.hearts,
            lastUpdate: new Date()
        });
        if(updateContentResponse._id) {
            console.log('content updated!!');
            // add the achievements to the content owner
            // get the owner data
            let owner = await userMiddleware.getUser(owner_id);
            // update the owner achievements
            owner.cash = owner.cash + achievements.cash;
            owner.cash_earned = (owner.cash_earned) ? (owner.cash_earned + achievements.cash):(achievements.cash);
            owner.hearts = owner.hearts + achievements.hearts;
            owner.hearts_earned = (owner.hearts_earned) ? (owner.hearts_earned + achievements.hearts):(achievements.hearts);
            let owner_fields_update = {
                cash: owner.cash,
                cash_earned: owner.cash_earned,
                hearts: owner.hearts,
                hearts_earned: owner.hearts_earned,
                lastContentUpdate: new Date()
            };
            let ownerUpdateResponse = await userMiddleware.updateUser(owner_id, owner_fields_update);
            console.log(ownerUpdateResponse);
            if(ownerUpdateResponse._id) {
                console.log('content owner updated!!');
                if(achievements.cash > 0) {
                    await actionMiddleware.addAction(actionType.EMOJI, client_id, owner_id, content_id, achievements.emoji);
                }
                if(achievements.hearts > 0) {
                    await actionMiddleware.addAction(actionType.HEART, client_id, owner_id, content_id);
                }
                res.json({cash: client_update_cash, hearts: client_update_hearts});
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

const getUserContent = async (req, res) => {
    console.log('contentController[getUserContent]');
    let user_id = req.query.id;
    let userContents = await contentMiddleware.getUserContent(user_id);
    res.json(userContents);
}

const getSomeContents = async (req, res) => {
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

module.exports = {
    uploadContent: uploadContent,
    getAll: getAll,
    updateAchievement: updateAchievement,
    getUserContent: getUserContent,
    getSomeContents: getSomeContents
}
