const KoaRouter = require("koa-router");

const router = new KoaRouter();

async function loadUser(ctx, next) {
    ctx.state.user = await ctx.orm.user.findByPk(ctx.params.id);
    return next();
};

router.get("users.new", "/new", async (ctx) => {
    const user = ctx.orm.user.build();
    await ctx.render("users/new", {
        user,
        submitUserPath: ctx.router.url("users.create"),
        usersPath: ctx.router.url("users.index"),
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
         submitUserPath: ctx.router.url("users.create"),
         usersPath: ctx.router.url("users.index"), 
         errors: validationError.errors,  
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

router.get("users.show", "/:id",loadUser, async (ctx) => {
    const { user } = ctx.state;
    await ctx.render("users/show", {
        user,
        usersPath: ctx.router.url("users.index"),
        editUserPath: ctx.router.url("users.edit", {id: user.id}),

        // para irse a comentarios
        publicationsPath: ctx.router.url("publications.index", {userId: user.id}),
        //para irse a mensajes
        messagesPath: ctx.router.url("messages.index", {userId: user.id}),
    });
});

router.get("users.edit", "/:id/edit",loadUser, async (ctx) => {
    const { user }= ctx.state;
    await ctx.render("users/edit", {
        user,
        userPath: ctx.router.url("users.show",{id: user.id}),
        submitUserPath: ctx.router.url("users.update", {id: user.id}),
        deleteUserPath: ctx.router.url("users.delete", {id: user.id}),
    });
});

router.patch("users.update","/:id", loadUser, async (ctx) => {
    const { user }  = ctx.state;
    try {
        const {name, lastname, username, email, password,
             picture, country, description} = ctx.request.body;
        await user.update({name, lastname, username, email, password, picture, country, description})
        ctx.redirect(ctx.router.url("users.show", {id: user.id}))
    } catch (validationError) {
        await ctx.render("users/edit", {
            user,
            userPath: ctx.router.url("users.show",{id: user.id}),
            submitUserPath: ctx.router.url("users.update", {id: user.id}),
            deleteUserPath: ctx.router.url("users.delete", {id: user.id}),
            errors: validationError.errors
        })
    }
});

router.del("users.delete", "/:id", loadUser, async (ctx)=>{
    const { user } = ctx.state;
    await user.destroy();
    ctx.redirect(ctx.router.url("users.index"));
});

module.exports = router