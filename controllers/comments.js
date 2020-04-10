const commentsMiddleware = require('../middleware/comments');

const getContentComments = async(req, res) => {
    console.log('CommentsController[getContentComments]');
    let content_id = req.query.id;
    let response = await commentsMiddleware.getContentComment(content_id);
    res.json(response);
}

const addComment = async(req, res) => {
    console.log('CommentsController[addComment]');
    let user_id = req.query.id;

    let content_id = req.body.content_id;
    let comment = req.body.comment;
    
    let response = await commentsMiddleware.addComment(user_id, content_id, comment);
    res.json(response);
}

module.exports = {
    getContentComment: getContentComments,
    addComment: addComment
}
