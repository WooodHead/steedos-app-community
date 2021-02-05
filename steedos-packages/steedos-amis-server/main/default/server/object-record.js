const _ = require('underscore');
const graphql = require('./graphql');

function getReadonlyFormInitApi(object, recordId, fields){
    return {
        method: "post",
        url: "http://127.0.0.1:8088/graphql",
        adaptor: "payload.data = payload.data.data[0];return payload",
        data: graphql.getFindOneQuery(object, recordId, fields)
    }
}

/**
 * Global parameter: data、payload
 * @param {*} refFields 
 */
function getConvertDataScriptStr(refFields){
    let scriptStr = '';
    _.each(refFields, function(field){
        const valueField = field.reference_to_field || '_id';
        if(field.multiple){
            scriptStr = scriptStr + `data.${field.name} = _.pluck(data.${field.name}, '${valueField}');`
        }else{
            scriptStr = scriptStr + `data.${field.name} = data.${field.name} ? data.${field.name}.${valueField}:null;`
        }
    })
    console.log('scriptStr', scriptStr);
    return scriptStr;
}

function getEditFormInitApi(object, recordId, fields){

    const refFields = _.filter(fields, function(field){return field.name.indexOf('.') < 0 && field.type == 'lookup'});

    return {
        method: "post",
        url: "http://127.0.0.1:8088/graphql?"+recordId,
        adaptor: `
            var data = payload.data.data[0];
            ${getConvertDataScriptStr(refFields)}
            payload.data = data;
            console.log('getEditFormInitApi payload.data', payload.data);
            return payload;
        `,
        data: graphql.getFindOneQuery(object, recordId, fields)
    }
}

exports.getReadonlyFormInitApi = getReadonlyFormInitApi
exports.getEditFormInitApi = getEditFormInitApi