const _ = require('underscore');
const graphql = require('./graphql');
const Fields = require('./fields');

const OMIT_FIELDS = ['created', 'created_by', 'modified', 'modified_by'];
const APICACHE = 100;

function getReadonlyFormAdaptor(fields){
    let scriptStr = '';
    const selectFields = _.filter(fields, function(field){return field.name.indexOf('.') < 0 && ((field.type == 'select' && field.options) || ((field.type == 'lookup' || field.type == 'master_detail') && !field.reference_to))});
    _.each(selectFields, function(field){
        if(!_.include(OMIT_FIELDS, field.name)){
            const valueField = field.name;
            if(field.options){
                const options = JSON.stringify({options: field.options});
                scriptStr = scriptStr + `var ${field.name}Options= (${options}).options;console.log('${field.name}Options', ${field.name}Options);`;
            }else if(field.optionsFunction){
                scriptStr = scriptStr + `var ${field.name}Options = eval(${field.optionsFunction.toString()})(api.data);`
            }
            if(field.multiple){
                scriptStr = scriptStr + `data.${field.name}__label = _.pluck(_.filter(${field.name}Options, function(option){return _.include(data.${field.name}, option.value)}), 'label');`
            }else{
                scriptStr = scriptStr + `var ${field.name}Selected = _.find(${field.name}Options, function(option){return data.${field.name} == option.value});`
                scriptStr = scriptStr + `data.${field.name}__label = ${field.name}Selected ? ${field.name}Selected.label:null;`
            }
        }
    })

    // const refFields = _.filter(fields, function(field){return field.name.indexOf('.') < 0 && (field.type == 'lookup' || field.type == 'master_detail') && !field.reference_to});
    // _.each(refFields, function(field){
    //     if(!_.include(OMIT_FIELDS, field.name)){
    //         const valueField = field.reference_to_field || '_id';
    //         scriptStr = scriptStr + `var ${field.name}Options = eval(${field.optionsFunction.toString()})(api.data);`
    //         if(field.multiple){
    //             scriptStr = scriptStr + `data.${field.name}__label = _.pluck(_.filter(${field.name}Options, function(option){return _.include(data.${field.name}, option.value)}), 'label');`
    //         }else{
    //             scriptStr = scriptStr + `var ${field.name}Selected = _.find(${field.name}Options, function(option){return data.${field.name} == option.value});`
    //             scriptStr = scriptStr + `data.${field.name}__label = ${field.name}Selected ? ${field.name}Selected.label:null;`
    //         }
    //     }
    // })

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
        url: graphql.getApi()+"?rf="+ (new Date()).getTime(),
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
    const refFields = _.filter(fields, function(field){return field.name.indexOf('.') < 0 && (field.type == 'lookup' || field.type == 'master_detail') && field.reference_to});
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
        url: graphql.getApi()+"?rf="+ (new Date()).getTime(),
        cache: APICACHE,
        adaptor: `
            var data = payload.data.data[0];
            ${getConvertDataScriptStr(fields)}
            payload.data = data;
            console.log('getEditFormInitApi', payload);
            return payload;
        `,
        data: graphql.getFindOneQuery(object, recordId, fields)
    }
}

function getSaveApi(object, recordId, fields, options){
    return {
        method: 'post',
        url: graphql.getApi(),
        data: graphql.getSaveQuery(object, recordId, fields, options),
        requestAdaptor: graphql.getSaveRequestAdaptor()
    }
}

function getInitApi(object, recordId, fields, readonly){
    if(readonly){
        return getReadonlyFormInitApi(object, recordId, fields);
    }else{
        return getEditFormInitApi(object, recordId, fields);
    }
}

function getFormActions(redirect){
    return [
        {
          "type": "button",
          "label": "取消",
          "actionType": "link",
          "dialog": {
            "title": "系统提示",
            "body": "对你点击了"
          },
          "level": "default",
          "block": false,
          "link": redirect
        },
        {
          "type": "button",
          "label": "保存",
          "actionType": "submit",
          "level": "info",
          "dialog": {
            "title": "系统提示",
            "body": "对你点击了"
          }
        }
      ]
}


function convertSObjectToAmisSchema(object, recordId, readonly, userSession) {
    const fieldControls = [];
    const permissionFields = Fields.getPermissionFields(object, userSession)
    _.each(permissionFields, function(perField){
        let field = perField;
        if(perField.type === 'grid'){
            field = Fields.getGridFieldSubFields(perField, permissionFields);
        }else if(perField.type === 'object'){
            field = Fields.getObjectFieldSubFields(perField, permissionFields);
        }
        if(field.name.indexOf(".") < 0){
            fieldControls.push(Fields.convertSFieldToAmisField(field, readonly))
        }
    })

    _.each(Fields.getBaseFields(readonly), function(field){
        fieldControls.push(field);
    })

    let gapClassName = 'row-gap-1';
    if(!readonly){
        gapClassName = 'row-gap-4'
    }

    const redirect = `/app/admin/${object.name}/view/${recordId}`

    return {
        type: 'page',
        bodyClassName: 'p-0',
        page: `page_${readonly ? 'readonly':'edit'}_${recordId}`,
        initApi: readonly ? getInitApi(object, recordId, permissionFields, readonly) : null,
        initFetch: readonly ? true : null,
        body: [
            {
                type: "form",
                mode: "horizontal",
                reload: `page_${readonly ? 'edit':'readonly'}_${recordId}`,
                redirect: redirect,
                persistData: false,
                promptPageLeave: readonly ? false : true,
                name: `form_${readonly ? 'readonly':'edit'}_${recordId}`,
                debug: false,
                title: "",
                api: readonly ? null : getSaveApi(object, recordId, permissionFields, {}),
                initApi: readonly ? null : getInitApi(object, recordId, permissionFields, readonly),
                initFetch: readonly ? null : true,
                controls: fieldControls,
                panelClassName:'m-0',
                bodyClassName: 'p-0',
                actions: readonly ? null : getFormActions(redirect),
                actionsClassName: readonly ? null : "p-sm b-t b-light text-center",
                className: `grid grid-cols-2 ${gapClassName} col-gap-6`
            }
        ]
    }
}

exports.convertSObjectToAmisSchema = convertSObjectToAmisSchema;