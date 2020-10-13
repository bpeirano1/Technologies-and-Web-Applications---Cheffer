const KoaRouter = require('koa-router');
const pkg = require('../../package.json');

const router = new KoaRouter();

async function loadUser(ctx, next) {
  ctx.state.user = await ctx.orm.user.findByPk(ctx.params.id);
  return next();
};

async function loadPublication(ctx, next) {
  ctx.state.publication = await ctx.orm.publication.findByPk(ctx.params.id);
  return next();
};

async function loadMessage(ctx, next) {
  ctx.state.message = await ctx.orm.message.findByPk(ctx.params.id);
  return next();
};

router.get('/', loadUser, loadPublication, loadMessage, async (ctx) => {
  const { user, publication, message } = ctx.state;
  await ctx.render('index', { appVersion: pkg.version,
    user,
    //publication,
    //message,
    usersPath: ctx.router.url("users.index"),
    //publicationsPath: ctx.router.url("publications.index", {userId: user.id}),
    //messagesPath: ctx.router.url("messages.index" , {userId: user.id}),
   });
});

module.exports = router;
