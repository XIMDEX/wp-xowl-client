<?php

/**
 * Plugin Name: Xowl Service
 * Plugin URI: http://demo.ximdex.com/xowl
 * Description: An editor plugin for detect semantic entities on your content.
 * Version: 0.1
 * Author: OXE development team
 * Author URI: http://www.ximdex.com/
 * Text Domain: xowl-client
 *
 */

// Constants definition
defined('ABSPATH') or die('Do not execute me naked, please!');
//Avoiding direct execution!
define('XOWL_VERSION', '0.1');
define('XOWL_MINIMUM_WP_VERSION', '4.2');
define('XOWL_PLUGIN_URL', plugin_dir_url(__FILE__));
define('XOWL_PLUGIN_DIR', plugin_dir_path(__FILE__));

require_once(XOWL_PLUGIN_DIR . '/inc/XowlClient.php');

Xowl_Plugin::init() ;


class Xowl_Plugin
{

    static public function post_head()
    {
        $conf = array(
            'xowl_endpoint' => get_option('xowl_endpoint'),
            'xowl_apikey' => get_option('xowl_apikey'),
            'xowl_plugin_url' => XowlClient::urlTo( ),
            'xowl_css' => XowlClient::urlTo(  'assets/css/styles.css' ),
        );
        $confJson = json_encode($conf);
        echo "<script type=\"text/javascript\">var xowlPlugin = {$confJson};</script>";

    }

    static public function filter_post_data($data, $postarr)
    {
        $changeFrom = array('/<a class=\\\"xowl-suggestion\\\" (.*) data-(.*)>/iUs');
        $data['post_content'] = preg_replace($changeFrom, '<a \1>', $data['post_content']);
        return $data;
    }

    static public function init()
    {
        register_activation_hook(__FILE__, array('XowlClient', 'plugin_activation'));
        register_deactivation_hook(__FILE__, array('XowlClient', 'plugin_deactivation'));

        // Activate the main stuff of the plugin
        add_action('init', array('XowlClient', 'init'));

        // Adding settings menu
        add_action('admin_menu', array('XowlClient', 'admin_menu'), 5);

        // Add the TinyMCE Xowl Plugin
        add_filter("mce_external_plugins", array('XowlClient', "xowl_register_tinymce_plugin"));
        add_filter('mce_buttons', array('XowlClient', 'xowl_add_tinymce_button'));

        // Pass variables from wordpress to tinymce
        foreach (array('post.php', 'post-new.php') as $hook) {
            add_action("admin_head-$hook", array('Xowl_Plugin' , 'post_head'));
        }
        // Capture post content and filter link attributes
        add_filter('wp_insert_post_data', array('Xowl_Plugin' , 'filter_post_data'), '99', 2);
        add_filter('plugin_action_links_' . plugin_basename(__FILE__), array('XowlClient', 'admin_plugin_settings_link'), 10, 2);
    }
}



