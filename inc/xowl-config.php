        <form action="" method="POST">
<div class="xowl-settings">
    <h2>
        <img src="<?=plugins_url('../assets/imgs/logo-xowl.png', __FILE__); ?>" alt="XOWL Service" title="XOWL Service">
        
                        
        <img class="xowl-flower" src="<?=plugins_url('../assets/imgs/h2-flower.png', __FILE__) ?>">
        <input type="submit" value="<?= _e( 'Save all the changes') ?>" class="button button-primary" style="float: right;">


    </h2>

    <div class="xowl-content">
        <h3><?= _e( 'Welcome to the Xowl client configuration page!') ?></h3>
        <p>An <strong>API-KEY</strong> is required to enrich your content with semantic references to the main <i>Semantic Data Stores</i> linked by this service.</p>
    
        <!-- get-api-key -->
        <div class="xowl-get-api xowl-step">
            <div class="xowl-step-row">
                <div class="xowl-step-left">
                    <h4>Get your own Api-Key</h4>
                    <p>If you don't have one at this moment, you can <strong>get one for free!</strong>.
                        <br>
                        <small>Create your account. It only takes a few seconds.</small></p>
                </div>

                <div class="xowl-step-right text-right">
                    <a class="button button-primary" target="_blank" href="<?=get_option('xowl_register') ?>">get an api-key</a>
                </div>
            </div>
        </div>
        <!-- end get-api-key -->

        <!-- form -->
            <!-- enter set endpoint -->
            <div class="xowl-endpoint xowl-step">
                <div class="xowl-step-row">
                    <div class="xowl-step-left">
                        <h4>Activate your Xowl client</h4>
                        <p>Type below the given <strong>API-KEY</strong> on your Ximdex account in order to validate it.</p>
                    </div>

                    <div class="xowl-step-left">
                        <label for="active-api-token">API-KEY:</label>
                        <input id="active-api-token" type="text" name="xowl_apikey" value="<?=get_option('xowl_apikey') ?>"/>
                        <button id="xowl-check-token" type="button" class="button button-primary">Check token</button>
                        <span id="is-valid-token" class=""></span>
                    </div>
                </div>
            </div>
            <!-- end set endpoint -->

            <!-- enter set api key -->
            <div class="xowl-active-api xowl-step">
                <div class="xowl-step-row">
                    <div class="xowl-step-left">
                        <h4>Service endpoint</h4>
                        <p>Enter the <strong>Service URL</strong> to point out your WordPress. We already set one by default for you.</p>
                    </div>

                    <div class="xowl-step-left">
                        <label for="active-api-endpoint">ENDPOINT URL:</label>
                        <input id="active-api-endpoint" type="text" name="xowl_endpoint" value="<?=get_option('xowl_endpoint') ?>" size="60"/>
                        <br/>
                        <!--<button type="submit" class="button button-primary">submit</button>-->
                    </div>
                </div>
            </div>
            <!-- end set api key -->
        <!-- end form -->

        <!-- XOWL -->
        <div class="xowl-demo">
            <h3>Do you want to know more about Xowl Service?</h3>
            <p>Visit our <a href="http://demo.ximdex.com/xowl/" target="_blank">Demo Page</a> or the <a href="https://github.com/XIMDEX/wp-xowl-client" target="_blank">Github's plugin page</a>.</p>
        </div>
        <!-- end XOWL -->
    </div>
</div>
        </form>

 <script src="<?=plugins_url('../assets/js/config-form.js', __FILE__); ?>"></script>
