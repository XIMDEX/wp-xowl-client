<div class="xowl-settings">
    <h2>
        <img src="<?= plugins_url('../assets/imgs/logo-xowl.png', __FILE__); ?>" alt="XOWL Service" title="XOWL Service">
        <img class="xowl-flower" src="<?= plugins_url('../assets/imgs/h2-flower.png', __FILE__) ?>">
    </h2>

    <div class="xowl-content">
        <h3>Welcome to the Xowl client configuration page!</h3>
        <p>An <strong>API-KEY</strong> is required to enrich your content with semantic references to the main <i>Semantic Data Stores</i> linked by this service.</p>

        <!-- get-api-key -->
        <div class="xowl-get-api xowl-step">
            <div class="xowl-step-row">
                <div class="xowl-step-left">
                    <h4>Get your Api-Key</h4>
                    <p>If you don't have one at this moment, you can <strong>¡GET ONE FOR FREE!</strong>.
                        <br>
                        <small>It only takes a few seconds.</small></p>
                </div>

                <div class="xowl-step-right text-right">
                    <a class="button button-primary" target="_blank" href="<?= get_option('xowl_register') ?>">get an api-key</a>
                </div>
            </div>
        </div>
        <!-- end get-api-key -->

        <!-- form -->
        <form action="" method="POST">
            <!-- enter set endpoint -->
            <div class="xowl-endpoint xowl-step">
                <div class="xowl-step-row">
                    <div class="xowl-step-left">
                        <h4>Enter a Endpoint</h4>
                        <p>Type below the <strong>Service URL</strong> to point out your Wordpress. We already give you one by default.</p>
                    </div>

                    <div class="xowl-step-left">
                        <label for="active-api-endpoint">ENDPOINT:</label>
                        <input id="active-api-endpoint" type="text" name="xowl_endpoint" value="<?= get_option('xowl_endpoint') ?>" size="60"/>
                        <br/>
                        <input type="submit" value="Save Changes" class="button button-primary">
                        <!--<button type="submit" class="button button-primary">submit</button>-->
                    </div>
                </div>
            </div>
            <!-- end set endpoint -->

            <!-- enter set api key -->
            <div class="xowl-active-api xowl-step">
                <div class="xowl-step-row">
                    <div class="xowl-step-left">
                        <h4>Active Xowl Service</h4>
                        <p>After that, type the given <strong>API-KEY</strong> on the next input in order to validate it. <strong>Enjoy!</strong></p>
                    </div>

                    <div class="xowl-step-left">
                        <label for="active-api-token">API-KEY:</label>
                        <input id="active-api-token" type="text" name="xowl_apikey" value="<?= get_option('xowl_apikey') ?>"/>
                        <button id="xowl-check-token" type="button" class="button button-primary">Check token</button>
                        <span id="is-valid-token" class=""></span>
                    </div>
                </div>
            </div>
            <!-- end set api key -->
        </form>
        <!-- end form -->

        <!-- XOWL -->
        <div class="xowl-demo">
            <h3>Do you want to know more about Xowl Service?</h3>
            <p>Visit our <a href="http://demo.ximdex.com/xowl/" target="_blank">Demo Page</a> or the <a href="https://github.com/XIMDEX/wp-xowl-client" target="_blank">Githubs Proyect Page</a>.</p>
        </div>
        <!-- end XOWL -->
    </div>
</div>

<script src="http://code.jquery.com/jquery-1.11.3.min.js"></script>
<script src="<?= plugins_url('../assets/js/config-form.js', __FILE__); ?>"></script>
