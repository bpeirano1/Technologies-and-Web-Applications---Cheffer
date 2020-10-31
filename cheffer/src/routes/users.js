const KoaRouter = require("koa-router");

const Hashids = require('hashids/cjs');
const { or } = require("sequelize");

const router = new KoaRouter();

const hashids = new Hashids();

async function loadUser(ctx, next) {
    ctx.state.user = await ctx.orm.user.findByPk(ctx.params.id);
    return next();
};


async function loadPublication2(ctx, next) {
    ctx.state.publication = await ctx.orm.publication.findByPk(ctx.params.publicationId);
    return next();
};



//router.get("users.new", "/new", async (ctx) => {
  //  const user = ctx.orm.user.build();
    //await ctx.render("users/new", {
      //  user,
        //submitUserPath: ctx.router.url("users.create"),
        //usersPath: ctx.router.url("users.index"),
        
    //});
//});

router.get("users.session.new", "/signin", (ctx) => {
    const user = ctx.orm.user.build();
    return ctx.render("users/signin", {
        user,
        createSessionPath: ctx.router.url("users.session.create"),
        createUserFormPath: ctx.router.url("users.new"),
        usersPath: ctx.router.url("users.index"),
        //userPath: (user) => ctx.router.url("users.show", {id: user.id})
    });
});

router.put("users.session.create", "/", async (ctx) => {
    const { email, password } = ctx.request.body;
    const user = await ctx.orm.user.findOne({ where: { email } });
    const isPasswordCorrect = user && await user.checkPassword(password);
        if (isPasswordCorrect){
            const encodedId = hashids.encode(user.id, process.env.HASH_SECRET);
            console.log(encodedId)
            ctx.session.userId = encodedId;
            return ctx.redirect(ctx.router.url("users.show", {id: user.id}));
        }

        else if ( password != "" && email != ""){
            console.log("CCCCCCC")
            const { user } = ctx.request.body;

            return ctx.render("users/signin", {
                user,
                createUserFormPath: ctx.router.url("users.new"),
                createSessionPath: ctx.router.url("users.session.create"),
                usersPath: ctx.router.url("users.index"),
                errors: "A",
            });
        }

        else if (  email == "") {
            console.log("DDDDDD")
            const { user } = ctx.request.body;
            return ctx.render("users/signin", {
                user,
                createUserFormPath: ctx.router.url("users.new"),
                createSessionPath: ctx.router.url("users.session.create"),
                usersPath: ctx.router.url("users.index"), 
                errors: "B",
            });
        }

        else if ( user && isPasswordCorrect != true) {
            console.log("FFFF")
            const { user } = ctx.request.body;
            return ctx.render("users/signin", {
                user,
                createUserFormPath: ctx.router.url("users.new"),
                createSessionPath: ctx.router.url("users.session.create"),
                usersPath: ctx.router.url("users.index"), 
                errors: "A",
            });
        }

        else {
            console.log("EEEEE")
            const { user } = ctx.request.body;
            return ctx.render("users/signin", {
                user,
                createUserFormPath: ctx.router.url("users.new"),
                createSessionPath: ctx.router.url("users.session.create"),
                usersPath: ctx.router.url("users.index"), 
                errors: "C",
            });
        }
   
}); 

router.get("users.new", "/signup", loadUser, (ctx) => {
    const user = ctx.orm.user.build();
    return ctx.render("users/signup", {
        user,
        createUserPath: ctx.router.url("users.create"),
        createUserFormPath: ctx.router.url("users.new"),
        usersPath: ctx.router.url("users.index"),
    });
});

router.post("users.create", "/", async (ctx) => {
    const user = ctx.orm.user.build(ctx.request.body);
    const { password, confirmPassword} = ctx.request.body;
    try { 
        if (password === confirmPassword){
        await user.save({ fields: ["name", "lastname", "username", "email", "password", "picture", "country", "description"] });
        const encodedId = hashids.encode(user.id, process.env.HASH_SECRET);
        ctx.session.userId = encodedId;
        ctx.redirect(ctx.router.url("users.show", {id: user.id}));
        }
        if (password != confirmPassword){
            await ctx.render("users/signup", {
                createSessionPath: ctx.router.url("users.create"),
                usersPath: ctx.router.url("users.index"),
                createUserPath: ctx.router.url("users.create"),
                createUserFormPath: ctx.router.url("users.new"),
                errors: "C",
            });
        }
        
    } catch (validationError) {
            await ctx.render("users/signup", {
            user,
            //submitUserPath: ctx.router.url("users.create"),
            //usersPath: ctx.router.url("users.index"), 
            createUserPath: ctx.router.url("users.create"),
            createUserFormPath: ctx.router.url("users.new"),
            usersPath: ctx.router.url("users.index"),
            errors: validationError.errors,  
            });
        }

});

