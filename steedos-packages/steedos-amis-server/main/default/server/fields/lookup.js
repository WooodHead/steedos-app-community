const _ = require('underscore');
const objectql = require('@steedos/objectql');
const graphql = require('../graphql');
const clone = require('clone');
const Tpl = require('../tpl');
const Field = require('./index');
const Table = require('./table');
function lookupToAmisPicker(field, readonly){
    if(!field.reference_to){
        return ;
    }
    const refObject = objectql.getObject(field.reference_to);
    const refObjectConfig = clone(refObject.toConfig());
    const tableFields = [{name: '_id', label: 'ID', type: 'text'}];
    let i = 0;
    const searchableFields = [];
    _.each(refObjectConfig.fields,function(field){
        if(i < 5){
            i++;
            tableFields.push(field)
            if(field.searchable){
                searchableFields.push(field.name);
            }
        }
    })

    const source = getApi(refObjectConfig, null, refObjectConfig.fields, {alias: 'rows', queryOptions: `filters: {__filters}, top: {__top}, skip: {__skip}, sort: "{__sort}"`});
    source.data.$term = "$term";
    source.data.$self = "$$";
    source.requestAdaptor = `
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
        }else if(api.data.$value){
            filters = [["_id", "=", "'+ api.data.$value +'"]];
        }
        const selfData = JSON.parse(JSON.stringify(api.data.$self));
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

    const data = {
        type: Field.getAmisStaticFieldType('picker', readonly),
        labelField: refObject.NAME_FIELD_KEY || 'name', //TODO
        valueField: field.reference_to_field || '_id', //TODO
        modalMode: 'dialog', //TODO 设置 dialog 或者 drawer，用来配置弹出方式
        source: source,
        size: "lg",
        data: {
            name: ''
        },
        pickerSchema: Table.getTableSchema(tableFields)
    }
    if(field.multiple){
        data.multiple = true
        data.extractValue = true
    }

    if(readonly){
        data.tpl = Tpl.getLookupTpl(field)
    }

    return data;
}

function lookupToAmisSelect(field, readonly){
    if(!field.reference_to && false){
        return ;
    }

    let refObject, apiInfo;

    if(field.reference_to){
        refObject = objectql.getObject(field.reference_to);
        const refObjectConfig = clone(refObject.toConfig());
    
        apiInfo = getApi(refObjectConfig, null, refObjectConfig.fields, {alias: 'options', queryOptions: `filters: {__filters}, top: {__top}`})
    }else{
        refObject = {};
        apiInfo = {
            method: "post",
            url: graphql.getApi(),
            data: {query: '{objects(filters: ["_id", "=", "-1"]){_id}}', $: "$$"}
        }
    }

    
    apiInfo.data.$term = "$term";
    apiInfo.data.$value = `$${field.name}._id`;
    _.each(field.depend_on, function(fName){
        apiInfo.data[fName] = `$${fName}`;
    })
    apiInfo.data['$'] = `$$`;
    apiInfo.data['rfield'] = `\${object_name}`;
    // [["_id", "=", "$${field.name}._id"],"or",["name", "contains", "$term"]]
    apiInfo.requestAdaptor = `
        var filters = '[]';
        var top = 10;
        if(api.data.$term){
            filters = '["name", "contains", "'+ api.data.$term +'"]';
        }else if(api.data.$value){
            filters = '["_id", "=", "'+ api.data.$value +'"]';
        }
        api.data.query = api.data.query.replaceAll('{__filters}', filters).replace('{__top}', top);
        return api;
    `
    let labelField = refObject.NAME_FIELD_KEY || 'name';
    let valueField = field.reference_to_field || '_id';
    if(field.optionsFunction){
        apiInfo.adaptor = `
        payload.data.options = eval(${field.optionsFunction.toString()})(api.data);
        return payload;
        `
        labelField = 'label';
        valueField = 'value';
    }

    const data = {
        type: Field.getAmisStaticFieldType('select', readonly),
        joinValues: false,
        extractValue: true,
        labelField: labelField,
        valueField: valueField,
        autoComplete: apiInfo,
    }
    if(_.has(field, 'defaultValue')){
        data.value = field.defaultValue
    }
    if(field.multiple){
        data.multiple = true
        data.extractValue = true
    }

    if(readonly){
        data.tpl = Tpl.getLookupTpl(field)
    }

    return data;
}

function getApi(object, recordId, fields, options){
    return {
        method: "post",
        url: graphql.getApi(),
        data: graphql.getFindQuery(object, recordId, fields, options)
    }
}

exports.lookupToAmisPicker = lookupToAmisPicker;
exports.lookupToAmisSelect = lookupToAmisSelect;