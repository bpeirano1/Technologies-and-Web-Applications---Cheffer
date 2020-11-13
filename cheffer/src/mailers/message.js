module.exports = function sendMessageEmail(ctx, data) {
    // you can get all the additional data needed by using the provided one plus ctx
    const email = data;
    return ctx.sendMail('message-email', { to: email , subject: "Message"}, { data });
  };