/**
 * Created by Tom on 3/29/2016.
 */
"use strict";

const request = require('request');
const cheerio = require('cheerio');
const URL = require('url-parse');

// const startUrl = "http://www.mtbproject.com/featured/Rides";
const startUrl = "http://www.mtbproject.com/trail/5843518/holzinger-lap";

const searchTerms = [
    'itemprop="itemreviewed"',
    'itemprop="rating"',
    "textSecondary",
    'title="Trailhead Directions"',
    'title="Download GPX File"',
    'class="imperial"',
    "Overview"
];
// const maxPages = 100000;
const maxPages = 10;

let data = [];

let pagesVisited = {};
let numPagesVisited = 0;
let pagesToVisit = [];
let url = new URL(startUrl);
let baseUrl = url.protocol + "//" + url.hostname;

let crawl = ()=> {
    if (numPagesVisited >= maxPages) {
        console.log("Reached max limit of number of pages to visit.");
        return;
    }
    let nextPage = pagesToVisit.pop();
    if (nextPage in pagesVisited) {
        // We've already visited this page, so repeat the crawl
        crawl();
    } else {
        // New page we haven't visited
        visitPage(nextPage, crawl);
    }
};

let visitPage = (url, callback) => {

    // Add page to our set
    pagesVisited[url] = true;
    numPagesVisited++;

    // Make the request
    console.log("Visiting page " + url);
    request(url, (error, response, body) => {
        // Check status code (200 is HTTP OK)
        console.log("Status code: " + response.statusCode);
        if (response.statusCode !== 200) {
            callback();
            return;
        }
        // Parse the document body
        let $ = cheerio.load(body);

        if (/(http:\/\/www.mtbproject.com\/trail\/).*/.test(url)) {
            data.push = searchForTerms($, searchTerms);


        } else {
            collectInternalLinks($);
            // In this short program, our callback is just calling crawl()
            callback();
        }
    });
};

let searchForTerms = ($, terms) => {
    let text = $('html').html();
    let termCount = 0;
    let ratingCount = 0;
    let secondaryCount = 0;
    let lengthCount = 0;
    let len = terms[0].length;
    let ret = {};
    let temp;

    for (var i = 0; i < text.length; i++) {
        if (text.slice(i, i + len) === terms[termCount]) {
            switch (termCount) {
                case 0:
                    temp = text.slice(i + len, i + len + 200);
                    ret.name = temp.match(/>([^<]*)</)[1].trim();
                    break;
                case 1:
                    temp = text.slice(i+len,i+len+200);
                    ret.rating = temp.match(/>([^<]*)</)[1].trim();
                    break;
                case 2:
                    console.log('made it');
                    temp = text.slice(i+len,i+len+200);
                    ret.difficulty = temp.match(/>([^<]*)</)[1].trim();
                    console.log(temp.match(/>([^<]*)</)[1].trim())
                    break;
            }
            termCount++;
            //if termcount > terms.length => break
            len = terms[termCount].length;

        }
    }
    console.log(ret);

    return (null);
};

let collectInternalLinks = ($) => {
    let relativeLinks = $("a[href^='/']");
    console.log("Found " + relativeLinks.length + " relative links on page");
    relativeLinks.each(function () {
        pagesToVisit.push(baseUrl + $(this).attr('href'));
    });
};

pagesToVisit.push(startUrl);
// pagesToVisit.push("http://www.mtbproject.com/directory/all");
crawl();