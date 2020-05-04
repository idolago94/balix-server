var express = require('express');
var router = express.Router();
const tokenMiddleware = require('../middleware/token');
const chatRoomMiddleware = require('../middleware/chatRoom');

router.get('/', tokenMiddleware.verify, async(req, res, next) => {
    let user_id = req.headers.user;
    let rooms = await chatRoomMiddleware.getUserRooms(user_id);
    res.json(rooms);
});

router.get('/user', tokenMiddleware.verify, async(req, res, next) => {
    let users_ids = req.query.id;
    users_ids.push(req.headers.user);
    let room = await chatRoomMiddleware.getRoomByUsers(users_ids);
    res.json(room);
})

module.exports = router;
