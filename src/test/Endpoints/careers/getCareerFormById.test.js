const sinon = require('sinon');
const assert = require('assert').strict;
const CareerForm = require('../../../Controllers/careers');
const [validator, handle] = require('../../../Endpoints/careers/getCareerFormById');

const sandbox = sinon.createSandbox();

const endpoint = (ctx) => validator(ctx, () => handle(ctx));

describe('Get Career Form by Id Endpoint', () => {
    afterEach(() => {
        sandbox.restore();
    });

    const id = 1;

    it('Should get the CareerForm by id successfully.', async () => {
        const params = { id };

        const ctx = {
            params,
        };

        const response = {
            id: 1,
            name: "fahad saleem",
            email: "fahaddani123@gmail.com",
            description: "hello this is fahad from inertiasoft",
            contactNo: "+923133380675",
            jobTitle: "Backend Developer",
            attachmentId: 1,
            createdAt: "2020-11-09T12:31:15.000Z",
            updatedAt: "2020-11-09T12:31:15.000Z"
        }

        sandbox.stub(CareerForm, 'getById').resolves(response);

        await endpoint(ctx);
        assert.deepStrictEqual(response, ctx.body);
        sinon.assert.calledOnceWithExactly(CareerForm.getById, id);
    });

    describe('get career form by id request validation', () => {
        async function testValidation(params, details) {
            const ctx = {
                params,
            };

            await assert.rejects(endpoint(ctx.params), (err) => {
                assert.strictEqual(err.name, 'ValidationError');
                assert.deepStrictEqual(err.details, details);
                return true;
            });
        }

        it('should validate request params', async () => {
            const params = { id };
            params.id = 'saasa';
            await testValidation(params, { id: '"id" is required' });
        });

        it('should validate request params', async () => {
            const params = { id };
            params.id = 0;
            await testValidation(params, { id: '"id" is required' });
        });
    });
});
