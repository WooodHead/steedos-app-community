function getFieldsTemplate(fields){
    const fieldsName = ['_id'];
    //TODO 此处需要考虑相关对象查询
    _.each(fields, function(field){
        if(field.name.indexOf('.') < 0 && field.type != 'lookup' && field.type != 'master_detail'){
            fieldsName.push(field.name)
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
        let __saveData = JSON.stringify(JSON.stringify(formData));;
        // fieldsName.forEach(function(fName){
        //     __saveData = __saveData + \`\${fName}:\${formData[fName]},\`
        // });
    `
}

function getSaveRequestAdaptor(){
    return `
        console.log('this', this);
        console.log('api', api);
        console.log('api data', api.data);
        ${getSaveDataTpl()}
        console.log('__saveData', __saveData);
        api.data.query = api.data.query.replace('{__saveData}', __saveData);
        return api;
    `
}

exports.getFindOneQuery = getFindOneQuery;
exports.getSaveQuery = getSaveQuery;
exports.getSaveRequestAdaptor = getSaveRequestAdaptor;