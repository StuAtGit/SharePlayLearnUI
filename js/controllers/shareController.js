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
                    $itemService.getItem($scope.user_info.access_token, modalItem.itemLocation, "base64").then(
                        function (itemResponse) {
                            $scope.modalImage.imageData = itemResponse.response.data;
                            $scope.modalImage.altText = modalItem.attr.altText;
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
    '$location', '$anchorScroll', '$user','$imageModal',
    function( $scope, $http, $routeParams, $location, $anchorScroll, $user, $imageModal, webSocket ) {

        $scope.sendHubCommand = function() {
            console.log("Sending command: " + $scope.hub.command + " to your hub. User: " + $scope.hub.user);
            //var hubSocket = webSocket("wss://shareplaylearn.com");
            //TODO: doesn't look like angular-websocket is really the way to go, since we need mqtt over websockets.
            //TODO: so figure out how to integrate this into our angular app: https://www.eclipse.org/paho/clients/js/

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