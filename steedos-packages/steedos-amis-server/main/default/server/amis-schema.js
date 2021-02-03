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

    let gapClassName = 'row-gap-1';
    if(!readonly){
        gapClassName = 'row-gap-4'
    }

    return {
        type: 'page',
        bodyClassName: 'p-0',
        body: [
            {
                type: "form",
                mode: "horizontal",
                debug: false,
                title: "",
                submitText:"",
                api: getSaveApi(object, recordId, permissionFields, {}),
                initApi: getInitApi(object, recordId, permissionFields),
                initFetch: true,
                controls: fieldControls,
                panelClassName:'m-0',
                className: `grid grid-cols-2 ${gapClassName} col-gap-6`
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

function lookupToAmisPicker(field, readonly){
    const refObject = objectql.getObject(field.reference_to).toConfig();
    const data = {
        type: getAmisFieldType('picker', readonly),
        labelField: 'name', //TODO
        valueField: '_id', //TODO
        modalMode: 'drawer', //TODO 设置 dialog 或者 drawer，用来配置弹出方式
        source: getApi(refObject, null, refObject.fields, {alias: 'rows'}),
        pickerSchema: {
            mode: "table",
            name: "thelist",
            draggable: true,
            columns: [
                {
                    "name": "_id",
                    "label": "_id",
                    "sortable": true,
                    "searchable": true,
                    "type": "text",
                    "toggled": true
                },
                {
                    "name": "name",
                    "label": "Name",
                    "sortable": true,
                    "searchable": true,
                    "type": "text",
                    "toggled": true
                }
            ]
        }
    }
    if(field.multiple){
        data.multiple = true
        data.extractValue = true
    }
    return data;
}

function lookupToAmisSelect(field, readonly){
    const refObject = objectql.getObject(field.reference_to).toConfig();

    const apiInfo = getApi(refObject, null, refObject.fields, {alias: 'options', queryOptions: `filters: {__filters}, top: {__top}`})
    apiInfo.data.$term = "$term";
    apiInfo.data.$value = `$${field.name}._id`;
    // [["_id", "=", "$${field.name}._id"],"or",["name", "contains", "$term"]]
    apiInfo.requestAdaptor = `
        var filters = '[]';
        var top = 10;
        if(api.data.$term){
            filters = '["name", "contains", "'+ api.data.$term +'"]';
        }else if(api.data.$value){
            filters = '["_id", "=", "'+ api.data.$value +'"]';
        }
        api.data.query = api.data.query.replace('{__filters}', filters).replace('{__top}', top);
        return api;
    `

    const data = {
        type: getAmisFieldType('select', readonly),
        joinValues: false,
        labelField: 'name',
        valueField: '_id',
        autoComplete: apiInfo,
    }
    if(_.has(field, 'defaultValue')){
        data.value = field.defaultValue
    }
    if(field.multiple){
        data.multiple = true
        data.extractValue = true
    }
    return data;
}

function convertSFieldToAmisField(field, readonly) {
    const baseData = {name: field.name, label: field.label, labelRemark: field.inlineHelpText};
    let convertData = {};
    switch (field.type) {
        case 'text':
            convertData.type = getAmisFieldType('text', readonly);
            break;
        case 'textarea':
            convertData.type = getAmisFieldType('textarea', readonly);
            convertData.tpl = `<b><%=data.${field.name}%></b>`;
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
                precision: field.scale
            }
            break;
        case 'currency':
            //TODO
            convertData = {
                type: getAmisFieldType('number', readonly),
                min: field.min,
                max: field.max,
                precision: field.scale
            }
            break;
        case 'percent':
            //TODO
            convertData = {
                type: getAmisFieldType('number', readonly),
                min: field.min,
                max: field.max,
                precision: field.scale
            }
            break;
        case 'password':
            convertData = {
                type: getAmisFieldType('password', readonly)
            }
            break;
        case 'lookup':
            convertData = lookupToAmisSelect(field, readonly)
            break;
        case 'master_detail':
            convertData = lookupToAmisSelect(field, readonly)
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
        if(field.is_wide){
            convertData.className = 'col-span-2 m-0';
        }else{
            convertData.className = 'm-0';
        }
        if(readonly){
            convertData.className = `${convertData.className} slds-form-element_readonly`
        }
        convertData.labelClassName = 'text-left';
        if(readonly){
            convertData.quickEdit = true;
        }
        return Object.assign({}, baseData, convertData);
    }
    
}

function getSaveApi(object, recordId, fields, options){
    return {
        method: 'post',
        url: 'http://127.0.0.1:8088/graphql',
        data: graphql.getSaveQuery(object, recordId, fields, options)
    }
}

function getApi(object, recordId, fields, options){
    return {
        method: "post",
        url: "http://127.0.0.1:8088/graphql",
        data: graphql.getFindOneQuery(object, recordId, fields, options)
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