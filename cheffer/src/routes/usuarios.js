const KoaRouter = require("koa-router");

const router = new KoaRouter();

router.get("usuarios.new", "/new", async (ctx) => {
    const usuario = ctx.orm.usuario.build();
    await ctx.render("usuarios/new", {
        usuario,
    });
});

router.post("books.create", "/", async (ctx) => {
    const usuario = ctx.orm.usuario.build(ctx.request.body);
    try {
    await usuario.save({fields:["name", "lastname", "nickname", "email", "password", "foto", "pais", "descripcion"]});
    ctx.redirect(ctx.router.url("usuarios.new"));
    } catch (error) {
        
    }
   
});
module.exports = router