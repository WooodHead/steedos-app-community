const express = require("express");
const router = express.Router();
const core = require('@steedos/core');
const AmisSchema = require('../server/amis-schema');
const _ = require('underscore');
const objectql = require('@steedos/objectql')
const clone = require('clone');
const steedosI18n = require("@steedos/i18n");

router.get('/api/amis/list/:objectName', core.requireAuthentication, async function (req, res) {
    const userSession = req.user;
    // const spaceId = userSession.spaceId;
    // const userId = userSession.userId;
    // const isSpaceAdmin = userSession.is_space_admin;
    let urlParams = req.params;
    let queryParams = req.query || {};
    console.log('queryParams', queryParams)

    let mainObject = clone(objectql.getObject(urlParams.objectName).toConfig());
    let lng = objectql.getUserLocale(userSession);
    steedosI18n.translationObject(lng, mainObject.name, mainObject)
    let fields = mainObject.fields;
    if(queryParams.list_view){
        const listViewFields = [];
        let listview = await objectql.getObject('object_listviews').find({filters: [['object_name', '=', mainObject.name], ['name', '=', queryParams.list_view]]}, userSession);
        if(listview){
            listview = listview[0];
        }else{
            listview = mainObject.list_views[queryParams.list_view];
        }
        
        console.log('listview', listview)
        if(listview && listview.columns){
            _.each(listview.columns, function(column){
                if(_.isString(column)){
                    listViewFields.push(mainObject.fields[column])
                }else if(_.isObject(column)){
                    listViewFields.push(Object.assign({}, mainObject.fields[column.field], {width: column.width, wrap: column.wrap}))
                }
            })
        }
        fields = listViewFields;
    }
    if(queryParams.fields){

    }
    console.log('fields', fields)
    res.status(200).send({ schema: AmisSchema.getListSchema(mainObject, fields, queryParams, userSession)});
});
exports.default = router;