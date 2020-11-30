const assert = require('assert').strict;
const sinon = require('sinon');

const ContactUsController = require('../../Controllers/contactUs');
const ContactUsModel = require('../../models/contactUs');

const sandbox = sinon.createSandbox();

const createResponse = {
  dataValues: {
    id: 15,
    fullName: 'fahad rajput',
    email: 'fahad1245556@gmail.com',
    mobileNo: '03133380676',
    query: 'hello there ! here is fahad from inertiasoft ! i need help',
    updatedAt: '2020-10-02T04:48:48.692Z',
    createdAt: '2020-10-02T04:48:48.692Z',
  },
  _previousDataValues: {
    fullName: 'fahad rajput',
    email: 'fahad1245556@gmail.com',
    mobileNo: '03133380676',
    query: 'hello there ! here is fahad from inertiasoft ! i need help',
    id: 15,
    createdAt: '2020-10-02T04:48:48.692Z',
    updatedAt: '2020-10-02T04:48:48.692Z',
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
  isNewRecord: false,
};

const getResponse = {
  dataValues: {
    id: 1,
    fullName: 'arslan fareed',
    email: 'arslanfareed1@gmail.com',
    mobileNo: 12345678911,
    query: 'hello there ! here is arslan from inertiasoft ! i need help',
    createdAt: '2020-09-08T05:44:53.000Z',
  },
  _previousDataValues: {
    id: 1,
    fullName: 'arslan fareed',
    email: 'arslanfareed1@gmail.com',
    mobileNo: 12345678911,
    query: 'hello there ! here is arslan from inertiasoft ! i need help',
    createdAt: '2020-09-08T05:44:53.000Z',
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

const contactUsParams = {
  fullName: 'fahad rajput',
  email: 'fahad1245556@gmail.com',
  mobileNo: '03133380676',
  query: 'hello there ! here is fahad from inertiasoft ! i need help',
};

describe('Contact Us Controller', () => {
  afterEach(() => {
    sandbox.restore();
  });

  it('should create a ContactUs successfully', async () => {
    const stubContactUsCreate = sandbox.stub(ContactUsModel, 'create').resolves(createResponse);
    const contactUs = await ContactUsController.save(contactUsParams);

    sinon.assert.calledOnceWithExactly(stubContactUsCreate, {
      fullName: contactUsParams.fullName,
      email: contactUsParams.email,
      mobileNo: contactUsParams.mobileNo,
      query: contactUsParams.query,
    });

    assert.strictEqual(contactUs.dataValues.id, createResponse.dataValues.id);
  });

  it('should failed to create a ContactUs', async () => {
    const stubContactUsCreate = sandbox.stub(ContactUsModel, 'create').resolves(0);

    await assert.rejects(ContactUsController.save(contactUsParams), (err) => {
      assert.strictEqual(err.name, 'InternalError');
      assert.deepStrictEqual(err.message, 'Failed to create the contactUs');
      return true;
    });

    sinon.assert.calledOnceWithExactly(stubContactUsCreate, {
      fullName: contactUsParams.fullName,
      email: contactUsParams.email,
      mobileNo: contactUsParams.mobileNo,
      query: contactUsParams.query,
    });
  });

  it('should get a ContactUs by id successfully', async () => {
    const page = 1;
    const limit = 1;
    const stubGetContactUs = sandbox.stub(ContactUsModel, 'get').resolves([getResponse]);
    const contactUs = await ContactUsController.get({ pageNum: page, pageSize: limit });

    sinon.assert.calledOnceWithExactly(stubGetContactUs, page, limit);
    assert.strictEqual(contactUs[0].id, getResponse.dataValues.id);
  });

  it('should throw contact not found when getting contacts collection', async () => {
    const page = 1;
    const limit = 1;
    const stubGetContactUs = sandbox.stub(ContactUsModel, 'get').resolves([]);

    await assert.rejects(ContactUsController.get({ pageNum: page, pageSize: limit }), (err) => {
      assert.strictEqual(err.name, 'NotFoundError');
      assert.deepStrictEqual(err.message, 'Contact not found');
      return true;
    });

    sinon.assert.calledOnceWithExactly(stubGetContactUs, page, limit);
  });
});
