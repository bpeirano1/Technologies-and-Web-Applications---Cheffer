const KoaRouter = require("koa-router");

const router = new KoaRouter();

async function loadPublication(ctx, next) {
    ctx.state.publication = await ctx.orm.publication.findByPk(ctx.params.id);
    return next();
};

router.get("publications.new", "/new", async (ctx) => {
    const publication = ctx.orm.publication.build();
    await ctx.render("publications/new", {
        publication,
        submitPublicationPath: ctx.router.url("publications.create"),
        publicationsPath: ctx.router.url("publications.index"),
    });
});

router.post("publications.create", "/", async (ctx) => {
    const publication = ctx.orm.publication.build(ctx.request.body);
    try {
        await publication.save({ fields: ["name", "ingredients", "time", "steps", "userId", "description", "ranking", "recipesPictures", "recipesVideos" , "stepsPictures"] });
        ctx.redirect(ctx.router.url("publications.show", {id: publication.id}));
    } catch (validationError) {
        await ctx.render("publications/new", {
         publication,
         errors: validationError.erros, 
         submitPublicationPath: ctx.router.url("publications.create"),
         publicationsPath: ctx.router.url("publications.index"),  
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
            errors: validationError.errors
        })
    }
});

module.exports = router