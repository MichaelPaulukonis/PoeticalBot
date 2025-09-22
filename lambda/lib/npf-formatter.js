/**
 * NPF (Neue Post Format) Formatter for PoeticalBot
 * Converts poem objects to Tumblr's NPF content blocks
 */

/**
 * Convert a poem object to NPF format
 * @param {Object} poem - Poem object with title, text, and metadata
 * @returns {Object} NPF-compatible post object
 */
function convertPoemToNPF(poem) {
  const content = []

  // Add title as heading2 with bold formatting
  if (poem.title) {
    content.push({
      type: 'text',
      subtype: 'heading2',
      text: poem.title,
      formatting: [
        {
          start: 0,
          end: poem.title.length,
          type: 'bold'
        }
      ]
    })
  }

  // Add poem text as main content
  if (poem.text) {
    content.push({
      type: 'text',
      text: poem.text
    })
  }

  // Add metadata as italic text
  if (poem.seed || poem.source) {
    const metaContent = createMetadataText(poem)
    content.push({
      type: 'text',
      text: metaContent,
      formatting: [
        {
          start: 0,
          end: metaContent.length,
          type: 'italic'
        },
        {
          start: 0,
          end: metaContent.length,
          type: 'small'
        }
      ]
    })
  }

  return {
    content: content,
    tags: ['poetry', 'generated', 'poeticalbot']
  }
}

function flattenObj(obj, parent, res = {}) {
  for (let key in obj) {
    let propName = parent ? parent + '_' + key : key
    if (typeof obj[key] === 'object') {
      flattenObj(obj[key], propName, res)
    } else {
      res[propName] = obj[key]
    }
  }
  return res
}

/**
 * Create metadata text from poem properties
 * @param {Object} poem - Poem object
 * @returns {string} Formatted metadata text
 */
function createMetadataText(poem) {
  const parts = []

  if (poem.seed) {
    parts.push(`Generated with seed: ${poem.seed}`)
  }

  if (poem.source) {
    parts.push(`Source: ${poem.source}`)
  }

  if (poem.template) {
    parts.push(`Template: ${poem.template}`)
  }

  if (poem.options) {
    const flatOptions = flattenObj(poem.options)
    for (const [key, value] of Object.entries(flatOptions)) {
      parts.push(`${key}: ${value}`)
    }
  }

  if (poem.method) {
    parts.push(`Method: ${poem.method}`)
  }

  return parts.join('\n')
}

/**
 * Alternative: Convert poem to NPF with separate metadata handling
 * This version puts metadata in AWS logs instead of the post
 * @param {Object} poem - Poem object
 * @param {Function} logger - Logger function for metadata
 * @returns {Object} NPF-compatible post object
 */
function convertPoemToNPFWithLogging(poem, logger) {
  const content = []

  // Add title as heading2 with bold formatting
  if (poem.title) {
    content.push({
      type: 'text',
      subtype: 'heading2',
      text: poem.title,
      formatting: [
        {
          start: 0,
          end: poem.title.length,
          type: 'bold'
        }
      ]
    })
  }

  // Add poem text as main content
  if (poem.text) {
    content.push({
      type: 'text',
      text: poem.text
    })
  }

  // Log metadata instead of including in post
  if (logger && (poem.seed || poem.source)) {
    const metadata = {
      seed: poem.seed,
      source: poem.source,
      template: poem.template,
      method: poem.method
    }
    logger('Poem metadata: ' + JSON.stringify(metadata))
  }

  return {
    content: content,
    tags: ['poetry', 'generated', 'poeticalbot']
  }
}

/**
 * Validate NPF content structure
 * @param {Object} npfPost - NPF post object
 * @returns {boolean} True if valid
 */
function validateNPF(npfPost) {
  if (!npfPost.content || !Array.isArray(npfPost.content)) {
    return false
  }

  // Check each content block
  for (const block of npfPost.content) {
    if (!block.type) {
      return false
    }

    if (block.type === 'text' && !block.text) {
      return false
    }

    // Validate formatting if present
    if (block.formatting) {
      for (const format of block.formatting) {
        if (typeof format.start !== 'number' || typeof format.end !== 'number') {
          return false
        }
      }
    }
  }

  return true
}

module.exports = {
  convertPoemToNPF,
  convertPoemToNPFWithLogging,
  createMetadataText,
  validateNPF
}