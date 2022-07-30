import axios from "axios";
import * as cheerio from 'cheerio';
import Chart from "../models/Chart";

const crawlMelonChart = async () => {
    const url = "https://www.melon.com/chart/index.htm";
    const getHtml = async () => {
        try {
            return await axios.get(url);    
        } catch (error) {
            console.error(error);
        }
    };
    
    let body = await getHtml();
    body = cheerio.load(body.data);
    
    const selectorTitle = (x) => {
        return `#lst${x} > td:nth-child(6) > div > div > div.ellipsis.rank01 > span > a`;
    }
    
    const selectorArtist = (x) => {
        return `#lst${x} > td:nth-child(6) > div > div > div.ellipsis.rank02 > span`;
    }
    
    let titles = [];
    let artists = [];
    for (const i of [50, 100]) {
        body(selectorTitle(i)).each((index, elem) => {
            titles.push(body(elem).text());
        });

        body(selectorArtist(i)).each((index, elem) => {
            artists.push(body(elem).text());
        });
    }
    
    let result = [];
    for (let i = 0; i < 100; i++) {
        result.push(JSON.stringify({index: i + 1, title: titles[i],artist: artists[i]}));
    }

    const exists = await Chart.exists({ companyName: 'melon' });
    if (!exists) {
        try {
            await Chart.create({
                companyName: 'melon',
                chart: result,
            });
            console.log("✅ New Melon Chart Created!");
        } catch(error) {
            console.log(error);
        }
    } else {
        const melonChart = await Chart.find({ companyName: 'melon' });
        melonChart[0].chart = result;
        melonChart[0].createdAt = Date.now();
        await melonChart[0].save();
        console.log("✅ Melon Chart Updated at Hour", melonChart[0].createdAt.getHours());
    }
}

const checkTimeAndCrawl = () => {
    let now = new Date();
    let min = now.getMinutes();
    let sec = now.getSeconds();
    if (String(min) === "0" && String(sec) === "3") {
        crawlMelonChart();
    }
}

setInterval(checkTimeAndCrawl, 1000);