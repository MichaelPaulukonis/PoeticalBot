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
  `This is not enough text, well, probably not anyway.`,
  'Whose line is it anyway?',
  'How many lines?',
  'How many lines is enough lines?',
  'Do you really want more?',
  'Not text?',
  'If not text, what lines?',
  'If not lines, what do you want?',
  'Do you want some more text?',
  'Do you have enough text?',
  'John has some green text.',
  'Mary has purple lines.',
  'Mary has more text than John'
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
