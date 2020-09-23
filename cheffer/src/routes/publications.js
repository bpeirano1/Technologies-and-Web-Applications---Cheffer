const KoaRouter = require("koa-router");

const router = new KoaRouter();

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

router.get("publications.show", "/:id", async (ctx) => {
    const publication = await ctx.orm.publication.findByPk(ctx.params.id);
    await ctx.render("publications/show", {
        publication,
        publicationsPath: ctx.router.url("publications.index"),
    });
});

module.exports = router