const KoaRouter = require('koa-router');

const hello = require('./routes/hello');
const index = require('./routes/index');
const usuarios = require('./routes/usuarios');
const publicaciones = require('./routes/publicaciones');
const comentarios = require('./routes/comentarios');
const mensajes = require('./routes/mensajes');
const denuncias = require('./routes/denuncias');

const router = new KoaRouter();

router.use('/', index.routes());
router.use('/hello', hello.routes());
router.use('/usuarios', usuarios.routes())
router.use('/publicaciones', publicaciones.routes())
router.use('/comentarios', comentarios.routes())
router.use('/mensajes', mensajes.routes())
router.use('/denuncias', denuncias.routes())

module.exports = router;
