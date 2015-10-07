/**
 * Created by stu on 8/30/15.
 *
 * TODO: load user items asynchronously in this service -
 * compose this object into the user service & begin loading the filelist after login.
 */

var itemModule = angular.module( "userItemModule", ["ng"]);

var $itemService = itemModule.service( "$itemService", ["$http", "$q", function( $http, $q ) {

    this.itemListDeferred = $q.defer();

    this.setItemList = function( data, status, headers, config, statusText ) {
        if( status == 200 ) {
            this.itemList = data;
            this.itemListDeferred.resolve(this.itemList);
        } else if( status == 401 ) {
            this.itemListDeferred.reject(
                "Not authorized to access your files? Did your login expire? " +
                "(Try logging out and logging in)"
            );
        }
        else if( status != 400 ) {
            this.itemListDeferred.reject(status + " " + statusText);
        }
    };

    this.getItemList = function( userEmail, userId, accessToken ) {
        if( typeof this.itemList === "undefined" ) {
            $http.get("api/file/" + userEmail + "/" + userId + "/filelist",
                {
                    headers: {'Authorization':'Bearer ' + accessToken}
                }).
                success(
                    this.setItemList.bind(this)
                ).error(
                    this.setItemList.bind(this)
                );
        } else {
                this.itemListDeferred.resolve(this.itemList);
        }
        return this.itemListDeferred.promise;
    };

    //TODO: user service calls this, and populates item data
    //TODO: for each item in the itemlist, and share controller
    //TODO: then invokes this. Write until/functional tests for services that
    //TODO: validate they do the right thing. And separate out ui into a separate project
    //TODO: UI now uses DATA URI's, and the service supplies the data from authenticated calls
    this.getItem = function( accessToken, itemLocation ) {
        var itemDataDeferred = $q.defer();
        $http.get("api/file" + itemLocation );
        return itemDataDeferred.promise;
    }

}]);
