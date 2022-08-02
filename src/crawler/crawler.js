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

    const selectorCoverImg = (x) => {
        return `#lst${x} > td:nth-child(4) > div > a > img`;
    }
    
    let titles = [];
    let artists = [];
    let covers = [];
    for (const i of [50, 100]) {
        body(selectorTitle(i)).each((index, elem) => {
            titles.push(body(elem).text());
        });

        body(selectorArtist(i)).each((index, elem) => {
            artists.push(body(elem).text());
        });

        body(selectorCoverImg(i)).each((index, elem) => {
            covers.push(body(elem).attr('src'));
        });
    }
    
    let result = [];
    for (let i = 0; i < 100; i++) {
        result.push(JSON.stringify({ index: i + 1, title: titles[i], artist: artists[i], cover: covers[i] }));
    }

    return result;
}

const saveNewChart = async (companyName, result) => {
    const now = new Date();
    try {
        await Chart.create({
            companyName,
            createdAt: now,
            chart: result,
        });
        console.log(`✅ New ${companyName} Chart Created At ${now.getHours()}!`);
    } catch (error) {
        console.log(error);
    }
}

const updateChart = async (companyName, result) => {
    const chart = await Chart.findOneAndUpdate({ companyName }, {
        chart: result,
        createdAt: Date.now(),
    });
    console.log(`✅ ${companyName} Chart Updated at Hour`, chart.createdAt.getHours());
}

const checkTimeAndCrawl = async () => {
    let now = new Date();
    let sec = now.getSeconds();
    const exists = await Chart.exists({ companyName: 'melon' });
    if (!exists) {
        const result = await crawlMelonChart();
        return saveNewChart('melon', result);
    }
    
    const chart = await Chart.find({ companyName: 'melon' });
    
    if (String(chart[0].createdAt.getHours()) !== String(now.getHours()) && sec >= 10) {
        const result = await crawlMelonChart();
        return updateChart('melon', result);
    } 
}

setInterval(checkTimeAndCrawl, 5000);