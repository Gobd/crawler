/**
 * Created by Tom on 4/4/2016.
 */
"use strict";

const fs = require("fs");
const emptyCallback = (err, fd) => {
};
fs.open("../data/data.json", "a+", emptyCallback);
fs.open("../data/log.txt", "a+", emptyCallback);
fs.open("../data/visitedLinks.txt", "a+", emptyCallback);
fs.open("../data/queuedLinks.txt", "a+", emptyCallback);

module.exports = {

    getStats: () => {
        let ret = {};
        ret.visited = fs.statSync("../data/visitedLinks.txt", emptyCallback).size != 0;
        ret.queued = fs.statSync("../data/queuedLinks.txt", emptyCallback).size != 0;
        return ret;
    },

    appendData: (command, url) => {
        switch (command) {
            case "write":
                fs.appendFileSync("../data/data.txt", "\'" + url + "\',\n");
                break;
            case "end":
            //finish writing and close stream
        }
    },
    appendQueue: (command, url) => {
        switch (command) {
            case "write":
                fs.appendFileSync("../data/queuedLinks.txt", url);
                break;
            case "end":
            //finish writing and close stream
        }

    },
    appendVisit: (command, url) => {
        switch (command) {
            case "write":
                fs.appendFileSync("../data/visitedLinks.txt", url);
                break;
            case "end":
            //finish writing and close stream
        }

    },
    appendLog: (command, entry) => {
        switch (command) {
            case "write":
                fs.appendFileSync("../data/log.txt", entry);
                break;
            case "end":
            //finish writing and close stream
        }
    },
    getQueued: () => {
        return fs.createReadStream("../data/queuedLinks.txt", {start: 0, end: 999});
        // console.log(temp)
        // return temp;
    },
    getVisit: () => {
        return fs.readFileSync("../data/visitedLinks.txt", {"encoding": "utf8"}, emptyCallback).split(",");
        
    }
};