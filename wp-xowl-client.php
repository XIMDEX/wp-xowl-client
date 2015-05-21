<?php
//WATCH OUT! Only for development.
error_reporting(E_ALL);
ini_set("display_errors", 1);
/**
* Plugin Name: Xowl client
* Plugin URI: http://demo.ximdex.com/xowl
* Description: An editor plugin for detect semantic entities on your content.
* Version: 1.0
* Author: OXE development team
* Author URI: http://www.ximdex.com/
**/

//Avoiding direct execution!
defined( 'ABSPATH' ) or die( 'Do not execute me naked, please!' );

define( 'XOWL_VERSION', '1.0.0' );
define( 'XOWL_MINIMUM_WP_VERSION', '3.2' );

define( 'XOWL_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'XOWL_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );

register_activation_hook( __FILE__, array( 'XowlClient', 'plugin_activation' ) );
register_deactivation_hook( __FILE__, array( 'XowlClient', 'plugin_deactivation' ) );

require_once( XOWL_PLUGIN_DIR . '/inc/XowlService.class.php' );
require_once( XOWL_PLUGIN_DIR . '/inc/XowlClient.class.php' );

add_action( 'init', array( 'XowlClient', 'init' ) );

/* Add the TinyMCE Xowl Plugin */
add_filter('mce_external_plugins', array( 'XowlClient','xowl_client_plugin'));

/* Plugin Name: My TinyMCE Buttons */
add_action( 'admin_init', array( 'XowlClient','xowl_tinymce_button'));
