
const port = process.env.PORT || 3113;
const express = require('express')
// const fs = require('fs')
const path = require('path');
const app = express()
const fs = require('node:fs');
const puppeteer = require('puppeteer')

app.use('/', express.static(path.join(__dirname, './')));

app.route("/").get((req,res,next) =>{
    res.redirect('store.html')
})

var number = 0
app.use(express.json());

const seconds_modifier = 1000
const minutes_modifier = seconds_modifier * 60
const hours_modifier = minutes_modifier * 60
const days_modifier = hours_modifier * 24

const false_front_generation_delay = 6 


async function saveScreenshot(width, height, scale, location) {
 const browser = await puppeteer.launch({ headless: true });
 const page = await browser.newPage();
 await page.setViewport({
    width: width - 17, // Minus the width of the scrollbar
    height: height,
    deviceScaleFactor: scale,
    mobile: false
 });
    await page.goto(`${location}`, {waitUntil: ['networkidle0']});
    const screenshot = await page.screenshot({
	type: "webp"
    });
 await browser.close();
 return screenshot
}


let aspect_ratios = {
    "1:1": {"width": 1024, "height": 1024},
    "4:3": {"width": 1024, "height": 768},
    "3:2": {"width": 1500, "height": 1000},
    "16:9": {"width": 1920, "height": 1080},
    "21:9": {"width": 2560, "height": 1080},

    
}


function generate_false_fronts(){
    Object.keys(aspect_ratios).forEach(ratio => {
	let width = aspect_ratios[ratio].width
	let height = aspect_ratios[ratio].height
	saveScreenshot(width, height, 0, "http://localhost:3000/#/demo").then(img => {
	    fs.writeFile(`public/false_fronts/arabidopsis_${width}x${height}.webp`, img, err => {
		if (err) {
		    console.error(err)
		}
		else {
		    console.log("false front saved!")
		}
	    })
	}) 

    })
}


setTimeout(generate_false_fronts, false_front_generation_delay)


app.listen(port)
console.log(`Server up and listening on port:${port}`)

