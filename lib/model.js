'use strict'

const T = require('union-type')
const Maybe = require('data.maybe')

const Duration = T({
  Just: [Number, Number, Number],
  Nothing: []
})

const Line = T({
  Empty: [],
  Header: [Number, String],
  Video: { title: String, url: String, speaker: String, duration: Duration },
  Text: [String]
})

// toDuration :: String -> Duration
const toDuration = (str) => {
  const match = str.match(/T(([0-5]?[\d])H)?([0-5]?[\d])M([0-5]?[\d]?)S/)

  if (match) {
    return Duration.Just(Number(match[2] | '0'), Number(match[3]), Number(match[4]))
  } else {
    return Duration.Nothing()
  }
}

const YOUTUBE_ID_RE = /https?:\/\/www.youtube.com\/watch\?v\=([a-zA-Z0-9_-]+)/

// getYouTubeID :: Line -> Maybe ID
const getYouTubeID = Line.case({
  Video: (title, url) => {
    const match = url.match(YOUTUBE_ID_RE)
    if (match) {
      return Maybe.Just(match[1])
    } else {
      return Maybe.Nothing()
    }
  },
  _: () => Maybe.Nothing()
})

module.exports = { Line, Duration, toDuration, getYouTubeID }
