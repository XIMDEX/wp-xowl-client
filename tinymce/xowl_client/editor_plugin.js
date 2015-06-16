/**
 * plugin for tinymce and wordpress accessing xowl service
 */
(function($) {
    // clean contents before send to Xowl Service 
    var XowlService = function() {
        this.semantic = [];
    }
    XowlService.prototype.preClean = function() {
        var self = this;
        var $content = $('<div></div>').append($.parseHTML(this.getContent()));
        $('a', $content).each(function() {
            if (typeof $(this).attr("data-cke-suggestions") == 'string') {
                $(this).removeAttr("data-cke-suggestions");
                $(this).removeAttr("data-entity-position");
                $(this).removeAttr("data-cke-annotation");
                $(this).removeAttr("data-cke-type");
                $(this).removeClass("xowl-suggestion");
            } else {
                return;
            }
        });
        return $content.html();
    };
    XowlService.prototype.buildFromData = function(data) {
        var self = this;
        self.semantic = data.semantic;
        return data.text;
    };
    XowlService.prototype.getContent = function() {
        return tinymce.activeEditor.getContent();
    }
    XowlService.prototype.setContent = function(content) {
        tinymce.activeEditor.setContent(content);
    };
    XowlService.prototype.postReceive = function(content) {
        // returns string 
        var $content = $('<div></div>').append($.parseHTML(content));
        var count = 0;
        $('a.xowl-suggestion', $content).each(function() {
            $(this).attr('data-entity-position', count);
            $(this).attr('target', '_blank');
            $(this).attr('href', XowlClient.changeUrl($(this).attr('href')));
            count++;
        });
        tinymce.activeEditor.dom.loadCSS('../wp-content/plugins/wp-xowl-client/assets/css/styles.css');
        return $content.html();
    };
    XowlService.prototype.changeUrl = function(url) {
        var patt = /(..\.)?(dbpedia.org\/resource\/)/;
        var match = patt.exec(url);
        if (match) {
            var lang = (typeof match[1] === 'undefined') ? 'en.' : match[1];
            url = url.replace(match[0], lang + 'wikipedia.org/wiki/');
        }
        return url;
    };
    XowlService.prototype.changeUri = function( position, newValue ) {
        var self = this;

        var content = $('<div></div>').append($.parseHTML( self.getContent()  ));
        var element = $('a.xowl-suggestion[data-entity-position="' + position + '"]', content).eq(0);
        element.attr( 'href', newValue) ;
        self.setContent( content.html());
    };
   

    var XowlClient = new XowlService();
    // Register the buttons
    tinymce.create('tinymce.plugins.xowl_plugin', {
        init: function(ed) {
            var self = this;
            self.firstLoad = true;
            // listen click inside textarea
            ed.on('click', function(ev) {
                
                    console.log( ev ) ;

var entityPosition = ev.target.getAttribute('data-entity-position');
if (entityPosition > "" && ev.target.className === "xowl-suggestion" && typeof XowlClient.semantic[entityPosition] === 'object') {
    var bodyValues = [];
    var currentUrl = ev.target.getAttribute('href');
    $.each(XowlClient.semantic[entityPosition].entities, function(i, e) {
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
        console.log(e );
    });
    var listBox = new tinymce.ui.ListBox({
        name: 'selectedEntity',
        label: 'Select Entities',
        values: bodyValues,
        onselect: function(v) {
            currentUrl =  v.control.value() ;
            return true;
        }
    });
    listBox.value( currentUrl);
    // var currentValue = console.log(e ) ;
     tinymce.activeEditor.windowManager.open({
        elem: this,
        title: 'Select Entity Dialog',
        body: [listBox],
        buttons: [{
            text: 'Aceptar',
            onclick: function() {
                XowlClient.changeUri( entityPosition, currentUrl);
                                this.parent().fire('submit');

            }
        }, {
            text: 'Cancelar',
            onclick: function() {
                this.parent().fire('cancel');
            }
        }, {
            text: 'Remove',
            onclick: function() {
                self.xsa.removeEntity(entityPosition);
                this.parent().fire('cancel');
            }
        }],
        // rebuild content inside textarea
        onsubmit: function(ev) {
            console.log(ev);
        }
    });
}



            });
            // init xsa object
            ed.on('LoadContent', function() {});
            // Enhance your content
            ed.addButton('xowl_button', {
                title: 'Enhance your content',
                image: '../wp-content/plugins/wp-xowl-client/assets/imgs/enhance.png',
                onclick: function() {
                    // add loader effect
                    $loader = $("<div/>", {
                        "class": 'loader'
                    });
                    $("<img/>").attr('src', '../wp-content/plugins/wp-xowl-client/assets/imgs/loader.gif').appendTo($loader);
                    $('body').css("position", "relative").append($loader);
                    // make request and replace content according with response
                    // clean content before and after response
                    var content = tinymce.activeEditor.getContent();
                    $.post(xowlPlugin.xowl_endpoint, {
                        token: xowlPlugin.xowl_apikey,
                        content: XowlClient.preClean()
                    }).done(function(data) {
                        $loader.remove();
                        XowlClient.setContent(XowlClient.postReceive(XowlClient.buildFromData(data)));
                    }).fail(function() {
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
    // helper class to manage text and other data
    // maintains text and semantic nodes and serve data to editor
    function XowlSemanticAdapter() {
        this.semanticIndex = [];
        this.elementsData = [];
        this.semanticText = '';
        this.saveAttr = {
            'class': 1,
            'href': 1,
            'target': 1
        };
    }
    // return html with restricted attributes
    XowlSemanticAdapter.prototype.modifyEntity = function(index, newHref) {
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
    XowlSemanticAdapter.prototype.removeEntity = function(position) {
        var oldContent = $('<div></div>').append($.parseHTML(tinymce.activeEditor.getContent()));
        var element = $('a.xowl-suggestion[data-entity-position="' + position + '"]', oldContent).eq(0);
        element.replaceWith(element.html());
        tinymce.activeEditor.setContent(oldContent.html());
    };
})(jQuery);