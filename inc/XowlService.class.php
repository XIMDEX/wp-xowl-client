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
class XowlService {
    protected $endpoint;

    public function __construct($endpoint) {
        $this->setEndpoint($endpoint);
    }

    public function setEndpoint($endpoint) {
        if (filter_var($endpoint, FILTER_VALIDATE_URL) == FALSE) {
            throw new InvalidArgumentException($endpoint . " is not a valid URL");
        }
        $this->endpoint = $endpoint;
    }

    public function getEndpoint() {
        return $this->endpoint;
    }

    /**
     * <p>Query the server with the default response format (application/json)</p>
     * @param string $text
     * @return this
     */
    public function suggest($text) {
        return $this->query($text);
    }

    /**
     * <p>Send petition to stanbol server and returns the parsed response</p>
     * @param unknown_type $text
     * @return this. 
     */
    private function query($text) {
        $token = get_option('xowl_usertoken', '');
        $dataText = array(
            'token' => $token,
            'content' => $text
        );

        $json = $this->doRequest('POST', $dataText);
        return $this->parseData($json);
    }

    /**
     * <p>Performs the real request</p>
     * @param string $method The HTTP method
     * @param string $data The data to be enhanced
     * @return StdClass An Object containing the response (code, data, etc)
     */
    private function doRequest($method, $data = NULL) {
        $content = http_build_query($data);
        $options = array(
            'headers' => array(),
            'method' => $method,
            'data' => $content
        );
        $response = wp_remote_request($this->endpoint, $options);
        return $response;
    }

    /**
     *
     * <p>Parse response data from stanbol server. JSON Format default.</p>
     * @param string|json $json The data in JSON format to be parsed
     * @return an array containing the mentions of the text and their related entities
     */
    private function parseData($json) {
        return $json->data;
    }
}

