const xmlrpc = require('xmlrpc')
const { URL } = require('url');
let { getConfig } = require('../utils/getConfig')

exports.request = async (methodCall, params, callBack = () => { }) => {
    let config = await getConfig()
    const MetaWeblogUrl = new URL(config.url);
    var client = xmlrpc.createSecureClient({ host: MetaWeblogUrl.hostname, path: MetaWeblogUrl.pathname })
    return new Promise((res, rej) => {
        client.methodCall(methodCall, params, function (error, value) {
            if (error) {
                callBack(value)
                rej(error)
            } else {
                callBack(value)
                res(value)
            }
        })
    })
}

