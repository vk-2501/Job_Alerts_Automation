// npm inint -y
// npm install minimist
// npm install axios
// npm install jsdom
// npm install excel4node
// npm install pdf-lib

// node hack.js --config=configJSON.json  --url=" https://www.naukri.com/"

let minimist=require("minimist");
let fs = require("fs");
let puppeteer=require('puppeteer');



let args=minimist(process.argv);

let configJSON=fs.readFileSync(args.config);
let configJSO=JSON.parse(configJSON);

async function run(){
    let browser=await puppeteer.launch({
        headless:false,
        args:[
            '--start-maximized'
        ],
        defaultViewport:{
            width:1366,
            height:768,
            isMobile:false,
        }
    });
    let pages=await browser.pages();
    let page=pages[0];
    await page.goto(args.url);

    await page.waitForSelector("a#login_Layer");
  await page.click("a#login_Layer");

  await page.waitForSelector("div.form-row >input[type='text']");
  await page.type("div.form-row >input[type='text']",configJSO.userid,{delay:50});

  await page.waitForSelector("div.form-row >input[type='password']");
  await page.type("div.form-row >input[type='password']",configJSO.password,{delay:50});

  
  await page.waitForSelector("button[type='submit']");
  await page.click("button[type='submit']");
  
  //for loop for handling multiple locations
  for(let i=0;i<configJSO.location.length;i++){
    await run1(page,configJSO.post[0],configJSO.location[i]);
    await page.goto("https://www.naukri.com/mnjuser/homepage");
  }
 
browser.close();

  



}

async function run1(page,post,loc){
  await page.waitForSelector("input#qsb-keyskill-sugg");
  await page.type("input#qsb-keyskill-sugg",configJSO.post);

  await page.waitForSelector("input#qsb-location-sugg");
  await page.type("input#qsb-location-sugg",loc);

  await page.keyboard.press("Enter");

// Click to check box remote
  await page.waitForSelector("span[title='Remote']");
  await page.click("span[title='Remote']", {clickCount:1});
// CLICK SAVE ALERTS
  await page.waitForSelector("div.quick-search-bar__view>button.btn-primary");
  await page.click("div.quick-search-bar__view>button.btn-primary");

  await page.waitForSelector("input[placeholder='Alert Name']");
  await page.type("input[placeholder='Alert Name']",post+" "+loc,{delay:50});
  
  

  await page.waitForSelector("button[type='submit']");
  await page.click("button[type='submit']");



 

  
}
run();



