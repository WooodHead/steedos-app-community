const Tpl = require('../tpl');
const _ = require('underscore');
const OMIT_FIELDS = ['created', 'created_by', 'modified', 'modified_by'];
const Lookup = require('./lookup');

function getBaseFields(readonly){
    let calssName = 'm-0';
    if(readonly){
        calssName = `${calssName} slds-form-element_readonly`
    }
    return [
        { 
            name: "createdInfo", 
            label: "创建人",
            type: "static",
            labelClassName: 'text-left',
            className: calssName,
            tpl: Tpl.getCreatedInfoTpl()
        },
        { 
            name: "modifiedInfo", 
            label: "修改人",
            type: "static",
            labelClassName: 'text-left',
            className: calssName,
            tpl: Tpl.getModifiedInfoTpl()
        }
    ]
};

function getAmisStaticFieldType(type, readonly){
    if(!readonly){
        return type;
    }
    if(_.include(['date', 'datetime', 'text'], type)){
        return `static-${type}`;
    }else{
        return 'static';
    }
};

function getAmisFieldType(sField){
    switch (sField.type) {
        case 'text':
            return 'text';
        case 'textarea':
            return 'textarea';
        case 'html':
            return 'html';
        case 'select':
            return 'select';
        case 'boolean':
            return 'switch';
        case 'date':
            return 'date';
        case 'datetime':
            return 'datetime';
        case 'number':
            return 'number';
        case 'currency':
            return 'number';
        case 'percent':
            return 'number'
        case 'password':
            return 'password';
        case 'lookup':
            // TODO 根据字段配置返回 select || picker
            return 'select';
        case 'master_detail':
            // TODO 根据字段配置返回 select || picker
            return 'picker';
        case 'autonumber':
            return 'text';
        case 'url':
            return 'url'
        case 'email':
            return 'email'
        case 'image':
            return 'image'
        case 'formula':
            //TODO
            break;
        case 'summary':
            //TODO
            break;
        case 'grid':
            return 'table';
        default:
            console.log('convertData default', sField.type);
            // convertData.type = field.type
            break;
    }

};

function getObjectFieldSubFields(mainField, fields){
    const newMainField = Object.assign({subFields: []}, mainField);
    const subFields = _.filter(fields, function(field){
        return field.name.startsWith(`${mainField.name}.`)
    });
    newMainField.subFields = subFields;
    return newMainField;
}

function getGridFieldSubFields(mainField, fields){
    const newMainField = Object.assign({subFields: []}, mainField);
    const subFields = _.filter(fields, function(field){
        return field.name.startsWith(`${mainField.name}.`)
    });
    newMainField.subFields = subFields;
    return newMainField;
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


function convertSFieldToAmisField(field, readonly) {
    if(_.include(OMIT_FIELDS, field.name)){return}
    const baseData = {name: field.name, label: field.label, labelRemark: field.inlineHelpText};
    let convertData = {};
    switch (field.type) {
        case 'text':
            convertData.type = getAmisStaticFieldType('text', readonly);
            break;
        case 'textarea':
            convertData.type = getAmisStaticFieldType('textarea', readonly);
            convertData.tpl = `<b><%=data.${field.name}%></b>`;
            break;
        case 'html':
            convertData = {
                type: getAmisStaticFieldType('html', readonly)
            }
            break;
        case 'select':
            convertData = {
                type: getAmisStaticFieldType('select', readonly),
                joinValues: false,
                options: field.options,
                extractValue: true,
                labelField: 'label',
                valueField: 'value',
                tpl: readonly ? Tpl.getSelectTpl(field) : null
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
                type: getAmisStaticFieldType('switch', readonly),
                option: field.inlineHelpText,
                tpl: readonly ? Tpl.getSwitchTpl(field) : null
            }
            break;
        case 'date':
            convertData = {
                type: getAmisStaticFieldType('date', readonly),
                format: "YYYY-MM-DD",
                valueFormat:'YYYY-MM-DDT00:00:00.000[Z]',
                tpl: readonly ? Tpl.getDateTpl(field) : null
            }
            break;
        case 'datetime':
            convertData = {
                type: getAmisStaticFieldType('datetime', readonly),
                inputFormat: 'YYYY-MM-DD HH:mm',
                format:'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
                tpl: readonly ? Tpl.getDateTimeTpl(field) : null
            }
            break;
        case 'number':
            convertData = {
                type: getAmisStaticFieldType('number', readonly),
                min: field.min,
                max: field.max,
                precision: field.scale
            }
            break;
        case 'currency':
            //TODO
            convertData = {
                type: getAmisStaticFieldType('number', readonly),
                min: field.min,
                max: field.max,
                precision: field.scale
            }
            break;
        case 'percent':
            //TODO
            convertData = {
                type: getAmisStaticFieldType('number', readonly),
                min: field.min,
                max: field.max,
                precision: field.scale
            }
            break;
        case 'password':
            convertData = {
                type: getAmisStaticFieldType('password', readonly),
                tpl: readonly ? Tpl.getPasswordTpl(field) : null
            }
            break;
        case 'lookup':
            convertData = Lookup.lookupToAmisSelect(field, readonly)
            break;
        case 'master_detail':
            convertData = Lookup.lookupToAmisPicker(field, readonly)
            break;
        case 'autonumber':
            //TODO
            break;
        case 'url':
            convertData = {
                type: getAmisStaticFieldType('url', readonly)
            }
            break;
        case 'email':
            convertData = {
                type: getAmisStaticFieldType('email', readonly)
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
        case 'grid':
            convertData = {
                type: 'table',
                strictMode:false,
                // needConfirm: true,  此属性设置为false后，导致table不能编辑。
                editable: !readonly,
                addable: !readonly,
                removable: !readonly,
                draggable: !readonly,
                columns: []
            }
            _.each(field.subFields, function(subField){
                const subFieldName = subField.name.replace(`${field.name}.$.`, '').replace(`${field.name}.`, '');
                const gridSub = convertSFieldToAmisField(Object.assign({}, subField, {name: subFieldName}), readonly);
                if(gridSub){
                    delete gridSub.name
                    delete gridSub.label
                    convertData.columns.push({
                        name: subFieldName,
                        label: subField.label,
                        quickEdit: readonly ? false : gridSub
                    })
                }
            })
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
            convertData.quickEdit = false;
        }
        return Object.assign({}, baseData, convertData);
    }
    
}

exports.convertSFieldToAmisField = convertSFieldToAmisField;
exports.getPermissionFields = getPermissionFields;
exports.getObjectFieldSubFields = getObjectFieldSubFields;
exports.getGridFieldSubFields = getGridFieldSubFields;
exports.getAmisStaticFieldType = getAmisStaticFieldType;
exports.getBaseFields = getBaseFields;
exports.getAmisFieldType = getAmisFieldType;