
Package.describe({
  name    : 'semantic:ui-label',
  summary : 'Semantic UI - Label: Single component release',
  version : '2.1.6',
  git     : 'git://github.com/Semantic-Org/UI-Label.git',
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.addFiles([
    'label.css'
  ], 'client');
});
