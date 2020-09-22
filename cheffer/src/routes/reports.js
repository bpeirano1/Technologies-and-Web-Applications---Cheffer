const KoaRouter = require("koa-router");

const router = new KoaRouter();

router.get("reports.new", "/new", async (ctx) => {
    const report = ctx.orm.report.build();
    await ctx.render("reports/new", {
        report,
        submitReportPath: ctx.router.url("reports.create"),
    });
});

router.post("reports.create", "/", async (ctx) => {
    const report = ctx.orm.report.build(ctx.request.body);
    try {
        await report.save({ fields: ["publicationId","description", "userId"] });
        ctx.redirect(ctx.router.url("reports.new"));
    } catch (validationError) {
        await ctx.render("reports/new", {
         report,
         errors: validationError.erros, 
         submitReportPath: ctx.router.url("reports.create"),  
        });
        
    }
});

module.exports = router