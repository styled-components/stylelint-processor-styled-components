const getTaggedTemplateLiteralContent = require('./tagged-template-literal').getTaggedTemplateLiteralContent

const getCSS = (node) => `.selector {${getTaggedTemplateLiteralContent(node)}}`

const getKeyframes = (node) => `@keyframes {${getTaggedTemplateLiteralContent(node)}}`

exports.getKeyframes = getKeyframes
exports.getCSS = getCSS
