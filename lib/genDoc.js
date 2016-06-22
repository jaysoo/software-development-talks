'use strict'

const Line = require('./model').Line
const Duration = require('./model').Duration

// genDoc :: Line[] -> String
const genDoc = (lines) => lines.map(toString).join('\n')

module.exports = genDoc

/* Private helpers */

// pad :: Number? -> String
const pad = (x) => {
  if (!x) {
    return '00'
  } else if (x < 10) {
    return `0${x}`
  } else {
    return `${x}`
  }
}

// formatDuration :: Duration -> String
const formatDuration = Duration.case({
  Just: (h, m, s) => `[ ${pad(h)}:${pad(m)}:${pad(s)} ] `,
  Nothing: () => ''
})

// toString :: Line -> String
const toString = Line.case({
  Text: (v) => v,
  Header: (level, v) => `${Array(level).fill('#').join('')} ${v}`,
  Empty: () => '',
  Video: (title, url, speaker, duration) =>
    `[${title}](${url}) ${formatDuration(duration)}- ${speaker}`
})
