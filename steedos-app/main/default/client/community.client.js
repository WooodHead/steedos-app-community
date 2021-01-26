Steedos.Community = {};
Steedos.Community.NavigationMenu = {}
Steedos.Community.NavigationMenu.changeSchema = function (doc, schema, when) {
  var objectSchema = Creator.getObjectSchema(Creator.getObject("community_navigation_menu"));
  var hiddenField = function(fieldName){
    schema._schema[fieldName].autoform.omit = true;
    schema._schema[fieldName].autoform.type = 'hidden';
    schema._schema[fieldName].optional = true;
  }

  var showField = function(fieldName){
    schema._schema[fieldName] = objectSchema[fieldName];
    schema._schema[fieldName].optional = false;
  }
  switch (doc.type) {
    case 'InternalLink':
      showField('page');
      hiddenField('event');
      hiddenField('object_name');
      hiddenField('object_listview');
      hiddenField('url');
      break;
    case 'Event':
      showField('event');
      hiddenField('page');
      hiddenField('object_name');
      hiddenField('object_listview');
      hiddenField('url');
      break;
    case 'ExternalLink':
      showField('url');
      hiddenField('event');
      hiddenField('page');
      hiddenField('object_name');
      hiddenField('object_listview');
      break;
    default:
      break;
  }
}