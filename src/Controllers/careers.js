const careerFormModel = require('../models/careers');
const { NotFoundError, InternalError } = require('../middlewares/errors');

class CareersForm {
    static async save({ name, email, description, contactNo, jobTitle, attachmentId }) {
        const careerForm = await careerFormModel.create({
            name,
            email,
            description,
            contactNo,
            jobTitle,
            attachmentId,
        });

        if (!careerForm || careerForm.length <= 0) {
            throw new InternalError('Failed to create the Career Form');
        }
        return careerForm;
    }

    static async getCareerForms({ pageSize, pageNum, sort }) {
        const page = parseInt(pageNum, 10);
        const limit = parseInt(pageSize, 10);

        const result = await careerFormModel.getCareerForms(page, limit, sort);

        if (result.length <= 0) {
            throw new NotFoundError('Career Forms not found');
        }

        return result.map((users) => users.dataValues);
    }

    static async getById(id) {
        const careerForm = await careerFormModel.getCareerFormById(id);
        if (!careerForm) {
            throw new NotFoundError('Career Form not found');
        }

        return careerForm;
    }
}

module.exports = CareersForm;
