const KoaRouter = require("koa-router");

const router = new KoaRouter();

router.get("usuarios.new", "/new", async (ctx) => {
    const usuario = ctx.orm.usuario.build();
    await ctx.render("usuarios/new", {
        usuario,
    });
});

module.exports = router