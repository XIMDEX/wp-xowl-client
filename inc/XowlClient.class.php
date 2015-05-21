<?php
/**
 *  \details © 2014  Open Ximdex Evolution SL [http://www.ximdex.org]
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published
 *  by the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  See the Affero GNU General Public License for more details.
 *  You should have received a copy of the Affero GNU General Public License
 *  version 3 along with Ximdex (see LICENSE file).
 *
 *  If not, visit http://gnu.org/licenses/agpl-3.0.html.
 *
 *  @author Ximdex DevTeam <dev@ximdex.com>
 *  @version $Revision$
 */

class XowlClient {
    const XOWL_ENDPOINT = 'http://demo.ximdex.com/xowl/api/';
    const XOWL_PORT = 9091;
    private static $initiated = false;

    public static function init() {
        if ( ! self::$initiated ) {
            $st = new XowlService(self::XOWL_ENDPOINT);

            //saving API KEY on Wordpress db.
            if(get_option('XOWL_API_KEY')==false){
                add_option('XOWL_API_KEY','0000-00-0000');
            }
            self::init_hooks();
        }
    }

    private static function init_hooks() {
        self::$initiated = true;
        //All the hooks and filters necessary
        /*
        $response=  wp_remote_get('http://demo.ximdex.com/xowl/v1/enhance');
        if(is_wp_error($response)){
         echo 'Error Found ( '.$response->get_error_message().' )';
        }
        else{
            $content=wp_remote_retrieve_response_message($response);
        }
        echo $content;
        */
    }

    public static function plugin_activation( ) {
        //error_log("Activando el plugin!");
    }

    public static function plugin_deactivation( ) {
        //error_log("Desactivando el plugin!");
    }

    // Load our plugin into TinyMCE
    public static function xowl_client_plugin() {
        //Add any more plugins you want to load here
        $plugins = array('xowl_client');
        $plugins_array = array();

        //Build the response - the key is the plugin name, value is the URL to the plugin JS
        foreach ($plugins as $plugin ) {
            $plugins_array[ $plugin ] = plugins_url('../tinymce/', __FILE__) . $plugin . '/editor_plugin.js';
        }

        return $plugins_array;
    }

    public static function xowl_tinymce_button () {
        if ( current_user_can( 'edit_posts' ) && current_user_can( 'edit_pages' ) ) {
            if (get_user_option( 'rich_editing' )==true) {
                add_filter( 'mce_buttons', array('XowlClient','xowl_register_tinymce_button' ));
                add_filter( 'mce_external_plugins', array('XowlClient','xowl_add_tinymce_button' ));
            }
        }
    }

    public static function xowl_register_tinymce_button( $buttons ) {
        array_push( $buttons, "button_eek", "button_green" );
        return $buttons;
    }

    public static function xowl_add_tinymce_button( $plugin_array ) {
        $plugin_array['my_button_script'] = plugins_url('../assets/js/xowl_button.js', __FILE__);
        return $plugin_array;
    }
}


