const KoaRouter = require('koa-router');
const jwt = require('jsonwebtoken');
const router = new KoaRouter();

// async function loadUser1(ctx, next) {
//     const { currentUser } = ctx;
  
//     if (currentUser.dataValues.id.toString() !== ctx.params.id) {
//       return (ctx.body = {
//         error: 'No puedes ver/modificar información de otros clientes',
//       });
//     }
  
//     return next(ctx);
//   };

async function loadUser(ctx, next) {
  // const authorization = ctx.get('Authorization');
  // const token = authorization.replace('Bearer ', '');
    const { jwtDecoded: { sub } } = ctx.state;
    const user = await ctx.orm.user.findByPk(sub);
    ctx.body = user;
    console.log(user);
  return next();
};


async function loadPublication(ctx, next) {
    const publication = "";
    if (await ctx.orm.publication.findByPk(ctx.params.id)) {
        ctx.state.publication = await ctx.orm.publication.findByPk(ctx.params.id)
    } 
    return next();
};

async function loadComment(ctx, next) {
    if (await ctx.orm.comment.findByPk(ctx.params.id)){
        ctx.state.comment = await ctx.orm.comment.findByPk(ctx.params.id);
    }
    return next();
};

async function loadToken(ctx, next) {
  if (await ctx.orm.comment.findByPk(ctx.params.id)){
      ctx.state.comment = await ctx.orm.comment.findByPk(ctx.params.id);
  }
  return next();
};
router.get('/', loadPublication,  async (ctx) => {
  const publications = await ctx.orm.publication.findAll();
  ctx.body = publications.map((publication) => ({
    ...publication.toJSON(),
    publicationUrl: ctx.apiUrl('publication', parseInt(publication.id)),
  }));
});

router.get('publication', '/:id', loadPublication, async (ctx) => {
  const { publication } = ctx.state;
  if (publication) {
    ctx.body = {
        ...publication.toJSON(),
        publicationByIdUrl: ctx.apiUrl('publication/:id', parseInt(publication.id)),
      };
  } else {
    ctx.body = { errorNotFound: 'This id does not exist' };
  }
 
});

router.get('publication', '/:id/comments', loadPublication, loadComment, async (ctx) => {
    const comments = await ctx.orm.comment.findAll();
    const { publication } = ctx.state;
    const arrayComment = []
    for (let c of comments){
        if (c.publicationId === publication.id){
            arrayComment.push(c)
        }
    }
    ctx.body = arrayComment.map((comment) => ({
        ...comment.toJSON(),
        commentUrl: ctx.apiUrl('publication/:id/comments', parseInt(publication.id)),
      }));
  });

router.get('publication', '/:id/comments/:id', loadPublication, loadComment, async (ctx) => {
    const { publication, comment } = ctx.state;
    if (comment) {
      ctx.body = {
          ...comment.toJSON(),
          commentByIdUrl: ctx.apiUrl('publication/:id/comments/:id', parseInt(comment.id)),
        };
    } else {
      ctx.body = { errorNotFound: 'This id does not exist' };
    }
   
  });
  
// router.get('publication-attendances', '/:id/attendances', async (ctx) => {
//   const { publication } = ctx.state;
//   ctx.body = publication.attendees.map(({ id, email }) => ({ id, email }));
// });

// router.post('publication', loadPublication, async (ctx) => {
//     const publication = await user.createPublication(ctx.request.body); 
//     ctx.body = publications.map((publication) => ({
//         ...publication.toJSON(),
//         publicationUrl: ctx.apiUrl('publication', parseInt(publication.id)),
//       }));
// });

router.post('publication.new', '/new', loadUser, async (ctx) => {
    const { currentUser } = ctx.state;
    const new_publication = await currentUser.createPublication(ctx.request.body);
    // const new_publication = await ctx.db.publication.create(body);
    ctx.body = new_publication;
  });
  



module.exports = router;