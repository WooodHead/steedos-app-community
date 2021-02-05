const Tpl = require('./tpl');
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
}

exports.getBaseFields = getBaseFields