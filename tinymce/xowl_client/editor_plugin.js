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
                image : '../wp-includes/images/spinner.gif',
                onclick : function() {
                    ed.selection.getContent();
                    alert(tinyMCE.activeEditor.getContent());
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
                var selected_text = ed.selection.getContent();
                var return_text = '';
                return_text = '<h1>' + selected_text + '</h1>';
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

