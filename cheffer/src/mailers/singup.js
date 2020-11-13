module.exports = function sendSingupEmail(ctx, data) {
    // you can get all the additional data needed by using the provided one plus ctx
    const { email } = data;
    return ctx.sendMail('singup-email', { to: email , subject: "Welcome"}, { data });
  };