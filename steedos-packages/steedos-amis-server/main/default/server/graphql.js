const objectql = require('@steedos/objectql');
function getFieldsTemplate(fields){
    const fieldsName = ['_id'];
    //TODO 此处需要考虑相关对象查询
    _.each(fields, function(field){
        if(field.name.indexOf('.') < 0){
            if((field.type == 'lookup' || field.type == 'master_detail') && field.reference_to){
                const NAME_FIELD_KEY = objectql.getObject(field.reference_to).NAME_FIELD_KEY;
                fieldsName.push(`${field.name}{_id,name,${NAME_FIELD_KEY}}`)
            }else{
                fieldsName.push(field.name)
            }

            if(field.type === 'date' || field.type == 'datetime'){
                fieldsName.push(`${field.name}__label`)
            }
        }
    })
    return `${fieldsName.join(' ')}`
}

function getFindOneQuery(object, recordId, fields, options){
    let queryOptions = "";
    if(recordId){
        queryOptions = `(filters:["_id", "=", "${recordId}"])`;
    }
    let alias = "data";
    if(options){
        if(options.alias){
            alias = options.alias;
        }

        if(options.filters){
            queryOptions = `(filters:${options.filters})`;
        }
        if(options.queryOptions){
            queryOptions = `(${options.queryOptions})`;
        }
    }
    return {
        query: `{${alias}:${object.name}${queryOptions}{${getFieldsTemplate(fields)}}}`
    }
}

function getSaveQuery(object, recordId, fields, options){
    return {
        query: `mutation {
            ${object.name}__update(_id:"${recordId}", data: {__saveData}){_id}
        }`,
        $: "$$"
    }
}

function getSaveDataTpl(){
    return `
        const formData = api.data.$;
        const fieldsName = Object.keys(formData);
        delete formData.created
        delete formData.created_by
        delete formData.modified
        delete formData.modified_by
        let __saveData = JSON.stringify(JSON.stringify(formData));;
        // fieldsName.forEach(function(fName){
        //     __saveData = __saveData + \`\${fName}:\${formData[fName]},\`
        // });
    `
}

function getSaveRequestAdaptor(){
    return `
        ${getSaveDataTpl()}
        api.data.query = api.data.query.replace('{__saveData}', __saveData);
        return api;
    `
}

exports.getFindOneQuery = getFindOneQuery;
exports.getSaveQuery = getSaveQuery;
exports.getSaveRequestAdaptor = getSaveRequestAdaptor;