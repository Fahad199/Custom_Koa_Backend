const joi = require('@hapi/joi');
const multer = require('@koa/multer');
const { validateRequest } = require('../../middlewares/requestValidator');
const Attachment = require('../../Controllers/attachment');
const {
  validationRules,
  config: { BASE_URL, PORT },
} = require('../../constants');

const storage = multer.diskStorage({
  destination: (ctx, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (ctx, file, cb) => {
    file.filename = Date.now() + '_' + file.originalname;
    cb(null, file.filename);
  },
});

const upload = multer({ storage });

const schema = {
  files: {
    file: joi
      .object({
        size: joi.number().integer().min(1).required(),
      })
      .unknown(),
  },
  headers: {
    'content-type': joi.string().pattern(validationRules.contentTypeMultipartRegExp).required(),
  },
};

async function handler(ctx) {
  const { file } = ctx.request;

  const { id } = await Attachment.upload(JSON.stringify(file));

  if (id) {
    ctx.statusCode = 201;
    ctx.body = {
      id,
      url: `${BASE_URL}${PORT}/download/attachment/${id}`,
    };
  }
}

module.exports = [validateRequest(schema), upload.single('file'), handler];
