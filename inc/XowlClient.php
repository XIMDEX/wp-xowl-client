<?php

/**
 *  \details © 2015  Open Ximdex Evolution SL [http://www.ximdex.org]
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
 * @author Ximdex DevTeam <dev@ximdex.com>
 * @version $Revision$
 */
class XowlClient
{

    private static $initiated = false;

    public static function init()
    {

    }

    /**
     * <p>Callback function for 'xowl/enhance' endpoint</p>
     * <p>This function calls Ximdex Xowl endpoint to analyze and enhance the content</p>
     */
    function xowl_enhance_content()
    {
        $content = filter_input(INPUT_POST, 'content');
        echo $service->suggest($content);
    }


    private static function init_hooks()
    {
    }

    public static function plugin_activation()
    {
        add_option('xowl_endpoint', 'http://xowl.ximdex.net/api/v1/enhance', true);
        add_option('xowl_apikey', '', true);
        add_option('xowl_register', 'http://xowl.ximdex.net/register/signup', '', true);
    }

    public static function plugin_deactivation()
    {
    }

    public static function xowl_register_tinymce_plugin($plugin_array)
    {


        $plugin_array['xowl_button'] =  XowlClient::urlTo(  '/tinymce/xowl_client/editor_plugin.js' ) ;
        return $plugin_array;
    }

    //Adding the new button to the Tiny's toolbar
    public static function xowl_add_tinymce_button($buttons)
    {
        $buttons[] = "xowl_button";
        return $buttons;
    }

    //Links in config tab
    public static function admin_plugin_settings_link($links)
    {
        $settings_link = '<a href="' . esc_url(self::get_page_url()) . '">' . __('Settings', 'xowl') . '</a>';
        array_unshift($links, $settings_link);
        return $links;
    }

    private static function get_page_url($page = 'config')
    {
        $args = array(
            'page' => 'xowl-config'
        );
        $url = add_query_arg($args, admin_url('options-general.php'));
        return $url;
    }

    public static function admin_menu()
    {
        $hook = add_options_page('Xowl Configuration', 'Xowl Service', 'manage_options', 'xowl-config', array(
            'XowlClient',
            'display_page'
        ));
        add_action("load-$hook", array(
            'XowlClient',
            'admin_help'
        ));
    }

    private static function updateVar($name)
    {
        if (!empty($_POST[$name]) && get_option($name) != $_POST[$name]) {
            update_option($name, trim($_POST[$name]));
        }
    }

    public static function display_page()
    {
        wp_enqueue_style('xowl-admin-css',  XowlClient::urlTo(  'assets/css/styles.css' ) , "",XOWL_VERSION, "screen"  );
        wp_enqueue_script('xowl-admin-js',  XowlClient::urlTo(  'assets/js/config-form.js' ) , array( "jquery") , XOWL_VERSION );
        self::updateVar('xowl_endpoint');
        self::updateVar('xowl_apikey');
        require_once('xowl-config.php');
    }
    public static function urlTo( $route  = '' ) {
        return XOWL_PLUGIN_URL . $route ;
    }
    public static function admin_help()
    {
    }
}
