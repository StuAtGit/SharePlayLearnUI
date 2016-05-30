
# Copyright 2015-2016 Stuart Smith
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
#
# If you modify this Program, or any covered work, by linking or combining
# it with the paho MQTT client library (or a modified version of that library),
# containing parts covered by the terms of EPL,
# the licensors of this Program grant you additional permission to convey the resulting work.

#Docker container for launching this project locally (for testing)
#you need to use the directory above this as the build context
#e.g.
#$> docker build -t ui-docker -f uiDocker/Dockerfile .
#run like so:
#$> docker run -p 8081:80 -i -t ui-docker /bin/bash
#docker_shell> service nginx start
#Then, the ui can be accessed at:
#http://127.0.0.1:8081/
#NOTE: "localhost" will not work (it must be 127.0.0.1), unless you update the nginx local-ui.conf
#nginx is picky about the server name like that...
#NOTE: general docker tip - stopping a container does not clean up resources,
#for that, use something like: docker rm `docker ps -a -q`

FROM ubuntu:wily

MAINTAINER stu26code@gmail.com

EXPOSE 80
EXPOSE 8080
EXPOSE 8081

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y nginx 
RUN apt-get install -y wget
RUN apt-get install -y vim
RUN apt-get install -y links

ADD uiDocker/local-ui.conf /etc/nginx/sites-enabled/local-ui.conf
ADD index.html /var/www/shareplaylearnUI/index.html
ADD templates /var/www/shareplaylearnUI/templates/
ADD js /var/www/shareplaylearnUI/js/
ADD css /var/www/shareplaylearnUI/css/
ADD bower_components /var/www/shareplaylearnUI/bower_components/
