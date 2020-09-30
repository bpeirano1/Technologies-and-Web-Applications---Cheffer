const KoaRouter = require("koa-router");

const router = new KoaRouter();

async function loadComment(ctx, next) {
    ctx.state.comment = await ctx.orm.comment.findByPk(ctx.params.id);
    return next();
};

async function loadUser(ctx, next) {
    ctx.state.user = await ctx.orm.user.findByPk(ctx.params.userId);
    return next();
};

async function loadPublication(ctx, next) {
    ctx.state.publication = await ctx.orm.publication.findByPk(ctx.params.publicationId);
    return next();
};

router.get("comments.new", "/new", loadUser, loadPublication, async (ctx) => {
    const { user, publication } = ctx.state;
    const comment = ctx.orm.comment.build();
    await ctx.render("comments/new", {
        user,
        comment,
        publication,
        submitCommentPath: ctx.router.url("comments.create", {
            userId: user.id, publicationId: publication.id
        }),
        commentsPath: ctx.router.url("comments.index", {
            userId: user.id, publicationId: publication.id
        }),
    });
});

router.post("comments.create", "/", loadUser, loadComment, loadPublication, async (ctx) => {
    const comment = ctx.orm.comment.build(ctx.request.body);
    const { user, publication } = ctx.state;
    try {
        await comment.save({ fields: ["publicationId", "userId", "description"] });
        ctx.redirect(ctx.router.url("comments.show", {id: comment.id, userId: user.id, publicationId: publication.id}));
    } catch (validationError) {
        await ctx.render("comments/new", {
         comment,
         user,
         publication,
         submitCommentPath: ctx.router.url("comments.create", {
            userId: user.id, publicationId: publication.id
        }),
         commentsPath: ctx.router.url("comments.index", {
            userId: user.id, publicationId: publication.id
        }), 
         errors: validationError.errors,  
        });
        
    }
});

router.get("comments.index","/", loadUser, loadComment, loadPublication, async (ctx) => {
    const comments = await ctx.orm.comment.findAll();
    const { user, comment, publication } = ctx.state;
    await ctx.render("comments/index", {
        comments,
        user,
        publication,
        comment,
        newCommentPath: ctx.router.url("comments.new", {userId: user.id, publicationId: publication.id}),
        commentPath: (comment) => ctx.router.url("comments.show", {id: comment.id, userId: user.id, publicationId: publication.id}),
    })
});

router.get("comments.show", "/:id", loadUser, loadComment, loadPublication, async (ctx) => {
    const { comment, user, publication } = ctx.state;
    await ctx.render("comments/show", {
        comment,
        user,
        commentsPath: ctx.router.url("comments.index", {id: comment.id, userId: user.id, publicationId: publication.id}),
        editCommentPath: ctx.router.url("comments.edit", {id: comment.id, userId: user.id, publicationId: publication.id}),
    });
});

router.get("comments.edit", "/:id/edit",loadComment, loadUser, loadPublication, async (ctx) => {
    const { comment, user, publication }= ctx.state;
    await ctx.render("comments/edit", {
        comment,
        user,
        publication,
        commentPath: ctx.router.url("comments.show",{id: comment.id, userId: user.id, publicationId: publication.id}),
        submitCommentPath: ctx.router.url("comments.update", {id: comment.id, userId: user.id, publicationId: publication.id}),
        deleteCommentPath: ctx.router.url("comments.delete", {id: comment.id, userId: user.id, publicationId: publication.id}),
    });
});

router.patch("comments.update","/:id", loadComment, loadUser, loadPublication, async (ctx) => {
    const { comment, user, publication }  = ctx.state;
    try {
        const {publicationId, userId, description} = ctx.request.body;
        await comment.update({publicationId, userId, description})
        ctx.redirect(ctx.router.url("comments.show", {id: comment.id, userId: user.id, publicationId: publication.id}))
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

router.del("comments.delete", "/:id", loadComment, loadUser, loadPublication, async (ctx)=>{
    const { comment, user, publication } = ctx.state;
    await comment.destroy();
    ctx.redirect(ctx.router.url("comments.index", {userId: user.id, publicationId: publication.id}));
});

module.exports = router