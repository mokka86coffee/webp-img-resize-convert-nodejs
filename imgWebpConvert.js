// html > head
// http://webpjs.appspot.com

var webp = require('webp-converter');
var fs = require('fs');
var path = require('path');
const sharp = require('sharp');

let promReadDir = (way) => new Promise(r=> fs.readdir( way, (err, items) => r(items) ) );
let promFileStat = (file) => new Promise(r=> fs.stat( file, (err, stats) => r( +(stats["size"]/1000).toFixed() ) ) );
let sharpImg = (file, outputWay, size) => new Promise( r => { sharp(file).resize(size || 800).toFile( outputWay ); r();} );
let convertImg = ({way, fileName, extension, quality}) => new Promise(r=> webp.cwebp(`${way}/src/${fileName}${extension}`,`dist/${fileName}.webp`, quality || '-q 85', (status,err) => err ? console.log(err) : r() ) );


(async ()=>{
    let way = path.resolve(__dirname);

    let files = await promReadDir(`${way}/src`);
        
    for (let file of files) {
            const extension = file.match(/\..+/)[0];
            let fileName = file.replace(/(\.(jpg|png)$|\s)/, '');
            let fileSize = await promFileStat(`${way}/src/${file}`);

            let imgSize = process.argv.includes(/s{1}\d+/g);
            if (imgSize) imgSize = imgSize[0];
            
            // await sharpImg(`${way}/src/${file}`, `${way}/dist/${fileName}.jpg`, imgSize);

            let quality = process.argv.includes(/q{1}\d+/g);
            if (quality) quality = quality[0];

            await convertImg({way, fileName, extension, quality});
    }
})();
