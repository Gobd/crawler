/**
 * Created by Tom on 4/4/2016.
 */
"use strict";

let crawler = require("./crawler.js");
// let fs = require("fs");
//
// const emptyCallback = (err, fd) => {
// };
// fs.open("../data/data.json", "a+", emptyCallback);
// fs.open("../data/log.txt", "a+", emptyCallback);
// fs.open("../data/visitedLinks.txt", "a+", emptyCallback);

crawler.getpageslist();

for (var i = 0; i < 100; i++){
crawler();
}

// crawl((data, err) => {
//     if (err) throw err
//     fs.createWriteStream(data)
// }).on('end', crawl())