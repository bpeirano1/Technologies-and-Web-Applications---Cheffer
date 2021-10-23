const axios = require("axios");

const KoaRouter = require("koa-router");

const router = new KoaRouter();

async function loadPublication(ctx, next) {
  const publication = "";
  if (await ctx.orm.publication.findByPk(ctx.params.id)) {
    ctx.state.publication = await ctx.orm.publication.findByPk(ctx.params.id);
  }
  return next();
}

router.get("api.show", "/:id", loadPublication, async (ctx) => {
  const { publication } = ctx.state;
  console.log("ercibi publication", publication);
  const options = {
    method: "GET",
    url: "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/quickAnswer",
    params: { q: "How many calories are there in a " + publication.name + "?" },
    headers: {
      "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
    },
  };
  const respuesta = await axios.request(options);
  console.log(respuesta.data);

  await ctx.render("api-rest/show", {
    nd: respuesta.data.answer,
  });
});

module.exports = router;
