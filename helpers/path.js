// const base_url = `http://127.0.0.1:8080`; // local url
const base_url = `http://34.69.232.216:8080` // google server url

const generateUrl = (type, path) => {
    if(type.includes('video')) {
        return `${base_url}/video?p=${path}`;
    } else {
        return `${base_url}/${path}`;
    }
}

module.exports = generateUrl;