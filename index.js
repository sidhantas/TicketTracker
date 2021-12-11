const axios = require("axios");
require("dotenv").config();
const nodeMailer = require("nodemailer");
const parseText = require("./parseText");

const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

axios({
  method: "get",
  url: process.env.REQUEST_URL,
}).then((response) => {
  const priceMap = parseText(process.argv[2]);
  let message = "";
  for (let value of Object.values(response.data.listings)) {
    let section = parseInt(value.s);
    let price = value.sgp;
    let num_tickets = value.q;
    
    let lookup = priceMap.get(section);
    if (lookup && price <= lookup.price_limit && num_tickets >= lookup.num_tickets) {
      message += `Found Section: ${value.s}\n${value.rf}\nPrice: ${value.sgp}\n# of Tickets: ${value.q}\n`;
    }
  }
  if (message) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECEIVER_EMAIL,
      subject: "Twice Tickets",
      text: message
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });
  }
}).catch((err) =>console.log(err));
