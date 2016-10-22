const getTaggedTemplateLiteralContent = require('./tagged-template-literal').getTaggedTemplateLiteralContent

const getCSS = (node) => `.selector {${getTaggedTemplateLiteralContent(node)}}\n`

const getKeyframes = (node) => `@keyframes {${getTaggedTemplateLiteralContent(node)}}\n`

exports.getKeyframes = getKeyframes
exports.getCSS = getCSS
