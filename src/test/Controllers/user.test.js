const assert = require('assert').strict;
const sinon = require('sinon');

const UserController = require('../../Controllers/user');
const UserModel = require('../../models/user');

const sandbox = sinon.createSandbox();

const response = {
  dataValues: {
    id: 12,
    name: 'Arslan',
    userName: 'arslan.fareed',
    password: 'arslan1234',
    role: 'Admin',
    updatedAt: '2020-10-02T05:54:14.256Z',
    createdAt: '2020-10-02T05:54:14.256Z',
  },
  _previousDataValues: {
    name: 'Arslan',
    userName: 'arslan.fareed',
    password: 'arslan1234',
    role: 'Admin',
    id: 12,
    createdAt: '2020-10-02T05:54:14.256Z',
    updatedAt: '2020-10-02T05:54:14.256Z',
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

const userParams = {
  name: 'fahad',
  userName: 'fahad12',
  password: 'fahad',
  role: 'Admin',
};

describe('User Controller', () => {
  afterEach(() => {
    sandbox.restore();
  });

  it('should create a user successfully', async () => {
    const stubUserCreate = sandbox.stub(UserModel, 'create').resolves(response);
    const user = await UserController.create(userParams);

    sinon.assert.calledOnceWithExactly(stubUserCreate, {
      name: userParams.name,
      userName: userParams.userName,
      password: userParams.password,
      role: userParams.role,
    });

    assert.strictEqual(user.dataValues.id, response.dataValues.id);
  });

  it('should failed to create a user', async () => {
    const stubUserCreate = sandbox.stub(UserModel, 'create').resolves(0);

    await assert.rejects(UserController.create(userParams), (err) => {
      assert.strictEqual(err.name, 'InternalError');
      assert.deepStrictEqual(err.message, 'Failed to create the user');
      return true;
    });

    sinon.assert.calledOnceWithExactly(stubUserCreate, {
      name: userParams.name,
      userName: userParams.userName,
      password: userParams.password,
      role: userParams.role,
    });
  });

  it('should get users successfully', async () => {
    const page = 1;
    const limit = 1;
    const stubGetUsers = sandbox.stub(UserModel, 'getUsers').resolves([response]);
    const user = await UserController.getUsers({ pageNum: page, pageSize: limit });

    sinon.assert.calledOnceWithExactly(stubGetUsers, page, limit);

    assert.strictEqual(user[0].id, response.dataValues.id);
  });

  it('should throw user not found when not getting a user collection', async () => {
    const page = 1;
    const limit = 1;
    const stubGetUsers = sandbox.stub(UserModel, 'getUsers').resolves([]);

    await assert.rejects(UserController.getUsers({ pageNum: page, pageSize: limit }), (err) => {
      assert.strictEqual(err.name, 'NotFoundError');
      assert.deepStrictEqual(err.message, 'User not found');
      return true;
    });

    sinon.assert.calledOnceWithExactly(stubGetUsers, page, limit);
  });

  it('should delete the user successfully', async () => {
    const id = 12;
    const stubDeleteUser = sandbox.stub(UserModel, 'deleteUser').resolves(1);
    const user = await UserController.delete(id);

    sinon.assert.calledOnceWithExactly(stubDeleteUser, id);

    assert.strictEqual(user, 1);
  });

  it('should failed to delete the user', async () => {
    const id = 12;
    const stubDeleteUser = sandbox.stub(UserModel, 'deleteUser').resolves(2);

    await assert.rejects(UserController.delete(id), (err) => {
      assert.strictEqual(err.name, 'ValidationError');
      assert.deepStrictEqual(err.message, 'Failed to delete the user');
      return true;
    });

    sinon.assert.calledOnceWithExactly(stubDeleteUser, id);
  });

  it('should throw user not found and failed to delete the user', async () => {
    const id = 12;
    const stubDeleteUser = sandbox.stub(UserModel, 'deleteUser').resolves(0);

    await assert.rejects(UserController.delete(id), (err) => {
      assert.strictEqual(err.name, 'NotFoundError');
      assert.deepStrictEqual(err.message, 'User not found');
      return true;
    });

    sinon.assert.calledOnceWithExactly(stubDeleteUser, id);
  });

  it('should update a user successfully', async () => {
    const id = 12;
    const name = 'abc';
    const userName = 'abc12';
    const role = 'Incharge';

    const stubGetUser = sandbox.stub(UserModel, 'getUserById').resolves(response);
    const stubUserUpdate = sandbox.stub(UserModel, 'updateUser').resolves([1]);
    await UserController.update({ id, name, userName, role });

    sinon.assert.calledOnceWithExactly(stubGetUser, id);
    sinon.assert.calledOnceWithExactly(stubUserUpdate, {
      id,
      name,
      userName,
      role,
    });
  });

  it('should throw user not found when upating a user', async () => {
    const id = 12;
    const name = 'abc';
    const userName = 'abc12';
    const role = 'Incharge';

    const stubGetUser = sandbox.stub(UserModel, 'getUserById').resolves(0);
    const stubUserUpdate = sandbox.stub(UserModel, 'updateUser').resolves([1]);

    await assert.rejects(UserController.update({ id, name, userName, role }), (err) => {
      assert.strictEqual(err.name, 'NotFoundError');
      assert.deepStrictEqual(err.message, 'User not found');
      return true;
    });

    sinon.assert.calledOnceWithExactly(stubGetUser, id);
    sinon.assert.notCalled(stubUserUpdate);
  });

  it('should failed to update a user', async () => {
    const id = 12;
    const name = 'abc';
    const userName = 'abc12';
    const role = 'Incharge';

    const stubGetUser = sandbox.stub(UserModel, 'getUserById').resolves(response);
    const stubUserUpdate = sandbox.stub(UserModel, 'updateUser').resolves(0);

    await assert.rejects(UserController.update({ id, name, userName, role }), (err) => {
      assert.strictEqual(err.name, 'InternalError');
      assert.deepStrictEqual(err.message, 'Failed to update the user');
      return true;
    });

    sinon.assert.calledOnceWithExactly(stubGetUser, id);
    sinon.assert.calledOnceWithExactly(stubUserUpdate, {
      id,
      name,
      userName,
      role,
    });
  });

  it('should get a user successfully', async () => {
    const userName = 'abc';
    const password = 'abc1234';
    const stubGetUser = sandbox.stub(UserModel, 'getUser').resolves(response);
    const user = await UserController.getUser({ userName, password });

    sinon.assert.calledOnceWithExactly(stubGetUser, userName, password);

    assert.strictEqual(user.dataValues.id, response.dataValues.id);
  });

  it('should throw user not found when not getting a user', async () => {
    const userName = 'abc';
    const password = 'abc1234';
    const stubGetUser = sandbox.stub(UserModel, 'getUser').resolves(0);

    await assert.rejects(UserController.getUser({ userName, password }), (err) => {
      assert.strictEqual(err.name, 'NotFoundError');
      assert.deepStrictEqual(err.message, 'User not found');
      return true;
    });

    sinon.assert.calledOnceWithExactly(stubGetUser, userName, password);
  });
});
