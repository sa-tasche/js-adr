let fs = require('fs')
let walkSync = require('walk-sync')
let workDir = process.cwd()

let DEFAULT_DIGITS = 3

function getSavePath () {
  if (!fs.existsSync(workDir + '/.adr.json')) {
    return workDir + '/doc/ard/'
  }

  let config = fs.readFileSync(workDir + '/.adr.json', 'utf8')

  try {
    return JSON.parse(config).path
  } catch (e) {
    return console.error(e)
  }
}

function pad (num, size) {
  let s = '00000000' + num
  return s.substr(s.length - size)
}

function getLastNumber () {
  let path = getSavePath()
  let files = walkSync(path)

  if (files[files.length - 1] === 'README.md') {
    files.splice(-1,1)
  }

  if (files && files.length > 0) {
    let lastNumber = parseInt(files[files.length - 1].substring(0, DEFAULT_DIGITS), 10)

    for (let i = 0;i < files.length;i++) {
      let file = files[i]
      let fileNumber = file.substring(0, DEFAULT_DIGITS)
      let int = parseInt(fileNumber, 10)
      if (int > lastNumber) {
        lastNumber = int
      }
    }

    return lastNumber
  }

  return 0
}

function getNewIndex () {
  let lastIndex = getLastNumber()
  if (!lastIndex) {
    return pad(1, DEFAULT_DIGITS)
  }
  lastIndex = lastIndex + 1
  return pad(lastIndex, DEFAULT_DIGITS)
}

let Utils = {
  DEFAULT_DIGITS: DEFAULT_DIGITS,
  getSavePath: getSavePath,
  getNewIndex: getNewIndex,
  getLastNumber: getLastNumber
}

export default Utils