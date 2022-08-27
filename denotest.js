// var {createCanvas}  = await import("https://deno.land/x/canvas/mod.ts")

// // var canvas = document.createElement("canvas");
// var canvas = createCanvas(20,20);
// var texttodraw = "afds"
// var ctx = canvas.getContext("2d");

// ctx.font = 5+'px Arial';
// ctx.fillStyle = "black"
// ctx.textBaseline="top"; 
// ctx.fillText(texttodraw, -5,-10);

// var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
// console.log(imageData.data)
// // check if image data array contains values other than 0
// var data = imageData.data.filter(function(e) {
//     return e !== 0;
// });
// console.log(data);


import Canvas from 'https://deno.land/x/canvaseno/mod.ts'
import { serve } from "https://deno.land/std@0.78.0/http/server.ts";

const canvas = Canvas.createCanvas(200, 200);
const ctx = canvas.getContext('2d');

ctx.fillStyle = '#00ff00';
ctx.font = '20px Arial';

ctx.textBaseline = "top"
// ctx.fillRect(10, 10, canvas.width - 20, canvas.height - 20);
ctx.fillText("test", 30,30);


var data = ctx.getImageData(0,0,10,10)
console.log(data.data)
const server = serve({ hostname: "0.0.0.0", port: 8080 });
console.log(`HTTP webserver running. Access it at: http://localhost:8080/`);

await Deno.writeFile(import.meta.url.split('/').pop()+".png", canvas.toBuffer());

// for await (const request of server) {
//   request.respond({ status: 200, body: canvas.toBuffer() });
// }

// test load font 

// var s_font_url = "https://fonts.cdnfonts.com/s/12165/Roboto-Regular.woff"
// var s_font_css_url = `url(${s_font_url})`  
// var s_font_name = s_font_css_url.split('/').pop().split('.').slice(0, -1)
// var s_font_name = s_font_name
// var o_font = new FontFace(s_font_name, s_font_css_url); // font face not defined in Deno
// o_font
//     .load()
//     .then(
//         function (font) {
//             console.log(`Font loaded from ${s_font_url}`);
//             // with canvas, if self is ommited won't work
//             document.fonts.add(font); // this wont work in deno :(
//         }, 
//         function(error){
//             console.error(`font with url ${s_font_url} could not be loaded`)
//             console.error(error)
//         }
//     );