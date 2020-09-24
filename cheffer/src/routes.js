const KoaRouter = require('koa-router');

const hello = require('./routes/hello');
const index = require('./routes/index');
const users = require('./routes/users');
const publications = require('./routes/publications');
const comments = require('./routes/comments');
const messages = require('./routes/messages');
const reports = require('./routes/reports');

const router = new KoaRouter();

router.use('/', index.routes());
router.use('/hello', hello.routes());
router.use('/users', users.routes());
router.use('/users/:userId/publications', publications.routes());
router.use('/users/:userId/publications/:publicationId/comments', comments.routes());
router.use('/users/:userId/publications/:publicationId/reports', reports.routes());


module.exports = router;
