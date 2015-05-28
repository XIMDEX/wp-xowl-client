/**
 * Created by javi on 21/05/15.
 */
(function($) {
    var fillSuggestionsField, openXowlDialog, processSemantic, removeSuggestion, replaceXowlAnnotations;
    /* Register the buttons */
    tinymce.create('tinymce.plugins.XowlButton', {
        init : function(ed, url) {
            /**
             * Enhance your content
             */
            ed.addButton( 'button_eek', {
                title : 'Enhance your content',
                //TODO: Search for a better Xowl icon
                image : '../wp-content/plugins/wp-xowl-client/assets/imgs/enhance.png',
                onclick : function() {
                    //ed.selection.getContent();
                    //alert(tinyMCE.activeEditor.getContent());
                    $loader = $("<div/>", {
                        "class": 'loader'
                    });
                    $("<img/>").attr('src', './../wp-content/plugins/wp-xowl-client/assets/imgs/loader.gif').appendTo($loader);
                    $('body').css("position", "relative").append($loader);
                    $.ajax({
                        type: 'POST',
                        dataType: "json",
                        url: 'http://x8.ximdex.net/xowl/api/v1/enhancer',
                        data: {
                            content: tinyMCE.activeEditor.getContent()
                        }
                    }).done(function(data) {
                        $loader.remove();
                        if (data && (data.text != null) && data.text.length > 0) {
                            alert(data);
                            tinyMCE.activeEditor.setContent(function() {
                                    this.insertHtml(replaceXowlAnnotations(data));
                                    //fillSuggestionsField();
                                    }
                            );
                        } else {
                            alert("ERROR#2: "+data.status + ": " + data.message);
                        }
                    }).fail(function() {
                        $loader.remove();
                        alert("Error retrieving content from Xowl Service");
                    });
                    //TODO: only replace the semantic links
                    //tinyMCE.activeEditor.setContent('') ;
                }
            });
        }
    });
    /* Start the buttons */
    tinymce.PluginManager.add( 'my_button_script', tinymce.plugins.XowlButton );
})(jQuery);