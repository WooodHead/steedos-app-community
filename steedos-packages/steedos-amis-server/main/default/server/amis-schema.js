const _ = require('underscore');
const objectql = require('@steedos/objectql');
const graphql = require('./graphql');

function getSchema(mainObjectName, recordId, readonly, userSession) {
    const object = objectql.getObject(mainObjectName).toConfig();
    return convertSObjectToAmisSchema(object, recordId, readonly);
}

/**
 * TODO 处理权限
 * @param {*} object steedos object
 * @param {*} userSession 
 */
function getPermissionFields(object, userSession){
    const permissionFields = [];
    _.each(object.fields, function(field){
        if(!field.hidden){
            permissionFields.push( Object.assign({}, field, {permission: {allowEdit: true}}))
        }
    })
    return permissionFields;
}

function convertSObjectToAmisSchema(object, recordId, readonly, userSession) {
    const controls = [];
    const permissionFields = getPermissionFields(object, userSession)
    _.each(permissionFields, function(field){
        if(!field.hidden){
            controls.push(convertSFieldToAmisFieldType(field, readonly))
        }
    })
    return {
        type: 'page',
        body: [
            {
                type: "form",
                initApi: getInitApi(object, recordId, permissionFields),
                initFetch: true,
                controls: controls
            }
        ]
    }
}

function convertSFieldToAmisFieldType(field, readonly) {
    const baseData = {name: field.name, label: field.label};
    let convertData = {};
    switch (field.type) {
        case 'text':
            convertData.type = 'text';
            break;
        case 'textarea':
            convertData.type = 'textarea'
            break;
        case 'html':
            convertData = {
                type: 'html'
            }
            break;
        case 'select':
            convertData = {
                type: 'select',
                joinValues: false,
                options: field.options
            }
            if(_.has(field, 'defaultValue')){
                convertData.value = field.defaultValue
            }
            if(field.multiple){
                convertData.multiple = true
                convertData.extractValue = true
            }
            break;
        case 'boolean':
            convertData = {
                type: 'switch',
                option: field.inlineHelpText
            }
            break;
        case 'date':
            convertData = {
                type: 'date',
                format: "YYYY-MM-DD",
                valueFormat:'YYYY-MM-DDT00:00:00.000[Z]'
            }
            break;
        case 'datetime':
            convertData = {
                type: 'datetime',
                format: 'YYYY-MM-DD HH:mm',
                valueFormat:'YYYY-MM-DDTHH:mm:ss.SSS[Z]'
            }
            break;
        case 'number':
            convertData = {
                type: 'number',
                min: field.min,
                max: field.max,
                precision: field.precision
            }
            break;
        case 'currency':
            //TODO
            convertData = {
                type: 'number',
                min: field.min,
                max: field.max,
                precision: field.precision
            }
            break;
        case 'percent':
            //TODO
            convertData = {
                type: 'number',
                min: field.min,
                max: field.max,
                precision: field.precision
            }
            break;
        case 'password':
            convertData = {
                type: 'password'
            }
            break;
        case 'lookup':
            //TODO
            break;
        case 'master_detail':
            //TODO
            break;
        case 'autonumber':
            //TODO
            break;
        case 'url':
            convertData = {
                type: 'url'
            }
            break;
        case 'email':
            convertData = {
                type: 'email'
            }
            break;
        case 'image':
            //TODO
            break;
        case 'formula':
            //TODO
            break;
        case 'summary':
            //TODO
            break;
        default:
            console.log('convertData default', field.type);
            // convertData.type = field.type
            break;
    }
    if(!_.isEmpty(convertData)){
        if(readonly){
            convertData.type = `static-${convertData.type}`;
        }
        return Object.assign({}, baseData, convertData);
    }
    
}

function getApi(object, recordId, fields){
    return {
        method: "post",
        url: "http://127.0.0.1:8088/graphql",
        data: graphql.getFindOneQuery(object, recordId, fields)
    }
}

function getInitApi(object, recordId, fields){
    return {
        method: "post",
        url: "http://127.0.0.1:8088/graphql",
        adaptor: "payload.data = payload.data.data[0];return payload",
        data: graphql.getFindOneQuery(object, recordId, fields)
    }
}

exports.getSchema = getSchema