const KoaRouter = require("koa-router");

const router = new KoaRouter();

router.get("api.show", "/", async (ctx) => {
    var unirest = require("unirest");
    var req = unirest("GET", "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/mealplans/generate");

    req.query({
        "targetCalories": "2000",
        "timeFrame": "day"
    });

    req.headers({
        "x-rapidapi-key": "03a700419bmshdf633e7b98069b2p152403jsn06c98d618261",
        "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
        "useQueryString": true
    });


    req.end(function (res) {
        if (res.error) throw new Error(res.error);
        console.log(res.body);
        console.log("bartolitooooooooooooooooooooo");
    });
    await ctx.render("api-rest/show", {
        
    });
});



module.exports = router