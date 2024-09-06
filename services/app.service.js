const fs = require('fs');
const cheerio = require('cheerio');

const getCases = () => {
  const cases = fs.existsSync('cases.json')
    ? JSON.parse(fs.readFileSync('cases.json', 'utf8'))
    : [];

  return cases;
};

const crawlCases = async () => {
  const now = new Date();
  const date = `${now.getDay()}-${now.getMonth()}-${now.getFullYear()}`;
  const cases = getCases();

  for (let page = 1; page < 2; page++) {
    let url = `https://steamcommunity.com/market/search?category_730_ItemSet%5B%5D=any&category_730_ProPlayer%5B%5D=any&category_730_StickerCapsule%5B%5D=any&category_730_Tournament%5B%5D=any&category_730_TournamentTeam%5B%5D=any&category_730_Type%5B%5D=tag_CSGO_Type_WeaponCase&category_730_Weapon%5B%5D=any&appid=730#p${page}`;
    let $ = await cheerio.fromURL(url);

    $('.market_listing_row').each((index, el) => {
      const existing = cases.find(
        (el) => el.name === $(`#result_${index}_name`).text()
      );
      if (existing) {
        existing.prices[date] = $(
          `#result_${index} .market_table_value.normal_price .sale_price`
        ).text();
      } else {
        cases.push({
          name: $(`#result_${index}_name`).text(),
          prices: {
            [date]: $(
              `#result_${index} .market_table_value.normal_price .sale_price`
            ).text(),
          },
        });
      }
    });
  }
  console.log(cases);
  fs.writeFileSync('cases.json', JSON.stringify(cases), 'utf8', (err) =>
    console.log(err)
  );
  return cases;
};

module.exports = {
  getCases,
  crawlCases,
};
