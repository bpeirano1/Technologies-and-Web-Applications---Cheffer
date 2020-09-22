const KoaRouter = require("koa-router");

const router = new KoaRouter();

router.get("messages.new", "/new", async (ctx) => {
    const message = ctx.orm.message.build();
    await ctx.render("messages/new", {
        message,
        submitMessagePath: ctx.router.url("messages.create"),
    });
});

router.post("messages.create", "/", async (ctx) => {
    const message = ctx.orm.message.build(ctx.request.body);
    try {
        await message.save({ fields: ["senderId", "receiverId", "description"] });
        ctx.redirect(ctx.router.url("messages.new"));
    } catch (validationError) {
        await ctx.render("messages/new", {
         message,
         errors: validationError.erros, 
         submitMessagePath: ctx.router.url("messages.create"),  
        });
        
    }
});

module.exports = router