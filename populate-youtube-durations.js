const parseDoc = require('./lib/parseDoc')
const genDoc = require('./lib/genDoc')
const withDurations = require('./lib/withDurations')
const fs = require('fs')

const source = () => fs.readFileSync('./README.md').toString()

const sink = (doc) => fs.writeFileSync('./README.md', doc) 

const lines = parseDoc(source())
  withDurations(lines)
    .map((lines) => genDoc(lines))
    .fork(
      (e) => console.error(e),
      sink
    )
