const KoaRouter = require("koa-router");

const router = new KoaRouter();

router.get("users.new", "/new", async (ctx) => {
    const user = ctx.orm.user.build();
    await ctx.render("users/new", {
        user,
        submitUserPath: ctx.router.url("users.create"),
    });
});


router.post("users.create", "/", async (ctx) => {
    const user = ctx.orm.user.build(ctx.request.body);
    try {
        await user.save({ fields: ["name", "lastname", "username", "email", "password", "picture", "country", "description"] });
        ctx.redirect(ctx.router.url("users.new"));
    } catch (validationError) {
        await ctx.render("users/new", {
         user,
         errors: validationError.erros, 
         submitUserPath: ctx.router.url("users.create"),  
        });
        
    }
});

module.exports = router