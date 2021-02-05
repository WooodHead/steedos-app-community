const objectql = require('@steedos/objectql');
function getCreatedInfoTpl(){
    return "<div><a href='/app/admin/users/view/${created_by._id}'>${created_by.name}</a> ${created}</div>"
}

function getModifiedInfoTpl(){
    return "<div href='/app/admin/users/view/${modified_by._id}'>${modified_by.name}</a> ${modified}</div>"
}

function getRefObjectNameFieldName(field){
    const refObject = objectql.getObject(field.reference_to);
    return refObject.NAME_FIELD_KEY;
}

function getLookupTpl(field){
    const NAME_FIELD_KEY = getRefObjectNameFieldName(field);
    if(field.multiple){
        return `
        <% if (data.${field.name} && data.${field.name}.length) { %><% data.${field.name}.forEach(function(item) { %> <a href="/app/-/${field.reference_to}/view/<%=item._id%>"><%=item.${NAME_FIELD_KEY}%></a>  <% }); %><% } %>
        `
    }else{
        return `<a href="/app/-/${field.reference_to}/view/\${${field.name}._id}">\${${field.name}.${NAME_FIELD_KEY}}</a>`
    }
    
}

exports.getLookupTpl = getLookupTpl
exports.getCreatedInfoTpl = getCreatedInfoTpl
exports.getModifiedInfoTpl = getModifiedInfoTpl