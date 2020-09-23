const KoaRouter = require("koa-router");

const router = new KoaRouter();

router.get("messages.new", "/new", async (ctx) => {
    const message = ctx.orm.message.build();
    await ctx.render("messages/new", {
        message,
        submitMessagePath: ctx.router.url("messages.create"),
        messagesPath: ctx.router.url("messages.index"),
    });
});

router.post("messages.create", "/", async (ctx) => {
    const message = ctx.orm.message.build(ctx.request.body);
    try {
        await message.save({ fields: ["senderId", "receiverId", "description"] });
        ctx.redirect(ctx.router.url("messages.show", {id: message.id}));
    } catch (validationError) {
        await ctx.render("messages/new", {
         message,
         errors: validationError.erros, 
         submitMessagePath: ctx.router.url("messages.create"),  
        });
        
    }
});

router.get("messages.index","/", async (ctx) => {
    const messages = await ctx.orm.message.findAll();
    await ctx.render("messages/index", {
        messages,
        newMessagePath: ctx.router.url("messages.new"),
        messagePath: (message) => ctx.router.url("messages.show", {id: message.id}),
    })
});

router.get("messages.show", "/:id", async (ctx) => {
    const message = await ctx.orm.message.findByPk(ctx.params.id);
    await ctx.render("messages/show", {
        message,
        messagesPath: ctx.router.url("messages.index"),
    });
});

module.exports = router