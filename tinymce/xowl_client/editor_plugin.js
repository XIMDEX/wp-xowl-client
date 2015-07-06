/**
 * plugin for tinymce and wordpress accessing xowl service
 */
 (function ($) {
    var SELECTED_ENTITY_CLASS = 'data-xowl-selected';
    // clean contents before send to Xowl Service 
    var XowlService = function () {
        this.semantic = [];
    }
    XowlService.prototype.preClean = function () {
        var self = this;
        var $content = $('<div></div>').append($.parseHTML(this.getContent()));
        $('a.xowl-suggestion', $content).each(function () {
            $(this).removeAttr(SELECTED_ENTITY_CLASS);
            $(this).removeAttr("data-cke-suggestions");
            $(this).removeAttr("data-entity-position");
            $(this).removeAttr("data-cke-annotation");
            $(this).removeAttr("data-cke-type");
            $(this).removeClass("xowl-suggestion");
        });
        return $content.html();
    };
    XowlService.prototype.buildFromData = function (data) {
        var self = this;
        self.semantic = data.semantic;
        return data.text;
    };
    XowlService.prototype.getContent = function () {
        return tinymce.activeEditor.getContent();
    }
    XowlService.prototype.setContent = function (content) {
        tinymce.activeEditor.setContent(content);
    };
    XowlService.prototype.postReceive = function (content) {
        // returns string 
        var $content = $('<div></div>').append($.parseHTML(content));
        var count = 0;
        $('a.xowl-suggestion', $content).each(function () {
            $(this).attr('data-entity-position', count);
            $(this).attr('target', '_blank');
            $(this).attr('href', XowlClient.changeUrl($(this).attr('href')));
            if ($(this).attr("data-cke-suggestions") == 1) {
                $(this).removeAttr("data-cke-suggestions");
            }
            count++;
        });
        tinymce.activeEditor.dom.loadCSS(xowlPlugin.xowl_plugin_url + 'assets/css/styles.css');
        return $content.html();
    };
    XowlService.prototype.changeUrl = function (url) {
        var patt = /(..\.)?(dbpedia.org\/resource\/)/;
        var match = patt.exec(url);
        if (match) {
            var lang = (typeof match[1] === 'undefined') ? 'en.' : match[1];
            url = url.replace(match[0], lang + 'wikipedia.org/wiki/');
        }
        return url;
    };
    XowlService.prototype.removeEntity = function (position) {
        var self = this;
        var content = $('<div></div>').append($.parseHTML(self.getContent()));
        var element = $('a.xowl-suggestion[data-entity-position="' + position + '"]', content).eq(0);
        element.replaceWith(element.html());
        tinymce.activeEditor.setContent(content.html());
    };
    XowlService.prototype.changeUri = function (position, newValue) {
        var self = this;
        var content = $('<div></div>').append($.parseHTML(self.getContent()));
        var element = $('a.xowl-suggestion[data-entity-position="' + position + '"]', content).eq(0);
        element.attr('href', newValue);
        self.setContent(content.html());
    };
    XowlService.prototype.setSelected = function (position) {
        var self = this;
        var content = $('<div></div>').append($.parseHTML(self.getContent()));
        var element = $('a.xowl-suggestion[data-entity-position="' + position + '"]', content).eq(0);
        element.attr(SELECTED_ENTITY_CLASS, '1');
        self.setContent(content.html());
    };
    var XowlClient = new XowlService();
    // Register the buttons
    tinymce.create('tinymce.plugins.xowl_plugin', {
        init: function (ed) {
            var self = this;
            self.firstLoad = true;
            // listen click inside textarea
            ed.on('click', function (ev) {
                var entityPosition = ev.target.getAttribute('data-entity-position');
                if (entityPosition > "" && ev.target.className === "xowl-suggestion" && typeof XowlClient.semantic[entityPosition] === 'object') {
                    var bodyValues = [];
                    var currentUrl = ev.target.getAttribute('href');
                    $.each(XowlClient.semantic[entityPosition].entities, function (i, e) {
                        var label = "";
                        if (typeof e["rdfs:label"].value === "string") {
                            label = e["rdfs:label"].value;
                        } else {
                            label = e["rdfs:label"][0].value;
                        }
                        bodyValues.push({
                            text: label + ' (' + XowlClient.changeUrl(e.uri) + ')',
                            value: XowlClient.changeUrl(e.uri)
                        });
                    });
                    var listBox = new tinymce.ui.ListBox({
                        name: 'selectedEntity',
                        label: 'Select Entities',
                        values: bodyValues,
                        onselect: function (v) {
                            currentUrl = v.control.value();
                            return true;
                        }
                    });
                    listBox.value(currentUrl);
                    tinymce.activeEditor.windowManager.open({
                        elem: this,
                        title: 'Select Entity Dialog',
                        body: [listBox],
                        buttons: [{
                            text: 'Aceptar',
                            onclick: function () {
                                XowlClient.changeUri(entityPosition, currentUrl);
                                this.parent().fire('submit');
                            }
                        }, {
                            text: 'Cancelar',
                            onclick: function () {
                                this.parent().fire('cancel');
                            }
                        }, {
                            text: 'Remove',
                            onclick: function () {
                                XowlClient.removeEntity(entityPosition);
                                this.parent().fire('cancel');
                            }
                        }],
                        // rebuild content inside textarea
                        onsubmit: function () {
                            XowlClient.setSelected(entityPosition);
                        }
                    });
}
});
            // init xsa object
            ed.on('LoadContent', function () {
            });

            // Enhance your content
            ed.addButton('xowl_button', {
                title: 'Enhance your content',
                image: xowlPlugin.xowl_plugin_url + 'assets/imgs/enhance.png',
                onclick: function () {
                    // add loader effect
                    $loader = $("<div/>", {
                        "class": 'loader'
                    });
                    $loader.css({
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        "background-color": "black",
                        opacity: 0.5,
                        "z-index": 1000
                    });
                    $("<img/>").attr('src', xowlPlugin.xowl_plugin_url + 'assets/imgs/loader.gif').css(
                    {
                        position: "fixed",
                        left: "50%",
                        top: "50%",
                        width: "100px",
                        "margin-top":"-50px",
                        "margin-left":"-50px"
                    }).appendTo($loader);
                    $('body').css("position", "relative").append($loader);
                    // make request and replace content according with response
                    // clean content before and after response
                    var content = tinymce.activeEditor.getContent();
                    $.post(xowlPlugin.xowl_endpoint, {
                        token: xowlPlugin.xowl_apikey,
                        content: XowlClient.preClean()
                    }).done(function (data) {
                        $loader.remove();
                        XowlClient.setContent(XowlClient.postReceive(XowlClient.buildFromData(data)));
                    }).fail(function () {
                        $loader.remove();
                        alert("Error retrieving content from Xowl Service.\nDo you have a valid API-KEY?");
                    });
                }
            });
}
});
/* Start the buttons */
tinymce.PluginManager.add('xowl_button', tinymce.plugins.xowl_plugin);
    // ----------------------------------------------------------------------------
    // return html with restricted attributes
})(jQuery);