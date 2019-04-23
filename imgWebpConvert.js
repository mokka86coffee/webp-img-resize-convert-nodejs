// html > head
// http://webpjs.appspot.com

var webp = require('webp-converter');
var fs = require('fs');
var path = require('path');
const sharp = require('sharp');

let promReadDir = (way) => new Promise(r=> fs.readdir( way, (err, items) => r(items) ) );
let promFileStat = (file) => new Promise(r=> fs.stat( file, (err, stats) => r( +(stats["size"]/1000).toFixed() ) ) );
let sharpImg = (file, outputWay) => new Promise( r => { sharp(file).resize(1000).toFile( outputWay ); r();} );
let convertImg = (way, fileName, quality = '-q 80') => new Promise(r=> webp.cwebp(`${way}/src/${fileName}.jpg`,`dist/${fileName}.webp`, quality, (status,error) => r() ) );


(async ()=>{
    let way = path.resolve(__dirname);

    let files = await promReadDir(`${way}/src`);
        
    for (let file of files) {
            let fileName = file.replace(/\.(jpg|png)$/g, '');
            let fileSize = await promFileStat(`${way}\\src\\${file}`);
            
            await sharpImg(`${way}/src/${file}`, `${way}/dist/${fileName}.jpg`);


            let quality = process.argv.includes(/q{1}\d+/g);
            console.log(quality)
            if (quality) quality = quality[0];

            await convertImg(way, fileName, quality);
    }
})();
