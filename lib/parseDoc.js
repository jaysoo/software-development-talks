'use strict'

const invariant = require('./invariant')
const Line = require('./model').Line
const Duration = require('./model').Duration
const toDuration = require('./model').toDuration

// parseDoc :: String -> Line[]
const parseDoc = (text) => text.split('\n').map(toType)
  
module.exports = parseDoc

/* Private helpers */

const EMPTY_RE = /^\s*$/
const HEADER_RE = /^([#]+)\s+(.+?)$/
const VIDEO_RE = /^\s*\[(.+?)\]\((http.+?)\)\s+(\[ (\d{2}):(\d{2}):(\d{2}) \]\s+)?-\s+(.+?)\s*$/

const toType = (line) => {
  if (EMPTY_RE.test(line)) {
    return Line.Empty()
  }

  let match = line.match(HEADER_RE)

  if (match) {
    return Line.Header(match[1].length, match[2])
  }

  match = line.match(VIDEO_RE)

  if (match) {
    return Line.VideoOf({
      title: match[1],
      url: match[2],
      speaker: match[7],
      duration: match[3] ? Duration.Just(Number(match[4]), Number(match[5]), Number(match[6])) : Duration.Nothing()
    })
  }


  return Line.Text(line)
}