router.del("users.delete", "/:id/delete", loadUser, async (ctx)=>{
    const { user } = ctx.state;
    await user.destroy();
    console.log("bartooooooooooo");
    ctx.redirect(ctx.router.url("users.session.new"))
    
});


router.get("users.index","/", async (ctx) => {
    const users = await ctx.orm.user.findAll();
    await ctx.render("users/index", {
        users,
        newUserPath: ctx.router.url("users.new"),
        usersPath: ctx.router.url("users.index"),
        userPath: (user) => ctx.router.url("users.show", {id: user.id})
    })
});

router.get("users.show", "/:id",loadUser, async (ctx) => {
    const { user, currentUser } = ctx.state;
    const publication = ctx.orm.comment.build();
    const publications = await user.getPublications();
    const followingList = await currentUser.getFollowed();
    const userFollowingData = {beingFollowed:false}
    console.log("Aqui viendo los que sigue");
    //Aquì armamos un objeto pa mandar la informaciòn de los seguidores
    for (let usuario of followingList){
        if (usuario.id === user.id){
            userFollowingData.beingFollowed = true;
        };
    };
    userFollowingData.following = (await user.getFollowed()).length;
    userFollowingData.followedBy = (await user.getFollows()).length;
    // esto es para los likes
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
    
    await ctx.render("users/show", {
        user,
        publication, 
        publications,
        usersPath: ctx.router.url("users.index"),
        editUserPath: ctx.router.url("users.edit", {id: user.id}),
        newMessagePath: ctx.router.url("messages.new", {userId: user.id}),
        // para irse a comentarios
        publicationsPath: ctx.router.url("publications.index", {userId: user.id}),
        //para irse a mensajes
        newPublicationPath: ctx.router.url("publications.new", {userId: user.id}),
        messagesPath: ctx.router.url("messages.index", {userId: user.id}),
        userPath: (user) => ctx.router.url("users.show", {id: user.id}),
        publicationPath: (publication) => ctx.router.url("publications.show", {id: publication.id, userId: user.id}),
        feedPath: ctx.router.url("feed.show", {userId: user.id}),
        followPath: ctx.router.url("users.follow", {id: user.id}),
        unfollowPath: ctx.router.url("users.unfollow", {id: user.id}),
        userFollowingData,
        likePublicationPath: (publication2) => ctx.router.url("publicationsUser.like", {publicationId: publication2.id, id: user.id}),
        unlikePublicationPath: (publication2) => ctx.router.url("publicationsUser.unlike", {publicationId: publication2.id, id:user.id}),
    });
    }); 

// });

router.get("users.edit", "/:id/edit", loadUser, async (ctx) => {
    const { user }= ctx.state;
    await ctx.render("users/edit", {
        user,
        //userPath: ctx.router.url("users.show",{id: user.id}),
        userPath: (user) => ctx.router.url("users.show", {id: user.id}),
        submitUserPath: ctx.router.url("users.update", {id: user.id}),
        deleteUserPath: ctx.router.url("users.delete", {id: user.id}),
    });
});

router.patch("users.update","/:id", loadUser, async (ctx) => {
    const { user }  = ctx.state;
    try {
        const {name, lastname, username, email, password,
             picture, country, description} = ctx.request.body;
        await user.update({name, lastname, username, email, password, picture, country, description})
        ctx.redirect(ctx.router.url("users.show", {id: user.id}))
    } catch (validationError) {
        await ctx.render("users/edit", {
            user,
            userPath: ctx.router.url("users.show",{id: user.id}),
            submitUserPath: ctx.router.url("users.update", {id: user.id}),
            deleteUserPath: ctx.router.url("users.delete", {id: user.id}),
            errors: validationError.errors
        })
    }
});



//cerrar sesión
router.del("users.session.destroy", "/", (ctx) => {
    ctx.session.userId = null;
    ctx.redirect(ctx.router.url("users.session.new"));
}); 
router.put("users.follow","/:id/follow",loadUser,async (ctx) => {
    const { user, currentUser} = ctx.state;
    await currentUser.addFollowed(user)
    ctx.redirect(ctx.router.url("users.show",{id: user.id}))

})
router.del("users.unfollow","/:id/unfollow",loadUser,async (ctx) => {
    const { user, currentUser} = ctx.state;
    await currentUser.removeFollowed(user)
    ctx.redirect(ctx.router.url("users.show",{id: user.id}))

});

router.put("publicationsUser.like","/:id/:publicationId/like", loadUser,loadPublication2,async (ctx) =>{
    const {currentUser,publication,user} = ctx.state;
    await currentUser.addLikedPublication(publication)
    ctx.redirect(ctx.router.url("users.show",{id: user.id}))

});

router.del("publicationsUser.unlike","/:id/:publicationId/unlike",loadUser,loadPublication2,async (ctx) =>{
    const {currentUser,publication,user} = ctx.state;
    await currentUser.removeLikedPublication(publication)
    ctx.redirect(ctx.router.url("users.show",{id: user.id}))
    

})

module.exports = router