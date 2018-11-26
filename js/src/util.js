/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.1.3): util.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

/**
 * ------------------------------------------------------------------------
 * Private TransitionEnd Helpers
 * ------------------------------------------------------------------------
 */

const MAX_UID = 1000000
const MILLISECONDS_MULTIPLIER = 1000
const TRANSITION_END = 'transitionend'

// Shoutout AngusCroll (https://goo.gl/pxwQGp)
function toType(obj) {
  return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase()
}

const getUID = (prefix) => {
  do {
    // eslint-disable-next-line no-bitwise
    prefix += ~~(Math.random() * MAX_UID) // "~~" acts like a faster Math.floor() here
  } while (document.getElementById(prefix))
  return prefix
}

const getSelectorFromElement = (element) => {
  let selector = element.getAttribute('data-target')

  if (!selector || selector === '#') {
    const hrefAttr = element.getAttribute('href')
    selector = hrefAttr && hrefAttr !== '#' ? hrefAttr.trim() : ''
  }

  return selector && document.querySelector(selector) ? selector : null
}

const getTransitionDurationFromElement = (element) => {
  if (!element) {
    return 0
  }

  // Get transition-duration of the element
  let transitionDuration = window.getComputedStyle(element).transitionDuration
  let transitionDelay = window.getComputedStyle(element).transitionDelay

  const floatTransitionDuration = parseFloat(transitionDuration)
  const floatTransitionDelay = parseFloat(transitionDelay)

  // Return 0 if element or transition duration is not found
  if (!floatTransitionDuration && !floatTransitionDelay) {
    return 0
  }

  // If multiple durations are defined, take the first
  transitionDuration = transitionDuration.split(',')[0]
  transitionDelay = transitionDelay.split(',')[0]

  return (parseFloat(transitionDuration) + parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER
}

const reflow = (element) => element.offsetHeight

const triggerTransitionEnd = (element) => {
  element.dispatchEvent(new Event(TRANSITION_END))
}

const isElement = (obj) => (obj[0] || obj).nodeType

const emulateTransitionEnd = (element, duration) => {
  let called = false
  const durationPadding = 5
  const emulatedDuration = duration + durationPadding
  function listener() {
    called = true
    element.removeEventListener(TRANSITION_END, listener)
  }

  element.addEventListener(TRANSITION_END, listener)
  setTimeout(() => {
    if (!called) {
      triggerTransitionEnd(element)
    }
  }, emulatedDuration)
}

const typeCheckConfig = (componentName, config, configTypes) => {
  for (const property in configTypes) {
    if (Object.prototype.hasOwnProperty.call(configTypes, property)) {
      const expectedTypes = configTypes[property]
      const value         = config[property]
      const valueType     = value && isElement(value)
        ? 'element' : toType(value)

      if (!new RegExp(expectedTypes).test(valueType)) {
        throw new Error(
          `${componentName.toUpperCase()}: ` +
          `Option "${property}" provided type "${valueType}" ` +
          `but expected type "${expectedTypes}".`)
      }
    }
  }
}

const makeArray = (nodeList) => {
  if (typeof nodeList === 'undefined' || nodeList === null) {
    return []
  }

  return [].slice.call(nodeList)
}

const isVisible = (element) => {
  if (typeof element === 'undefined' || element === null) {
    return false
  }

  if (element.style !== null && element.parentNode !== null && typeof element.parentNode.style !== 'undefined') {
    return element.style.display !== 'none' &&
      element.parentNode.style.display !== 'none' &&
      element.style.visibility !== 'hidden'
  }
  return false
}

// eslint-disable-next-line no-empty-function
const noop = () => () => {}

const jQuery = () => window.$ || window.jQuery

/**
 * --------------------------------------------------------------------------
 * Public Util Api
 * --------------------------------------------------------------------------
 */

export {
  TRANSITION_END,
  getUID,
  getSelectorFromElement,
  getTransitionDurationFromElement,
  reflow,
  triggerTransitionEnd,
  isElement,
  emulateTransitionEnd,
  typeCheckConfig,
  makeArray,
  isVisible,
  noop,
  jQuery
}
