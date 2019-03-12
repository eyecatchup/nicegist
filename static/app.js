(function(window) {
    var GithubApi = {
        xhr: null,
        apiBaseUrl: 'https://api.github.com',
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

// Since we can not access the iframe to get its scroll height (cross origin),
// we calculate the height by counting the lines in the embedded gist.
// Ugly, but works reliable.
var getIframeHeight = function(filename) {
    for (var n in files.others) {
        if (files.others[n].filename === filename) {
            var matches = files.others[n].content.match(/\n/g);
            if (matches && matches.length) {
                // 22px = line height in embedded gists (with .pibb extension)
                // 40px = embedded gists footer height
                // 3px = cumulated border height for embedded gists
                // 8px = body margin for embedded gists
                return ((matches.length + 1) * 22) + 40 + 3 + 8;
            }
        }
    }
    return false;
};

var ghapi = window.GithubApi,
    gistId = parseQueryString['id'],
    $titleHolder = document.querySelector('#titleHolder'),
    $contentHolder = document.querySelector('#content'),
	files = {
        markdown: [],
        text: [],
        others: []
    };

var loadGist = function(gistId) {
    ghapi.getGist(gistId, function(gist) {
        if (gist) {
            console.dir(gist);
            hideLoadingIndicator();

            if (gist.id && gist.id.length) {
                // use gist description as a document title / headline
                if (gist.description.length) {
                    $titleHolder.textContent = gist.description;
                    document.title = gist.description;
                } else {
                    $titleHolder.textContent = 'Untitled document';
                }

                // get all markdown files to be parsed
                for (var n in gist.files) {
                    if (gist.files[n].language === 'Markdown') {
                        files.markdown.push(gist.files[n]);
                    } else {
                        files.others.push(gist.files[n]);
                    }
                }

                // parse markdown files
                if (files.markdown.length) {
                    var html = '';
                    var md = window.markdownit({linkify: true});

                    for (var i in files.markdown) {
                        html += md.render(files.markdown[i].content);
                    }

                    // do we need to embed other gists?
                    var matches = html.match(/&lt;gist&gt;(.*?)&lt;\/gist&gt;/gi);
                    if (matches && matches.length) {
                        for (var x in matches) {
                            var filename = matches[x].replace('&lt;gist&gt;', '').replace('&lt;/gist&gt;', '');
                            var h = getIframeHeight(filename);
                            if (h !== false) {
                                html = html.replace(matches[x], '<iframe class="embedded-gist" style="height:' + h + 'px" src="https://gist.github.com/' + gistId + '.pibb?file=' + filename + '" scrolling="no"></iframe>');
                            }
                        }
                    }

                    // write gist content
                    $contentHolder.innerHTML = html;

                    // add link to gist comment section, if we have comments
                    if (gist.comments > 0) {
                        document.querySelector('#comments').innerHTML = '<a target="_blank" href="https://gist.github.com/' + gistId + '#comments">' + gist.comments + ' comments</a>';
                    }

                    // add syntax highlighting to code blocks
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
    loadGist(gistId);
}
