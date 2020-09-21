const KoaRouter = require("koa-router");

const router = new KoaRouter();

router.get("mensajes.new", "/new", async (ctx) => {
    const mensaje = ctx.orm.mensaje.build();
    await ctx.render("mensajes/new", {
        mensaje,
    });
});

module.exports = router