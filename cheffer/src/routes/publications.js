const KoaRouter = require("koa-router");

const router = new KoaRouter();

async function loadPublication(ctx, next) {
    ctx.state.publication = await ctx.orm.publication.findByPk(ctx.params.id);
    return next();
};

async function loadUser(ctx, next) {
    ctx.state.user = await ctx.orm.user.findByPk(ctx.params.userId);
    return next();
};

router.get("publications.new", "/new", loadUser, async (ctx) => {
    const { user } = ctx.state;
    const publication = ctx.orm.publication.build();
    await ctx.render("publications/new", {
        user,
        publication,
        submitPublicationPath: ctx.router.url("publications.create", {
            userId: user.id
        }),
        publicationsPath: ctx.router.url("publications.index",{
            userId: user.id
        }),
    });
});

router.post("publications.create", "/", loadUser, async (ctx) => {
    const { user } = ctx.state;
    const publication = ctx.orm.publication.build(ctx.request.body);
    try {
        await user.createPublication(ctx.request.body);
        ctx.redirect(ctx.router.url("publications.show", {userId: user.id}));
    } catch (validationError) {
        await ctx.render("publications/new", {
         user,
         publication,
         submitPublicationPath: ctx.router.url("publications.create", {
            userId: user.id
        }),
         publicationsPath: ctx.router.url("publications.index", {
            userId: user.id
        }),  
         errors: validationError.errors, 
        });
           
    }
});

router.get("publications.index","/", async (ctx) => {
    const publications = await ctx.orm.publication.findAll();
    await ctx.render("publications/index", {
        publications,
        newPublicationPath: ctx.router.url("publications.new"),
        publicationPath: (publication) => ctx.router.url("publications.show", {id: publication.id}),
    })
});

router.get("publications.show", "/:id", loadPublication, async (ctx) => {
    const { publication } = ctx.state;
    await ctx.render("publications/show", {
        publication,
        publicationsPath: ctx.router.url("publications.index"),
        editPublicationPath: ctx.router.url("publications.edit", {id: publication.id}),
    });
});

router.get("publications.edit", "/:id/edit",loadPublication, async (ctx) => {
    const { publication }= ctx.state;
    await ctx.render("publications/edit", {
        publication,
        publicationPath: ctx.router.url("publications.show",{id: publication.id}),
        submitPublicationPath: ctx.router.url("publications.update", {id: publication.id}),
        deletePublicationPath: ctx.router.url("publications.delete", {id: publication.id}),
    });
});

router.patch("publications.update","/:id", loadPublication, async (ctx) => {
    const { publication}  = ctx.state;
    try {
        const {name, ingredients, time, steps, userId, 
            description, ranking, recipesPictures, recipesVideos , stepsPictures} = ctx.request.body;
        await publication.update({name, ingredients, time, steps, userId, 
            description, ranking, recipesPictures, recipesVideos , stepsPictures})
        ctx.redirect(ctx.router.url("publications.show", {id: publication.id}))
    } catch (validationError) {
        await ctx.render("publications/edit", {
            publication,
            publicationPath: ctx.router.url("publications.show",{id: publication.id}),
            submitPublicationPath: ctx.router.url("publications.update", {id: publication.id}),
            deletePublicationPath: ctx.router.url("publications.delete", {id: publication.id}),
            errors: validationError.errors
        })
    }
});

router.del("publications.delete", "/:id", loadPublication, async (ctx)=>{
    const { publication } = ctx.state;
    await publication.destroy();
    ctx.redirect(ctx.router.url("publications.index"));
});

module.exports = router