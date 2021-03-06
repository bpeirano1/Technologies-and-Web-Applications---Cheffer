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

async function loadComment(ctx, next) {
    ctx.state.comment = await ctx.orm.comment.findByPk(ctx.params.id);
    return next();
};

router.get("publications.new", "/new", loadUser, async (ctx) => {
    const { user } = ctx.state;
    const publication = ctx.orm.publication.build();
    await ctx.render("publications/new", {
        user,
        publication,
        feedPath: ctx.router.url("feed.show", {userId: user.id}),
        submitPublicationPath: ctx.router.url("publications.create", {
            userId: user.id
        }),
        publicationsPath: ctx.router.url("publications.index",{
            userId: user.id
        }),
    });
});

router.post("publications.create", "/", loadUser, loadPublication, async (ctx) => {
    const {cloudinary, user } = ctx.state;
    try {
        const image = ctx.request.files.recipesPictures;
        //onsole.log("HOLAAAAA Baarrtt1");
        if (image.size > 0){
            //console.log("HOLAAAAA Baarrtt2")
            const uploadedImage = await cloudinary.uploader.upload(image.path,{resource_type : "auto"},function(error, result) {console.log(result, error); });
            ctx.request.body.recipesPictures = uploadedImage.public_id;
            
            //console.log(typeof(uploadedImage.public_id))

        }
        const publication = await user.createPublication(ctx.request.body);
        ctx.redirect(ctx.router.url("publications.show", {userId: user.id, id: publication.id}));
    } catch (validationError) {
        const publication = ctx.orm.publication.build(ctx.request.body);
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

router.get("publications.index","/", loadUser, loadPublication, async (ctx) => {
    const publications = await ctx.orm.publication.findAll();
    const { user, publication } = ctx.state;
    await ctx.render("publications/index", {
        user,
        publication,
        publications,
        newPublicationPath: ctx.router.url("publications.new", {userId: user.id}),
        publicationPath: (publication) => ctx.router.url("publications.show", {id: publication.id, userId: user.id}),
    })
});
 
router.get("publications.show", "/:id", loadPublication, loadUser, async (ctx) => {
    const { publication, user, currentUser } = ctx.state;
    const comment = ctx.orm.comment.build();
    const comments = await publication.getComments();
    // console.log("Comemtarios")
    // console.log(comments)
    for (const comment of comments) {
        const user = await comment.getUser()
        comment.user = user
    }

    //aqui para los likes
    publication.currentUserLikedPublication = false;
    const likes= await publication.getLikedUsers();
    const userP = await publication.getUser()
    publication.user = userP
    publication.likes = likes.length;
    for (let us of likes){
        if (us.id===currentUser.id){
            publication.currentUserLikedPublication = true
        }
    }

    //aqui para guardar publicaciones
    publication.currentUserSaveddPublication = false;
    const savedUsers= await publication.getSavedUsers();
    for (let us2 of savedUsers){
        if (us2.id===currentUser.id){
            publication.currentUserSavedPublication = true
        }
    }
    


    await ctx.render("publications/show", {
        publication,
        publicationsPath: ctx.router.url("publications.index", {userId: user.id}),
        feedPath: ctx.router.url("feed.show", {userId: user.id}),
        newReportPath: ctx.router.url("reports.new", {userId: user.id, publicationId: publication.id}),
        editPublicationPath: ctx.router.url("publications.edit", {userId: user.id, id: publication.id}),
        questionApiPath: (publication) => ctx.router.url("api.show", {publicationId: publication.id, id: publication.id}),
        // para que los comentarios aparezcan en publicacion
        comment,
        commentsPath: ctx.router.url("comments.index", {
            userId: user.id, publicationId: publication.id}),
        submitCommentPath: ctx.router.url("comments.create", {
            userId: user.id, publicationId: publication.id
        }),
        user,
        comments,
        userPath: (user) => ctx.router.url("users.show", {id: user.id}),
        // falta hacer lo mismo con report pero por mientras lo vamos a redireccionar para la navegabilidad
        reportsPath: ctx.router.url("reports.index", {userId: user.id, publicationId: publication.id}),
        likePath: ctx.router.url("publications.like", {userId: user.id, id: publication.id}),
        unlikePath: ctx.router.url("publications.unlike", {userId: user.id,id: publication.id}),
        likePublicationPath: (publication) => ctx.router.url("publications.like", {userId: user.id,id: publication.id}),
        unlikePublicationPath: (publication) => ctx.router.url("publications.unlike", {userId: user.id,id: publication.id}),
        savedPublicationPath: (publication) => ctx.router.url("publications.save", {userId: user.id,id: publication.id}),
        unsavedPublicationPath: (publication) => ctx.router.url("publications.unsave", {userId: user.id,id: publication.id}),
    });
});

router.get("publications.edit", "/:id/edit",loadPublication, loadUser, async (ctx) => {
    const { publication, user }= ctx.state;
    await ctx.render("publications/edit", {
        publication,
        user,
        publicationPath: ctx.router.url("publications.show",{id: publication.id, userId: user.id}),
        submitPublicationPath: ctx.router.url("publications.update", {id: publication.id, userId: user.id}),
        deletePublicationPath: ctx.router.url("publications.delete", {id: publication.id, userId: user.id}),
    });
});

router.patch("publications.update","/:id", loadPublication, loadUser, async (ctx) => {
    const { cloudinary, publication, user}  = ctx.state;
    //console.log("HOLAAAAA Baarrtt0")
    //console.log(ctx.request.files)
    try {
        // Esto es para subir las fotos
        const image = ctx.request.files.recipesPictures;
        if (image.size > 0){
            //console.log("HOLAAAAA Baarrtt2")
            const uploadedImage = await cloudinary.uploader.upload(image.path, {resource_type : "auto"}, function(error, result) {console.log(result, error); });
            ctx.request.body.recipesPictures = uploadedImage.public_id;
            //console.log(typeof(uploadedImage.public_id))

        }
        //Aqui se termina para subir las fotos
        console.log("HOLAAAAA Baarrtt3")
        const {name, ingredients, time, steps, userId, 
            description, ranking, recipesPictures, recipesVideos , stepsPictures} = ctx.request.body;
        console.log(recipesPictures)
        //console.log("HOLAAAAA Baarrtt4");  
        await publication.update({name, ingredients, time, steps, userId, 
            description, ranking, recipesPictures, recipesVideos , stepsPictures})
        ctx.redirect(ctx.router.url("publications.show", {id: publication.id, userId: user.id}))
    } catch (validationError) {
        console.log("Se levanto un error bartoo");
        console.log(validationError);
        await ctx.render("publications/edit", {
            publication,
            publicationPath: ctx.router.url("publications.show",{id: publication.id, userId: user.id}),
            submitPublicationPath: ctx.router.url("publications.update", {id: publication.id, userId: user.id}),
            deletePublicationPath: ctx.router.url("publications.delete", {id: publication.id, userId: user.id}),
            errors: validationError.errors
        })
    }
});

router.del("publications.delete", "/:id",loadPublication, async (ctx)=>{
    const { publication, currentUser } = ctx.state;
    await publication.destroy();
    ctx.redirect(ctx.router.url("users.show",{id: currentUser.id}));
});

//like routes
router.put("publications.like","/:id/like", loadUser, loadPublication,async (ctx) =>{
    const {currentUser,publication,user} = ctx.state;
    const like = await currentUser.addLikedPublication(publication)
    // ctx.redirect(ctx.router.url("publications.show",{userId: user.id,id: publication.id}))
    ctx.body = like;
});

router.del("publications.unlike","/:id/unlike", loadUser,loadPublication,async (ctx) =>{
    const {currentUser,publication,user} = ctx.state;
    await currentUser.removeLikedPublication(publication)
    // ctx.redirect(ctx.router.url("publications.show",{userId: user.id, id: publication.id}))
    ctx.body = 'Todo ok';
});

// Saved publications routes
router.put("publications.save","/:id/save", loadUser, loadPublication,async (ctx) =>{
    const {currentUser,publication,user} = ctx.state;
    await currentUser.addSavedPublication(publication)
    ctx.redirect(ctx.router.url("publications.show",{userId: user.id,id: publication.id}))

});

router.del("publications.unsave","/:id/unsave", loadUser,loadPublication,async (ctx) =>{
    const {currentUser,pubherolication,user} = ctx.state;
    await currentUser.removeSavedPublication(publication)
    ctx.redirect(ctx.router.url("publications.show",{userId: user.id, id: publication.id}))
    

});

//comentarios routes


module.exports = router