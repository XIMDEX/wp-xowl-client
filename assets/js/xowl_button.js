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
                image : '../wp-includes/images/spinner.gif',
                onclick : function() {
                    var content=ed.selection.getContent();
                    console.log(content);
                }
            });
            /**
             * Adds HTML tag to selected content
             */
            ed.addButton( 'button_green', {
                title : 'Add span',
                image : '../wp-includes/images/smilies/icon_mrgreen.gif',
                cmd: 'button_green_cmd'
            });
            ed.addCommand( 'button_green_cmd', function() {
                var content = ed.selection.getContent();
                //TODO: Calling to the Xowl service
                ed.execCommand('mceInsertContent', 0, return_text);
            });
        },
        createControl : function(n, cm) {
            return null;
        }
    });
    /* Start the buttons */
    tinymce.PluginManager.add( 'my_button_script', tinymce.plugins.XowlButton );
})();