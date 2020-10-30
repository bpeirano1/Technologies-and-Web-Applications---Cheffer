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
const admins = require('./routes/admins');

const router = new KoaRouter();
const hashids = new Hashids(); 

router.use(async (ctx, next) => {
    decodedId = hashids.decode(ctx.session.userId, process.env.HASH_SECRET)
    Object.assign(ctx.state, {
        currentUser: ctx.session.userId && await ctx.orm.user.findByPk(decodedId[0]),
        signInPath: ctx.router.url("users.session.new"),
        signOutPath: ctx.router.url("users.session.destroy"),
        feedPath: ctx.router.url("feed.show"),
        newPublicationPath: ctx.session.userId && ctx.router.url("publications.new", {userId: decodedId[0]}),
        messagesPath: ctx.session.userId && ctx.router.url("messages.index", {userId: decodedId[0]}),
        userPath: (user) => ctx.router.url("users.show", {id: decodedId[0]}),
        editUserPath: ctx.session.userId && ctx.router.url("users.edit", {id: decodedId[0]}),
        
    });

    return next();
});

router.use(async (ctx, next) => {
    adminDecodedId = hashids.decode(ctx.session.adminId, process.env.HASH_SECRET)
    Object.assign(ctx.state, {
        currentAdmin: ctx.session.adminId && await ctx.orm.admin.findByPk(adminDecodedId[0]),
        adminsignInPath: ctx.router.url("admins.session.new"),
        adminsignOutPath: ctx.router.url("admins.session.destroy"),
    });
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
router.use('/admins', admins.routes());


module.exports = router;
