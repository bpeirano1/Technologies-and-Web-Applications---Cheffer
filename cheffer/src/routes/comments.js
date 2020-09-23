const KoaRouter = require("koa-router");

const router = new KoaRouter();

router.get("comments.new", "/new", async (ctx) => {
    const comment = ctx.orm.comment.build();
    await ctx.render("comments/new", {
        comment,
        submitCommentPath: ctx.router.url("comments.create"),
        commentsPath: ctx.router.url("comments.index"),
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

router.get("comments.index","/", async (ctx) => {
    const comments = await ctx.orm.comment.findAll();
    await ctx.render("comments/index", {
        comments,
        newCommentPath: ctx.router.url("comments.new"),
    })
});

module.exports = router