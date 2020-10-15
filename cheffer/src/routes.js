const KoaRouter = require('koa-router');
const Hashids = require('hashids/cjs');

require("dotenv").config();

const hello = require('./routes/hello');
const index = require('./routes/index');
const users = require('./routes/users');
const publications = require('./routes/publications');
const comments = require('./routes/comments');
const messages = require('./routes/messages');
const reports = require('./routes/reports');
const feed = require('./routes/feed');

const router = new KoaRouter();
const hashids = new Hashids();

router.use(async (ctx, next) => {
    decodedId = hashids.decode(ctx.session.userId, process.env.HASH_SECRET)
    console.log(decodedId)
    Object.assign(ctx.state, {
        currentUser: ctx.session.userId && await ctx.orm.user.findByPk(decodedId[0]),
        signInPath: ctx.router.url("users.session.new"),
        signOutPath: ctx.router.url("users.session.destroy"),
    });
    console.log("aaaaaaaaaaaaaaaaa");
    console.log(ctx.state.currentUser);
    return next();
});

router.use('/', index.routes());
router.use('/hello', hello.routes());
router.use('/users', users.routes());
router.use('/users/:userId/publications', publications.routes());
router.use('/users/:userId/publications/:publicationId/comments', comments.routes());
router.use('/users/:userId/publications/:publicationId/reports', reports.routes());
router.use('/users/:userId/messages', messages.routes());
router.use('/feed', feed.routes());


module.exports = router;
