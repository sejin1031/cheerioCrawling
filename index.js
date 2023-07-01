const logic = require('./logic');

function main () {
  const pages = 9;
  const results = [];

  for(let i = 1; i <= pages; i++) {
    logic.parseBoard(i, results);
  }

  setTimeout(() => {
    const result = logic.createCSVFile(results.map(res => res.getCsvRow()))

    logic.exportCsvFile(result);
  }, 3000)
  
}

function countMain () {
  const pages = 9;
  const countResult = {};

  for(let i = 1; i <= pages; i++) {
    logic.parseBoardCountNickname(i, countResult);
  }

  setTimeout(() => {
    const countArray = Object.keys(countResult).map(nickname => `${nickname},${countResult[nickname]}\r\n`)
    const result = logic.createCSVFile(countArray)

    logic.exportCsvFile(result, "닉네임");
  }, 3000)
}

countMain();