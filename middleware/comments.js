const Comment = require('../models/Comment');

const addComment = async(sender_id, content_id, data) => {
    console.log('CommentsMiddleware[addComment]');
    let newComment = new Comment({
        sender_id,
        content_id,
        data,
        date: new Date()
    });
    let response = await newComment.save();
    return response;
}

const getContentComment = async(content_id) => {
    console.log('CommentsMiddleware[getContentComment]');
    let response = await Comment.find({content_id});
    return response;
}

module.exports = {
    addComment: addComment,
    getContentComment: getContentComment
}
