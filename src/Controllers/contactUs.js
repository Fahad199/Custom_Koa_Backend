const contactUsModel = require('../models/contactUs');
const { NotFoundError, InternalError } = require('../middlewares/errors');

class ContactUs {
  static async save({ fullName, email, mobileNo, query }) {
    const contactUs = await contactUsModel.create({
      fullName,
      email,
      mobileNo,
      query,
    });

    if (!contactUs || contactUs.length <= 0) {
      throw new InternalError('Failed to create the contactUs');
    }
    return contactUs;
  }

  static async get({ pageSize, pageNum }) {
    const page = parseInt(pageNum, 10);
    const limit = parseInt(pageSize, 10);

    const result = await contactUsModel.get(page, limit);

    if (result.length <= 0) {
      throw new NotFoundError('Contact not found');
    }

    return result.map((users) => users.dataValues);
  }
}

module.exports = ContactUs;
