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
  'Mary has more text than John',
  'the next a loud splash announced that my brave queequeg had dived to the rescue', // #Person
  'some hands now jumped into a boat alongside and pushed a little off from the ship', // #Person
  'the classification of the constituents of a chaos nothing less is here essayed', // #Noun is #Noun
  'stubb thou didst not know ahab then', // #Verb not
  "morning to ye shipmates morning the ineffable heavens bless ye i'm sorry i stopped ye look here friend said i if you have anything important to tell us out with it but if you are only trying to bamboozle us you are mistaken in your game that's all i have to say and it's said very well and i like to hear a chap talk up that way you are just the man for him--the likes of ye", // #Noun .? are #Noun+
  'most statistical tables are parchingly dry in the reading not so in the present case however where the reader is flooded with whole pipes barrels quarts and gills of good gin and good cheer', // #Adjective+? #Noun .? (are|is) .? (#Adjective|#Noun)+
  'among whale wise people it has often been argued whether considering the paramount importance of his life to the success of the voyage it is right for a whaling captain to jeopardize that life in the active perils of the chase', // #Adjective? #Noun+ of #Adjective? #Noun`
  'but no matter who provided it the thanks of the feasters were solemnly and reverently given to the master to whose power the production of all food was due', // #Adverb and #Adverb
  'ahab stood before him and was lightly unwinding some thirty or forty turns to form a preliminary hand coil to toss overboard when the old manxman who was intently eyeing both him and the line made bold to speak', // '#Adverb+ #Verb+'
  'the two compasses pointed east and the pequod was as infallibly going west', // #Conjunction #Determiner #Noun
  'on life and death this old man walked', // #Determiner #Adjective
  'meantime ahab out of hearing of his officers having sided the furthest to windward was still ranging ahead of the other boats a circumstance bespeaking how potent a crew was pulling him', // #Expression`
  'it will not do for him to be peering into it and putting his face in it', // #Gerund
  'they had dumplings too small but substantial symmetrically globular and indestructible dumplings', // #Infinitive`
  'so so thou reddenest and palest my heat has melted thee to anger glow', // #Noun #Conjunction #Noun
  'great washington too stands high aloft on his towering main mast in baltimore and like one of hercules pillars his column marks that point of human grandeur beyond which few mortals will go' // #Noun #Modal
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
