const Tpl = require('../tpl');
const Fields = require('./index');
const _ = require('underscore');
const graphql = require('../graphql');
function getOperation(fields){
    const controls = [];
    _.each(fields, function(field){
        controls.push(Fields.convertSFieldToAmisField(field, true));
    })
    return {
        "type": "operation",
        "label": "操作",
        "width": 100,
        fixed: "right",
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
            toggled: field.toggled
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

exports.getTableApi = function(mainObject, fields){
    const searchableFields = [];
    _.each(fields,function(field){
        if(field.searchable){
            searchableFields.push(field.name);
        }
    })
    let valueField = mainObject.key_field || '_id';
    const api = getApi(mainObject, null, fields, {alias: 'rows', queryOptions: `filters: {__filters}, top: {__top}, skip: {__skip}, sort: "{__sort}"`});
    api.data.$term = "$term";
    api.data.$self = "$$";
    api.requestAdaptor = `
        const selfData = JSON.parse(JSON.stringify(api.data.$self));
        var filters = [];
        var pageSize = api.data.pageSize || 10;
        var pageNo = api.data.pageNo || 1;
        var skip = (pageNo - 1) * pageSize;
        var orderBy = api.data.orderBy || '';
        var orderDir = api.data.orderDir || '';
        var sort = orderBy + ' ' + orderDir;
        var allowSearchFields = ${JSON.stringify(searchableFields)};
        if(api.data.$term){
            filters = [["name", "contains", "'+ api.data.$term +'"]];
        }else if(selfData.op === 'loadOptions' && selfData.value){
            filters = [["${valueField}", "=", selfData.value]];
        }
        if(allowSearchFields){
            allowSearchFields.forEach(function(key){
                const keyValue = selfData[key];
                if(keyValue){
                    filters.push([key, "contains", keyValue]);
                }
            })
        }
        api.data.query = api.data.query.replaceAll('{__filters}', JSON.stringify(filters)).replace('{__top}', pageSize).replace('{__skip}', skip).replace('{__sort}', sort.trim());
        return api;
    `
    return api;
}

function getApi(object, recordId, fields, options){
    return {
        method: "post",
        url: graphql.getApi(),
        data: graphql.getFindQuery(object, recordId, fields, options)
    }
}