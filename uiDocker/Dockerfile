#Docker container for launching this project locally (for testing)
#you need to use the directory above this as the build context
#e.g.
#$> docker build -t ui-docker -f uiDocker/Dockerfile .
#run like so:
#$> docker run -p 8081:80 -i -t ui-docker /bin/bash
#docker_shell> service nginx start

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
ADD templates /var/www/shareplaylearnUI/
ADD js /var/www/shareplaylearnUI/
ADD css /var/www/shareplaylearnUI/
ADD bower_components /var/www/shareplaylearnUI/
