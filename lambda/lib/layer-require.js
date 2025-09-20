/**
 * Helper to require modules from Lambda layers or local node_modules
 * @param {string} moduleName - The module name to require
 * @returns {any} The required module
 */
function layerRequire(moduleName) {
  // AWS Lambda sets this environment variable
  if (process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return require(`/opt/nodejs/node_modules/${moduleName}`)
  }
  return require(moduleName)
}

module.exports = layerRequire