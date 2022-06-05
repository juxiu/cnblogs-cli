const { promisify } = require('util')
var parseString = promisify(require('xml2js').parseString);
const axios = require('axios')
function parse(res) {
    if (res.methodResponse) {
        res = res.methodResponse;
    }
    if (res.params) {
        res = res.params.param.value;
    } else if (res.fault) {
        res = res.fault.value;
    }
    return _parse(res);
}
function _parse(res) {
    for (var name in res) {
        if (name === 'struct') {
            var data = {};
            var members = res.struct.member;
            if (!members) {
                return data;
            }
            if (members.constructor.name !== 'Array') {
                members = [members];
            }
            for (var i = 0, l = members.length; i < l; i++) {
                var member = members[i];
                data[member.name] = parse(member.value);
            }
            return data;
        } else if (name === 'array') {
            var values = res.array.data.value;
            if (values.constructor.name !== 'Array') {
                values = [values];
            }
            var data = [];
            for (var i = 0, l = values.length; i < l; i++) {
                data[i] = parse(values[i]);
            }
            return data;
        } else if (name === 'boolean') {
            return res[name] === '1';
        } else {
            return res[name];
        }
    }
}

async function toJson(data) {
    const json = await parseString(data, { explicitArray: false, ignoreAttrs: true });
    return parse(json)
}

async function request(url, data, options = {}) {
    const res = await axios.post(url, data, options)
    const json = await toJson(res.data)
    return json
}



exports.toJson = toJson
exports.request = request