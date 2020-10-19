const KoaRouter = require("koa-router");

const router = new KoaRouter();


async function loadPublications(ctx, next) {
    ctx.state.publications = await ctx.orm.publication.findAll();
    return next();
};

async function loadPublication2(ctx, next) {
    ctx.state.publication = await ctx.orm.publication.findByPk(ctx.params.publicationId);
    return next();
};

router.get("feed.show", "/", loadPublications, async (ctx) => {
    const { currentUser, publications } = ctx.state;
    for (let pub of publications){
        let likes= await pub.getLikedUsers()
        pub.likes = likes.length;
        pub.currentUserLikedPublication = false;
        for (let us of likes){
            if (us.id===currentUser.id){
                pub.currentUserLikedPublication = true
            }
        }
        
    }
    await ctx.render("feed/show", {
        publications,
        usersPath: ctx.router.url("users.index"),
        editUserPath: ctx.router.url("users.edit", {id: currentUser.id}),
        // para irse a comentarios
        publicationsPath: ctx.router.url("publications.index", {userId: currentUser.id}),
        newPublicationPath: ctx.router.url("publications.new", {userId: currentUser.id}),
        userPath: (user) => ctx.router.url("users.show", {id: currentUser.id}),
        publicationPath: (publication) => ctx.router.url("publications.show", {id: publication.id, userId: publication.userId}),
        //para irse a mensajes
        messagesPath: ctx.router.url("messages.index", {userId: currentUser.id}),
        likePublicationPath: (publication) => ctx.router.url("publicationsFeed.like", {publicationId: publication.id}),
        unlikePublicationPath: (publication) => ctx.router.url("publicationsFeed.unlike", {publicationId: publication.id}),
    });
});

router.put("publicationsFeed.like","/:publicationId/like",loadPublication2,async (ctx) =>{
    const {currentUser,publication} = ctx.state;
    await currentUser.addLikedPublication(publication)
    ctx.redirect(ctx.router.url("feed.show",{}))

});

router.del("publicationsFeed.unlike","/:publicationId/unlike",loadPublication2,async (ctx) =>{
    const {currentUser,publication} = ctx.state;
    await currentUser.removeLikedPublication(publication)
    ctx.redirect(ctx.router.url("feed.show",{}))
    

});



module.exports = router