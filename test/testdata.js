const sentences = [
  `This is some text.`,
  `This is some more.`,
  `Another line of text.`,
  `How many lines?`,
  `This is not enough.`,
  `Not enough text.`,
  `This is maybe enough.`,
  `Enough text?`,
  `This is probably not.`,
  `No, not nearly enough lines.`,
  `How many times do I have to write enough text?`,
  `Is this enough text?`,
  `This is not enough text, well, probably not anyway.`
]

const text = sentences.join(' ')

const corporaDummy = {
  name: 'Some text',
  text: () => text,
  sentences: () => sentences
}

module.exports = {
  sentences,
  text,
  corporaDummy
}
