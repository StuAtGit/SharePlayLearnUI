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
var shareApp = angular.module( 'shareApp', ['ngRoute', 'shareAppControllers']);

shareApp.config(
        ['$routeProvider',
         function( $routeProvider ) {
             $routeProvider.
                when('/share', {
                    templateUrl: "templates/share-my-stuff.html",
                    controller:  "ShareMyStuffCtrl"
                }).when('/share/:uploaded_flag' , {
                    templateUrl: "templates/share-my-stuff.html",
                    controller: "ShareMyStuffCtrl"
                }).when('/login',{
                    templateUrl: "templates/login.html",
                    controller: "LoginCtrl"
                }).when('/login_callback',{
                    templateUrl: "templates/logged_in.html",
                    controller: "LoginCtrl"
                }).when( '/play', {
                    templateUrl: "templates/play.html",
                    controller: "PlayCtrl"
                }).when( '/learn', {
                     templateUrl: "templates/learn.html",
                     controller: "LearnCtrl"
                }).when( '/logout', {
                     templateUrl: "templates/logout.html",
                     controller: "LogoutCtrl"
                }).otherwise( {
                     redirectTo: "/share"
                })
         }
        ]
 );