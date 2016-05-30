/**
 * Copyright 2015-2016 Stuart Smith
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
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

var shareAppControllers = angular.module('shareAppControllers',["userModule","itemModule","btford.modal"])
    .config(function($sceProvider,$compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(data):/);
});

shareAppControllers.controller("PlayCtrl", ['$scope', '$routeParams',
    function( $scope, $routeParams ) {
        checkLoginStatus($scope, document);
    }
]);

/**
 * 
 * @param {type} str
 * @returns {unresolved}
 *
 **/
var base64urlDecode  = function(str) {
  return atob(str.replace(/\-/g, '+').replace(/_/g, '/'));
};

var setCurrentUser = function ( username, document ) {
    if (document.getElementById("current-user") != null &&
        document.getElementById("current-user") != undefined) {

        document.getElementById("current-user")
            .appendChild(
            document.createTextNode("Logged in as: " + username )
        );
    }

    document.getElementById("login-control").style.display = "none";
    document.getElementById("logout-control").style.display = "block";
};

var logout = function( $scope, document ) {
    document.getElementById("login-control").style.display = "block";
    document.getElementById("logout-control").style.display = "none";
};