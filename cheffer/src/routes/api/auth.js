const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.post('auth-create', '/', async (ctx) => {
  
  try {
    const { email, password } = ctx.request.body;
    const user = await ctx.orm.user.findOne({ where: { email } });
    const authenticated = user && (await bcrypt.compare(password, user.password));
    if (user && authenticated) {
      const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET);
      ctx.status = 201;
      ctx.body = { token };
    } else {
      ctx.body = { errorValidation: "Incorrect password or email"};
      //ctx.throw(401, 'Correo o contraseña incorrectos');
    }
  } catch (validationError) {
    errors = validationError.errors
    ctx.body = { errorValidation: validationError.message};
  }
});

module.exports = router;