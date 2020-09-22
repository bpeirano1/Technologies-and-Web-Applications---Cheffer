const KoaRouter = require("koa-router");

const router = new KoaRouter();

router.get("messages.new", "/new", async (ctx) => {
    const message = ctx.orm.message.build();
    await ctx.render("messages/new", {
        message,
    });
});

module.exports = router