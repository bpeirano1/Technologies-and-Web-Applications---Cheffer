const KoaRouter = require("koa-router");

const router = new KoaRouter();

router.get("users.new", "/new", async (ctx) => {
    const user = ctx.orm.user.build();
    await ctx.render("users/new", {
        user,
        submitUserPath: ctx.router.url("users.create"),
        usersPath: ctx.router.url("users.index")
    });
});


router.post("users.create", "/", async (ctx) => {
    const user = ctx.orm.user.build(ctx.request.body);
    try {
        await user.save({ fields: ["name", "lastname", "username", "email", "password", "picture", "country", "description"] });
        ctx.redirect(ctx.router.url("users.show", {id: user.id}));
    } catch (validationError) {
        await ctx.render("users/new", {
         user,
         errors: validationError.erros, 
         submitUserPath: ctx.router.url("users.create"),  
        });
        
    }
});

router.get("users.index","/", async (ctx) => {
    const users = await ctx.orm.user.findAll();
    await ctx.render("users/index", {
        users,
        newUserPath: ctx.router.url("users.new"),
        userPath: (user) => ctx.router.url("users.show", {id: user.id})
    })
});

router.get("users.show", "/:id", async (ctx) => {
    const user = await ctx.orm.user.findByPk(ctx.params.id);
    await ctx.render("users/show", {
        user,
        usersPath: ctx.router.url("users.index"),
    });
});


module.exports = router