const express = require("express");
const router = express.Router();
const core = require('@steedos/core');
const objectql = require('@steedos/objectql');

router.get('/api/get/app/strore/schema', core.requireAuthentication, async function (req, res) {
    const userSession = req.user;
    const spaceId = userSession.spaceId;
    // const userId = userSession.userId;
    const isSpaceAdmin = userSession.is_space_admin;
    if (!isSpaceAdmin) {
        return res.status(401).send({ status: 'error', message: 'Permission denied' });
    }
    const space = await objectql.getObject('spaces').findOne(spaceId);
    if(space){
        const apiKey = space.api_key;
        let steedos_server = 'https://huayan.my.steedos.com:8443/';
        if(process.env.STEEDOS_DEVELOPER_SERVER){
            steedos_server =  process.env.STEEDOS_DEVELOPER_SERVER;
        }  
        const pageJson = {
            "type": "dialog",
            "showCloseButton": true,
            "closeOnEsc": true,
            "title": "App Exchage",
            "size": "md",
            "className": "font-bold text-dark p-t-xs p-b-xs b-t b-b b-l",
            "actions": [ 
            ],
            "body": [{
                "type": "page",
                "body": [{
                    "type": "crud",
                    "api": {
                        "method": "post",
                        "url": steedos_server + "/graphql",
                        "data": {
                            "query": "{   items: published_package {     _id     carousel_01     carousel_02     carousel_03     instruction     keyword     title: label     logo     package_type     rating     free     latest_release__label     listed_on__label     package_type__label     package_store {       storeId:_id       downloads       label     }     package_version {       versionId:_id       description       downloads       fields       install_password       name       objects       post_install       release_notes       resources       version     }    } }"
                        },
                        "adaptor": "var items = payload.data.items;\r\nfor(var i = 0; i< items.length; i++){\r\n    var item = items[i];\r\n    var images = [];\r\n\r\n    if(item.logo){\r\n        logo = `" + steedos_server + "/api/files/images/${item.logo}`;\r\n        item.logo = logo;\r\n    }\r\n    \r\n    if(item.carousel_01){\r\n        images.push({\r\n            image: `" + steedos_server + "/api/files/images/${item.carousel_01}`\r\n        })\r\n    }\r\n    if(item.carousel_02){\r\n        images.push({\r\n            image: `" + steedos_server + "/api/files/images/${item.carousel_02}`\r\n        })\r\n    }\r\n    if(item.carousel_03){\r\n        images.push({\r\n            image: `" + steedos_server + "/api/files/images/${item.carousel_03}`\r\n        })\r\n    }\r\n    item.images = images;\r\n    item.free_label = \"??????\";\r\n    if(item.free){\r\n        item.free_label = \"??????\";\r\n    }\r\n}\r\npayload.data.items = items;\r\nconsole.log('payload.data.items is ', payload.data.items);\r\nreturn payload;                         ",
                        "replaceData": false,
                        "requestAdaptor": "api.headers={\"Authorization\":\"Bearer apikey," + apiKey + "\"};"
                    },
                    "messages": {
                    },
                    "mode": "cards",
                    "card": {
                        "type": "card",
                        "header": {
                            "avatar": "${logo}",
                            "title": "${title}",
                            "subTitle": "${free_label}"
                        },
                        "body": [
                            {
                                "label": "",
                                "type": "plain",
                                "className": "no-border p-none m-t-sm m-b-sm m-l m-r text-sm",
                                "tpl": "${instruction}",
                                "inline": false
                            }
                        ],
                        "actions": [
                            {
                                "type": "button",
                                "value": "",
                                "body": "????????????",
                                "blank": false,
                                "className": "text-sm text-muted text-info",
                                "visible": "",
                                "visibleOn": "",
                                "label": "????????????",
                                "actionType": "dialog",
                                "close": true,
                                "dialog": {
                                    "type": "dialog",
                                    "title": "${title}??????",
                                    "size": "md",
                                    "className": "font-bold text-dark p-t-xs p-b-xs b-t b-b b-l",
                                    "body": [
                                        {
                                            "type": "carousel",
                                            "title": "",
                                            "name": "images",
                                            "controlsTheme": "light",
                                            "size": "md",
                                            "className": "font-bold text-dark p-t-xs p-b-xs b-t b-b b-l m-r-lg m-l-lg",
                                            "closeOnEsc": false,
                                            "showCloseButton": true,
                                            "actions": [
                                            ],
                                            "bodyClassName": "p-l-lg p-r-lg"
                                        },
                                        {
                                            "type": "hbox",
                                            "className": "mt-8",
                                            "columns": [
                                                {
                                                    "type": "tpl",
                                                    "tpl": "??????????????????${title}",
                                                    "inline": false,
                                                    "title": "",
                                                    "controls": [
                                                        {
                                                            "label": "?????????",
                                                            "type": "text",
                                                            "name": "text"
                                                        }
                                                    ],
                                                    "canAccessSuperData": false,
                                                    "className": "text-center font-bold no-bg text-dark p-t-xs p-b-xs b-t b-b b-l text-sm"
                                                },
                                                {
                                                    "type": "tpl",
                                                    "tpl": "??????????????????${package_version.version}",
                                                    "inline": false,
                                                    "title": "",
                                                    "controls": [
                                                        {
                                                            "label": "?????????",
                                                            "type": "text",
                                                            "name": "text"
                                                        }
                                                    ],
                                                    "canAccessSuperData": false,
                                                    "className": "pl-6 font-bold no-bg text-dark p-t-xs p-b-xs b-t b-r b-b text-sm b-l"
                                                }
                                            ],
                                            "title": "",
                                            "size": "md",
                                            "closeOnEsc": false,
                                            "showCloseButton": true,
                                            "actions": [
                                            ],
                                            "bodyClassName": "p-l-lg p-r-lg",
                                            "name": "images",
                                            "controlsTheme": "light",
                                            "canAccessSuperData": false
                                        },
                                        {
                                            "type": "hbox",
                                            "className": "font-bold no-bg text-dark text-md",
                                            "columns": [
                                                {
                                                    "type": "tpl",
                                                    "tpl": "?????????${free_label}",
                                                    "inline": false,
                                                    "title": "",
                                                    "controls": [
                                                        {
                                                            "label": "?????????",
                                                            "type": "text",
                                                            "name": "text"
                                                        }
                                                    ],
                                                    "canAccessSuperData": false,
                                                    "className": "text-center font-bold no-bg text-dark p-t-xs p-b-xs b-t b-b b-l text-sm"
                                                },
                                                {
                                                    "type": "tpl",
                                                    "tpl": "??????????????????${package_type__label}",
                                                    "inline": false,
                                                    "title": "",
                                                    "controls": [
                                                        {
                                                            "label": "?????????",
                                                            "type": "text",
                                                            "name": "text"
                                                        }
                                                    ],
                                                    "canAccessSuperData": false,
                                                    "className": "pl-6 font-bold no-bg text-dark p-t-xs p-b-xs b-t b-r b-b text-sm b-l"
                                                }
                                            ],
                                            "title": "",
                                            "size": "md",
                                            "closeOnEsc": false,
                                            "showCloseButton": true,
                                            "actions": [
                                            ],
                                            "bodyClassName": "p-l-lg p-r-lg",
                                            "name": "images",
                                            "controlsTheme": "light",
                                            "canAccessSuperData": false
                                        },
                                        {
                                            "type": "hbox",
                                            "className": "font-bold no-bg text-dark text-md",
                                            "columns": [
                                                {
                                                    "type": "tpl",
                                                    "tpl": "????????????????????????${listed_on__label}",
                                                    "inline": false,
                                                    "title": "",
                                                    "controls": [
                                                        {
                                                            "label": "?????????",
                                                            "type": "text",
                                                            "name": "text"
                                                        }
                                                    ],
                                                    "canAccessSuperData": false,
                                                    "className": "text-center font-bold no-bg text-dark p-t-xs p-b-xs b-t b-b b-l text-sm"
                                                },
                                                {
                                                    "type": "tpl",
                                                    "tpl": "?????????????????????${latest_release__label}",
                                                    "inline": false,
                                                    "title": "",
                                                    "controls": [
                                                        {
                                                            "label": "?????????",
                                                            "type": "text",
                                                            "name": "text"
                                                        }
                                                    ],
                                                    "canAccessSuperData": false,
                                                    "className": "pl-6 font-bold no-bg text-dark p-t-xs p-b-xs b-t b-r b-b text-sm b-l"
                                                }
                                            ],
                                            "title": "",
                                            "size": "md",
                                            "closeOnEsc": false,
                                            "showCloseButton": true,
                                            "actions": [
                                            ],
                                            "bodyClassName": "p-l-lg p-r-lg",
                                            "name": "images",
                                            "controlsTheme": "light",
                                            "canAccessSuperData": false
                                        },
                                        {
                                            "type": "hbox",
                                            "className": "font-bold no-bg text-dark text-md",
                                            "columns": [
                                                {
                                                    "type": "tpl",
                                                    "tpl": "???????????????${package_version.downloads}",
                                                    "inline": false,
                                                    "title": "",
                                                    "controls": [
                                                        {
                                                            "label": "?????????",
                                                            "type": "text",
                                                            "name": "text"
                                                        }
                                                    ],
                                                    "canAccessSuperData": false,
                                                    "className": "text-center font-bold no-bg text-dark p-t-xs p-b-xs b-t b-b b-l text-sm"
                                                },
                                                {
                                                    "type": "tpl",
                                                    "tpl": "???????????????${package_version.post_install}",
                                                    "inline": false,
                                                    "title": "",
                                                    "controls": [
                                                        {
                                                            "label": "?????????",
                                                            "type": "text",
                                                            "name": "text"
                                                        }
                                                    ],
                                                    "canAccessSuperData": false,
                                                    "className": "pl-6 font-bold no-bg text-dark p-t-xs p-b-xs b-t b-r b-b text-sm b-l"
                                                }
                                            ],
                                            "title": "",
                                            "size": "md",
                                            "closeOnEsc": false,
                                            "showCloseButton": true,
                                            "actions": [
                                            ],
                                            "bodyClassName": "p-l-lg p-r-lg",
                                            "name": "images",
                                            "controlsTheme": "light",
                                            "canAccessSuperData": false
                                        },
                                        {
                                            "type": "hbox",
                                            "className": "font-bold no-bg text-dark b-a text-base",
                                            "columns": [
                                                {
                                                    "type": "tpl",
                                                    "tpl": "??????????????????${instruction }",
                                                    "inline": false,
                                                    "title": "",
                                                    "controls": [
                                                        {
                                                            "label": "???????????????",
                                                            "type": "textarea",
                                                            "name": "textarea",
                                                            "minRows": 3,
                                                            "maxRows": 5
                                                        }
                                                    ],
                                                    "canAccessSuperData": false,
                                                    "className": "overflow-scroll h-32 text-center font-bold no-bg text-dark p-t-xs p-b-xs b-t b-b b-l text-sm"
                                                }
                                            ]
                                        },
                                        {
                                            "type": "hbox",
                                            "className": "font-bold no-bg text-md",
                                            "columns": [
                                                {
                                                    "type": "plain",
                                                    "tpl": "",
                                                    "inline": false,
                                                    "placeholder": "",
                                                    "className": "font-bold no-bg text-blue-500 p-t-xs p-b-xs text-sm"
                                                },
                                                {
                                                    "type": "button",
                                                    "label": "??????",
                                                    "blank": true,
                                                    "actionType": "url",
                                                    "className": "h-10 w-20 text-center m-t-lg  text-white r-2x font-bold bg-danger text-base",
                                                    "size": "md",
                                                    "confirmText": "????????????????????????????????????",
                                                    "url": "/api/package/installing_from_app_exchange/${package_version.versionId}"
                                                }
                                            ],
                                            "title": "",
                                            "size": "md",
                                            "closeOnEsc": false,
                                            "showCloseButton": true,
                                            "actions": [
                                            ]
                                        }
                                    ],
                                    "closeOnEsc": false,
                                    "showCloseButton": true,
                                    "actions": [
                                    ],
                                    "bodyClassName": "p-l-lg p-r-lg"
                                },
                                "level": "link",
                                "link": ""
                            }
                        ],
                        "titleClassName": "",
                        "highlightClassName": "",
                        "bodyClassName": "text-base font-bold m-none p-none",
                        "className": "m-t-lg m-b-lg",
                        "label": "",
                        "inline": false,
                        "avatarClassName": "r-2x r w-12 h-12",
                        "imageClassName": "w-12 h-12",
                        "src": "${logo}",
                        "thumbMode": "cover"
                    },
                    "placeholder": "????????????",
                    "showHeader": false,
                    "showFooter": false,
                    "columnsCount": 3,
                    "className": "m-r m-l m-b p",
                    "keepItemSelectionOnPageChange": false,
                    "itemClassName": "Grid-col--sm6 Grid-col--md4 Grid-col--lg3"

                }],
                "inline": false,
                "headerClassName": "m-none p-none",
                "itemsClassName": "",
                "bodyClassName":"overflow-y-scroll h-96",
                "tabsMode": "line",
                "mountOnEnter": false,
                "initApi": "",
                "filter": null,
            }]
        }        
        res.status(200).send({ 
            apiKey: apiKey,
            steedos_server : steedos_server,
            pageJson: pageJson
        });       
    }
    res.status(500).send({ error: 'not find ApiKey' });  
});
exports.default = router;


