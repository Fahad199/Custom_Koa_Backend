const assert = require('assert').strict;
const sinon = require('sinon');
const CareersForm = require('../../Controllers/careers');

const CareerFormController = require('../../Controllers/careers');
const CareerFormModel = require('../../models/careers');

const sandbox = sinon.createSandbox();

const createResponse = {
    dataValues: {
        id: 1,
        name: "fahad saleem",
        email: "fahaddani123@gmail.com",
        description: "hello this is fahad from inertiasoft",
        contactNo: "+923133380675",
        jobTitle: "Backend Developer",
        attachmentId: 1
    },
    _previousDataValues: {
        id: 1,
        name: "fahad saleem",
        email: "fahaddani123@gmail.com",
        description: "hello this is fahad from inertiasoft",
        contactNo: "+923133380675",
        jobTitle: "Backend Developer",
        attachmentId: 1
    },
    _changed: { Set: {} },
    _options: {
        isNewRecord: true,
        _schema: null,
        _schemaDelimiter: '',
        attributes: undefined,
        include: undefined,
        raw: undefined,
        silent: undefined,
    },
    isNewRecord: true,
};

const getResponse = {
    dataValues: {
        id: 1,
            name: "fahad saleem",
            email: "fahaddani123@gmail.com",
            description: "hello this is fahad from inertiasoft",
            contactNo: "+923133380675",
            jobTitle: "Backend Developer",
            attachmentId: 1,
            createdAt: "2020-11-09T12:31:15.000Z",
            updatedAt: "2020-11-09T12:31:15.000Z"
    },
    _previousDataValues: {
        id: 1,
            name: "fahad saleem",
            email: "fahaddani123@gmail.com",
            description: "hello this is fahad from inertiasoft",
            contactNo: "+923133380675",
            jobTitle: "Backend Developer",
            attachmentId: 1,
            createdAt: "2020-11-09T12:31:15.000Z",
            updatedAt: "2020-11-09T12:31:15.000Z"
    },
    _changed: { Set: {} },
    _options: {
        isNewRecord: false,
        _schema: null,
        _schemaDelimiter: '',
        raw: true,
        attributes: [Array],
    },
    isNewRecord: false,
};

const careerFormParams = {
    name: "fahad saleem",
    email: "fahaddani123@gmail.com",
    description: "hello this is fahad from inertiasoft",
    contactNo: "+923133380675",
    jobTitle: "Backend Developer",
    attachmentId: "1",
};

describe('Career Form Controller', () => {
    afterEach(() => {
        sandbox.restore();
    });

    it('should create a CareerForm successfully', async () => {
        const stubCareerFormCreate = sandbox.stub(CareerFormModel, 'create').resolves(createResponse);
        const careerForm = await CareerFormController.save(careerFormParams);

        sinon.assert.calledOnceWithExactly(stubCareerFormCreate, {
            name: careerFormParams.name,
            email: careerFormParams.email,
            description: careerFormParams.description,
            contactNo: careerFormParams.contactNo,
            jobTitle: careerFormParams.jobTitle,
            attachmentId: careerFormParams.attachmentId,
        });

        assert.strictEqual(careerForm.dataValues.id, createResponse.dataValues.id);
    });

    it('should failed to create a CareerForm', async () => {
        const stubCareerFormCreate = sandbox.stub(CareerFormModel, 'create').resolves(0);

        await assert.rejects(CareerFormController.save(careerFormParams), (err) => {
            assert.strictEqual(err.name, 'InternalError');
            assert.deepStrictEqual(err.message, 'Failed to create the Career Form');
            return true;
        });

        sinon.assert.calledOnceWithExactly(stubCareerFormCreate, {
            name: careerFormParams.name,
            email: careerFormParams.email,
            description: careerFormParams.description,
            contactNo: careerFormParams.contactNo,
            jobTitle: careerFormParams.jobTitle,
            attachmentId: careerFormParams.attachmentId,
        });
    });

    it('should get a CareerForm by id successfully', async () => {
        const id = 1;
        const stubGetCareerForm = sandbox.stub(CareerFormModel, 'getCareerFormById').resolves(getResponse);
        const careerForm = await CareersForm.getById(id);
    
        sinon.assert.calledOnceWithExactly(stubGetCareerForm, id);
    
        assert.strictEqual(careerForm.dataValues.id, getResponse.dataValues.id);
      });
    
      it('should throw Career Form not found when getting by id', async () => {
        const id = 1;
        const stubGetCareerForm = sandbox.stub(CareerFormModel, 'getCareerFormById').resolves(0);
    
        await assert.rejects(CareersForm.getById(id), (err) => {
          assert.strictEqual(err.name, 'NotFoundError');
          assert.deepStrictEqual(err.message, 'Career Form not found');
          return true;
        });
    
        sinon.assert.calledOnceWithExactly(stubGetCareerForm, id);
      });

    it('should get CareerForms successfully', async () => {
        const page = 1;
        const limit = 1;
        const sort = 'ASC';
        const stubGetCareerForm = sandbox.stub(CareerFormModel, 'getCareerForms').resolves([getResponse]);
        const careerForm = await CareerFormController.getCareerForms({ pageNum: page, pageSize: limit, sort });

        sinon.assert.calledOnceWithExactly(stubGetCareerForm, page, limit, sort);
        assert.strictEqual(careerForm[0].id, getResponse.dataValues.id);
    });

    it('should throw career form not found when getting careers collection', async () => {
        const page = 1;
        const limit = 1;
        const sort = 'ASC';
        const stubGetCareerForm = sandbox.stub(CareerFormModel, 'getCareerForms').resolves([]);

        await assert.rejects(CareerFormController.getCareerForms({ pageNum: page, pageSize: limit, sort }), (err) => {
            assert.strictEqual(err.name, 'NotFoundError');
            assert.deepStrictEqual(err.message, 'Career Forms not found');
            return true;
        });

        sinon.assert.calledOnceWithExactly(stubGetCareerForm, page, limit, sort);
    });
});
