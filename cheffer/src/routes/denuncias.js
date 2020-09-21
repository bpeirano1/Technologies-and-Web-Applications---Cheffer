const KoaRouter = require("koa-router");

const router = new KoaRouter();

router.get("denuncias.new", "/new", async (ctx) => {
    const denuncia = ctx.orm.denuncia.build();
    await ctx.render("denuncias/new", {
        denuncia,
    });
});

module.exports = router