const KoaRouter = require("koa-router");

const Hashids = require('hashids/cjs');

const router = new KoaRouter();

const hashids = new Hashids();

router.get("admins.session.new", "/signin", async (ctx) => {
    const admin = ctx.orm.admin.build();
    await ctx.render("admins/signin", {
        admin,
        adminCreateSessionPath: ctx.router.url("admins.session.create"),
    });
});

router.put("admins.session.create", "/", async (ctx) => {
    const { email, password } = ctx.request.body;
    const admin = await ctx.orm.admin.findOne({ where: { email } });
    const isPasswordCorrect = admin && await admin.checkPassword(password);
    //try {
        if (isPasswordCorrect){
            const encodedId = hashids.encode(admin.id, process.env.HASH_SECRET);
            ctx.session.adminId = encodedId;
            return ctx.redirect(ctx.router.url("admins.show", {id: admin.id}));
        }

        else if ( password != "" && email != ""){
            return ctx.render("admins/signin", {
                admin,
                createAdminFormPath: ctx.router.url("admins.new"),
                adminCreateSessionPath: ctx.router.url("admins.session.create"),
                adminPath: ctx.router.url("admins.show", {id: admin.id}),
                errors: "A",
            });
        }
        else{
            return ctx.render("admins/signin", {
                admin,
                createSessionPath: ctx.router.url("admins.session.create"),
                adminPath: ctx.router.url("admins.show", {id: admin.id}),
                //errors: validationError.errors,  
                errors: "B",
            });
        }}); 

router.get("admins.users", "/users", async (ctx) => {
    const admin = ctx.state.currentAdmin;
    const users = await ctx.orm.user.findAll();
    await ctx.render("admins/users", {
        admin,
        users,
        adminPath: ctx.router.url("admins.show", {id: admin.id}),
        allUsersPath: ctx.router.url("admins.users"),
        allPublicationsPath: ctx.router.url("admins.publications"),
        allCommentsPath: ctx.router.url("admins.comments"),
        adminDeleteUserPath: (user) => ctx.router.url("admins.deleteUsers", {id: user.id}),
    })
});

router.get("admins.publications", "/publications", async (ctx) => {
    const admin = ctx.state.currentAdmin;
    const publications = await ctx.orm.publication.findAll();
    await ctx.render("admins/publications", {
        admin,
        publications,
        adminPath: ctx.router.url("admins.show", {id: admin.id}),
        allUsersPath: ctx.router.url("admins.users"),
        allPublicationsPath: ctx.router.url("admins.publications"),
        allCommentsPath: ctx.router.url("admins.comments"),
        adminDeletePublicationPath: (publication) => ctx.router.url("admins.deletePublications", {id: publication.id}),
    })
});

router.get("admins.comments", "/comments", async (ctx) => {
    const admin = ctx.state.currentAdmin;
    const comments = await ctx.orm.comment.findAll();
    await ctx.render("admins/comments", {
        admin,
        comments,
        adminPath: ctx.router.url("admins.show", {id: admin.id}),
        allUsersPath: ctx.router.url("admins.users"),
        allPublicationsPath: ctx.router.url("admins.publications"),
        allCommentsPath: ctx.router.url("admins.comments"),
        adminDeleteCommentPath: (comment) => ctx.router.url("admins.deleteComments", {id: comment.id}),
    })
});

router.del("admins.deleteUsers", "/users/:id", async (ctx)=>{
    const admin = ctx.state.currentAdmin;
    const user = await ctx.orm.user.findByPk(ctx.params.id);
    await user.destroy();
    ctx.redirect(ctx.router.url("admins.users"));
});

router.del("admins.deletePublications", "/publications/:id", async (ctx)=>{
    const admin = ctx.state.currentAdmin;
    const publication = await ctx.orm.user.findByPk(ctx.params.id);
    await publication.destroy();
    ctx.redirect(ctx.router.url("admins.publications"));
});

router.del("admins.deleteComments", "/comments/:id", async (ctx)=>{
    const admin = ctx.state.currentAdmin;
    const comment = await ctx.orm.comment.findByPk(ctx.params.id);
    await comment.destroy();
    ctx.redirect(ctx.router.url("admins.comments"));
});

router.get("admins.show", "/:id", async (ctx) => {
    const admin = await ctx.orm.admin.findByPk(ctx.params.id);
    const users = await ctx.orm.user.findAll();
    const publications = await ctx.orm.publication.findAll();
    const comments = await ctx.orm.comment.findAll();
    const reports = await ctx.orm.report.findAll();
    await ctx.render("admins/show", {
        admin,
        allUsersPath: ctx.router.url("admins.users"),
        allPublicationsPath: ctx.router.url("admins.publications"),
        allCommentsPath: ctx.router.url("admins.comments"),
    })
});

//Logout
router.del("admins.session.destroy", "/", (ctx) => {
    ctx.session.adminId = null;
    ctx.redirect(ctx.router.url("admins.session.new"));
}); 





module.exports = router