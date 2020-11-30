const assert = require('assert').strict;
const sinon = require('sinon');

const WebsiteSubscriber = require('../../Controllers/subscriptions');
const SubscriptionModel = require('../../models/subscriptions');

const sandbox = sinon.createSandbox();

const response = {
  dataValues: {
    id: 17,
    name: 'fahad',
    email: 'abc@gmail.com',
    updatedAt: '2020-10-02T05:19:03.434Z',
    createdAt: '2020-10-02T05:19:03.434Z',
  },
  _previousDataValues: {
    name: 'fahad',
    email: 'abc@gmail.com',
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

const params = {
  email: 'abc@gmail.com',
};

describe('Webiste Subscriptions Controller', () => {
  afterEach(() => {
    sandbox.restore();
  });

  it('should subscribe by an email successfully', async () => {
    const stubWebsiteSubscribe= sandbox.stub(SubscriptionModel, 'subscribeWebsite').resolves([1]);
    await WebsiteSubscriber.subscribeWebsite(params);

    sinon.assert.calledOnceWithExactly(stubWebsiteSubscribe, {
      email: params.email,
    });
  });

  it('should failed to subscribe by an email', async () => {
    const stubWebsiteSubscribe = sandbox.stub(SubscriptionModel, 'subscribeWebsite').resolves(0);

    await assert.rejects(WebsiteSubscriber.subscribeWebsite(params), (err) => {
      assert.strictEqual(err.name, 'InternalError');
      assert.deepStrictEqual(err.message, 'Failed to subscribe');
      return true;
    });

    sinon.assert.calledOnceWithExactly(stubWebsiteSubscribe, {
      email: params.email,
    });
  });

  it('should unsubscribe by an email successfully', async () => {
    const email = 'abc@gmail.com';

    const stubGetEmail = sandbox.stub(SubscriptionModel, 'getEmail').resolves(response);
    const stubWebsiteSubscribe = sandbox.stub(SubscriptionModel, 'unsubscribeWebsite').resolves([1]);
    await WebsiteSubscriber.unsubscribeWebsite(email);

    sinon.assert.calledOnceWithExactly(stubGetEmail, email);
    sinon.assert.calledOnceWithExactly(stubWebsiteSubscribe, email);
  });

  it('should failed to unsubscribe by an email', async () => {
    const email = 'abc@gmail.com';

    const stubGetEmail = sandbox.stub(SubscriptionModel, 'getEmail').resolves(response);
    const stubWebsiteSubscribe = sandbox.stub(SubscriptionModel, 'unsubscribeWebsite').resolves(0);

    await assert.rejects(WebsiteSubscriber.unsubscribeWebsite(email), (err) => {
      assert.strictEqual(err.name, 'InternalError');
      assert.deepStrictEqual(err.message, 'Failed to unsubscribe');
      return true;
    });

    sinon.assert.calledOnceWithExactly(stubGetEmail, email);
    sinon.assert.calledOnceWithExactly(stubWebsiteSubscribe, email);
  });

  it('should throw not found when unsubscribing by an email', async () => {
    const email = 'abc@gmail.com';

    const stubGetEmail = sandbox.stub(SubscriptionModel, 'getEmail').resolves(0);
    const stubWebsiteSubscribe = sandbox.stub(SubscriptionModel, 'unsubscribeWebsite').resolves(0);

    await assert.rejects(WebsiteSubscriber.unsubscribeWebsite(email), (err) => {
      assert.strictEqual(err.name, 'NotFoundError');
      assert.deepStrictEqual(err.message, 'The user have not subscribed yet');
      return true;
    });

    sinon.assert.calledOnceWithExactly(stubGetEmail, email);
    sinon.assert.notCalled(stubWebsiteSubscribe);
  });
});
