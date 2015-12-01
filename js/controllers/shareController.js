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

shareAppControllers.controller("ImageModalCtrl", ["$scope", "$imageModal","$user",
    function($scope, $imageModal, $user) {
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
        }
        $scope.modalImage = {};
        $scope.modalImage.imageData = "Hello!";
        $scope.modalImage.altText = "Nice Pic :)";
        this.closeModal = $imageModal.deactivate;
}]);

shareAppControllers.controller("ShareMyStuffCtrl", ['$scope', '$http','$routeParams',
    '$location', '$anchorScroll', '$user','$imageModal',
    function( $scope, $http, $routeParams, $location, $anchorScroll, $user, $imageModal ) {

        $scope.openImageModal = function( item ) {
            //TODO: set current Image item in user service, so modal service can retrieve and display
            //TODO: the correct image data above
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