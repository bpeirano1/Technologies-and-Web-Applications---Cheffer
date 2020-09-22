const KoaRouter = require("koa-router");

const router = new KoaRouter();

router.get("comments.new", "/new", async (ctx) => {
    const comment = ctx.orm.comment.build();
    await ctx.render("comments/new", {
        comment,
    });
});

module.exports = router