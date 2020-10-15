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
 
router.post("comments.create", "/", loadUser, loadPublication, async (ctx) => {
    const comment = ctx.orm.comment.build(ctx.request.body);
    const { user, publication } = ctx.state;
    comment.publicationId = publication.id
    comment.userId = ctx.state.currentUser.id
    console.log("AAAAAAAAAAAAAAAAAa")
    console.log(ctx.state.currentUser);
    try {
        await comment.save({ fields: ["publicationId", "userId", "description"] });
        ctx.redirect(ctx.router.url("publications.show", {id: publication.id, userId: user.id}));
    } catch (validationError) {
        const comments = await publication.getComments()
        for (const comment of comments) {
            const user = await comment.getUser()
            comment.user = user
        }
        await ctx.render("publications/show", {
            publication,
            publicationsPath: ctx.router.url("publications.index", {userId: user.id}),
            editPublicationPath: ctx.router.url("publications.edit", {userId: user.id, id: publication.id}),
            
            // para que los comentarios aparezcan en publicacion
            comment,
            commentsPath: ctx.router.url("comments.index", {
                userId: user.id, publicationId: publication.id}),
            submitCommentPath: ctx.router.url("comments.create", {
                userId: user.id, publicationId: publication.id
            }),
            user,
            comments,
            // falta hacer lo mismo con report pero por mientras lo vamos a redireccionar para la navegabilidad
            reportsPath: ctx.router.url("reports.index", {userId: user.id, publicationId: publication.id}),
            errors: validationError.errors,  
        });
        
    }
});

router.get("comments.index","/", loadUser, loadPublication, async (ctx) => {
    const comments = await ctx.orm.comment.findAll();
    const { user, comment, publication } = ctx.state;
    await ctx.render("comments/index", {
        comments,
        user,
        publication,
        comment,
        newCommentPath: ctx.router.url("comments.new", {userId: user.id, publicationId: publication.id, userUsername: user.username}),
        commentPath: (comment) => ctx.router.url("comments.show", {id: comment.id, userId: user.id, publicationId: publication.id, userUsername: user.username}),
    })
});

router.get("comments.show", "/:id", loadUser, loadComment, loadPublication, async (ctx) => {
    const { comment, user, publication } = ctx.state;
    await ctx.render("comments/show", {
        comment,
        user,
        commentsPath: ctx.router.url("comments.index", {id: comment.id, userId: user.id, publicationId: publication.id, userUsername: user.username}),
        editCommentPath: ctx.router.url("comments.edit", {id: comment.id, userId: user.id, publicationId: publication.id, userUsername: user.username}),
    });
});

router.get("comments.edit", "/:id/edit",loadComment, loadUser, loadPublication, async (ctx) => {
    const { comment, user, publication }= ctx.state;
    await ctx.render("comments/edit", {
        comment,
        user,
        publication,
        commentPath: ctx.router.url("comments.show",{id: comment.id, userId: user.id, publicationId: publication.id, userUsername: user.username}),
        submitCommentPath: ctx.router.url("comments.update", {id: comment.id, userId: user.id, publicationId: publication.id, userUsername: user.username}),
        deleteCommentPath: ctx.router.url("comments.delete", {id: comment.id, userId: user.id, publicationId: publication.id, userUsername: user.username}),
    });
});

router.patch("comments.update","/:id", loadComment, loadUser, loadPublication, async (ctx) => {
    const { comment, user, publication }  = ctx.state;
    try {
        const {publicationId, userId, description, userUsername} = ctx.request.body;
        await comment.update({publicationId, userId, description, userUsername})
        ctx.redirect(ctx.router.url("comments.show", {id: comment.id, userId: user.id, publicationId: publication.id, userUsername: user.username}))
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