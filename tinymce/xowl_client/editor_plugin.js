/**
 * Created by OXE Development Team on 21/05/15.
 */
(function() {
    /* Register the buttons */
    tinymce.create('tinymce.plugins.XowlButton', {
        init : function(ed, url) {
            /**
             * Inserts shortcode content
             */
            ed.addButton( 'button_eek', {
                title : 'Enhance content',
                //TODO: Search for a better Xowl icon
                image : '../wp-content/plugins/wp-xowl-client/assets/imgs/enhance.png',
                onclick : function() {
                    //ed.selection.getContent();
                    //alert(tinyMCE.activeEditor.getContent());
                    $loader = jQuery("<div/>", {
                        "class": 'loader'
                    });
                    jQuery("<img/>").attr('src', './../wp-content/plugins/wp-xowl-client/assets/imgs/loader.gif').appendTo($loader);
                    jQuery('body').css("position", "relative").append($loader);
                    jQuery.ajax({
                        type: 'POST',
                        dataType: "json",
                        url: 'http://x8.ximdex.net:9090/enhancer',
                        data: {
                            content: tinyMCE.activeEditor.getContent()
                        }
                    }).done(function(data) {
                        $loader.remove();
                        if (data && (data.text != null) && data.text.length > 0) {
                            alert(data);
                            //CKEDITOR.xowl['lastResponse'] = data;
                            //editor.setData('', function() {
                                //this.insertHtml(replaceXowlAnnotations(data));
                                //fillSuggestionsField();
                            //});
                        } else {
                            alert(data.status + ": " + data.message);
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
})();