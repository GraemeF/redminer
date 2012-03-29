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

Redminer.prototype.getIssues = function (queryId, page, callback) {

    var query = {};

    if (queryId)
        query.query_id = queryId;

    if (page) {
        query.page = page;
    }

    makeRequest(rest.get, this.uri + '/issues.json', {
        headers: {'X-Redmine-API-Key': this.apiKey},
        query: query
    }, function (x) {
        return x;
    }, callback);
};

Redminer.prototype.getIssuesFromPage = function (queryId, page, callback) {
    var self = this;
    this.getIssues(queryId, page, function (error, result) {
        if (error) {
            return callback(error, result);
        }
        if (result.total_count > ((result.offset + result.limit))) {
            self.getIssuesFromPage(queryId, page + 1, function (error, nextPage) {
                callback(error, result.issues.include(nextPage));
            });
        }
        else {
            callback(error, result.issues);
        }
    });
};

Redminer.prototype.getAllIssues = function (queryId, callback) {
    this.getIssuesFromPage(queryId, 0, callback);
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