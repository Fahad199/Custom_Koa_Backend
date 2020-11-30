const sinon = require('sinon');
const assert = require('assert').strict;
const CareerForm = require('../../../Controllers/careers');
const [validator, handle] = require('../../../Endpoints/careers/getCareerForms');

const sandbox = sinon.createSandbox();

const endpoint = (ctx) => validator(ctx, () => handle(ctx));

describe('Get CareerForms Endpoint', () => {
    afterEach(() => {
        sandbox.restore();
    });

    const pageNum = 1;
    const pageSize = 1;
    const sort = 'ASC';

    it('Should get the CareerForms successfully.', async () => {
        const query = { pageNum, pageSize, sort };

        const ctx = {
            request: {
                query,
            },
        };

        const response = [
            {
                id: 1,
                name: "fahad saleem",
                email: "fahaddani123@gmail.com",
                description: "hello this is fahad from inertiasoft",
                contactNo: "+923133380675",
                jobTitle: "Backend Developer",
                attachmentId: 1
            }
        ];

        sandbox.stub(CareerForm, 'getCareerForms').resolves(response);

        await endpoint(ctx);
        assert.deepStrictEqual(response, ctx.body);
        sinon.assert.calledOnceWithExactly(CareerForm.getCareerForms, { pageSize, pageNum, sort });
    });

    describe('get request validation', () => {
        async function testValidation(query, details) {
            const ctx = {
                request: {
                    query,
                },
            };

            await assert.rejects(endpoint(ctx), (err) => {
                assert.strictEqual(err.name, 'ValidationError');
                assert.deepStrictEqual(err.details, details);
                return true;
            });
        }

        it('should validate request body', async () => {
            const query = { pageNum, pageSize };
            query.pageNum = 'asas';
            await testValidation(query, {
                pageNum: '"pageNum" must be a number',
            });

            query.pageNum = 1;
            query.pageSize = 'asaas';
            await testValidation(query, {
                pageSize: '"pageSize" must be a number',
            });

            query.pageSize = 1;
            query.sort = 'AC';
            await testValidation(query, {
                sort: '"sort" must be one of [ASC, DESC]',
            });
        });
    });
});
