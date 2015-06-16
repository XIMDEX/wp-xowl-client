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
                    var content = tinymce.activeEditor.getContent() ;

                    $.post(xowlPlugin.xowl_endpoint, {
                        token: xowlPlugin.xowl_apikey,
                        content: self.xsa.preClean( tinymce.activeEditor.getContent() )
                    }).done(function (data) {
                        $loader.remove();
                        self.xsa = new XowlSemanticAdapter();
                        tinymce.activeEditor.setContent( self.xsa.postReceive( self.xsa.buildFromData(data) )  );
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
        self.semantic = data.semantic;
        return data.text ; 
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

        var oldContent = $('<div></div>').append(  $.parseHTML( tinymce.activeEditor.getContent() ) );

        var element = $('a.xowl-suggestion[data-entity-position="' + position + '"]', oldContent).eq(0);
        element.replaceWith(element.html());
        tinymce.activeEditor.setContent(oldContent.html());
    };


     XowlSemanticAdapter.prototype.preClean = function (content ) {
        // returns string 
         var $content = $('<div></div>').append(  $.parseHTML( content) );

        $('a', $content).each( function() {
            if ( typeof $(this).attr( "data-cke-suggestions") == 'string' ) {

                $(this).removeAttr("data-cke-suggestions" );
                $(this).removeAttr("data-entity-position" );
                $(this).removeAttr("data-cke-annotation" );
                $(this).removeAttr("data-cke-type" );
                $(this).removeClass("xowl-suggestion" );
            }  else {
                return ;
            }

        });
     
        return $content.html(); 

     } ;


     XowlSemanticAdapter.prototype.postReceive = function (content ) {
        // returns string 
         var $content = $('<div></div>').append(  $.parseHTML( content) );

        var count = 0 ; 

                var changeHref = function (oldHref) {
            var patt = /(..\.)?(dbpedia.org\/resource\/)/;
            var match = patt.exec(oldHref);
            if (match) {
                var lang = (typeof match[1] === 'undefined') ? 'en.' : match[1];
                return oldHref.replace(match[0], lang + 'wikipedia.org/wiki/');
            }
            return oldHref;
        };


        $( 'a.xowl-suggestion', $content ).each( function() {
                $(this).attr('data-entity-position', count );
                $(this).attr('target', '_blank');
              //   $(this).attr( 'href', changeHref( $(this).attr( 'href')));
                count++ ;


        });





 


      
        return $content.html(); 

     } ;




})(jQuery);