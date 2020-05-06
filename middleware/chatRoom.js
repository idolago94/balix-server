const ChatRoom = require('../models/ChatRoom');

const getAll = async() => {
    console.log('ChatRoomMiddleware[getAll]');
    let rooms = await ChatRoom.find({});
    return rooms;
}

const getRoomById = async(room_id) => {
    console.log('ChatRoomMiddleware[getRoomById]');
    let room = await ChatRoom.findById(room_id);
    return room;
}

const getUserRooms = async(user_id) => {
    let rooms = await ChatRoom.find({ participants: { $all: [user_id] } });
    return rooms;
}

const getRoomByUsers = async(users_array) => {
    console.log('ChatRoomMiddleware[getRoomByUsers]');
    let room = await ChatRoom.find({ $and: [ 
        {participants: { $all: users_array }}, 
        {participants: { $size: users_array.length }} 
    ]});
    return room;
}

const createRoom = async(participants_array) => {
    console.log('ChatRoomMiddleware[createRoom]');
    let newRoom = new ChatRoom({ participants: participants_array });
    let result = await newRoom.save();
    return result;
}

const updateRoom = async(room_id, field_update) => {
    let updateRoom = await ChatRoom.findByIdAndUpdate(room_id, field_update);
    return updateRoom;
}

const deleteRoom = async(room_id) => {
    let response = await ChatRoom.findOneAndDelete(room_id);
    return response;
}

module.exports = {
    getAll,
    getRoomById,
    getUserRooms,
    getRoomByUsers,
    createRoom,
    updateRoom,
    deleteRoom
}

//  find an array that contains both the elements "red" and "blank", without regard to order or other elements in the array
//  db.inventory.find( { tags: { $all: ["red", "blank"] } } )

// queries for all documents where tags is an array that contains the string "red" as one of its elements
// db.inventory.find( { tags: "red" } )

// queries for all documents where the field tags value is an array with exactly two elements, "red" and "blank", in the specified order
// db.inventory.find( { tags: ["red", "blank"] } )