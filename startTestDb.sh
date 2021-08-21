docker run -it --rm --name mysql \
-e "MYSQL_ALLOW_EMPTY_PASSWORD=no" \
-e "MYSQL_DATABASE=translation_caching" \
-p 3306:3306 \
-h mysql \
mysql:8.0.20