const fs = require('fs').promises;
const url = require('url');
const path = require('path');
const imageType = require('image-type');
import createError from 'http-errors'

var uuid4 = require('uuid4');

export async function saveBase64ToImage(str, relPath) {
    const buff = Buffer.from(str, 'base64');
    const ext = imageType(buff);
    if (!ext) {
        throw new createError(415, 'Bad image');
    }

    const imagePath = path.format({
        dir: relPath,
        name: uuid4(),
        ext: '.' + ext.ext
    });
    const absPath = path.join(process.env.MEDIA_PATH, imagePath);

    await fs.mkdir(path.dirname(absPath), {recursive: true});
    await fs.writeFile(absPath, buff);
    return imagePath;
}


export function getMediaUrl(relPath) {
    if (relPath)
        return path.posix.join('/media', relPath);
    return null;
}