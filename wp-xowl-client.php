<?php

/**
 * Plugin Name: Xowl client
 * Plugin URI: http://demo.ximdex.com/xowl
 * Description: An editor plugin for detect semantic entities on your content.
 * Version: 1.0
 * Author: OXE development team
 * Author URI: http://www.ximdex.com/
 * */
// Constants definition
defined('ABSPATH') or die('Do not execute me naked, please!'); //Avoiding direct execution!
define('XOWL_VERSION', '0.1');
define('XOWL_MINIMUM_WP_VERSION', '4.2');
define('XOWL_PLUGIN_URL', plugin_dir_url(__FILE__));
define('XOWL_PLUGIN_DIR', plugin_dir_path(__FILE__));

require_once( XOWL_PLUGIN_DIR . '/inc/XowlService.class.php' );
require_once( XOWL_PLUGIN_DIR . '/inc/XowlClient.class.php' );

register_activation_hook(__FILE__, array('XowlClient', 'plugin_activation'));
register_deactivation_hook(__FILE__, array('XowlClient', 'plugin_deactivation'));

add_option('xowl_register', 'http://x8.ximdex.net/register/signup', '', 'yes');
add_option('xowl_endpoint', 'http://x8.ximdex.net/api/v1', '', 'yes');

// Activate the main stuff of the plugin
add_action('init', array('XowlClient', 'init'));
// Adding settings menu
add_action('admin_menu', array('XowlClient', 'admin_menu'), 5);

// Add the TinyMCE Xowl Plugin
add_filter("mce_external_plugins", array('XowlClient', "xowl_register_tinymce_plugin"));
add_filter('mce_buttons', array('XowlClient', 'xowl_add_tinymce_button'));

// Pass variables from wordpress to tinymce
foreach (array('post.php', 'post-new.php') as $hook) {
    add_action("admin_head-$hook", 'my_admin_head');
}

function my_admin_head() {
    echo "<script type='text/javascript'>";
    echo "var xowlPlugin = {";
    echo "   'xowl_endpoint': '" . get_option('xowl_endpoint') . "',";
    echo "   'xowl_apikey': '" . get_option('xowl_apikey') . "',";
    echo "   'xowl_css': '" . XOWL_PLUGIN_URL . '/assets/css/styles.css' . "',";
    echo "};";
    echo "</script>";
}

// Capture post content and filter link attributes
add_filter('wp_insert_post_data', 'filter_post_data', '99', 2);

function filter_post_data($data, $postarr) {
    require_once XOWL_PLUGIN_DIR . 'inc/simple_html_dom.php';
    error_log("FILTER post data before save...\n", 3, "/tmp/wp.log");

    // parse html and filter attributes
    $html = str_get_html($data['post_content']);
    if ($html) {
        foreach ($html->find('a') as $elem) {
            $elem->{'data-cke-annotation'} = null;
            $elem->{'data-cke-suggestions'} = null;
            $elem->{'data-cke-type'} = null;
            $elem->{'data-entity-position'} = null;
        }
    }

    // set post_content
    $data['post_content'] = $html . '';
    return $data;
}

// Links in config tab
add_filter('plugin_action_links_' . plugin_basename(plugin_dir_path(__FILE__) . 'wp-xowl-client.php'), array('XowlClient', 'admin_plugin_settings_link'), 10, 2);

// TODO: parse Xowl response.
//function xowl_st($atts, $content) {
//    $a = shortcode_atts(array(
//        'entity' => '',
//            ), $atts);
//
//    return "<a href=\"" . $a['entity'] . "\">" . $content . "</a>";
//}
//
//add_shortcode('xowl', 'xowl_st');

