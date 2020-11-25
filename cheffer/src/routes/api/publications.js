const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.param('id', async (id, ctx, next) => {
  const event = await ctx.orm.event.findByPk(id, { include: ['organization', 'attendees'] });
  if (!event) ctx.throw(404);
  ctx.state.event = event;
  return next();
});

router.get('/', async (ctx) => {
  const events = await ctx.orm.event.findAll({ include: 'organization' });
  ctx.body = events.map((event) => ({
    ...event.toJSON(),
    eventUrl: ctx.apiUrl('event', event.id),
  }));
});

router.get('event', '/:id', async (ctx) => {
  const { event } = ctx.state;
  ctx.body = {
    ...event.toJSON(),
    attendancesUrl: ctx.apiUrl('event-attendances', event.id),
  };
});

router.get('event-attendances', '/:id/attendances', async (ctx) => {
  const { event } = ctx.state;
  ctx.body = event.attendees.map(({ id, email }) => ({ id, email }));
});

module.exports = router;