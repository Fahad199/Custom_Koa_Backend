const path = require('path');
const fs = require('fs');
const attachmentsModel = require('../models/attachments');
const { NotFoundError, InternalError } = require('../middlewares/errors');

class Attachment {
  static async upload(file) {
    file = JSON.parse(file);
 
    const relativePath = this.generateURI();
    const name = this.getFileName(file);
    const extension = this.getFileExtension(file);
    const mimeType = this.getMimeType(file);
    const result = await attachmentsModel.create({
      name,
      extension,
      mimeType,
      relativePath
    });

    if (!result || result.length <= 0) {
      throw new InternalError('Failed to upload the image');
    }
    return result;
  }

  static async download(id) {
    const image = await attachmentsModel.getImage(id);

    if (!image) {
      throw new NotFoundError('Image not found');
    }
    const { name, relativePath, extension, mimeType } = image.dataValues;

    const file = `${process.cwd()}${relativePath}${name}${extension}`;
    const fileContent = fs.readFileSync(file);
    return {
      file: fileContent,
      mimeType,
    };
  }

  static generateURI() {
    return `/uploads/`;
  }

  static getFileExtension(file) {
    const extension = path.extname(file.originalname);
    return extension;
  }

  static getFileName(file) {
    const ext = this.getFileExtension(file);
    const name = path.basename(file.filename, ext);
    return name;
  }

  static getMimeType(file) {
    return `${file.mimetype}`;
  }
}

module.exports = Attachment;
