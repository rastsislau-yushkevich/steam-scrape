const cheerio = require('cheerio');
const fs = require('fs');
const express = require('express');
const router = require('./controllers/app.controllers');
const app = express();
const port = 3000;

async function main(maxPages = 50) {
  const now = new Date();
  const date = `${now.getDay()}-${now.getMonth()}-${now.getFullYear()}`;
  const products = fs.existsSync('products.json')
    ? JSON.parse(fs.readFileSync('products.json', 'utf8'))
    : [];
  console.log(products.length);

  for (let page = 1; page < 2; page++) {
    let url = `https://steamcommunity.com/market/search?category_730_ItemSet%5B%5D=any&category_730_ProPlayer%5B%5D=any&category_730_StickerCapsule%5B%5D=any&category_730_Tournament%5B%5D=any&category_730_TournamentTeam%5B%5D=any&category_730_Type%5B%5D=tag_CSGO_Type_WeaponCase&category_730_Weapon%5B%5D=any&appid=730#p${page}`;
    let $ = await cheerio.fromURL(url);

    $('.market_listing_row').each((index, el) => {
      const existing = products.find(
        (el) => el.name === $(`#result_${index}_name`).text()
      );
      if (existing) {
        existing.prices.push({
          [date]: $(
            `#result_${index} .market_table_value.normal_price .sale_price`
          ).text(),
        });
      } else {
        products.push({
          name: $(`#result_${index}_name`).text(),
          prices: [
            {
              [date]: $(
                `#result_${index} .market_table_value.normal_price .sale_price`
              ).text(),
            },
          ],
        });
      }
    });
  }
  console.log(products);
  fs.writeFileSync('products.json', JSON.stringify(products), 'utf8', (err) =>
    console.log(err)
  );
  return products;
}

app.use(router);

app.listen(port, () => {
  console.log('App working');
});

// main()
//   .then(() => {
//     process.exit(0);
//   })
//   .catch((err) => console.error(err));
