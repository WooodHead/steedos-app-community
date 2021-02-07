const _ = require('underscore');
const graphql = require('./graphql');
const APICACHE = 100;
const OMIT_FIELDS = ['created', 'created_by', 'modified', 'modified_by'];

function getReadonlyFormAdaptor(fields){
    let scriptStr = '';
    const selectFields = _.filter(fields, function(field){return field.name.indexOf('.') < 0 && (field.type == 'select' && field.options)});
    _.each(selectFields, function(field){
        if(!_.include(OMIT_FIELDS, field.name)){
            const valueField = field.name;
            const options = JSON.stringify({options: field.options});
            console.log('options', options);
            scriptStr = scriptStr + `var ${field.name}Options= (${options}).options;console.log('${field.name}Options', ${field.name}Options);`;
            if(field.multiple){
                scriptStr = scriptStr + `data.${field.name}__label = _.pluck(_.filter(${field.name}Options, function(option){return _.include(data.${field.name}, option.value)}), 'label');`
            }else{
                scriptStr = scriptStr + `var ${field.name}Selected = _.find(${field.name}Options, function(option){return data.${field.name} == option.value});`
                scriptStr = scriptStr + `data.${field.name}__label = ${field.name}Selected ? ${field.name}Selected.label:null;`
            }
        }
    })

    return  `
    var data = payload.data.data[0];
    ${scriptStr}
    console.log('data', data);
    payload.data = data;
    return payload;
`
}

function getReadonlyFormInitApi(object, recordId, fields){
    return {
        method: "post",
        url: "http://127.0.0.1:8088/graphql?rf="+ (new Date()).getTime(),
        cache: APICACHE,
        adaptor: getReadonlyFormAdaptor(fields),
        data: graphql.getFindOneQuery(object, recordId, fields)
    }
}

/**
 * Global parameter: data、payload
 * @param {*} fields 
 */
function getConvertDataScriptStr(fields){
    const refFields = _.filter(fields, function(field){return field.name.indexOf('.') < 0 && (field.type == 'lookup' || field.type == 'master_detail')});
    let scriptStr = '';
    _.each(refFields, function(field){
        if(!_.include(OMIT_FIELDS, field.name)){
            const valueField = field.reference_to_field || '_id';
            if(field.multiple){
                scriptStr = scriptStr + `data.${field.name} = _.pluck(data.${field.name}, '${valueField}');`
            }else{
                scriptStr = scriptStr + `data.${field.name} = data.${field.name} ? data.${field.name}.${valueField}:null;`
            }
        }
    })
    return scriptStr;
}

function getEditFormInitApi(object, recordId, fields){

    

    return {
        method: "post",
        url: "http://127.0.0.1:8088/graphql?rf="+ (new Date()).getTime(),
        cache: APICACHE,
        adaptor: `
            var data = payload.data.data[0];
            ${getConvertDataScriptStr(fields)}
            payload.data = data;
            return payload;
        `,
        data: graphql.getFindOneQuery(object, recordId, fields)
    }
}

exports.getReadonlyFormInitApi = getReadonlyFormInitApi
exports.getEditFormInitApi = getEditFormInitApi