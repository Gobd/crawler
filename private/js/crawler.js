/**
 * Created by Tom on 3/29/2016.
 */
"use strict";
//imports
const request = require('request');
const cheerio = require('cheerio');
const URL = require('url-parse');
const bottleneck = require('bottleneck');
const fh = require('./fileHelpers');

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
const limiter = new bottleneck(1, 1000);

//define some variables for later use
let pagesVisited = {};
let numPagesVisited = 0;
let pagesToVisit = [];
let url = new URL(startUrl);
let baseUrl = url.protocol + "//" + url.hostname;

pagesToVisit.push(startUrl);
pagesToVisit.push("http://www.mtbproject.com/directory/all");
pagesToVisit.push("http://www.mtbproject.com/directory/8010492/salt-lake-city-and-wasatch-front");

let stats = fh.getStats();
if(stats.visited){
    let tempV = fh.getVisit();
    for (let i = 0; i < temp.length; i++) {
        pagesVisited[temp[i]] = true;
    }
}
if(stats.queued){
    let tempQ = fh.getQueued();
    tempQ.on("data", (data)=>{
        for (let i = 0; i < data.length; i++) {
            pagesToVisit.push(temp[i]);
        }
    })
}

//crawler that makes sure we only visit unvisited pages
let crawl = () => {
    //we've visited max number of pages or visited all in queue
    if (numPagesVisited >= maxPages || pagesToVisit.length === 0) {

    } else {

        if (numPagesVisited % 100 === 0) {
            console.log(numPagesVisited);
        }
        let nextPage = pagesToVisit.shift();
        if(pagesToVisit.length < 500){
            let temp = fh.getQueued();
            for (let i = 0; i < temp.length; i++) {
                pagesToVisit.push(temp[i])
            }
        }
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
    fh.appendVisit("write", String("\'" + url + "\',\n"));
    numPagesVisited++;

    // Make the request
    request(url, (error, response, body) => {
        // Check status code (200 is HTTP OK)
        if (!error) {
            if (response.statusCode !== 200) {
                fh.appendLog("write",String(url + " : failed, " + response.statusCode + "\n"));
                callback();
                return;
            }
            fh.appendLog("write", String(url + " : passed, " + response.statusCode + "\n"));
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
        } else {
            fh.appendLog("write", String(url + " : failed, " + error + "\n"));
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
                fh.appendData("write", JSON.stringify(ret) + ",");
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
            fh.appendQueue("write",String(baseUrl + $(this).attr('href') + ","));
        }
    });
};

crawl();
