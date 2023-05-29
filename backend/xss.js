'use strict';

const xss = require('xss');
const Logs = require('./logs');
const log = new Logs('xss');

/**
 * Prevent XSS injection by client side
 *
 * @param {object} dataObject
 * @returns sanitized object
 */
const checkXSS = (id, dataObject) => {
    try {
        if (typeof dataObject === 'object' && Object.keys(dataObject).length > 0) {
            let objectJson = objectToJSONString(dataObject);
            if (objectJson) {
                let jsonString = xss(objectJson);
                let jsonObject = JSONStringToObject(jsonString);
                if (jsonObject) {
                    log.debug('[' + id + '] XSS Object sanitization done');
                    return jsonObject;
                }
            }
        }
        if (typeof dataObject === 'string' || dataObject instanceof String) {
            log.debug('[' + id + '] XSS String sanitization done');
            return xss(dataObject);
        }
        log.warn('[' + id + '] XSS not sanitized', dataObject);
        return dataObject;
    } catch (error) {
        log.error('[' + id + '] XSS error', { data: dataObject, error: error });
        return dataObject;
    }
};

function objectToJSONString(dataObject) {
    try {
        return JSON.stringify(dataObject);
    } catch (error) {
        return false;
    }
}

function JSONStringToObject(jsonString) {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        return false;
    }
}

module.exports = checkXSS;
