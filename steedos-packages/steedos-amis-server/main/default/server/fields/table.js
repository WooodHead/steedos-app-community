const Tpl = require('../tpl');
const Fields = require('./index');
const _ = require('underscore');

function getOperation(fields){
    const controls = [];
    _.each(fields, function(field){
        controls.push(Fields.convertSFieldToAmisField(field, true));
    })
    return {
        "type": "operation",
        "label": "操作",
        "width": 100,
        "buttons": [
          {
            "type": "button",
            "icon": "fa fa-eye",
            "actionType": "dialog",
            "tooltip": "查看",
            "dialog": {
              "title": "查看",
              "body": {
                "type": "form",
                "controls": controls
              }
            }
        }]
    }
}

function getTableColumns(fields){
    const columns = [];
    _.each(fields, function(field){

        const tpl = Tpl.getFieldTpl(field);

        let type = 'text';
        if(tpl){
            type = 'tpl';
        }

        columns.push({
            name: field.name,
            label: field.label,
            sortable: field.sortable,
            searchable: field.searchable,
            type: type,
            tpl: tpl,
            // toggled: true 
        })
    });

    columns.push(getOperation(fields));

    return columns;
}

exports.getTableSchema = function(fields, options){
    return {
        mode: "table",
        name: "thelist",
        draggable: false,
        headerToolbar: ['switch-per-page', 'pagination'],
        columns: getTableColumns(fields)
    }
}