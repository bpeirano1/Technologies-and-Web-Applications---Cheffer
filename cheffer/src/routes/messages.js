const KoaRouter = require("koa-router");

const router = new KoaRouter();

async function loadMessage(ctx, next) {
    ctx.state.message = await ctx.orm.message.findByPk(ctx.params.id);
    return next();
};

async function loadUser(ctx, next) {
    ctx.state.user = await ctx.orm.user.findByPk(ctx.params.userId);
    return next();
};

router.get("messages.new", "/new", loadUser, async (ctx) => {
    const { user } = ctx.state;
    const message = ctx.orm.message.build();
    await ctx.render("messages/new", {
        user,
        message,
        submitMessagePath: ctx.router.url("messages.create", {userId: user.id}),
        publicationsPath: ctx.router.url("publications.index", {userId: user.id}),
        newPublicationPath: ctx.router.url("publications.new", {userId: user.id}),
        userPath: (user) => ctx.router.url("users.show", {id: user.id}),
        editUserPath: ctx.router.url("users.edit", {id: user.id}),
        messagesPath: ctx.router.url("messages.index" , {userId: user.id}),
    });
});

router.post("messages.create", "/", loadUser, async (ctx) => {
    const { user } = ctx.state;
    const message = ctx.orm.message.build(ctx.request.body);
    message.senderId = ctx.state.currentUser.id
    message.receiverId = user.id
    message.ReceiverUsername = user.username
    try {
        await message.save({ fields: ["senderId", "receiverId", "description"] });
        ctx.redirect(ctx.router.url("messages.show", {id: message.id, userId: user.id}));
    } catch (validationError) {
        await ctx.render("messages/new", {
         user, 
         message,
         submitMessagePath: ctx.router.url("messages.create", {id: message.id, userId: user.id}), 
         messagesPath: ctx.router.url("messages.index", {id: message.id, userId: user.id}),
         errors: validationError.errors,  
        });
        
    }
});
 
router.get("messages.index","/", loadUser, loadMessage, async (ctx) => {
    const messages = await ctx.orm.message.findAll();
    const { user, message} = ctx.state;
    for (const message of messages) {
        const user = await message.getReceiver()
        message.user = user
    }
    await ctx.render("messages/index", {
        //userR,
        user,
        message,
        messages,
        newMessagePath: ctx.router.url("messages.new", {userId: user.id}),
        publicationsPath: ctx.router.url("publications.index", {userId: user.id}),
        //para irse a mensajes
        newPublicationPath: ctx.router.url("publications.new", {userId: user.id}),
        messagesPath: ctx.router.url("messages.index", {userId: user.id}),
        editUserPath: ctx.router.url("users.edit", {id: user.id}),
        userPath: (user) => ctx.router.url("users.show", {id: user.id}),
        messagePath: (message) => ctx.router.url("messages.show", {id: message.id, userId: user.id}),
    })
});
  
router.get("messages.show", "/:id",loadMessage, loadUser, async (ctx) => {
    const { message, user } = ctx.state;
    const userR = await message.getReceiver()
    await ctx.render("messages/show", {
        userR,
        message,
        publicationsPath: ctx.router.url("publications.index", {userId: user.id}),
        newPublicationPath: ctx.router.url("publications.new", {userId: user.id}),
        messagesPath: ctx.router.url("messages.index", {userId: user.id}),
        editUserPath: ctx.router.url("users.edit", {id: user.id}),
        userPath: (user) => ctx.router.url("users.show", {id: user.id}),
        editMessagePath: ctx.router.url("messages.edit", {id: message.id, userId: user.id}),
    });
});

router.get("messages.edit", "/:id/edit", loadMessage, loadUser, async (ctx) => {
    const { user } = ctx.state;
    const { message }= ctx.state;
    await ctx.render("messages/edit", {
        message,
        messagePath: ctx.router.url("messages.show",{id: message.id, userId: user.id}),
        submitMessagePath: ctx.router.url("messages.update", {id: message.id, userId: user.id}),
        deleteMessagePath: ctx.router.url("messages.delete", {id: message.id, userId: user.id}),
    });
});

router.patch("messages.update","/:id", loadMessage, loadUser, async (ctx) => {
    const { message, user }  = ctx.state;
    try {
        const { senderId, receiverId, description } = ctx.request.body;
        await message.update({ senderId, receiverId, description })
        ctx.redirect(ctx.router.url("messages.show", {id: message.id, userId: user.id}))
    } catch (validationError) {
        await ctx.render("messages/edit", {
            message,
            messagePath: ctx.router.url("messages.show",{id: message.id, userId: user.id}),
            submitMessagePath: ctx.router.url("messages.update", {id: message.id, userId: user.id}),
            deleteMessagePath: ctx.router.url("messages.delete", {id: message.id, userId: user.id}),
            errors: validationError.errors
        })
    }
});

router.del("messages.delete", "/:id", loadMessage, loadUser, async (ctx)=>{
    const { message, user } = ctx.state;
    await message.destroy();
    ctx.redirect(ctx.router.url("messages.index", {userId: user.id, id: message.id}));
});

module.exports = router