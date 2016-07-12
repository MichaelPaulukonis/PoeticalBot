# NaPoGenMo2016
See output @ http://poeticalbot.tumblr.com/

[National Poetry Generation Month 2016](https://github.com/NaPoGenMo/NaPoGenMo2016)

[my notes](https://github.com/NaPoGenMo/NaPoGenMo2016/issues/3)

## poem generators
 - queaneau-buckets
 - jgnoetry (headless)
  - custom templates
  - TODO: on-the-fly generated templates
  - TODO: templates can have pre-populated text and spacing ?
  - TODO: rewire for multi-pass with saved-text (and post sequences)
- [Harvard Sentences](http://www.cs.cmu.edu/afs/cs.cmu.edu/project/fgdata/OldFiles/Recorder.app/utterances/Type1/harvsents.txt) drone
 - TODO: the drone structure seems like it would work for other generators, if they output sentences/lines.

## transformers
 - random leading spaces
 - sort (ascending/descending)
 - mispelr
 - phonetic
 - rhyme appender
   - more proof-of-concept than anything.
   - existing implementation is sub-optimal

## titles
 - first/last/random line
 - random-selection from most common words in poem
 - summary sentence (summary algorithm picks sentence)
  -  fails poorly when there aren't enough sentences

## corpus
 - lots of texts
 - sorted into folders
 - select with regex
 - a number of pre-selected combinations, plus random collections
 - randomize percentages for the jGnoetry model

## Plans
 - Hybridizer
 - heijinian leading spaces
 - mesostics
 - news-text importer (one of the original ideas)
 - (optionally) replace the syllable-detection algorithm in jgnoetry
  - at a minimum, extract it for unit-testing


Boringly, I continue to work with unit-tests and code-coverage, and other dull things instead of the "cool" poetry generation _all the time_. So sue me.

It usually pays off in the long run, when I return to a project after a while not remembering how it works -- boom, the tests document usage! Also they run through so many scenarios I know when I do or do not break stuff (depending upon coverage).


### some things to look at
 - https://github.com/rossgoodwin/poetry-solver
 - https://github.com/rossgoodwin/poetizer
 - https://github.com/rossgoodwin/sonnetizer
 - https://github.com/rossgoodwin/lyricist
 - https://github.com/rossgoodwin/wikipoet (30 minutes to gen a poem!!!)
 - https://www.npmjs.com/package/syllable
 - https://github.com/nlp-compromise - what else can it do that would be... interesting?
 - better text cleanup - see [ebook_ebooks](https://github.com/scotthammack/ebook_ebooks/blob/master/ebook_ebooks.py) - _a few features to improve readability, such as chapter numbering, paragraph breaks, and parenthesis/quotation mark balancing_
 - https://github.com/matthewsklar/PoetryBot
 - aparrish's [linear-systems poetry](https://github.com/aparrish/linear-lsystem-poetry) Hard to get good results, butwith practice, weird things can emerge.
 - topic analysis? I played around with a lib, but the results were not promising. these "poems" are too weird to be coherent for topics, usually. And not sure what to do with the output.
 - I tried using nlp-compromise's simple-english module, but it didn't do much, very often
 - more meta-data on the poems/words/etc. So transforms can be done with more granularity?
  - at the very least, try to keep re-processing the texts and poems into sentences and words multiple times.



## Original ideas that did and did not work

So, I've been looking at the [Lexeduct code](https://github.com/MichaelPaulukonis/Lexeduct/) that Chris Pressey started last year. I didn't look into it enough at the time, and my work with it was at cross-currents to its ideology (my work last year was in the `gh-pages` branch, and "worked", even though it doesn't fit the main model in the master branch).

I think wrangling that understanding and applying it to want I currently want to do will be too time-consuming (although profitable).

So, I'm going to do the Simplest Thing That Could Possibly Work.

1. static text generator posts to Tumblr
1. text generator becomes non-static
1. elaborate and iterate on step 2
1. end-goal includes ingestion of source material from online news


SO 1-3 HAPPENED THAT'S GOOD
And 3 continues to happen....
