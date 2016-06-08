/**
 * Created by Tom on 3/29/2016.
 */
"use strict";
//imports
const request = require('request');
const cheerio = require('cheerio');
const URL = require('url-parse');
const bottleneck = require('bottleneck');
const q = require('q');
const jsonfile = require('jsonfile');
const startUrl = `http://games.crossfit.com/scores/leaderboard.php?stage=0&sort=0&page=147&division=1&region=11&numberperpage=100&competition=0&frontpage=0&expanded=1&year=16&full=0&showtoggles=0&hidedropdowns=1&showathleteac=0&=&is_mobile=&scaled=0&fittest=1&fitSelect=0&regional=3&occupation=0`;
// const startUrl = `http://games.crossfit.com/scores/leaderboard.php?stage=0&sort=0&division=101&region=11&regional=1&numberperpage=100&page=0&competition=1&frontpage=0&expanded=1&full=0&year=11&showtoggles=0&hidedropdowns=1&showathleteac=1&athletename=&fittest=1&fitSelect=undefined&scaled=0&occupation=0`;
// const startUrl = `http://games.crossfit.com/scores/leaderboard.php?stage=5&sort=1&division=1&region=0&regional=0&numberperpage=100&page=0&competition=0&frontpage=0&expanded=1&full=0&year=12&showtoggles=0&hidedropdowns=1&showathleteac=1&athletename=&fittest=1&fitSelect=0&scaled=0&occupation=0`;
// const startUrl = `http://games.crossfit.com/scores/leaderboard.php?stage=5&page=145&sort=0&division=1&region=11&regional=3&numberperpage=100&userid=0&competition=0&frontpage=0&expanded=1&year=16&full=0&showtoggles=0&hidedropdowns=1&showathleteac=0&athletename=&scaled=0`;
// const startUrl = `http://games.crossfit.com/scores/leaderboard.php?stage=0&sort=0&page=1&division=101&region=11&numberperpage=100&competition=1&frontpage=0&expanded=1&year=16&full=0&showtoggles=0&hidedropdowns=0&showathleteac=0&=&is_mobile=&scaled=0&fittest=0&fitSelect=&regional=3&occupation=0`;
const limiter = new bottleneck(1, 1000);

const regional = {
    1: 'Atlantic',
    2: 'California',
    3: 'Central',
    4: 'East',
    5: 'Meridian',
    6: 'Pacific',
    7: 'South',
    8: 'West'
};

function crossfit() {
    request(startUrl, (error, response, body) => {
        let titles = [];
        let pages = ['1'];
        let arr = [];
        let $ = cheerio.load(body);

        $('#leaderboard-pager').find('.button').each(function(a, b) {
            let link = $(this).attr('href').match(/(?:page=)(\d+)/i);
            if (link[1]) {
                pages.indexOf(link[1]) === -1 ? pages.push(link[1]) : false;
            }
        });

        console.log(pages);

        $('tr').eq(0).find('th').each(function(i, e) {
            if ($(this).text()) {
                let temp = $(this).text().toString().replace(/\n\s*/ig, '');
                if (/event/ig.test(temp)) {
                    temp = temp.match(/[a-z]+[0-9]+/i);
                }
                titles.push(temp);
            }
        });

        if (arr.length === 0) {
            for (let l = 0; l < $('tr').slice(1).length; l++) {
                arr[l] = {};
                for (let k = 0; k < titles.length; k++) {
                    arr[l][titles[k]] = {};
                }
            }
        }

        $('tr').slice(1).each(function(i, e) {
            let shorten = $(e).children().length > titles.length;
            if (shorten) {
                let place = $(e).children('.number').text().match(/^[0-9]*/);
                let points = $(e).children('.number').text().match(/(?:\()(.*)(?:\))/);
                arr[i][titles[0]].name = $(e).children('.name').text();
                if (place[0]) {
                    arr[i][titles[0]].place = $(e).children('.number').text().match(/^[0-9]*/)[0];
                } else {
                    arr[i][titles[0]].place = '--';
                }
                if (points) {
                    arr[i][titles[0]].points = $(e).children('.number').text().match(/(?:\()(.*)(?:\))/)[1];
                }
            }
            $(e).find('.score-cell').each(function(j, f) {
                let detail = $(f).find('.detail').length !== 0 ? '.detail' : '.display';
                let points = $(f).find(detail).html().toString().match(/(?:<br>)([0-9]*)(?:.*<br>)|^\d+/);
                let time = $(f).find(detail).html().toString().replace(/[\\n\s]+/g, '').match(/(?:.*)(?:<br>)(.*)$|(?:\()(.*)(?:\))/);
                if (j < titles.length - 1) {
                    if (Boolean(points)) {
                        Boolean(points[1]) ? arr[i][titles[j + 1]].points = points[1] : arr[i][titles[j + 1]].points = points[0];
                    } else {
                        arr[i][titles[j + 1]].points = $(f).find(detail).html().toString().replace(/[\\n\s]+/g, '').replace(/<.*>/g, '').replace(/\(.*/g, '');
                    }
                    if (Boolean(time)) {
                        Boolean(time[1]) ? arr[i][titles[j + 1]].time = time[1].replace(/\).*/, '') : arr[i][titles[j + 1]].time = time[2].replace(/\).*/, '');
                    } else {
                        arr[i][titles[j + 1]].time = $(f).find(detail).html().toString().replace(/[\\n\s]+/g, '').replace(/<.*>/g, '');
                    }
                }
            });

        });

    });
}

crossfit();