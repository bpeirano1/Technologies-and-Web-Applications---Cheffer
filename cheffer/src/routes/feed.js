const KoaRouter = require("koa-router");

const router = new KoaRouter();


async function loadPublications(ctx, next) {
    ctx.state.publications = await ctx.orm.publication.findAll();
    return next();
};

router.get("feed.show", "/", loadPublications, async (ctx) => {
    const { currentUser, publications } = ctx.state;
    await ctx.render("feed/show", {
        usersPath: ctx.router.url("users.index"),
        editUserPath: ctx.router.url("users.edit", {id: currentUser.id}),
        // para irse a comentarios
        publicationsPath: ctx.router.url("publications.index", {userId: currentUser.id}),
        newPublicationPath: ctx.router.url("publications.new", {userId: currentUser.id}),
        userPath: (user) => ctx.router.url("users.show", {id: currentUser.id}),
        publicationPath: (publication) => ctx.router.url("publications.show", {id: publication.id, userId: publication.userId}),
        //para irse a mensajes
        messagesPath: ctx.router.url("messages.index", {userId: currentUser.id}),
    });
});

module.exports = router