require('dotenv').config();
const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');

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

       
    const topThreeAnimes = data.slice(0, 3);

    
    const emailContent = `Episódios novos:\n\n` + topThreeAnimes.map((anime, index) => {
        return `#${index + 1}\nTítulo: ${anime.title}\nAno: ${anime.year}\nURL: ${anime.url}\n`;
    }).join('\n\n');

    
    await sendEmail(emailContent);

}


async function sendEmail(content) {
    
    const transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS 
        }
    });

    
    const mailOptions = {
        from: EMAIL_USER,
        to: 'gabrielvdcsilva@gmail.com',
        subject: 'Episódios novos disponíveis!',
        text: content 
    };

    
    try {
        await transporter.sendMail(mailOptions);
        console.log('Email enviado com sucesso!');
    } catch (error) {
        console.error('Erro ao enviar email:', error);
    }
}


main();
