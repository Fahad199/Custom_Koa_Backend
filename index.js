const logger = require('koa-logger');
const app = require('./src/app');
const sequelize = require('./src/helpers/dbConnection');

sequelize.sync().then(() => {
  app.listen(process.env.PORT, async () => {
    console.log(`server listening on port ${process.env.PORT}`);
    try {
      await sequelize.authenticate();
      console.log('Database successfully connected!');
    } catch (err) {
      console.error('failed to connect', err);
    }
  });
});

app.use(logger('dev'));

app.use((err, ctx) => {
  ctx.locals.message = err.message;
  ctx.locals.error = ctx.app.get('env') === 'development' ? err : {};
  ctx.status = err.status || 500;
  ctx.render = 'error';
});

module.exports = app;
