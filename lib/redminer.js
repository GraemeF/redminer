var rest = require('restler');

var Redminer = function (uri, apiKey) {
    this.uri = uri;
    this.apiKey = apiKey;
};

function makeRequest(fn, uri, options, selector, callback) {
    fn(uri, options)
        .on('complete', function (result) {
            if (result instanceof Error) {
                callback(result);
            } else {
                callback(null, selector(result));
            }
        });
}

Redminer.prototype.getIssues = function (queryId, limit, callback) {

    var query = {};

    if (queryId)
        query.query_id = queryId;

    if (limit)
        query.limit = limit;

    makeRequest(rest.get, this.uri + '/issues.json', {
        headers: {'X-Redmine-API-Key': this.apiKey},
        query: query
    }, function (x) {
        return x.issues;
    }, callback);
};

Redminer.prototype.getIssueUri = function (id) {
    return this.uri + '/issues/' + id;
};

Redminer.prototype.getIssue = function (id, callback) {

    var query = {include: 'journals'};

    makeRequest(rest.get, this.getIssueUri(id) + '.json', {
        headers: {'X-Redmine-API-Key': this.apiKey},
        query: query
    }, function (x) {
        return x.issue;
    }, callback);
};

module.exports = Redminer;