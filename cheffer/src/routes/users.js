const KoaRouter = require("koa-router");

const Hashids = require('hashids/cjs');

const router = new KoaRouter();

const hashids = new Hashids();

async function loadUser(ctx, next) {
    ctx.state.user = await ctx.orm.user.findByPk(ctx.params.id);
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
    });
});

router.put("users.session.create", "/", async (ctx) => {
    const { email, password } = ctx.request.body;
    const user = await ctx.orm.user.findOne({ where: { email } });
    const isPasswordCorrect = user && await user.checkPassword(password);
    console.log("AAAA")
    //try {
        if (isPasswordCorrect){
            console.log("BBBB")
            const encodedId = hashids.encode(user.id, process.env.HASH_SECRET);
            console.log(encodedId)
            ctx.session.userId = encodedId;
            // encriptar userId
            return ctx.redirect(ctx.router.url("users.show", {id: user.id}));
        }

        else if ( password != "" && email != ""){
            console.log("CCCCCCC")
            return ctx.render("users/signin", {
                user,
                createUserFormPath: ctx.router.url("users.new"),
                createSessionPath: ctx.router.url("users.session.create"),
                usersPath: ctx.router.url("users.index"),
                //errors: validationError.errors,  
                errors: "A",
            });
        }
        else{
            console.log("DDDDDD")
            return ctx.render("users/signin", {
                user,
                createUserFormPath: ctx.router.url("users.new"),
                createSessionPath: ctx.router.url("users.session.create"),
                usersPath: ctx.router.url("users.index"),
                //errors: validationError.errors,  
                errors: "B",
            });
        }
    //}

    //} catch (validationError) {
      //  console.log("CCCCC")
       // await ctx.render("users/signin", {
       //  user,
       //  createUserFormPath: ctx.router.url("users.new"),
       //  createSessionPath: ctx.router.url("users.session.create"),
       //  usersPath: ctx.router.url("users.index"),
       //  errors: validationError.errors,  
       // });
        
    //}
    


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
            console.log("FLOLOOOOOOOO")
            await ctx.render("users/signup", {
                createSessionPath: ctx.router.url("users.create"),
                usersPath: ctx.router.url("users.index"),
                createUserPath: ctx.router.url("users.create"),
                createUserFormPath: ctx.router.url("users.new"),
                errors: "C",
            });
        }
        
    } catch (validationError) {
        console.log("MAIDA")
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
    const { user } = ctx.state;
    const publication = ctx.orm.comment.build();
    const publications = await user.getPublications();
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
    }); 
});

router.get("users.edit", "/:id/edit", loadUser, async (ctx) => {
    const { user }= ctx.state;
    await ctx.render("users/edit", {
        user,
        userPath: ctx.router.url("users.show",{id: user.id}),
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

router.del("users.delete", "/:id", loadUser, async (ctx)=>{
    const { user } = ctx.state;
    await user.destroy();
    ctx.redirect(ctx.router.url("users.index"));
});

//cerrar sesión
router.del("users.session.destroy", "/", (ctx) => {
    ctx.session.userId = null;
    ctx.redirect(ctx.router.url("users.session.new"));
}); 


module.exports = router