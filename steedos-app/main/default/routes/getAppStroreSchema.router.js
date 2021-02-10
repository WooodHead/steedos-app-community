const express = require("express");
const router = express.Router();
const core = require('@steedos/core');
const objectql = require('@steedos/objectql');

router.get('/api/get/app/strore/schema', core.requireAuthentication, async function (req, res) {
    const userSession = req.user;
    const spaceId = userSession.spaceId;
    // const userId = userSession.userId;
    const isSpaceAdmin = userSession.is_space_admin;
    const spaces = await objectql.getObject('spaces').find({filters: ['_id','=', spaceId]});
    if(spaces.length > 0){
        const apiKey = spaces[0].api_key;
        let steedos_server = 'https://huayan.my.steedos.com:8443/';
        if(process.env.STEEDOS_DEVELOPER_SERVER){
            steedos_server =  process.env.STEEDOS_DEVELOPER_SERVER;
        }
        console.log('apiKey----', apiKey)
        if (!isSpaceAdmin) {
            return res.status(401).send({ status: 'error', message: 'Permission denied' });
        }
        console.log('steedos_server----', steedos_server)
          
        res.status(200).send({ 
            apiKey: apiKey,
            steedos_server : steedos_server
        });       
    }
    res.status(500).send({ error: 'not find ApiKey' });  
});
exports.default = router;


