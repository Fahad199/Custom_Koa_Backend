const sinon = require('sinon');
const assert = require('assert').strict;
const CareerForm = require('../../../Controllers/careers');
const [validator, handle] = require('../../../Endpoints/careers/saveCareerForm');

const sandbox = sinon.createSandbox();

const endpoint = (ctx) => validator(ctx, () => handle(ctx));

function genBaseRequest() {
    return {
        name: "fahad saleem",
        email: "fahaddani123@gmail.com",
        description: "hello this is fahad from inertiasoft",
        contactNo: "+923133380675",
        jobTitle: "Backend Developer",
        attachmentId: "1",
    }
}

describe('Create CareerForm Endpoint', () => {
    afterEach(() => {
        sandbox.restore();
    });

    const name = 'arslan';
    const email = 'arslan121@gmail.com';
    const description = "Hello this is fahad from inertiasoft"
    const contactNo = '03331234569';
    const jobTitle = 'Backend Developer';
    const attachmentId = '1';

    it('Should create the CareerForm successfully.', async () => {
        const body = { name, email, description, contactNo, jobTitle, attachmentId };

        const ctx = {
            request: {
                body,
            },
        };

        const message = {
            message: 'Career Form saved successfully',
        };
        const result = {
            dataValues: {
                id: '123132',
            },
        };
        sandbox.stub(CareerForm, 'save').resolves(result);

        await endpoint(ctx);
        assert.deepStrictEqual(message, ctx.body);
        sinon.assert.calledOnceWithExactly(CareerForm.save, { name, email, description, contactNo, jobTitle, attachmentId });
    });

    describe('create request validation', () => {
        async function testValidation(body, details) {
            const ctx = {
                request: {
                    body,
                },
            };

            await assert.rejects(endpoint(ctx), (err) => {
                assert.strictEqual(err.name, 'ValidationError');
                assert.deepStrictEqual(err.details, details);
                return true;
            });
        }

        it('should validate request body', async () => {
            const body = genBaseRequest();
            body.name = 12121;
            await testValidation(body, {
                name: '"name" must be a string',
            });

            body.name = genBaseRequest().name;
            body.email = 'asaas';
            await testValidation(body, {
                email: '"email" must be a valid email',
            });

            body.email = genBaseRequest().email;
            body.description = 1122;
            await testValidation(body, {
                description: '"description" must be a string',
            });

            body.description = genBaseRequest().description;
            body.contactNo = 12121;
            await testValidation(body, {
                contactNo: '"contactNo" must be a string',
            });

            body.contactNo = genBaseRequest().contactNo;
            body.jobTitle = 12121;
            await testValidation(body, {
                jobTitle: '"jobTitle" must be a string',
            });

            body.jobTitle = genBaseRequest().jobTitle;
            body.attachmentId = '';
            await testValidation(body, {
                attachmentId: '"attachmentId" is not allowed to be empty',
            });
        });
    });
});
