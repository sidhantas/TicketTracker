#!/usr/bin/env node

const axios = require("axios");
require("dotenv").config();
const nodeMailer = require("nodemailer");
const fs = require("fs");
const parseText = require("./parseText");
const vivid_seats_axios_config = require("./vivid_seats_headers");
const seat_geek_axios_config = require("./seat_geek_headers");
const config = "seats_wanted.config";
const cache_email_file = "./cache/prev_email.tmp";

const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

let message = "";
let total_tickets = 0;
const priceMap = parseText(config);

const add_tickets = (source, section, price, num_tickets, row, lookup) => {
  if (
    lookup &&
      price <= lookup.price_limit &&
      num_tickets >= lookup.num_tickets
  ) {
    message += `Source: ${source}\nFound Section: ${section}\nRow: ${row}\nPrice: ${price}\n# of Tickets: ${num_tickets}\n\n`;
  }
  total_tickets += num_tickets;
};

const get_seat_geek = async () => {
  try {
    const response = await axios(seat_geek_axios_config);

    for (let value of Object.values(response.data.listings)) {
      let section = parseInt(value.s) ? parseInt(value.s) : value.sf;
      let price = value.dp;
      let num_tickets = value.q;
      let lookup = priceMap.get(section);
      let row = value.rf;
      add_tickets("Seat Geek", section, price, num_tickets, row, lookup);
    }
  } catch {
    console.log("Error");
  }
};

const get_vivid_seats = async () => {
  try {
    const response = await axios(vivid_seats_axios_config);
    for (let value of Object.values(response.data.tickets)) {
      let section = value.s.substr(0, 5) === "Floor" ? value.s : parseInt(value.d);
      let price = parseInt(value.p) + 100;
      let num_tickets = parseInt(value.q);
      let row = parseInt(value.r);
      let lookup = priceMap.get(section);
      add_tickets("Vivid Seats", section, price, num_tickets, row, lookup);
    }
  } catch {
    console.log("Error");
  }
};


const read_prev_email = () => {
  try {
    cache_prev = parseInt(fs.readFileSync(cache_email_file, "utf-8"));
  } catch {
    fs.closeSync(fs.openSync(cache_email_file, "w"));
    cache_prev = fs.readFileSync(cache_email_file, "utf-8");
  }
  return cache_prev;
}

const write_prev_email = (email) => {
  try {
    fs.writeFileSync(cache_email_file, email.toString());
  } catch {
    console.log("Could Not Write to Cache");
  }
}

const get_all = async () => {
  try {
    Promise.all([get_seat_geek(), get_vivid_seats()]).then(() => {
      let ascii_message = 0;
      console.log(total_tickets);
      for (let i = 0; i < message.length; i++) {
        ascii_message += message.charCodeAt(i);
      }
      if (message && ascii_message != read_prev_email()) {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: process.env.RECEIVER_EMAIL,
          subject: "Twice Tickets",
          text: `${message} \n Total Tickets Remaining: ${total_tickets}`,
        };
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.log(err);
          } else {
            write_prev_email(ascii_message);
            console.log(`Email sent: ${info.response}`);
          }
        });
      }
    });
  } catch {
    console.log("Error");
  }
};

get_all();
