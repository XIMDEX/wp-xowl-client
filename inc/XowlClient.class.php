<?php

class XowlClient {
     static function install() {
            // do not generate any output here
     }
}
register_activation_hook( __FILE__, array( 'XowlClient', 'install' ) );


