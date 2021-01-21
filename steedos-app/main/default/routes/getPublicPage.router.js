const express = require("express");
const router = express.Router();
const core = require('@steedos/core');
const objectql = require('@steedos/objectql');
router.get('/api/community/public/:communityPath/:pagePath', async function (req, res) {
    let urlParams = req.params;
    let communityPath = urlParams.communityPath;
    let pagePath = urlParams.pagePath;
    const communitys = await objectql.getObject('community').find({filters: ['url','=', communityPath]});
    if(communitys.length > 0){
        const community = communitys[0];
        //TODO 此处应该返回public page。
        const pages = await objectql.getObject('community_page').find({filters: [['community','=', community._id], ['path','=', pagePath]]});
        if(pages.length > 0){
            res.status(200).send(pages[0]);
        }
    }
    res.status(500).send({ error: 'not find page' });
});
exports.default = router;