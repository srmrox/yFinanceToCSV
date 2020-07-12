const yahooFinance = require('yahoo-finance');
const { parse } = require('json2csv');
const fs = require('fs');
var dateFormat = require('dateformat');

const fields = ['date', 'open', 'high', 'low', 'close', 'adjClose', 'volume', 'symbol'];
const opts = { fields };

const symbol = '^KLSE';
const from = '2000-07-28';  // yyyy-mm-dd
const to = '2018-07-31';  // yyyy-mm-dd
const period = 'd'; // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)

console.log(`Fetching data for ${symbol}...`);

yahooFinance.historical({ symbol, from, to, period }, function (err, res) {
  res.forEach(function (entry, index) {
    const newDate = new Date(entry['date']);
    entry['date'] = dateFormat(newDate, "dd-mmm-yyyy");
  });

  try {
    const csv = parse(res, opts);
    
    fs.writeFile(`${symbol}.csv`, csv, function (err) {
      if (err) return console.log(err);
      console.log('Done');
    });

  } catch (err) {
    console.error(err);
  }
});
