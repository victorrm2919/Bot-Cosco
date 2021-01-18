const fs = require('fs');
const pupeeteer = require('puppeteer');
const informacionCont = require('./containers.json');

(async()=>{
    const browser = await pupeeteer.launch(); /* Llamada a navegador */
    const page= await browser.newPage(); /* Creacion de pagina en el navegador */

    await page.setViewport({ width: 1280, height: 800 }) /* Asignacion de tamaño de pagina */
    await page.goto('https://elines.coscoshipping.com/ebusiness/'); /* Ir a la pagina */
    await page.waitForSelector('.ivu-modal-footer button.ivu-btn'); /* Esperar al modal de inicio */
    await page.click('.ivu-modal-footer button.ivu-btn'); /* Acepta politicas */
    await page.waitForTimeout(1000); /* Espera 1s */
    await page.click('.srh_c_t > li:nth-child(3)'); /* Selecciona el 3er hijo (CONTAINER) */

    await page.waitForTimeout(1000); /* Espera 1s */

    await page.type('div.ivu-form-item-content input','TGBU8953370'); /* Interactuar con la pagina y escribir */

    await page.click('div.btn_box a'); /* Click en pagina */
    await page.waitForSelector('.cargoTrackingTabPanel'); /* Espera a la informacion */
    await page.waitForTimeout(2000); /* Espera 2s */


    /* Extraccion de informacion */
    const infoT = await page.evaluate(()=>{
        const info = {};

        info.Container = document.querySelector('.cntrSelfPart p.cntrNumber').innerText;  /* Extrae contenedor */
        info.Date = document.querySelector('.ETA p.date').innerText;    /* Extrae ETA */

        return info;
    })

    await browser.close();  /* Cierra navegador */
    
    const resultadoJSON = JSON.stringify(infoT) /* Convierte a JSON resultado */


    /* Escribe la informacion en el txt */

    fs.appendFile('result.txt', resultadoJSON,(err)=>{
        if (err){
            throw err;
        }
        console.log('Consultas Terminadas')
    })

    console.log(informacionCont[1]);


})();