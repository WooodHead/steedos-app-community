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
    let queryParams = req.query;

    let mainObject = clone(objectql.getObject(urlParams.objectName).toConfig());
    let lng = objectql.getUserLocale(userSession);
    steedosI18n.translationObject(lng, mainObject.name, mainObject)

    if(queryParams.list_view){

    }
    if(queryParams.fields){

    }
    res.status(200).send({ schema: AmisSchema.getListSchema(mainObject, mainObject.fields, {}, userSession)});
});
exports.default = router;