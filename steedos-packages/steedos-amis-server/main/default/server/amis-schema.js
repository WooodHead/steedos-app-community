const _ = require('underscore');
const objectql = require('@steedos/objectql');
const graphql = require('./graphql');

/**
 * 
 * @param {*} mainObjectName 
 * @param {*} recordId : 可以为record：doc
 * @param {*} readonly 
 * @param {*} userSession 
 */
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
    const fieldControls = [];
    const permissionFields = getPermissionFields(object, userSession)
    _.each(permissionFields, function(field){
        if(!field.hidden){
            fieldControls.push(convertSFieldToAmisField(field, readonly))
        }
    })

    return {
        type: 'page',
        body: [
            {
                type: "form",
                mode: "horizontal",
                initApi: getInitApi(object, recordId, permissionFields),
                initFetch: true,
                controls: fieldControls,
                className: "grid grid-cols-2 gap-4"
            }
        ]
    }
}

function getAmisFieldType(type, readonly){
    if(!readonly){
        return type;
    }
    if(_.include(['date', 'time', 'text', 'switch'], type)){
        return `static-${type}`;
    }else{
        return 'static';
    }
}

function convertSFieldToAmisField(field, readonly) {
    const baseData = {name: field.name, label: field.label, labelRemark: field.inlineHelpText};
    let convertData = {};
    if(field.is_wide){
        convertData.className = 'col-span-2';
    }
    switch (field.type) {
        case 'text':
            convertData.type = getAmisFieldType('text', readonly);
            break;
        case 'textarea':
            convertData.type = getAmisFieldType('textarea', readonly);
            break;
        case 'html':
            convertData = {
                type: getAmisFieldType('html', readonly)
            }
            break;
        case 'select':
            convertData = {
                type: getAmisFieldType('select', readonly),
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
                type: getAmisFieldType('switch', readonly),
                option: field.inlineHelpText
            }
            break;
        case 'date':
            convertData = {
                type: getAmisFieldType('date', readonly),
                format: "YYYY-MM-DD",
                valueFormat:'YYYY-MM-DDT00:00:00.000[Z]'
            }
            break;
        case 'datetime':
            convertData = {
                type: getAmisFieldType('datetime', readonly),
                format: 'YYYY-MM-DD HH:mm',
                valueFormat:'YYYY-MM-DDTHH:mm:ss.SSS[Z]'
            }
            break;
        case 'number':
            convertData = {
                type: getAmisFieldType('number', readonly),
                min: field.min,
                max: field.max,
                precision: field.precision
            }
            break;
        case 'currency':
            //TODO
            convertData = {
                type: getAmisFieldType('number', readonly),
                min: field.min,
                max: field.max,
                precision: field.precision
            }
            break;
        case 'percent':
            //TODO
            convertData = {
                type: getAmisFieldType('number', readonly),
                min: field.min,
                max: field.max,
                precision: field.precision
            }
            break;
        case 'password':
            convertData = {
                type: getAmisFieldType('password', readonly)
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
                type: getAmisFieldType('url', readonly)
            }
            break;
        case 'email':
            convertData = {
                type: getAmisFieldType('email', readonly)
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