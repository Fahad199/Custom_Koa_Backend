const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const serve = require('koa-static');
const cors = require('koa-cors');

const errorHandler = require('./middlewares/lib/errorHandler');
const handleErrors = require('./middlewares/handleErrors');
const { sendMail } = require('./middlewares/sendMail');

const login = require('./Endpoints/user/login');
const { createUser, getUsers, updateUser, deleteUser } = require('./Endpoints/user');
const { addEmail, updateEmail, getEmails, deleteEmail } = require('./Endpoints/email');
const { saveContactUs, getContactUs } = require('./Endpoints/contactUs');
const { saveCareerForm, getCareerForms, getCareerFormById } = require('./Endpoints/careers')
const { createBlog, getBlogsByStatus, getBlogById, deleteBlog, updateBlog } = require('./Endpoints/blogs');
const { upload, download } = require('./Endpoints/attachments');
const { subscribeWebsite, unsubscribeWebsite } = require('./Endpoints/subscriptions/index');

const app = new Koa();

const router = new Router();

const corsOptions = {
  origin: '*',
};

app.use(cors(corsOptions));
app.use(bodyParser());
app.use(serve('/uploads'));

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    err.status = err.statusCode || err.status || 500;
    ctx.body = err.message;
    ctx.app.emit('error', err, ctx);
  }
});
app.use(handleErrors(errorHandler));
app.use(router.routes()).use(router.allowedMethods());
// app.use(handleErrors())
app.use(sendMail);

// Login User Endpoint
router.post('/login', ...login.flat());

// User Endpoint
router.post('/user', ...createUser.flat());
router.patch('/user/:id', ...updateUser.flat());
router.get('/users', ...getUsers.flat());
router.delete('/user/:id', ...deleteUser.flat());

// Email Endpoint
router.post('/email', ...addEmail.flat());
router.patch('/email/:id', ...updateEmail.flat());
router.get('/emails', ...getEmails.flat());
router.delete('/email/:id', ...deleteEmail.flat());

//Email Subscriptions
router.post('/website/subscribe', ...subscribeWebsite.flat());
router.post('/website/unsubscribe', ...unsubscribeWebsite.flat());

// Contact-Us Endpoint
router.post('/contact-us', ...saveContactUs.flat());
router.get('/contact-us', ...getContactUs.flat());

// Career-Form Endpoint
router.post('/career-form', ...saveCareerForm.flat());
router.get('/career-forms', ...getCareerForms.flat());
router.get('/career-form/:id', ...getCareerFormById.flat());

// Blogs Endpoint
router.post('/blog', ...createBlog.flat());
router.get('/blogs', ...getBlogsByStatus.flat());
router.get('/blog/:id', ...getBlogById.flat());
router.delete('/blog/:id', ...deleteBlog.flat());
router.patch('/blog/:id', ...updateBlog.flat());

// Image Endpoint
router.post('/upload/attachment', ...upload.flat());
router.get('/download/attachment/:id', ...download.flat());

module.exports = app;
