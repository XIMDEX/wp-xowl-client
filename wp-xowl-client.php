<?php

/**
 * Plugin Name: Xowl client
 * Plugin URI: http://demo.ximdex.com/xowl
 * Description: An editor plugin for detect semantic entities on your content.
 * Version: 1.0
 * Author: OXE development team
 * Author URI: http://www.ximdex.com/
 * */
/* ------------------------------------ */
//WATCH OUT! Only for development.
error_reporting(E_ALL);
ini_set("display_errors", 1);
/* ------------------------------------ */


//Constants definition
defined('ABSPATH') or die('Do not execute me naked, please!'); //Avoiding direct execution!
define('XOWL_VERSION', '1.0.0');
define('XOWL_MINIMUM_WP_VERSION', '3.2');
define('XOWL_PLUGIN_URL', plugin_dir_url(__FILE__));
define('XOWL_PLUGIN_DIR', plugin_dir_path(__FILE__));

require_once( XOWL_PLUGIN_DIR . '/inc/XowlService.class.php' );
require_once( XOWL_PLUGIN_DIR . '/inc/XowlClient.class.php' );

register_activation_hook(__FILE__, array('XowlClient', 'plugin_activation'));
register_deactivation_hook(__FILE__, array('XowlClient', 'plugin_deactivation'));

add_option('xowl_register', 'http://x8.ximdex.net/register/signup', '', 'yes');
add_option('xowl_endpoint', 'http://x8.ximdex.net/api/v1', '', 'yes');
//add_action('wp_ajax_xowl_enhance', 'xowl_enhance_process');



/* Activate the main stuff of the plugin */
add_action('init', array('XowlClient', 'init'));
//Adding settings menu
add_action('admin_menu', array('XowlClient', 'admin_menu'), 5);
/* Add the TinyMCE Xowl Plugin */
add_filter('mce_external_plugins', array('XowlClient', 'xowl_client_plugin'));

//add_filter('plugin_action_links', array('XowlClient','add_settings_link'), 10, 2 );
/* Plugin Name: My TinyMCE Buttons */
add_action('admin_init', array('XowlClient', 'xowl_tinymce_button'));

//Links
add_filter('plugin_action_links_' . plugin_basename(plugin_dir_path(__FILE__) . 'wp-xowl-client.php'), array('XowlClient', 'admin_plugin_settings_link'), 10, 2);

//add_filter( 'plugin_action_links_'.plugin_basename( plugin_dir_path( __FILE__ ) . 'akismet.php'), array( 'Akismet_Admin', 'admin_plugin_settings_link' ) );

/* function my_plugin_action_links( $links ) {
  $links[] = '<a href="'. esc_url( get_admin_url(null, 'options-general.php?page=xowl-admin.php') ) .'">Settings</a>';
  return $links;
  } */

//TODO: parse Xowl response.
function xowl_st($atts, $content) {
    $a = shortcode_atts(array(
        'entity' => '',
            ), $atts);

    return "<a href=\"" . $a['entity'] . "\">" . $content . "</a>";
}

add_shortcode('xowl', 'xowl_st');

