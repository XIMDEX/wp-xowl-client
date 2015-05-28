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

    private static $initiated = false;
    private $service;

    public static function init() {
        if ( ! self::$initiated ) {

            add_option('XOWL_ENDPOINT','http://x8.ximdex.net/xowl/api/v1/enhancer');
            //saving API KEY on Wordpress db.
            if(get_option('XOWL_API_KEY')==false){
                add_option('XOWL_API_KEY','0000-00-0000');
            }
            $service = new XowlService(get_option('XOWL_ENDPOINT'));
            //self::init_hooks();
            self::load_xowl_styles();
        }
    }

    /**
     * <p>Callback function for 'xowl/enhance' endpoint</p>
     * <p>This function calls Ximdex Xowl endpoint to analyze and enhance the content</p>
     */
    function xowl_enhance_content(){
        $content = filter_input(INPUT_POST, 'content');
        echo $service->suggest($content);
    }

    private static function load_xowl_styles(){
        //wp_register_style('styles.css', XOWL_PLUGIN_DIR.'assets/css/styles.css', array(),false);
        wp_register_style('styles.css', '/wp-content/plugins/wp-xowl-client/assets/css/styles.css', array(),false);
        wp_enqueue_style('styles.css');
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

    /**
     * Add Settings link to plugins - code from GD Star Ratings
     */
    /*public static function add_settings_link($links, $file) {
        static $this_plugin;
        if (!$this_plugin) $this_plugin = plugin_basename(__FILE__);

        if ($file == $this_plugin){
            $settings_link = '<a href="admin.php?page=xowl-admin.php">'.__("Settings", "photosmash-galleries").'</a>';
            array_unshift($links, $settings_link);
        }
        return $links;
    }*/

    public static function admin_plugin_settings_link( $links ) {
        $settings_link = '<a href="'.esc_url( self::get_page_url() ).'">'.__('Settings', 'xowl').'</a>';
        array_unshift( $links, $settings_link );
        return $links;
    }

    public static function get_page_url( $page = 'config' ) {
        $args = array( 'page' => 'xowl-config' );
        $url = add_query_arg( $args, admin_url( 'options-general.php' ) );
        return $url;
    }

    public static function admin_menu() {
            self::load_menu();
    }

    public static function load_menu() {
        if ( class_exists( 'Jetpack' ) )
            $hook = add_submenu_page( 'jetpack', __( 'Akismet2' , 'akismet'), __( 'Akismet5' , 'akismet'), 'manage_options', 'akismet-key-config', array( 'Akismet_Admin', 'display_page' ) );
        else
            $hook = add_options_page('Xowl Configuration', 'Xowl client', 'manage_options', 'xowl-config', array( 'XowlClient', 'display_page' ) );

        if ( version_compare( $GLOBALS['wp_version'], '3.3', '>=' ) ) {
            add_action( "load-$hook", array( 'XowlClient', 'admin_help' ) );
        }
    }

    public static function display_page() {
        echo '<div class="wrap"><h2>Xowl Service</h2></div>';
        echo '<p>Welcome to the Xowl client configuration page. An API-KEY is required to enrich your content with semantic references to the main Semantic Data Stores linked by this service.</p>
                <p>If you don\'t have one at this moment, please, follow <a href="" target="_blank">this link</a> and ¡get one for free!. It only takes a few seconds.</p>
                <p>After that, type the given API-KEY on the next input in order to validate it. Enjoy!</p>';
        echo '<div class="activate-highlight activate-option">
	<div class="option-description" style="width:75%;">
		<strong class="small-heading">API-KEY</strong>
    </div>
<form name="akismet_activate" id="akismet_activate" action="CHECK_TOKEN" method="post" class="right" target="_blank">
    <input type="hidden" name="passback_url" value="<?php echo esc_attr( XowlClient::get_page_url() ); ?>"/>
    <!--<input type="hidden" name="user_id" value="<?php echo $akismet_user->ID;?>"/>-->
    <input type="text" name="API-token"/>
    <input type="submit" class="button button-primary" value="Check token"/>
</form>
</div>';
    }

    public static function admin_help() {
        echo "PEPE";
    }
}


