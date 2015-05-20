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

//Para evitar ejecucion directa del archivo
//defined( 'ABSPATH' ) or die( 'No script kiddies please!' );
define( 'XOWL_VERSION', '1.0.0' );
define( 'XOWL_MINIMUM_WP_VERSION', '3.2' );
//define( 'XOWL_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
//define( 'XOWL_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );

register_activation_hook( __FILE__, array( 'Xowl', 'plugin_activation' ) );
register_deactivation_hook( __FILE__, array( 'Xowl', 'plugin_deactivation' ) );

require_once( XOWL_PLUGIN_DIR . '/inc/XowlService.php' );
require_once( XOWL_PLUGIN_DIR . '/inc/Xowl.php' );

print_r(get_defined_constants(true));

$response=  wp_remote_get('http://demo.ximdex.com/xowl/v1/enhance');
if(is_wp_error($response)){
 echo 'Error Found ( '.$response->get_error_message().' )';
}
else{
	$content=wp_remote_retrieve_response_message($response);
}
echo $content;
?>
