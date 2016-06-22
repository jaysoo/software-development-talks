'use strict'

const Task = require('data.task')
const Line = require('./model').Line
const getYouTubeID = require('./model').getYouTubeID
const toDuration = require('./model').toDuration
const R = require('ramda')
const fetch = require('node-fetch')

// withDurations :: Line[] -> Task Error Line[]
const withDurations = (lines) =>
  new Task((rej, res) => {
    Promise.all(lines.map(withDuration))
      .then(res)
      .catch(rej)
  })

module.exports = withDurations

/* Private helpers */

// withDuration :: Line -> Promise Line
const withDuration = (line) =>
  getYouTubeID(line).cata({
    Just: (id) => getYouTubeDetails(id).then(addDurationFromJSON(line)),
    Nothing: () => Promise.resolve(line)
  })

// getYouTubeDetails :: URL -> Promise JSON
const getYouTubeDetails = (id) =>
  fetch(`https://www.googleapis.com/youtube/v3/videos?id=${id}&part=contentDetails&key=AIzaSyBn6VAt-hqQEowrEouhsL_k7RqJ2zSsoNI`)
    .then((resp) => resp.json())

// addDurationFromJSON :: Line -> JSON -> Line
const addDurationFromJSON = (line) =>R.compose(addDuration(line), getDurationData)

// getDurationData :: JSON -> Duration 
const getDurationData = (json) => toDuration(json.items[0].contentDetails.duration)

// addDuration :: Line -> Duration -> Line
const addDuration = R.curry((line, duration) => {
  return Line.case({
    Video: (title, url, speaker, _) => Line.Video(title, url, speaker, duration),
    _: () => line
  }, line)
})
