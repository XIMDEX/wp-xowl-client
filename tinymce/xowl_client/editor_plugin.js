/**
 * plugin for tinymce and wordpress accessing xowl service
 */
(function ($) {
    // Register the buttons
    tinymce.create('tinymce.plugins.xowl_plugin', {
        init: function (ed) {
            var self = this;
            self.firstLoad = true;
            self.xsa = new XowlSemanticAdapter();

            // listen click inside textarea
            ed.on('click', function (ev) {
                tinymce.activeEditor.dom.loadCSS('../wp-content/plugins/wp-xowl-client/assets/css/styles.css');

                if (!ev.target || ev.target.className === "") {
                    return;
                }

                // build select box
                var entityPosition = ev.target.getAttribute('data-entity-position');
                var bodyValues = [];

                if (typeof self.xsa.semantic[entityPosition] === 'undefined') {
                    return;
                }

                $.each(self.xsa.semantic[entityPosition].entities, function (i, e) {
                    bodyValues.push({text: e["rdfs:label"].value + ' (' + e.uri + ')', value: e.uri});
                });

                var listBox = new tinymce.ui.ListBox({
                    name: 'selectedEntity',
                    label: 'Select Entities',
                    values: bodyValues
                });
                listBox.entityPosition = entityPosition;

                tinymce.activeEditor.windowManager.open({
                    elem: this,
                    title: 'Select Entity Dialog',
                    body: [listBox],
                    buttons: [
                        {
                            text: 'Aceptar',
                            onclick: function () {
                                this.parent().fire('submit', {entityPosition: entityPosition});
                            }
                        },
                        {
                            text: 'Cancelar',
                            onclick: function () {
                                this.parent().fire('cancel');
                            }
                        },
                        {
                            text: 'Remove',
                            onclick: function () {
                                self.xsa.removeEntity(entityPosition);
                                this.parent().fire('cancel');
                            }
                        }
                    ],
                    // rebuild content inside textarea
                    onsubmit: function (ev) {
//                        console.log('ev.selectedEntity', ev.entityPosition);
//                        self.xsa.removeEntity(entityPosition);
//                        tinymce.activeEditor.setContent(self.xsa.textToEditor());
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
                        alert("Error retrieving content from Xowl Service.\nDo you have a valid API-KEY?");
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
        this.saveAttr = {'class': 1, 'href': 1, 'target': 1};
    }

    // parse server response and store in inner variables
    XowlSemanticAdapter.prototype.buildFromData = function (data) {
        var self = this;
        var jq = $(data.text);
        var idx = 0;
        var changeHref = function (oldHref) {
            var patt = /(..\.)?(dbpedia.org\/resource\/)/;
            var match = patt.exec(oldHref);
            if (match) {
                var lang = (typeof match[1] === 'undefined') ? 'en.' : match[1];
                return oldHref.replace(match[0], lang + 'wikipedia.org/wiki/');
            }
            return oldHref;
        };

        $.each(jq.contents(), function (i, e) {
            if (typeof e.getAttribute === 'function' && e.getAttribute("data-cke-suggestions")) {
                e.setAttribute('data-entity-position', idx);
                e.setAttribute('target', '_blank');
                var oldHref = e.getAttribute('href');
                var newHref = changeHref(oldHref);
                e.setAttribute('href', newHref);
                idx++;
            }
        });
        self.elementsData = jq;
        self.semantic = data.semantic;
    };

    // return html with all attributes
    XowlSemanticAdapter.prototype.textToEditor = function () {
        var self = this;
        return self.elementsData.html();
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

    // return html with restricted attributes
    XowlSemanticAdapter.prototype.removeEntity = function (position) {
        var oldContent = $(tinymce.activeEditor.getContent());
        var element = $('a.xowl-suggestion[data-entity-position="' + position + '"]', oldContent).eq(0);
        element.replaceWith(element.html());
        tinymce.activeEditor.setContent(oldContent.html());
    };
})(jQuery);