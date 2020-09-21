const KoaRouter = require("koa-router");

const router = new KoaRouter();

router.get("publicaciones.new", "/new", async (ctx) => {
    const publicacion = ctx.orm.publicacion.build();
    await ctx.render("publicaciones/new", {
        publicacion,
    });
});

module.exports = router