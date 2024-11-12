const puppeteer = require('puppeteer');

const url = 'https://bakashi.tv/calendario/';

async function main() {
    const browser = await puppeteer.launch({
        headless: false,
    });

    const page = await browser.newPage();
    await page.goto(url);

    const data = await page.evaluate(() => {

        const animes = Array.from(document.querySelectorAll("article.item.tvshows"));

        return animes.map((post) => {
           
            const titleElement = post.querySelector(".data.dfeatur h3 a");
            const yearElement = post.querySelector(".data.dfeatur span");

            return {
                title: titleElement ? titleElement.textContent.trim() : null,
                url: titleElement ? titleElement.getAttribute("href") : null,
                year: yearElement ? yearElement.textContent.trim() : null,
            };
        });
    });

    console.log(data);

    await browser.close();
}

main();
