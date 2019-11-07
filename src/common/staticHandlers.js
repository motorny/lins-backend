const fs = require('fs').promises;
const path = require('path');
const imageType = require('image-type');
import createError from 'http-errors'
var uuid4 = require('uuid4');

export async function saveBase64ToImage(str, relPath) {
    const buff = Buffer.from(str, 'base64');
    const ext = imageType(buff).ext;
    if (!ext) {
        throw new createError(415, 'Bad image');
    }
    const imagePath = path.format({
        dir: path.join('media', relPath), //todo: Include media prefix from app config
        name: uuid4(),
        ext: '.' + ext
    });
    await fs.mkdir(path.dirname(imagePath),{recursive:true});
    await fs.writeFile(imagePath, buff);
    return imagePath;
}