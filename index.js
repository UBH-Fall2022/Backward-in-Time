function getDate(date) {
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    return year + (month/12) + (day/365) + (hour/(365*24)) + (minute/(365*24*60));
}
function percToDate(percent, time){
    var func1 = time - (Math.exp(20.3444*Math.pow(percent, 3)+3)-Math.exp(3));
    return func1
}

var facts = [];

async function loadFacts(filePath) {
    let file = ""
    await fetch(filePath)
        .then((response) => response.text())
        .then((text) => file = text);
    let lines = file.split("\n");
    for (let line of lines) {
        // Remove quotes
        line = line.replace(/"/g, "");
        // Split into columns along all commas
        let columns = line.split(",");
        // Reassemble the fact (date is known to not have commas)
        let fact = columns.slice(1).join(",");
        // Add to array
        facts.push({date: columns[0], fact: fact});
    }
}
let mostRecentFact = null;
async function factForDate(year){
    if(facts.length === 0) await loadFacts("events.csv");
    // Iterate over facts to find the most recent one that is before the given date
    var mostRecentDate = new Date().getFullYear() + 1; // set in future so everything is before it
    for (let event of facts) {
        if (+event.date < mostRecentDate && +event.date >= year) {
            mostRecentFact = event.fact;
            mostRecentDate = +event.date;
        }
    }
    return mostRecentFact;
}
/**
 * Date to display
 * 
 * @param {number} year The date as a decimal (i.e. 2022.123)
 * @returns A string representing how to display the date
 */
function fullDate(year){
    let currentYear = new Date().getFullYear();
    let yearInMs =  365.25*24*60*60*1000;
    if (year > 1990) {
        // Present - 1990
        // @todo - how accurate is this?
        let date = new Date((year-1970) * yearInMs);
        return dateToString(date);
    }
    else if (year > 1000)
        // 1990 - 1000
        return `${Math.floor(year)}`;
    else if (year > 0)
        // 1000 CE - 0
        return `${Math.floor(year)} CE`;
    else if (year > -1000)
        // 0 - 1000 BCE
        return `${Math.abs(Math.ceil(year))} BCE`;
    else if (Math.ceil(currentYear-year) > -10000)
        // 1000 BCE - 10,000 BCE
        return `${(Math.abs(Math.ceil(currentYear-year))).toLocaleString()} years ago`
    else if (Math.ceil(currentYear-year) > -1000000)
        // 10 thousand years ago - 1 million years ago
        return `${Math.abs(Math.round((currentYear-year)/1000))} thousand years ago`
    else if (Math.ceil(currentYear-year) > -100000000)
        // 1 million years ago - 1 billion years ago
        return `${Math.abs(Math.ceil(currentYear-year)/1000000)} million years ago`
    else
        // 1 billion years ago - end
        return `${Math.abs(Math.ceil(currentYear-year)/1000000000)} billion years ago`
}

/**
 * Calculate the percentage given start and end dates
 * 
 * @param {string} start The start date/time as a an ISO string (i.e. '2022-11-05T14:42') 
 * @param {string} end   The end date/time as a an ISO string (i.e. '2022-11-05T14:42')
 * @param {string} [now = [current time]] The current date/time as a an ISO string (i.e. '2022-11-05T14:42')
 * @returns The percentage of the way through the time period as a decimal (i.e. 0.5)
 */
function calcPercent(start, end, now = new Date().f()) {
    let startMs = Date.parse(start);
    let endMs = Date.parse(end);
    let nowMs = Date.parse(now);

    if (nowMs < startMs) return 0;
    if (nowMs > endMs) return 1;

    return ((nowMs - startMs) / (endMs - startMs));
}

/**
 * Submit function for when you press the button
 */
function submit() {
    let start = document.getElementById("start-time").value;
    if(start === "") start = new Date().toISOString();
    document.getElementById("start-time").value = start;
    let end = document.getElementById("end-time").value;
    let timeline = document.getElementById("timeline");
    timeline.style.display = "block";
    
    if (timeline.loop) clearInterval(timeline.loop);
    timeline.loop = setInterval(() => loop(start, end), 100);
    
}

function loop(start, end) {
    let now = new Date().toISOString();
    let percent = calcPercent(start, end, now);
    let resultDate = percToDate(percent, getDate(new Date(start)));
    let prog = document.getElementById("progress");
    //percent = percent.toFixed(4);

    prog.innerText = `${(percent*100).toFixed(4)}% completed`;
    let bar = document.getElementById("progress-bar-inner");
    bar.style.width = `${percent*100}%`;
    let date = document.getElementById("date");
    date.innerText = fullDate(resultDate);
    let fact = document.getElementById("fact");
    factForDate(resultDate).then((factText) => {
        fact.innerText = factText;
    });

    if(percent === 1) clearInterval(timeline.loop);
}
/**
 * Returns a String based date for reading
 * 
 * @param {string} date   Date object')
 * @returns Returns the date as a string in the format MONTH DAY, YEAR
 */
function dateToString(date){
    let monthNames = [
        "January",
        "February", 
        "March",
        "April", 
        "May", 
        "June", 
        "July",
        "August", 
        "September", 
        "October",
        "November", 
        "December"
    ]
    let years = date.getFullYear();
    let months = date.getMonth();
    
    let days = date.getDate();
    return `${monthNames[months]} ${days}, ${years}`;
}