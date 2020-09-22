const KoaRouter = require("koa-router");

const router = new KoaRouter();

router.get("publications.new", "/new", async (ctx) => {
    const publication = ctx.orm.publication.build();
    await ctx.render("publications/new", {
        publication,
        submitPublicationPath: ctx.router.url("publications.create"),
    });
});

router.post("publications.create", "/", async (ctx) => {
    const publication = ctx.orm.publication.build(ctx.request.body);
    try {
        await publication.save({ fields: ["name", "ingredients", "time", "steps", "userId", "description", "ranking", "recipesPictures", "recipesVideos" , "stepsPictures"] });
        ctx.redirect(ctx.router.url("publications.new"));
    } catch (validationError) {
        await ctx.render("publications/new", {
         publication,
         errors: validationError.erros, 
         submitPublicationPath: ctx.router.url("publications.create"),  
        });
        
    }
});
module.exports = router