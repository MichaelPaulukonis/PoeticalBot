'use strict'

let Drone = function (config) {
  if (!(this instanceof Drone)) {
    return new Drone(config)
  }

  // TODO: redo this
  let util = config.util

  let sentences = config.sentences

  // alternative - first and last lines repeat
  // alternative - EVERY OTHER LINE REPEATS
  let drone = function () {
    let stanzaLines = util.randomInRange(2, 6)

    let stanzaCount = util.randomInRange(2, 9)

    let lines = []

    let repeat = util.pick(sentences)

    for (let i = 0; i < stanzaCount; i++) {
      lines = lines.concat(util.pickCount(sentences, stanzaLines - 1))
      lines.push(repeat)
      if (i < stanzaCount - 1) { lines.push(``) }
    }
    return lines
  }

  let bookends = function () {
    let lineCount = util.randomInRange(5, 25)

    let repeat = util.pick(sentences)

    let lines = []

    lines.push(repeat)
    lines = lines.concat(util.pickCount(sentences, lineCount - 2))
    lines.push(repeat)

    return lines
  }

  let alternate = function () {
    let lineCount = util.randomInRange(3, 25)

    let repeat = util.pick(sentences)

    let lines = []

    for (let i = 0; i < lineCount; i += 2) {
      lines.push(util.pick(sentences))
      lines.push(repeat)
    }

    return lines
  }

  this.generate = function () {
    let methods = [drone, bookends, alternate]

    let method = util.pick(methods)

    let lines = method()

    let poem = { lines: lines,
      text: lines.join(`\n`)
    }

    return poem
  }
}

module.exports = Drone
