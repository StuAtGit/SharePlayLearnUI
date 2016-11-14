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

shareAppControllers.controller("ShareIntroCtrl", ['$scope', '$http',
    function( $scope, $http ) {
        //checkLoginStatus($scope, document);
    }
]);

shareAppControllers.factory("$imageModal", function(btfModal) {
   return btfModal({
       controller: "ImageModalCtrl",
       controllerAs: "modal",
       templateUrl: "templates/image-modal.html"
   });
});

shareAppControllers.controller("ImageModalCtrl", ["$scope", "$imageModal","$user","$itemService",
    function($scope, $imageModal, $user, $itemService) {

        /**
         * we don't want this happening until the appropriate item is set in the user service
         */
        $scope.modalImage = {};
        if ($user.getCurrentUser() !== undefined) {
            $user.getCurrentUser().then(
                function success(data) {
                    $scope.user_info = data;
                    setCurrentUser($scope.user_info.user_name, document);
                    var modalItem = $user.getModalItem();
                    $scope.modalImage.altText = "Loading..";
                    
                    $itemService.getItem($scope.user_info.access_token, modalItem.preferredLocation.fullPath, "base64").then(
                        function (itemResponse) {
                            $scope.modalImage.imageData = itemResponse.response.data;
                            $scope.modalImage.altText = modalItem.attr.altText;
                            $scope.modalItem = modalItem;
                        },
                        function (errMsg) {
                            $scope.modalImage.altText = "Failed to load image, " + modalItem.attr.altText + ", " + errMsg;
                        }
                    );
                },
                function error(msg) {
                    $user.logout();
                    logout($scope, document);
                }
            );
        }

        this.closeModal = $imageModal.deactivate;
}]);

shareAppControllers.controller("ShareMyStuffCtrl", ['$scope', '$http','$routeParams',
    '$location', '$anchorScroll', '$user','$imageModal', 'FileUploader',
    function( $scope, $http, $routeParams, $location, $anchorScroll, $user, $imageModal, FileUploader ) {
        $scope.uploader = new FileUploader();
        //TODO: maybe I should be using HTML5 at this point? http://jsfiddle.net/f8Hee/1/ ?

        $scope.sendHubCommand = function() {
            console.log("Sending command: " + $scope.hub.command + " to your hub. User: " + $scope.hub.user);
            //TODO: we may want to move the client out into a service
            //TODO: MQTT connect does take a bit, and usually takes two tries.
            //TODO: But that would mean integrating into our login
            var mqttClient = new Paho.MQTT.Client( "www.shareplaylearn.com", Number(8001), "shareplaylearn_webclient");

            var connectOptions = {};
            connectOptions.userName = $scope.hub.user;
            connectOptions.password = $scope.hub.password;
            connectOptions.cleanSession = true;
            connectOptions.useSSL = true;
            connectOptions.timeout = 60;
            connectOptions.onSuccess = function( resp ) {
                console.log("Connected to " + $scope.hub.user + "'s hub.");
                var commandMessage = new Paho.MQTT.Message( $scope.hub.command );
                commandMessage.destinationName = "lightswitch";
                commandMessage.qos = 1;
                mqttClient.send( commandMessage );
            };

            mqttClient.onConnectionLost = function( response ) {
                if( response.errorCode !== 0 ) {
                    console.log("Connection lost with error: " + response.errorMessage );
                }
                console.log("Connection to hub lost without error.");
            };

            mqttClient.onMessageDelivered = function( message ) {
                console.log("Message was delivered to: " + message.destinationName + ": " + JSON.stringify(message) );
                mqttClient.disconnect();
            };

            mqttClient.connect( connectOptions );
        };

        $scope.openImageModal = function( item ) {
            //TODO: set current Image item in user service, so modal service can retrieve and display
            //TODO: the correct image data above
            $user.setModalItem(item);
            $imageModal.activate();
        };

        $scope.gotoAnchorHash = function(anchorHash) {
            alert("Attempting to scroll to " + anchorHash);
            $location.hash(anchorHash);
            $anchorScroll();
        };

        //Angular can't deal with input type file models right now
        //so we'll need a more complex solution for the async upload
        $scope.submitUpload = function( file_upload, user_info ) {
            //$http.post("api/file/form")
        };

        if( "uploaded" in $routeParams ) {
            document.getElementById("file-uploaded").style.display = "block";
        } else if ( document.getElementById("file-uploaded") != null &&
            document.getElementById("file-uploaded") != undefined ) {
            document.getElementById("file-uploaded").style.display = "none";
        }

        if( $user.getCurrentUser() !== undefined ) {
            $scope.loggingIn = true;
            $user.getCurrentUser().then(
                function success( data ) {
                    $scope.user_info = data;
                    setCurrentUser($scope.user_info.user_name, document);
                    $scope.loggingIn = false;
                },
                function error( msg ) {
                    $scope.loggingIn = false;
                    $user.logout();
                    logout($scope,document);
                }
            );
        } else {
            $scope.loggingIn = false;
            logout($scope,document);
        }
    }
]);