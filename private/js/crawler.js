/**
 * Created by Tom on 3/29/2016.
 */
"use strict";

//imports
const request = require('request');
const cheerio = require('cheerio');
const URL = require('url-parse');
const fs = require("fs");
const bottleneck = require('bottleneck');

//define some option constants
const startUrl = "http://www.mtbproject.com/featured/Rides";
// const startUrl = "http://www.mtbproject.com/trail/5843518/holzinger-lap";
const searchTerms = [
    'itemprop="itemreviewed"',
    'itemprop="rating"',
    "textSecondary",
    'maps.google.com/?daddr',
    'Getting There',
    'class="imperial"',
    "Overview"
];
const maxPages = 100;
const fileExts = [
    ".asx",     // Windows video
    ".bmp",     // bitmap image
    ".css",     // Cascading Style Sheet
    ".doc",     // Microsoft Word (mostly)
    ".docx",    // Microsoft Word
    ".flv",     // Old Flash video format
    ".gif",     // GIF image
    ".jpeg",    // JPEG image
    ".jpg",     // JPEG image
    ".mid",     // MIDI file
    ".mov",     // Quicktime movie
    ".mp3",     // MP3 audio
    ".ogg",     // .ogg format media
    ".pdf",     // PDF files
    ".png",     // image
    ".ppt",     // powerpoint
    ".ra",      // real media
    ".ram",     // real media
    ".rm",      // real media
    ".swf",     // Flash files
    ".txt",     // plain text
    ".wav",     // WAV format sound
    ".wma",     // Windows media audio
    ".wmv",     // Windows media video
    ".xml",     // XML files
    ".zip",     // ZIP files
    ".m4a",     // MP4 audio
    ".m4v",     // MP4 video
    ".mov",     // Quicktime movie
    ".mp4",     // MP4 video or audio
    ".m4b"	    // MP4 video or audio
];
//const dataStream = fs.createWriteStream("../data/crawledData.json", {encoding: 'utf8'});
//const logStream = fs.createWriteStream('../data/log.txt', {encoding: 'utf8'});
//const visitStream = fs.createWriteStream('../data/visitedLinks.txt', {encoding: 'utf8'});
//const readQueue = fs.createReadStream('../data/queuedLinks.txt');
const limiter = new bottleneck(2, 500);

//define some variables for later use
let pagesVisited = {};
let numPagesVisited = 0;
let pagesToVisit = [];
let url = new URL(startUrl);
let baseUrl = url.protocol + "//" + url.hostname;
let commaFlag = false;
let visitFlag = false;
const emptyCallback = (err, fd) => {
};
fs.open("../data/crawledData.json", "a+", emptyCallback);
fs.open("../data/log.txt", "a+", emptyCallback);
fs.open("../data/visitedLinks.txt", "a+", emptyCallback);
//do some things before start
//todo  add read of visit and queue into memory

let stats = fs.statSync("../data/crawledData.json", emptyCallback).size;
if (stats != 0) {
    commaFlag = true;
}
stats = fs.statSync("../data/visitedLinks.txt", emptyCallback).size;
if (stats != 0) {
    let temp = fs.readFileSync("../data/visitedLinks.txt", {"encoding": "utf8"}, emptyCallback).split(",'");
    for (let i = 0; i < temp.length; i++) {
        pagesVisited[temp[i]]=true;
    }
    visitFlag = true;
}
stats = fs.statSync("../data/queuedLinks.txt", emptyCallback).size;
if (stats != 0) {
    let temp = fs.readFileSync("../data/queuedLinks.txt", {"encoding": "utf8"}, emptyCallback).split(',');
    for (let i = 0; i < temp.length; i++) {
        pagesToVisit.push(temp[i])
    }
}

const queueStream = fs.createWriteStream('../data/queuedLinks.txt', {encoding: 'utf8'});


pagesToVisit.push(startUrl);
pagesToVisit.push("http://www.mtbproject.com/directory/all");
pagesToVisit.push("http://www.mtbproject.com/directory/8010492/salt-lake-city-and-wasatch-front");
//dataStream.write("[");
//visitStream.write("[");
//queueStream.write("[");

//todo figure out why some entries end up with no commas or double commas

//crawler that makes sure we only visit unvisited pages
let crawl = () => {
    //we've visited max number of pages or visited all in queue
    if (numPagesVisited >= maxPages || pagesToVisit.length === 0) {

        queueStream.write(JSON.stringify(pagesToVisit));
        queueStream.on('finish', ()=> {
            console.log('queue has been written')
        });
        queueStream.end();
    } else {

        if (numPagesVisited % 100 === 0) {
            console.log(numPagesVisited);
        }
        let nextPage = pagesToVisit.pop();

        if (nextPage in pagesVisited) {
            // We've already visited this page, so repeat the crawl
            crawl();
        } else {
            // New page we haven't visited
            limiter.submit(visitPage, nextPage, crawl);
            // visitPage(nextPage,crawl)
        }
    }
};

