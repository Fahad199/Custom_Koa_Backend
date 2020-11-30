const assert = require('assert').strict;
const sinon = require('sinon');

const EmailController = require('../../Controllers/email');
const EmailModel = require('../../models/email');

const sandbox = sinon.createSandbox();

const response = {
  dataValues: {
    id: 17,
    name: 'fahad',
    email: 'fahadsaleem47@yahoo.com',
    updatedAt: '2020-10-02T05:19:03.434Z',
    createdAt: '2020-10-02T05:19:03.434Z',
  },
  _previousDataValues: {
    name: 'fahad',
    email: 'fahadsaleem47@yahoo.com',
    id: 17,
    createdAt: '2020-10-02T05:19:03.434Z',
    updatedAt: '2020-10-02T05:19:03.434Z',
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

const emailParams = {
  name: 'asas',
  email: 'abc@gmail.com',
};

describe('Email Controller', () => {
  afterEach(() => {
    sandbox.restore();
  });

  it('should create an email successfully', async () => {
    const stubEmailCreate = sandbox.stub(EmailModel, 'create').resolves(response);
    const email = await EmailController.create(emailParams);

    sinon.assert.calledOnceWithExactly(stubEmailCreate, {
      name: emailParams.name,
      email: emailParams.email,
    });

    assert.strictEqual(email.dataValues.id, response.dataValues.id);
  });

  it('should failed to create an email', async () => {
    const stubEmailCreate = sandbox.stub(EmailModel, 'create').resolves(0);

    await assert.rejects(EmailController.create(emailParams), (err) => {
      assert.strictEqual(err.name, 'InternalError');
      assert.deepStrictEqual(err.message, 'Failed to create the email');
      return true;
    });

    sinon.assert.calledOnceWithExactly(stubEmailCreate, {
      name: emailParams.name,
      email: emailParams.email,
    });
  });

  it('should get emails collection successfully', async () => {
    const page = 1;
    const limit = 1;
    const stubGetEMails = sandbox.stub(EmailModel, 'getEmails').resolves([response]);
    const email = await EmailController.getEmails({ pageNum: page, pageSize: limit });

    sinon.assert.calledOnceWithExactly(stubGetEMails, page, limit);

    assert.strictEqual(email[0].id, response.dataValues.id);
  });

  it('should throw not found when getting emails collection', async () => {
    const page = 1;
    const limit = 1;
    const stubGetEMails = sandbox.stub(EmailModel, 'getEmails').resolves([]);

    await assert.rejects(EmailController.getEmails({ pageNum: page, pageSize: limit }), (err) => {
      assert.strictEqual(err.name, 'NotFoundError');
      assert.deepStrictEqual(err.message, 'Email not found');
      return true;
    });

    sinon.assert.calledOnceWithExactly(stubGetEMails, page, limit);
  });

  it('should delete the email successfully', async () => {
    const id = 17;
    const stubDeleteEmail = sandbox.stub(EmailModel, 'deleteEmail').resolves(1);
    const email = await EmailController.delete(id);

    sinon.assert.calledOnceWithExactly(stubDeleteEmail, id);
    assert.strictEqual(email, 1);
  });

  it('should failed to delete an email', async () => {
    const id = 17;
    const stubDeleteEmail = sandbox.stub(EmailModel, 'deleteEmail').resolves(2);

    await assert.rejects(EmailController.delete(id), (err) => {
      assert.strictEqual(err.name, 'ValidationError');
      assert.deepStrictEqual(err.message, 'Failed to delete an email');
      return true;
    });

    sinon.assert.calledOnceWithExactly(stubDeleteEmail, id);
  });

  it('should throw not found when deleting an email', async () => {
    const id = 17;
    const stubDeleteEmail = sandbox.stub(EmailModel, 'deleteEmail').resolves(0);

    await assert.rejects(EmailController.delete(id), (err) => {
      assert.strictEqual(err.name, 'NotFoundError');
      assert.deepStrictEqual(err.message, 'Email not found');
      return true;
    });

    sinon.assert.calledOnceWithExactly(stubDeleteEmail, id);
  });

  it('should update a email successfully', async () => {
    const id = 17;
    const name = 'abc';
    const email = 'abc@gmail.com';

    const stubGetEmail = sandbox.stub(EmailModel, 'getEmailById').resolves(response);
    const stubEmailUpdate = sandbox.stub(EmailModel, 'updateEmail').resolves([1]);
    await EmailController.update(id, name, email);

    sinon.assert.calledOnceWithExactly(stubGetEmail, id);
    sinon.assert.calledOnceWithExactly(stubEmailUpdate, {
      id,
      name,
      email,
    });
  });

  it('should failed to update the email', async () => {
    const id = 17;
    const name = 'abc';
    const email = 'abc@gmail.com';

    const stubGetEmail = sandbox.stub(EmailModel, 'getEmailById').resolves(response);
    const stubEmailUpdate = sandbox.stub(EmailModel, 'updateEmail').resolves(0);

    await assert.rejects(EmailController.update(id, name, email), (err) => {
      assert.strictEqual(err.name, 'InternalError');
      assert.deepStrictEqual(err.message, 'Failed to update the email');
      return true;
    });

    sinon.assert.calledOnceWithExactly(stubGetEmail, id);
    sinon.assert.calledOnceWithExactly(stubEmailUpdate, {
      id,
      name,
      email,
    });
  });

  it('should throw not found when updating an email', async () => {
    const id = 17;
    const name = 'abc';
    const email = 'abc@gmail.com';

    const stubGetEmail = sandbox.stub(EmailModel, 'getEmailById').resolves(0);
    const stubEmailUpdate = sandbox.stub(EmailModel, 'updateEmail').resolves([1]);

    await assert.rejects(EmailController.update(id, name, email), (err) => {
      assert.strictEqual(err.name, 'NotFoundError');
      assert.deepStrictEqual(err.message, 'Email not found');
      return true;
    });

    sinon.assert.calledOnceWithExactly(stubGetEmail, id);
    sinon.assert.notCalled(stubEmailUpdate);
  });
});
