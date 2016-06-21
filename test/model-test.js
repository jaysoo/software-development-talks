'use strict'

const test = require('tape')
const model = require('../lib/model')

test('toDuration', (assert) => {
  assert.deepEqual(
    model.toDuration('PT45M56S'),
    model.Duration.Just(0, 45, 56)
  )

  assert.end()
})
