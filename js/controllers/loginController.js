/**
 * Copyright 2015-2016 Stuart Smith
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version. Or under the the Eclipse Public License v1.0
 * as published by the Eclipse Foundation or (per the licensee's choosing)
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * If you modify this Program, or any covered work, by linking or combining
 * it with the paho MQTT client library (or a modified version of that library),
 * containing parts covered by the terms of EPL,
 * the licensors of this Program grant you additional permission to convey the resulting work.
 */

shareAppControllers.controller("LogoutCtrl", ["$scope", "$user",
    function( $scope, $user ) {
        $user.logout();
        logout( $scope, document );
    }
]);

shareAppControllers.controller("LoginCtrl",["$scope", "$http", "$routeParams", "$user",
    function( $scope, $http, $routeParams, $user ) {
        $scope.credentials = {};

        if( $user.getCurrentUser() !== undefined ) {
            $user.getCurrentUser().then(
                function success( data ) {
                    $scope.user_info = data;
                    setCurrentUser($scope.user_info.user_name, document);
                },
                function error( msg ) {
                    logout($scope,document);
                }
            );
        } else {
            logout($scope,document);
        }

        $scope.submitLogin = function(credentials) {
            console.log("Submitting login with: " + JSON.stringify(credentials));
            var loginPromise = $user.loginUser(credentials);
            loginPromise.then(
                function( userInfo ) {
                    $scope.user_info = userInfo;
                    setCurrentUser($scope.user_info.user_name, document);
                    $user.getCurrentUser().then(
                        function success( data ) {
                            $scope.user_info = data;
                        },
                        function error( msg ) {
                            logout($scope,document);
                        }
                    );
                },
                function( error ) {
                    alert( "Login failed: " + error + " :(");
                }
            );
        };

        if( "client_state" in $routeParams &&
            "access_token" in $routeParams &&
            "expires_in" in $routeParams &&
            "id_token" in $routeParams ) {
            if( $routeParams["client_state"] === "insecure_test_token" ) {
                if( typeof $scope.user_info === "undefined" ) {
                    $scope.user_info = {};
                }
                $scope.user_info.access_token = $routeParams["access_token"];
                $scope.user_info.token_expiration = $routeParams["expires_in"];
                $scope.user_info.id_token = $routeParams["id_token"];
                window.sessionStorage.setItem("access_token", $scope.user_info.access_token);
                //might want to calculate expiration as soon as it gets back, so I can have it anchored to a time?
                //will need to be UTC, etc.
                window.sessionStorage.setItem("expires_in", $scope.user_info.token_expiration);
                /**
                 * Parse jwt in id_token to get user info
                 * Pulled in jwsjs library so I could do this...
                 * I have just added header, payload, signature to scope so I can print them in the logged in template..
                 * I vaguely recall that I may have already confirmed this? But adding it back in for debugging while I decode jwt payload.
                 * Soo.. just FYI: the payload will decode to the JSON with the info I need - the jsjws library will just verify
                 * the signature of the js passed.
                 * The access token (not the id_token) is what is used to authorize with google.
                 * If we talk https to the oauth endpoint (we need SSL for the site, then!), and the secret comes back OK,
                 * it should be secure-ish (secure, according to google).. so I suppose we can delay verification for a little bit???
                 * We may not even need all this info.. mebbe just use email.
                 */
                var id_token_elements = $scope.user_info.id_token.split('.');
                var header = base64urlDecode(id_token_elements[0]);
                var payload = JSON.parse(base64urlDecode(id_token_elements[1]));
                //do we need to escape this? Gibberish either way.. (coz binary sig)
                var signature = base64urlDecode(id_token_elements[2]);

                $scope.user_info.id_token_header = header;
                $scope.user_info.id_token_payload = payload;
                $scope.user_info.id_token_signature = signature;
                $scope.user_info.user_name = payload.email.split('@')[0];
                $scope.user_info.user_id = payload.sub;

                //window.sessionStorage.setItem("id_token", $scope.user_info.id_token);
                //window.sessionStorage.setItem("id_token_header", header);
                //window.sessionStorage.setItem("id_token_payload", payload);
                window.sessionStorage.setItem("user_id", payload.sub);
                window.sessionStorage.setItem("user_email", payload.email);
                window.sessionStorage.setItem("user_name",$scope.user_info.user_name)
                //window.sessionStorage.setItem("id_token_signature", signature);

                $user.getCurrentUser().then(
                    function success( data ) {
                        $scope.user_info = data;
                        setCurrentUser($scope.user_info.user_name, document);
                    },
                    function error( msg ) {
                        alert(msg);
                        logout($scope,document);
                    }
                );
            }
        }
    }
]);