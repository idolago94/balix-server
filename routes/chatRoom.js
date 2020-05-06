var express = require('express');
var router = express.Router();
const tokenMiddleware = require('../middleware/token');
const chatRoomMiddleware = require('../middleware/chatRoom');

router.get('/', tokenMiddleware.verify, async(req, res, next) => {
    let user_id = req.headers.user;
    let rooms = await chatRoomMiddleware.getUserRooms(user_id);
    res.json(rooms);
});

router.get('/all', tokenMiddleware.adminVerify, async(req, res, next) => {
    let rooms = await chatRoomMiddleware.getAll();
    res.json(rooms);
});

router.get('/user', tokenMiddleware.verify, async(req, res, next) => {
    let users_ids = req.query.ids.split(',');
    users_ids.push(req.headers.user);
    console.log('route chatRoom/user', users_ids);
    let room = await chatRoomMiddleware.getRoomByUsers(users_ids);
    res.json(room);
});

router.delete('/delete', tokenMiddleware.adminVerify, async(req, res, next) => {
    let room_id = req.query.id;
    let response = await chatRoomMiddleware.deleteRoom(room_id);
    res.json(response);
});

module.exports = router;
