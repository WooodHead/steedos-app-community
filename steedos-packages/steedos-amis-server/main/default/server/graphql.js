function getFieldsTemplate(fields){
    const fieldsName = [];
    //TODO 此处需要考虑相关对象查询
    _.each(fields, function(field){
        if(field.type != 'lookup' && field.type != 'master_detail'){
            fieldsName.push(field.name)
        }
    })
    return `${fieldsName.join(' ')}`
}

function getFindOneQuery(object, recordId, fields){
    return {
        query: `{data:${object.name}(filters:["_id", "=", "${recordId}"]){${getFieldsTemplate(fields)}}}`
    }
}

exports.getFindOneQuery = getFindOneQuery