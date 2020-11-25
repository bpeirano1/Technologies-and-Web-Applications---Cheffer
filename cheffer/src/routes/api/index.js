const KoaRouter = require('koa-router');
const jwt = require('koa-jwt');
const auth = require('./auth');

const router = new KoaRouter({ prefix: '/api' });

router.use((ctx, next) => {
  ctx.apiUrl = (...params) => `${ctx.origin}${ctx.router.url(...params)}`;
  return next();
});

router.get('/', async (ctx) => {
  ctx.body = { message: 'savetalk API' };
});

//router.use('/auth', auth.routes());
//router.use('/events', events.routes());

router.use(jwt({ secret: process.env.JWT_SECRET, key: 'jwtDecoded' }));

//router.use('/users', users.routes());

module.exports = router;