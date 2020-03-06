const MongoClient = require('mongodb');
const convert = require('./convert');
const database = require('../database');


const getFileData = async(file) => {
    console.log('filesMiddleware[getFileData]');
    // get file chunks
    let chunksFile = await getChunks(file.id);
    // convert chunks to base64
    let base64File = convert.toBase64(chunksFile, file.contentType);

    let fileData = {...file, base64: base64File};

    return fileData;
}

const getFileBase64 = async(file) => {
    console.log('filesMiddleware[getFileBase64]');
    // get file chunks
    let chunksFile = await getChunks(file.id);
    // convert chunks to base64
    let base64File = convert.toBase64(chunksFile, file.contentType);
    return base64File;
}

const getChunks = (file_id) => {
    console.log('filesMiddleware[getChunks]');
    return new Promise((resolve) => {
        MongoClient.connect('mongodb://localhost', async(err, client) => {
            if (err) throw err;
            // connect to database
            const db = client.db(database.db_name);
            // get chunks collections
            let collectionChunks = db.collection('images.chunks');
            // get chunks
            collectionChunks.find({files_id: file_id})
            // .sort({n: 0})
            .toArray((err, chunks) => {
                if (err) throw err;
                resolve(chunks);
            })
        })
    })
}

module.exports = {
    getFileData: getFileData,
    getFileBase64: getFileBase64
}
