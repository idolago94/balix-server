const generateUrl = (type, path) => {
    if(type.includes('video')) {
        return `http://127.0.0.1:8080/video?p=${path}`; // local url
        // return `http://34.69.232.216:8080/video?p=${path}` // google server url
    } else {
        return `http://127.0.0.1:8080/${path}`; // local url
        // return `http://34.69.232.216:8080/${path}` // google server url
    }
}

module.exports = generateUrl;