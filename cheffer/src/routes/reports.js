const KoaRouter = require("koa-router");

const router = new KoaRouter();

async function loadReport(ctx, next) {
    ctx.state.report = await ctx.orm.report.findByPk(ctx.params.id);
    return next();
};

router.get("reports.new", "/new", async (ctx) => {
    const report = ctx.orm.report.build();
    await ctx.render("reports/new", {
        report,
        submitReportPath: ctx.router.url("reports.create"),
        reportsPath: ctx.router.url("reports.index"),
    });
});

router.post("reports.create", "/", async (ctx) => {
    const report = ctx.orm.report.build(ctx.request.body);
    try {
        await report.save({ fields: ["publicationId","description", "userId"] });
        ctx.redirect(ctx.router.url("reports.show", {id: report.id}));
    } catch (validationError) {
        await ctx.render("reports/new", {
         report,
         submitReportPath: ctx.router.url("reports.create"),
         reportsPath: ctx.router.url("reports.index"), 
         errors: validationError.errors,  
        });
        
    }
});

router.get("reports.index","/", async (ctx) => {
    const reports = await ctx.orm.report.findAll();
    await ctx.render("reports/index", {
        reports,
        newReportPath: ctx.router.url("reports.new"),
        reportPath: (report) => ctx.router.url("reports.show", {id: report.id}),
    })
});

router.get("reports.show", "/:id", loadReport, async (ctx) => {
    const { report } = ctx.state;
    await ctx.render("reports/show", {
        report,
        reportsPath: ctx.router.url("reports.index"),
        editReportPath: ctx.router.url("reports.edit", {id: report.id}),
    });
});

router.get("reports.edit", "/:id/edit",loadReport, async (ctx) => {
    const { report } = ctx.state;
    await ctx.render("reports/edit", {
        report,
        reportPath: ctx.router.url("reports.show",{id: report.id}),
        submitReportPath: ctx.router.url("reports.update", {id: report.id}),
        deleteReportPath: ctx.router.url("reports.delete", {id: report.id}),
    });
});

router.patch("reports.update","/:id", loadReport, async (ctx) => {
    const { report }  = ctx.state;
    try {
        const {publicationId, description, userId} = ctx.request.body;
        await report.update({publicationId, description, userId})
        ctx.redirect(ctx.router.url("reports.show", {id: report.id}))
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

router.del("reports.delete", "/:id", loadReport, async (ctx)=>{
    const { report } = ctx.state;
    await report.destroy();
    ctx.redirect(ctx.router.url("reports.index"));
});

module.exports = router