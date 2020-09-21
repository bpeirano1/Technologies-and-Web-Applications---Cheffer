const KoaRouter = require("koa-router");

const router = new KoaRouter();

router.get("comentarios.new", "/new", async (ctx) => {
    const comentario = ctx.orm.comentario.build();
    await ctx.render("comentarios/new", {
        comentario,
    });
});

module.exports = router