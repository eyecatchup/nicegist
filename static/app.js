(function(window) {
    var GithubApi = {
        xhr: null,
        apiBaseUrl: 'https://api.github.com',
        apiAccessToken: '89B467EB-2176-4978-9DE9-2F83439039FE',
        getXMLHttpRequest: function () {
            if (!!window.XMLHttpRequest) {
                this.xhr = new window.XMLHttpRequest;
            }
            else {
                try {
                    this.xhr = new ActiveXObject("MSXML2.XMLHTTP.3.0");
                } catch (e) {
                    this.xhr = null;
                }
            }

            if (!this.xhr) {
                window.console.log("AJAX (XMLHTTP) not supported by your client.");
            }
        },
        get: function (endpoint, success, failure) {
            this.getXMLHttpRequest();

            var self = this.xhr,
                requestUrl = this.apiBaseUrl + endpoint;

            this.xhr.open('GET', requestUrl, true);
            this.xhr.setRequestHeader('Accept', 'application/json');
            //this.xhr.setRequestHeader('Authorization', this.apiAccessToken);

            self.onload = function() {
                if (self.status >= 200 && self.status < 400) {
                    window.console.log('Successfully called ' + requestUrl);
                    try {
                        var json = JSON.parse(self.responseText);
                    } catch (e) {
                        window.console.log('Error parsing response as JSON. Returning raw response data.');
                    }

                    var response = !json ? self.responseText : json;

                    success(response);
                }
                else {
                    window.console.log('Error requesting ' + requestUrl +
                        '. Response Status-Code is ' + self.status);
                    failure();
                }
            }
            self.onerror = function() {
                window.console.log('There was an error (of some sort) connecting to ' + requestUrl);
                failure();
            };

            this.xhr.send();
        },
        getGists: function(user, pageId, success, failure) {
            var url = '/users/' + user + '/gists?page=' + pageId;
            this.get(url, success, failure);
        },
        getGist: function(gistId, success, failure) {
            var url = '/gists/' + gistId;
            this.get(url, success, failure);
        }
    };

    window.GithubApi = GithubApi;
})(window);

var hideLoadingIndicator = function() {
    document.querySelector('#loadingIndicator').style.display = 'none';
};

var parseQueryString = (function (pairList) {
    var pairs = {};
    for (var i = 0; i < pairList.length; ++i) {
        var keyValue = pairList[i].split('=', 2);
        if (keyValue.length == 1)
            pairs[keyValue[0]] = '';
        else
            pairs[keyValue[0]] = decodeURIComponent(keyValue[1].replace(/\+/g, ' '));
    }
    return pairs;
})(window.location.search.substr(1).split('&'));

var ghapi = window.GithubApi,
    gistId = parseQueryString['id'],
    $titleHolder = document.querySelector('#titleHolder'),
    $contentHolder = document.querySelector('#content'),
	files = {
        markdown: [],
        text: []
    };

var getGist = function(gistId) {
    ghapi.getGist(gistId, function(gist) {
        if (gist) {
            console.dir(gist);
            hideLoadingIndicator();

            if (gist.id && gist.id.length) {
                if (gist.description.length) {
                    $titleHolder.textContent = gist.description;
                } else {
                    $titleHolder.textContent = 'Untitled document';
                }

                if (gist.comments > 0) {
                    document.querySelector('#comments').innerHTML = '<a target="_blank" href="https://gist.github.com/' + gistId + '#comments">' + gist.comments + ' comments</a>';
                }

                for (var n in gist.files) {
                    if (gist.files[n].language === 'Markdown') {
                        files.markdown.push(gist.files[n]);
                    }
                }

                if (files.markdown.length) {
                    var html = '';
                    var md = window.markdownit();

                    for (var i in files.markdown) {
                        html += md.render(files.markdown[i].content);
                        //html += marked(files.markdown[i].content);
                    }
                    $contentHolder.innerHTML = html;

                    var codeBlocks = document.querySelectorAll('pre');
                    for (var c in codeBlocks) {
                        try {
                            hljs.highlightBlock(codeBlocks[c]);
                        } catch(e) {}
                    }
                } else {
                    $contentHolder.textContent = 'No markdown files attached to gist ' + gistId;
                }
            }
        }
    }, function(error) {
        console.warn(error);
        hideLoadingIndicator();
        $titleHolder.textContent = 'Error fetching gist.'
    });
};

if (typeof gistId === 'undefined') {
    hideLoadingIndicator();
    $titleHolder.textContent = 'No/invalid gist id'
} else {
    getGist(gistId);
}
