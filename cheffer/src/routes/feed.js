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
    const {currentUser, publications } = ctx.state;


    //aqui filtramos por las publicaciones de los usuarios que sigue el current user
    const currentUserFollowings = await currentUser.getFollowed()  // usuarios que sigue el current user
    const currentUserFollowingsId = []
    const publicationsFiltered = []

    for (let following of currentUserFollowings) {
        currentUserFollowingsId.push(following.id)
    }
    for (let pub of publications){
        if (currentUserFollowingsId.includes(pub.userId)){
            publicationsFiltered.push(pub)
        }
        //console.log(currentUserFollowingsId.includes(pub.userId))
    }
    //console.log("Publicaciones Filtradas")
    //console.log(publicationsFiltered)
    for (let pub of publicationsFiltered){
        let likes= await pub.getLikedUsers()
        let savedUsers = await pub.getSavedUsers()
        const user = await pub.getUser()
        pub.user = user
        pub.likes = likes.length;
        pub.currentUserLikedPublication = false;
        pub.currentUserSavedPublication = false;
        // esto es para ver si el current user le puso like a la publicacion
        for (let us of likes){
            if (us.id===currentUser.id){
                pub.currentUserLikedPublication = true
            }
        }
        // esto es para ver si el current user guardó a la publicacion
        for (let us2 of savedUsers){
            if (us2.id===currentUser.id){
                pub.currentUserSavedPublication = true
            }
        }
        
    }
    ///aqui ya teminamos de filtar
    
    await ctx.render("feed/show", {
        publicationsFiltered,
        usersPath: ctx.router.url("users.index"),
        editUserPath: ctx.router.url("users.edit", {id: currentUser.id}),
        // para irse a comentarios
        publicationsPath: ctx.router.url("publications.index", {userId: currentUser.id}),
        newPublicationPath: ctx.router.url("publications.new", {userId: currentUser.id}),
        userPath: (user) => ctx.router.url("users.show", {id: user.id}),
        publicationPath: (publication) => ctx.router.url("publications.show", {id: publication.id, userId: publication.userId}),
        //para irse a mensajes
        messagesPath: ctx.router.url("messages.index", {userId: currentUser.id}),
        likePublicationPath: (publication) => ctx.router.url("publicationsFeed.like", {publicationId: publication.id}),
        unlikePublicationPath: (publication) => ctx.router.url("publicationsFeed.unlike", {publicationId: publication.id}),
        savedPublicationPath: (publication) => ctx.router.url("publicationsFeed.save", {publicationId: publication.id}),
        unsavedPublicationPath: (publication) => ctx.router.url("publicationsFeed.unsave", {publicationId: publication.id}),
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

router.put("publicationsFeed.save","/:publicationId/save",loadPublication2,async (ctx) =>{
    const {currentUser,publication} = ctx.state;
    await currentUser.addSavedPublication(publication)
    ctx.redirect(ctx.router.url("feed.show",{}))

});

router.del("publicationsFeed.unsave","/:publicationId/unsave",loadPublication2,async (ctx) =>{
    const {currentUser,publication} = ctx.state;
    await currentUser.removeSavedPublication(publication);
    ctx.redirect(ctx.router.url("feed.show",{}));
});



module.exports = router