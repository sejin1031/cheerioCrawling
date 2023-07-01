const request = require('request');
const cheerio = require('cheerio')
const fs = require('fs')

const baseURL = `https://gall.dcinside.com/`

const getPageUrl = (page) => {
  return `https://gall.dcinside.com/mgallery/board/lists/?id=idolsy&page=${page}&search_pos=-349984&s_type=search_subject_memo&s_keyword=.5B.EC.85.98.EB.AC.B4.EC.A7.84`
}

class Result {
  constructor(url, nickname) {
    this.url = url;
    this.nickname = nickname
  }
  getCsvRow () {
    return `${this.nickname},${this.url}\r\n`
  }
}

exports.parseBoard  = (page, results) => {
  const url = getPageUrl(page);

  request(url, function (error, response, body) {
    const $ = cheerio.load(body);

    const eachtr = $('div.gall_listwrap.list > table > tbody tr')

    eachtr.each(function () {
      const gall_num = $(this).find('.gall_num').text();
      if(Number(gall_num) < 300000) {
        return;
      }

      const nickname = $(this).find('.nickname em').text();
      const url = baseURL + $(this).find('.gall_tit a').attr('href')

      // console.log(nickname, url)

      const result = new Result(url, nickname);

      results.push(result);

    })
  }) 
}

exports.parseBoardCountNickname  = (page, result) => {
  const url = getPageUrl(page);

  request(url, function (error, response, body) {
    const $ = cheerio.load(body);

    const eachtr = $('div.gall_listwrap.list > table > tbody tr')

    eachtr.each(function () {
      const gall_num = $(this).find('.gall_num').text();
      if(Number(gall_num) < 300000) {
        return;
      }

      const nickname = $(this).find('.nickname em').text();
      const url = baseURL + $(this).find('.gall_tit a').attr('href')

      // console.log(nickname, url)

      if(!result[nickname]) {
        result[nickname] = 0
      } else {
        result[nickname] += 1;
      }

    })
  })
}

exports.createCSVFile = (resultArray) => {
  console.log(resultArray)
  let result = '닉네임,url\r\n';
  
  resultArray.forEach(res => {
      result += res
  })


  return result;
}

exports.exportCsvFile = (str, fileName = "집계") => {
  fs.writeFile(`${fileName}.csv`, str, 'utf8', (function (err) {
    if(err) {
      console.error('Some error occured while exporting', err)
    } else {
      console.log("Csv File Create SUCEESS")
    }
  }))
}