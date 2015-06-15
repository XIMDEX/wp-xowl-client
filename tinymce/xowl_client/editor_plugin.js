/**
 * plugin for tinymce and wordpress accessing xowl service
 */
(function ($) {
    var fillSuggestionsField, openXowlDialog, processSemantic, removeSuggestion, replaceXowlAnnotations;
    // Register the buttons
    tinymce.create('tinymce.plugins.xowl_plugin', {
        init: function (ed) {
            var self = this;
            self.firstLoad = true;
            self.xsa = new XowlSemanticAdapter();

            // listen click inside textarea
            ed.on('click', function (ev) {
                tinymce.activeEditor.dom.loadCSS('../wp-content/plugins/wp-xowl-client/assets/css/styles.css');
                if (!self.xsa.ok || ev.originalTarget.className === "") {
                    return;
                }

                // extract attribute value
                var entityPosition = 0;
                $.each(ev.explicitOriginalTarget.parentNode.attributes, function (i, e) {
                    if (e.name === 'data-entity-position') {
                        entityPosition = e.nodeValue;
                        return false;
                    }
                });

                // build select box
                var si = self.xsa.semanticIndex[entityPosition];
                var bodyValues = [];
                $.each(self.xsa.elementsData[si].sem.entities, function (i, e) {
                    bodyValues.push({text: e["rdfs:label"].value + ' (' + e.uri + ')', value: e.uri});
                });

                tinymce.activeEditor.windowManager.open({
                    title: 'Select Entity Dialog',
                    body: [{
                            type: 'listbox',
                            name: 'selectedEntity',
                            label: 'Select Entities',
                            values: bodyValues
                        }],
                    // rebuild content inside textarea
                    onsubmit: function (sel) {
                        self.xsa.modifyEntity(entityPosition, sel.data.selectedEntity);
                        tinymce.activeEditor.setContent(self.xsa.textToEditor());
                    }
                });
            });

            // init xsa object
            ed.on('LoadContent', function () {
                self.firstLoad = true;
                self.xsa.buildFromData({semantic: [], text: tinymce.activeEditor.getContent()});
            });

            // Enhance your content
            ed.addButton('xowl_button', {
                title: 'Enhance your content',
                //TODO: Search for a better Xowl icon
                image: '../wp-content/plugins/wp-xowl-client/assets/imgs/enhance.png',
                onclick: function () {
                    // add loader effect
                    $loader = $("<div/>", {
                        "class": 'loader'
                    });
                    $("<img/>").attr('src', '../wp-content/plugins/wp-xowl-client/assets/imgs/loader.gif').appendTo($loader);
                    $('body').css("position", "relative").append($loader);

                    // make request and replace content according with response
                    // clean content before and after response
                    $.post(xowlPlugin.xowl_endpoint, {
                        token: xowlPlugin.xowl_apikey,
                        content: tinymce.activeEditor.getContent()
                    }).done(function (data) {
                        $loader.remove();
                        self.xsa = new XowlSemanticAdapter();
                        self.xsa.buildFromData(data);
                        tinymce.activeEditor.setContent(self.xsa.textToEditor());
                    }).fail(function () {
                        $loader.remove();
                        self.xsa = new XowlSemanticAdapter();
                        alert("Error retrieving content from Xowl Service");
                    });
                }
            });
        }
    });
    /* Start the buttons */
    tinymce.PluginManager.add('xowl_button', tinymce.plugins.xowl_plugin);

// ----------------------------------------------------------------------------

    // helper class to manage text and other data
    // maintains text and semantic nodes and serve data to editor
    function XowlSemanticAdapter() {
        this.semanticIndex = [];
        this.elementsData = [];
        this.semanticText = '';
        this.ok = false;
        this.saveAttr = {'class': 1, 'href': 1, 'target': 1};
    }

    // parse an anchor element and remove some attributes
    XowlSemanticAdapter.prototype.filterAnchorAttributes = function (text) {
        var self = this;
        var jq = $(text);
        var clone = $('<a>').text(jq.text());

        $.each(jq.get(0).attributes, function (i, attrib) {
            if (self.saveAttr[attrib.name]) {
                clone.attr(attrib.name, attrib.value);
            }
        });

        return clone;
    };

    // parse raw text
    XowlSemanticAdapter.prototype.parseText = function (text) {
        var self = this;
        var html = $(text);
        var htmlClone = $('<p>');
        var arrayText = [];

        html.contents().each(function (i, elem) {
            if (elem.nodeType === 3) {
                arrayText.push(elem.nodeValue);
            }
            else {
                var clone = self.filterAnchorAttributes(elem);
                arrayText.push(clone.get(0).outerHTML);
            }
        });

        htmlClone.html(arrayText.join(""));
        return htmlClone;
    };

    // parse server response and store in inner variables
    XowlSemanticAdapter.prototype.buildFromData = function (data) {
        var self = this;

        if (typeof data.semantic === 'undefined' || data.semantic.length === 0) {
            var parsed = self.parseText(data.text);
            self.semanticText = parsed.html();
            self.ok = false;
            return;
        }

        var changeHref = function (oldHref) {
            var patt = /(..\.)?(dbpedia.org\/resource\/)/;
            var match = patt.exec(oldHref);
            var lang = (typeof match[1] === 'undefined') ? 'en.' : match[1];
            return oldHref.replace(match[0], lang + 'wikipedia.org/wiki/');
        };

        var idx = 0;
        self.ok = true;
        var html = $.parseHTML(data.text);
        $.each(html[0].childNodes, function (i, elem) {
            if (elem.nodeType === 3) {
                self.elementsData.push({type: 3, elem: elem.nodeValue});
            }
            else {
                if (elem.attributes.getNamedItem("data-cke-suggestions")) {
                    var e1 = $(elem);
                    // add position to help manipulation
                    e1.attr("data-entity-position", idx);

                    // replace dbpedia link
                    var oldHref = e1.attr("href");
                    e1.attr("href", changeHref(oldHref));
                    e1.attr("target", '_blank');

                    if (typeof data.semantic[idx] !== 'undefined') {
                        // replace dbpedia link
                        $.each(data.semantic[idx].entities, function (i, elem) {
                            elem.uri = changeHref(elem.uri);
                        });
                        
                        self.semanticIndex.push(self.elementsData.length);
                        self.elementsData.push({type: 1, sem: data.semantic[idx], elem: e1.get(0)});
                    }
                    idx++;
                }
                else {
                    self.elementsData.push({type: 2, elem: elem.outerHTML});
                }
            }
        });
    };

    // return html with all attributes
    XowlSemanticAdapter.prototype.textToEditor = function () {
        var self = this;

        if (self.ok) {
            var newP = $("<p>");
            $.each(self.elementsData, function (i, obj) {
                newP.append(obj.elem);
            });
            self.semanticText = newP.html();
        }

        return self.semanticText;
    };

    // return html with restricted attributes
    XowlSemanticAdapter.prototype.modifyEntity = function (index, newHref) {
        var self = this;

        if (!self.ok) {
            return;
        }

        var idx = self.semanticIndex[index];
        var elem = self.elementsData[idx].elem;
        var jq = $(elem);
        jq.removeAttr("data-cke-suggestions");
        jq.attr("href", newHref);
        var wrap = $("<div>").append(jq);
        self.elementsData[idx].elem = wrap.html();
    };


})(jQuery);