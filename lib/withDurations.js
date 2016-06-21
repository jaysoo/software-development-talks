'use strict'

require('debug.trace/global')
const Task = require('data.task')
const Line = require('./model').Line
const getYouTubeID = require('./model').getYouTubeID
const toDuration = require('./model').toDuration
const R = require('ramda')
const fetch = require('node-fetch')

// getDurationData :: JSON -> Duration 
const getDurationData = (json) => toDuration(json.items[0].contentDetails.duration)

// addDuration :: Line -> Duration -> Line
const addDuration = R.curry((line, duration) => {
  return Line.case({
    Video: (title, url, speaker, _) => Line.Video(title, url, speaker, duration),
    _: () => line
  }, line)
})

// getYouTubeDetails :: URL -> Promise JSON
const getYouTubeDetails = (id) =>
  fetch(`https://www.googleapis.com/youtube/v3/videos?id=${id}&part=contentDetails&key=AIzaSyBn6VAt-hqQEowrEouhsL_k7RqJ2zSsoNI`)
    .then((resp) => resp.json())

// withDuration :: Line -> Promise Line
const withDuration = (line) =>
  getYouTubeID(line).cata({
    Just: (id) => getYouTubeDetails(id).then(R.compose(addDuration(line), getDurationData)),
    Nothing: () => Promise.resolve(line)
  })

// withDurations :: Line[] -> Task Error Line[]
const withDurations = (lines) =>
  new Task((rej, res) => {
    const futures = lines.map(withDuration)

    Promise.all(futures)
      .then((newLines) => {
        res(newLines)
      })
      .catch((e) => rej(e))
  })

module.exports = withDurations
