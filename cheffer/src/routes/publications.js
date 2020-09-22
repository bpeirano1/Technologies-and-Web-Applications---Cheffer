const KoaRouter = require("koa-router");

const router = new KoaRouter();

router.get("publications.new", "/new", async (ctx) => {
    const publication = ctx.orm.publication.build();
    await ctx.render("publications/new", {
        publication,
    });
});

module.exports = router