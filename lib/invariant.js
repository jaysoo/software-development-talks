'use strict'

module.exports = (predicate, message) => {
  if (!predicate) {
    throw new Error(message)
  }
}
