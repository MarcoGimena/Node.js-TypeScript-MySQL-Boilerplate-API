const nodemailer = require("nodemailer");

(async () => {
  const testAccount = await nodemailer.createTestAccount();
  console.log(testAccount);
})();