const KoaRouter = require("koa-router");

const router = new KoaRouter();

async function loadReport(ctx, next) {
    ctx.state.report = await ctx.orm.report.findByPk(ctx.params.id);
    return next();
};

async function loadUser(ctx, next) {
    ctx.state.user = await ctx.orm.user.findByPk(ctx.params.userId);
    return next();
};

async function loadPublication(ctx, next) {
    ctx.state.publication = await ctx.orm.publication.findByPk(ctx.params.publicationId);
    return next();
};

router.get("reports.new", "/new", loadUser, loadPublication, async (ctx) => {
    const { user, publication } = ctx.state;
    const report = ctx.orm.report.build();
    await ctx.render("reports/new", {
        user,
        publication,
        report,
        submitReportPath: ctx.router.url("reports.create", {
            userId: user.id, publicationId: publication.id
        }),
        reportsPath: ctx.router.url("reports.index", {
            userId: user.id, publicationId: publication.id
        }),
    });
});

router.post("reports.create", "/", loadUser, loadReport, loadPublication, async (ctx) => {
    const report = ctx.orm.report.build(ctx.request.body);
    const { user, publication } = ctx.state;
    report.publicationId = publication.id
    report.userId = ctx.state.currentUser.id
    try {
        await report.save({ fields: ["publicationId","description", "userId"] });
        ctx.redirect(ctx.router.url("publications.show", {id: report.id, userId: user.id, publicationId: publication.id}));
    } catch (validationError) {
        const reports = await publication.getReports()
        for (const report of reports) {
            const user = await report.getUser()
            report.user = user
        }
        await ctx.render("reports/new", {
         user,
         publication,
         report,
         reports,
         submitReportPath: ctx.router.url("reports.create", {userId: user.id, publicationId: publication.id}),
         reportsPath: ctx.router.url("reports.index", {userId: user.id, publicationId: publication.id}), 
         errors: validationError.errors,  
        });
        
    }
});

router.get("reports.index","/", loadUser, loadReport, loadPublication, async (ctx) => {
    const reports = await ctx.orm.report.findAll();
    const { user, report, publication } = ctx.state;
    await ctx.render("reports/index", {
        user,
        publication,
        report,
        reports,
        newReportPath: ctx.router.url("reports.new", {userId: user.id, publicationId: publication.id}),
        reportPath: (report) => ctx.router.url("reports.show", {id: report.id, userId: user.id, publicationId: publication.id}),
    })
});

router.get("reports.show", "/:id", loadReport, loadUser, loadPublication, async (ctx) => {
    const { report, user, publication } = ctx.state;
    await ctx.render("reports/show", {
        report,
        user,
        reportsPath: ctx.router.url("reports.index", {id: report.id, userId: user.id, publicationId: publication.id}),
        editReportPath: ctx.router.url("reports.edit", {id: report.id, userId: user.id, publicationId: publication.id}),
    });
});

router.get("reports.edit", "/:id/edit", loadReport, loadUser, loadPublication, async (ctx) => {
    const { report, user, publication } = ctx.state;
    await ctx.render("reports/edit", {
        report,
        user,
        publication,
        reportPath: ctx.router.url("reports.show",{id: report.id, userId: user.id, publicationId: publication.id}),
        submitReportPath: ctx.router.url("reports.update", {id: report.id, userId: user.id, publicationId: publication.id}),
        deleteReportPath: ctx.router.url("reports.delete", {id: report.id, userId: user.id, publicationId: publication.id}),
    });
});

router.patch("reports.update","/:id", loadReport, loadUser, loadPublication, async (ctx) => {
    const { report, user, publication }  = ctx.state;
    try {
        const {publicationId, description, userId} = ctx.request.body;
        await report.update({publicationId, description, userId})
        ctx.redirect(ctx.router.url("reports.show", {id: report.id, userId: user.id, publicationId: publication.id}))
    } catch (validationError) {
        await ctx.render("reports/edit", {
            report,
            reportPath: ctx.router.url("reports.show",{id: report.id}),
            submitReportPath: ctx.router.url("reports.update", {id: report.id}),
            deleteReportPath: ctx.router.url("reports.delete", {id: report.id}),
            errors: validationError.errors
        })
    }
});

router.del("reports.delete", "/:id", loadReport, loadUser, loadPublication, async (ctx)=>{
    const { report, user, publication } = ctx.state;
    await report.destroy();
    ctx.redirect(ctx.router.url("reports.index", {userId: user.id, publicationId: publication.id}));
});

module.exports = router