//visits the page and determines whether we care about it or not
let visitPage = (url, callback) => {

    // Add page to visitedpages
    pagesVisited[url] = true;
    if (!visitFlag) {
        visitFlag = true;
    } else {
        fs.appendFile("../data/visitedLinks.txt", ",", (err)=> {
            err ? console.log(err) : {};
        })
    }
    fs.appendFile("../data/visitedLinks.txt", "\'" + url + "\'");
    numPagesVisited++;

    // Make the request
    request(url, (error, response, body) => {
        // Check status code (200 is HTTP OK)
        if (response.statusCode) {
            fs.appendFile("../data/log.txt", url + " : passed, " + response.statusCode + "\n");
            if (response.statusCode !== 200) {
                callback();
                return;
            }
            // Parse the document body
            let $ = cheerio.load(body);

            //ensures it only searches trail pages
            if (/(http:\/\/www.mtbproject.com\/trail\/).*/.test(url)) {
                searchForTerms(url, $, searchTerms);
                callback();
            } else {
                collectInternalLinks($);
                callback();
            }
        } else{
            fs.appendFile("../data/log.txt", url + " : failed, " + error + "\n");
        }
    });
};

//searches html for terms we're interested in and writes them to file
let searchForTerms = (url, $, terms) => {
    let text = $('html').html();
    let termCount = 0;
    let len = terms[0].length;
    let ret = {};
    ret.location = {coordinates: []};
    ret.url = url;
    let temp;

    //iterates through html page
    for (var i = 0; i < text.length; i++) {
        //checks html for hooks
        if (text.slice(i, i + len) === terms[termCount]) {
            //hooks are sequential, matches observed patterns and pulls relevant data
            switch (termCount) {
                //name
                case 0:
                    temp = text.slice(i + len, i + len + 200);
                    ret.name = temp.match(/>([^<]*)</)[1].trim();
                    break;
                //rating
                case 1:
                    temp = text.slice(i + len, i + len + 200);
                    ret.rating = temp.match(/>([^<]*)</)[1].trim();
                    break;
                //difficulty
                case 2:
                    temp = text.slice(i + len, i + len + 200);
                    temp = temp.match(/>([^<]*)</)[1];
                    ret.difficulty = temp.match(/(.*(?=from))/)[1];
                    break;
                //location
                case 3:
                    //long,lat
                    temp = text.slice(i + len, i + len + 200);
                    temp = temp.match(/=([^"]*)"/)[1];
                    ret.location.coordinates[1] = temp.match(/(.*(?=,))/)[1];
                    ret.location.coordinates[0] = temp.match(/,([^,]+)/)[1];
                    break;
                //gpx
                case 4:
                    temp = text.slice(i + len, i + len + 200);
                    temp = temp.match(/"([^"]*)"/)[1];
                    ret.gpx = baseUrl + temp;
                    break;
                //length
                case 5:
                    temp = text.slice(i + len, i + len + 200);
                    ret.length = temp.match(/>([^<]*)</)[1].trim();
                    break;
                //desc
                case 6:
                    temp = text.slice(i + len, i + len + 2000);
                    if (!(/Details<([^>].*)/.test(temp))) {
                        if ((/(.*\n(?=<\/div><))/.test(temp))) {
                            temp = temp.match(/(.*\n(?=<\/div><))/)[1];
                        }
                    } else {
                        temp = temp.match(/Details<([^>].*)/)[1];
                        temp = temp.match(/((?=[^>]*$).*)/)[1];
                    }
                    ret.desc = temp;
                    break;
            }
            termCount++;
            //once we've found all data we care about
            if (termCount >= terms.length) {
                //write data to file
                //writes commas after every entry besides the first one to ensure json format
                if (!commaFlag) {
                    commaFlag = true;
                } else {
                    fs.appendFile("../data/crawledData.json", ",", (err)=> {
                        err ? console.log(err) : {};
                    })
                }
                fs.appendFile("../data/crawledData.json", JSON.stringify(ret), (err)=> {
                    err ? console.log(err) : {};
                });
                break;
            }
        }
        else {
            len = terms[termCount].length;
        }
    }
};

//collects links on pages visited that are from the same domain
let collectInternalLinks = ($) => {
    let relativeLinks = $("a[href^='/']");
    //todo converting .each anon callback to a big arrow function breaks $ for some reason
    relativeLinks.each(function () {
        //if the link is one that we care about, add it to the list to visit
        if (!/\/photo.*/.test($(this).attr('href')) || !/\/forum.*/.test($(this).attr('href')) || !/\/faq.*/.test($(this).attr('href')) || !/\/blog.*/.test($(this).attr('href')) || !/\/user.*/.test($(this).attr('href')) || !/\/club.*/.test($(this).attr('href')) || !/\/admin.*/.test($(this).attr('href')) || !/\/ajax.*/.test($(this).attr('href')) || !/\/edit.*/.test($(this).attr('href')) || !/\/earth.*/.test($(this).attr('href')) ||
            !$(this).attr('href').match(/(\..*)/)[1] in fileExts ||
            (baseUrl + $(this).attr('href')) in pagesVisited
        ) {
            //if (!queueFlag) {
            //    queueFlag = true;
            //} else {
            //    queueStream.write(",", (err)=> {
            //        err ? console.log(err) : {};
            //    })
            //}
            //queueStream.write("\'"+baseUrl + $(this).attr('href')+"\'");
            pagesToVisit.push(baseUrl + $(this).attr('href'));
        }
    });
};

crawl();