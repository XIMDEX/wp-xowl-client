/**
 * Created by javi on 21/05/15.
 */
(function() {
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
                    alert(tinyMCE.activeEditor.getContent());
                }
            });
        }
    });
    /* Start the buttons */
    tinymce.PluginManager.add( 'my_button_script', tinymce.plugins.XowlButton );
})();