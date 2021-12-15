const fs = require("fs");

function parseText(textFile) {
  let data = fs.readFileSync(textFile, "utf-8");
  let priceMap = new Map();
  const lines = data.split(/\r?\n/);
  
  lines.forEach((line) => {
    let arr = line.split(" ");
    if (arr.length == 4) {
      let lower_seat = parseInt(arr[0]);
      let upper_seat = parseInt(arr[1]);
      let price_limit = parseInt(arr[2]);
      let num_tickets = parseInt(arr[3]);
      
      for (let i = lower_seat; i < upper_seat; i++) {
        priceMap.set(i, { price_limit: price_limit, num_tickets: num_tickets });
      }
    } else if (arr.length == 3) {
      let floor = arr[0].replace("_", " ");
      let price_limit = parseInt(arr[1]);
      let num_tickets = parseInt(arr[2]);
      priceMap.set(floor, { price_limit: price_limit, num_tickets: num_tickets });
    }
  });
  console.log(priceMap);
  return priceMap;
}

module.exports = parseText;
