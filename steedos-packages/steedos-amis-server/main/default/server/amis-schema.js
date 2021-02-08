const _ = require('underscore');
const objectql = require('@steedos/objectql');
const steedosI18n = require("@steedos/i18n");
const clone = require('clone');
const ObjectRecord = require('./object-record');

/**
 * 
 * @param {*} mainObjectName 
 * @param {*} fields : TODO
 * @param {*} recordId : 可以为record：doc
 * @param {*} readonly 
 * @param {*} userSession 
 */
function getRecordSchema(mainObjectName, recordId, readonly, userSession) {
    const object = clone(objectql.getObject(mainObjectName).toConfig());
    let lng = objectql.getUserLocale(userSession);
    steedosI18n.translationObject(lng, object.name, object)
    return ObjectRecord.convertSObjectToAmisSchema(object, recordId, readonly);
}

exports.getRecordSchema = getRecordSchema