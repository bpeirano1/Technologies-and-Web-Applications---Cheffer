const KoaRouter = require("koa-router");

const router = new KoaRouter();

router.get("comments.new", "/new", async (ctx) => {
    const comment = ctx.orm.comment.build();
    await ctx.render("comments/new", {
        comment,
        submitCommentPath: ctx.router.url("comments.create"),
    });
});

router.post("comments.create", "/", async (ctx) => {
    const comment = ctx.orm.comment.build(ctx.request.body);
    try {
        await comment.save({ fields: ["publicationId", "userId", "description"] });
        ctx.redirect(ctx.router.url("comments.new"));
    } catch (validationError) {
        await ctx.render("comments/new", {
         comment,
         errors: validationError.erros, 
         submitCommentPath: ctx.router.url("comments.create"),  
        });
        
    }
});
module.exports = router