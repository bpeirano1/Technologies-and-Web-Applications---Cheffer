const KoaRouter = require("koa-router");

const router = new KoaRouter();

router.get("users.new", "/new", async (ctx) => {
    const user = ctx.orm.user.build();
    await ctx.render("users/new", {
        user,
    });
});

module.exports = router