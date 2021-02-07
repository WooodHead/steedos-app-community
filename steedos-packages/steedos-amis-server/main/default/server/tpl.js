const objectql = require('@steedos/objectql');
function getCreatedInfoTpl(){
    return "<div><a href='/app/admin/users/view/${created_by._id}'>${created_by.name}</a> ${created__label}</div>"
}

function getModifiedInfoTpl(){
    return "<div><a href='/app/admin/users/view/${modified_by._id}'>${modified_by.name}</a> ${modified__label}</div>"
}

function getDateTpl(field){
    return `<div>\${${field.name}__label}</div>`
}


function getDateTimeTpl(field){
    return `<div>\${${field.name}__label}</div>`
}

function getRefObjectNameFieldName(field){
    const refObject = objectql.getObject(field.reference_to);
    return refObject.NAME_FIELD_KEY;
}

function getSelectTpl(field){
    return `<div>\${${field.name}__label}</div>`
}

function getLookupTpl(field){
    if(!field.reference_to){
        return getSelectTpl(field)
    }
    const NAME_FIELD_KEY = getRefObjectNameFieldName(field);
    if(field.multiple){
        return `
        <% if (data.${field.name} && data.${field.name}.length) { %><% data.${field.name}.forEach(function(item) { %> <a href="/app/-/${field.reference_to}/view/<%=item._id%>"><%=item.${NAME_FIELD_KEY}%></a>  <% }); %><% } %>
        `
    }else{
        return `<a href="/app/-/${field.reference_to}/view/\${${field.name}._id}">\${${field.name}.${NAME_FIELD_KEY}}</a>`
    }
    
}

exports.getSelectTpl = getSelectTpl;
exports.getDateTpl = getDateTpl;
exports.getDateTimeTpl = getDateTimeTpl;
exports.getLookupTpl = getLookupTpl
exports.getCreatedInfoTpl = getCreatedInfoTpl
exports.getModifiedInfoTpl = getModifiedInfoTpl