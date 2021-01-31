const express = require("express");
const router = express.Router();
const core = require('@steedos/core');
const AmisSchema = require('../server/amis-schema');
const _ = require('underscore');
router.get('/api/amis/schema/:objectName/:recordId', core.requireAuthentication, async function (req, res) {
    // const userSession = req.user;
    // const spaceId = userSession.spaceId;
    // const userId = userSession.userId;
    // const isSpaceAdmin = userSession.is_space_admin;
    let urlParams = req.params;
    let queryParams = req.query;
    res.status(200).send({ schema: AmisSchema.getSchema(urlParams.objectName, urlParams.recordId, _.has(queryParams, 'readonly')) });
});
exports.default = router;