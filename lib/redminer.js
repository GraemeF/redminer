var rest = require('restler');

var Redminer = function (uri, apiKey) {
    this.uri = uri;
    this.apiKey = apiKey;
};

Redminer.prototype.getIssues = function (callback) {

    rest.get(this.uri + '/issues.json', {headers: {'X-Redmine-API-Key': this.apiKey}})
        .on('complete', function (result) {
            if (result instanceof Error) {
                callback(result);
            } else {
                callback(null, result.issues);
            }
        });
};

module.exports = Redminer;