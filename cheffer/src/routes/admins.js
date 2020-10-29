const KoaRouter = require("koa-router");

const Hashids = require('hashids/cjs');

const router = new KoaRouter();

const hashids = new Hashids();

router.get("admins.session.new", "/signin", async (ctx) => {
    const admin = ctx.orm.admin.build();
    await ctx.render("admins/signin", {
        admin,
        createSessionPath: ctx.router.url("admins.session.create"),
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
                createSessionPath: ctx.router.url("admins.session.create"),
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
    console.log(admin);
    const users = await ctx.orm.user.findAll();
    await ctx.render("admins/users", {
        users,
        adminPath: ctx.router.url("admins.show", {id: admin.id}),
        adminDeleteUserPath: (user) => ctx.router.url("admins.deleteUsers", {id: user.id}),
    })
});

router.del("admins.deleteUsers", "/users/:id", async (ctx)=>{
    const admin = ctx.state.currentAdmin;
    const user = await ctx.orm.user.findByPk(ctx.params.id);
    await user.destroy();
    ctx.redirect(ctx.router.url("admins.users"));
});

router.get("admins.show", "/:id", async (ctx) => {
    const admin = await ctx.orm.admin.findByPk(ctx.params.id);
    const users = await ctx.orm.user.findAll();
    const publications = await ctx.orm.publication.findAll();
    const comments = await ctx.orm.comment.findAll();
    const reports = await ctx.orm.report.findAll();
    await ctx.render("admins/show", {
        admin,
        allUsersPath: ctx.router.url("admins.users")
    })
});





module.exports = router