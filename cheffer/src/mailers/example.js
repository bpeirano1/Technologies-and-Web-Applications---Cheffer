module.exports = function sendExampleEmail(ctx, data) {
  // you can get all the additional data needed by using the provided one plus ctx
  const { email } = data;
  return ctx.sendMail('example-email', { to: email , subject: "Bienvenido"}, { data });
};
