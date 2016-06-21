'use strict'

const test = require('tape')
const parseDoc = require('../lib/parseDoc')
const Line = require('../lib/model').Line
const Duration = require('../lib/model').Duration

const SAMPLE = `# Talks

Hello! These are talks...

## Process and Organization

[What We Actually Know About Software Development, and Why We Believe It's True](http://vimeo.com/9270320) - Greg Wilson

[The Top 10 Ways To Scam The Modern American Programmer](https://www.youtube.com/watch?v=neI_Pj558CY) [ 00:45:22 ] - Zed Shaw

## Refactoring

[Workflows of Refactoring](https://www.youtube.com/watch?v=vqEg37e4Mkw) - Martin Fowler`
  

test('parseDoc', (assert) => {
  const actual = parseDoc(SAMPLE)
  const expected = [
    Line.Header(1, 'Talks'),
    Line.Empty(),
    Line.Text('Hello! These are talks...'),
    Line.Empty(),
    Line.Header(2, 'Process and Organization'),
    Line.Empty(),
    Line.VideoOf({ title: "What We Actually Know About Software Development, and Why We Believe It's True", speaker: 'Greg Wilson', url: 'http://vimeo.com/9270320', duration: Duration.Nothing() }),
    Line.Empty(),
    Line.VideoOf({ title: 'The Top 10 Ways To Scam The Modern American Programmer', speaker: 'Zed Shaw', url: 'https://www.youtube.com/watch?v=neI_Pj558CY', duration: Duration.Just(0, 45, 22) }),
    Line.Empty(),
    Line.Header(2, 'Refactoring'),
    Line.Empty(),
    Line.VideoOf({ title: 'Workflows of Refactoring', speaker: 'Martin Fowler', url: 'https://www.youtube.com/watch?v=vqEg37e4Mkw', duration: Duration.Nothing() })
  ]

  assert.deepEqual(actual, expected, 'parses document')

  assert.end()
})
