#!/bin/sh

ROOT_DIR=/app/dist

echo "Replacing env constants in JS"
for file in $ROOT_DIR/js/*.js*;
do
  echo "Processing $file ...";

  sed -i 's|SERVER_URL_SED_WILDCARD|'${VUE_APP_SERVER_URL}'|g' $file

done

http-server dist