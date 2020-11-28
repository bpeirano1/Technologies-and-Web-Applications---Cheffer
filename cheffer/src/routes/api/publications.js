const KoaRouter = require('koa-router');
const jwt = require('jsonwebtoken');
const router = new KoaRouter();


async function loadUser(ctx, next) {
    const { jwtDecoded: { sub } } = ctx.state;
    if (await ctx.orm.user.findByPk(sub)){
      ctx.state.user = await ctx.orm.user.findByPk(sub);
      //ctx.body = user;
      //console.log(user);
    } else {
      ctx.body = { errorNotFound: 'You must sign in' };
    }
    
    
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
    if (publication) {
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
    } else {
      ctx.body = { errorNotFound: 'This id does not exist' };
    }
    
  });

router.get('publication', '/comments/:id', loadPublication, loadComment, async (ctx) => {
    const { publication, comment } = ctx.state;
    if (comment) {
      ctx.body = {
          ...comment.toJSON(),
          commentByIdUrl: ctx.apiUrl('publication/comments/:id', parseInt(comment.id)),
        };
    } else {
      ctx.body = { errorNotFound: 'This id does not exist' };
    }
   
  });
  


router.post('publication.new', '/new', loadUser, async (ctx) => {
    const { user } = ctx.state;
    const new_publication = await user.createPublication(ctx.request.body);
    // const new_publication = await ctx.db.publication.create(body);
    ctx.body = new_publication;
  });
  
router.post('publication', '/:id/comments/new', loadPublication, loadUser,  async (ctx) => {
    const comment = ctx.orm.comment.build(ctx.request.body);  
    const { user, publication } = ctx.state;
    //
    comment.userId = user.id;
    if (publication){
      comment.publicationId = publication.id;
      await comment.save({ fields: ["publicationId", "userId", "description"] });
    ctx.body = comment;
    } else {
      ctx.body = { errorNotFound: 'This id does not exist' };
    }
    
  });


module.exports = router;