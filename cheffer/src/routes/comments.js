const KoaRouter = require("koa-router");

const router = new KoaRouter();

async function loadComment(ctx, next) {
    ctx.state.comment = await ctx.orm.comment.findByPk(ctx.params.id);
    return next();
};

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
        ctx.redirect(ctx.router.url("comments.show", {id: comment.id}));
    } catch (validationError) {
        await ctx.render("comments/new", {
         comment,
         submitCommentPath: ctx.router.url("comments.create"),
         commentsPath: ctx.router.url("comments.index"), 
         errors: validationError.errors,  
        });
        
    }
});

router.get("comments.index","/", async (ctx) => {
    const comments = await ctx.orm.comment.findAll();
    await ctx.render("comments/index", {
        comments,
        newCommentPath: ctx.router.url("comments.new"),
        commentPath: (comment) => ctx.router.url("comments.show", {id: comment.id}),
    })
});

router.get("comments.show", "/:id",loadComment, async (ctx) => {
    const { comment } = ctx.state;
    await ctx.render("comments/show", {
        comment,
        commentsPath: ctx.router.url("comments.index"),
        editCommentPath: ctx.router.url("comments.edit", {id: comment.id}),
    });
});

router.get("comments.edit", "/:id/edit",loadComment, async (ctx) => {
    const { comment }= ctx.state;
    await ctx.render("comments/edit", {
        comment,
        commentPath: ctx.router.url("comments.show",{id: comment.id}),
        submitCommentPath: ctx.router.url("comments.update", {id: comment.id}),
        deleteCommentPath: ctx.router.url("comments.delete", {id: comment.id}),
    });
});

router.patch("comments.update","/:id", loadComment, async (ctx) => {
    const { comment }  = ctx.state;
    try {
        const {publicationId, userId, description} = ctx.request.body;
        await comment.update({publicationId, userId, description})
        ctx.redirect(ctx.router.url("comments.show", {id: comment.id}))
    } catch (validationError) {
        await ctx.render("comments/edit", {
            comment,
            commentPath: ctx.router.url("comments.show",{id: comment.id}),
            submitCommentPath: ctx.router.url("comments.update", {id: comment.id}),
            deleteCommentPath: ctx.router.url("comments.delete", {id: comment.id}),
            errors: validationError.errors
        })
    }
});

router.del("comments.delete", "/:id", loadComment, async (ctx)=>{
    const { comment } = ctx.state;
    await comment.destroy();
    ctx.redirect(ctx.router.url("comments.index"));
});

module.exports = router