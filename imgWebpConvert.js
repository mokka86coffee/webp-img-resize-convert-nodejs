// html > head
// http://webpjs.appspot.com

var webp = require('webp-converter');
var fs = require('fs');
var path = require('path');
const sharp = require('sharp');

let promReadDir = (way) => new Promise(r=> fs.readdir( way, (err, items) => r(items) ) );
let promFileStat = (file) => new Promise(r=> fs.stat( file, (err, stats) => r( +(stats["size"]/1000).toFixed() ) ) );
let sharpImg = (file) => new Promise(r=> sharp(file).resize(1000).toFile('src/output.jpg', (err, info) => r(info) ) );
let convertImg = (way, fileName, quality) => new Promise(r=> webp.cwebp(`${way}/output.jpg`,`dist/${fileName}.webp`, quality, (status,error) => r() ) );


(async ()=>{
    let way = path.resolve(`${__dirname}/src`);

    let files = await promReadDir(way);
        
    for (file of files) {
            let fileName = file.replace(/\.(jpg|png)$/g, '');
            let fileSize = await promFileStat(`${way}/${file}`);

            await sharpImg(`${way}/${file}`);

            let quality = "-q 80";            
    }
})();
