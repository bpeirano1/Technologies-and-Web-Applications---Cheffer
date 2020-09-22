const KoaRouter = require("koa-router");

const router = new KoaRouter();

router.get("reports.new", "/new", async (ctx) => {
    const report = ctx.orm.report.build();
    await ctx.render("reports/new", {
        report,
    });
});

module.exports = router