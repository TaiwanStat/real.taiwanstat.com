var fs = require("fs");

module.exports= function (hbs) {
  // register partials
  hbs.registerPartial('head', getTemplate('head'));
  hbs.registerPartial('header', getTemplate('header'));
  hbs.registerPartial('start', getTemplate('start'));
  hbs.registerPartial('end', getTemplate('end'));
  hbs.registerPartial('footer', getTemplate('footer'));
};

function getTemplate(filename) {
  var template = fs.readFileSync('./include/template/'+filename+'.html', 'utf8');
  template = template.replace(/[\t\n]/g, '');
  return template;
}
