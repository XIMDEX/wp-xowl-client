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
        if (!self::$initiated) {

            add_option('XOWL_ENDPOINT', 'http://x8.ximdex.net/xowl/api/v1/enhance');
            //saving API KEY on Wordpress db.
            if (get_option('XOWL_API_KEY') == false) {
                add_option('XOWL_API_KEY', '0000-00-0000');
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
    function xowl_enhance_content() {
        $content = filter_input(INPUT_POST, 'content');
        echo $service->suggest($content);
    }

    private static function load_xowl_styles() {
        //wp_register_style('styles.css', '/wp-content/plugins/wp-xowl-client/assets/css/styles.css', array(), false);
        //wp_enqueue_style('styles.css');
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

    public static function plugin_activation() {
        //error_log("Activando el plugin!");
    }

    public static function plugin_deactivation() {
        //error_log("Desactivando el plugin!");
    }

    //Esta llamada registra el plugin. Crearemos un archivo Javascript dentro de nuestra carpeta del tema.
    public static function xowl_register_tinymce_plugin($plugin_array) {
        $plugin_array['xowl_button'] = plugins_url('..', __FILE__) . '/tinymce/xowl_client/editor_plugin.js';
        return $plugin_array;
    }

    //Esta llamada añadirá el botón a la barra
    public static function xowl_add_tinymce_button($buttons) {
        //Añadimos el ID del botón al array
        $buttons[] = "xowl_button";
        return $buttons;
    }

    // ------------------------------------
//    // Load our plugin into TinyMCE
//    public static function xowl_client_pluginz() {
//        //Add any more plugins you want to load here
//        $plugins = array('xowl_client');
//        $plugins_array = array();
//
//        //Build the response - the key is the plugin name, value is the URL to the plugin JS
//        foreach ($plugins as $plugin) {
//            $plugins_array[$plugin] = plugins_url('../tinymce/', __FILE__) . $plugin . '/editor_plugin.js';
//        }
//
//        return $plugins_array;
//    }
//    public static function xowl_tinymce_button() {
//        if (current_user_can('edit_posts') && current_user_can('edit_pages')) {
//            if (get_user_option('rich_editing') == true) {
//                add_filter('mce_buttons', array('XowlClient', 'xowl_register_tinymce_button'));
//                add_filter('mce_external_plugins', array('XowlClient', 'xowl_add_tinymce_button'));
//            }
//        }
//    }
//    public static function xowl_register_tinymce_button($buttons) {
//        array_push($buttons, "button_eek", "button_green");
//        return $buttons;
//    }
//    public static function xowl_add_tinymce_button($plugin_array) {
//        $plugin_array['my_button_script'] = plugins_url('../assets/js/xowl_button.js', __FILE__);
//        return $plugin_array;
//    }
    // ------------------------------------

    /**
     * Add Settings link to plugins - code from GD Star Ratings
     */
    /* public static function add_settings_link($links, $file) {
      static $this_plugin;
      if (!$this_plugin) $this_plugin = plugin_basename(__FILE__);

      if ($file == $this_plugin){
      $settings_link = '<a href="admin.php?page=xowl-admin.php">'.__("Settings", "photosmash-galleries").'</a>';
      array_unshift($links, $settings_link);
      }
      return $links;
      } */

    //Links in config tab
    public static function admin_plugin_settings_link($links) {
        $settings_link = '<a href="' . esc_url(self::get_page_url()) . '">' . __('Settings', 'xowl') . '</a>';
        array_unshift($links, $settings_link);
        return $links;
    }

    private static function get_page_url($page = 'config') {
        $args = array('page' => 'xowl-config');
        $url = add_query_arg($args, admin_url('options-general.php'));
        return $url;
    }

    public static function admin_menu() {
        $hook = add_options_page('Xowl Configuration', 'Xowl client', 'manage_options', 'xowl-config', array('XowlClient', 'display_page'));
        add_action("load-$hook", array('XowlClient', 'admin_help'));
    }

    private static function updateVar($name) {
        if (!empty($_POST[$name]) && get_option($name) != $_POST[$name]) {
            update_option($name, $_POST[$name]);
        }
    }

    public static function display_page() {
        self::updateVar('xowl_endpoint');
        self::updateVar('xowl_apikey');
        require_once('xowl-config.php');
    }

    public static function admin_help() {
        
    }

}
