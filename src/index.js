
function submit(){
    var time = document.getElementById("start-time").value;
    var date = new Date(Date.parse(time));
    var historicDate = percToDate(percent, date);
}
function getDate(date) {
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate() ;
    var hour = date.getHours()-24;
    var minute = date.getMinutes();
    var decimal = year + (month / 12) + (day / 365) + (hour / 8760) + (minute / 525600);
    return decimal;
}
function percToDate(percent, time){
    var func1 = time - (Math.exp(20.3444*Math.pow(percent, 3)+3)-Math.exp(3));
    return func1
}

function factForDate(year){
    var csv = data.FileReader("data.csv")
    var lowestyear = 0
    var difference = 99999999999
    for (var i of csv){
        if (Math.abs(i[0] - year) < difference){
            lowestyear = i[0]
            difference = Math.abs(i[0] - year)
        }
    }
    for(var i of csv){
        if (lowestyear == i[0]){
            return i[1]
        }
    }
}

/**
 * Date to display
 * 
 * @param {number} year The date as a decimal (i.e. 2022.123)
 * @returns A string representing how to display the date
 */
function fullDate(year){
    let currentYear = new Date().getFullYear();
    let yearInMs = 31536000000;

    if (year > 1990) {
        // Present - 1990
        // @todo - how accurate is this?
        let date = Date(currentYear - year * yearInMs)
        return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
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

let tests = [ 2022, 2000, 1901, 1900, 1899, 1001, 1000, 999, 1, 0, -1, -999, -1000, -1001, -9999, -10000, -10001, -999999, -1000000, -1000001, -999999999, -1000000000, -1000000001 ];
for (test of tests)
    console.log(`${test} -> ${fullDate(test)}`);
