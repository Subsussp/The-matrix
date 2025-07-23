import axios from 'axios';
import * as cheerio from 'cheerio';

async function scrapeGoogle(query) {
  const url = `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`;

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Wikipedia summary is usually in the first <p> inside #mw-content-text
    const firstParagraph = $("#mw-content-text p").first().text().trim();
// console.log(firstParagraph)
console.log(firstParagraph)
    return firstParagraph;
  } catch (error) {
    console.error("Failed to scrape Wikipedia:", error);
    return null;
  }
}

// Example usage:
// scrapeGoogle("web scraping tutorial").then(results => {
//   console.log(results);
// });
export default scrapeGoogle