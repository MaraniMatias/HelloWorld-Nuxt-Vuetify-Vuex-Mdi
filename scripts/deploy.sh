#!/bin/bash

# echo "pwd: `pwd`"
# echo "\$0: $0"
# echo "basename: `basename $0`"
# echo "dirname: `dirname $0`"
# echo "dirname/readlink: $(dirname $(readlink -f $0))"

build_and_deploy() {
  # CONFIG_FILE="`dirname $0`/config.env"
  CONFIG_FILE="./$1/config.env"
  ## CONFIG_FILE=$(echo "$1" | grep -oP "\./config/.+/?(config.env)")
  ## echo "$CONFIG_FILE"
  FTP_SERVER_IP=$(cat "$CONFIG_FILE" | grep -oP "^\s*FTP_SERVER_IP=\".+\"" | grep -oP "(\d+.\d+.\d+.\d+){1}")
  FTP_DOMINIO=$(cat "$CONFIG_FILE" | grep -oP "^\s*FTP_DOMINIO=\".+\"" | grep -oP "((\w|\d|-)*\.)+com")
  FTP_SERVER_PORT=$(cat "$CONFIG_FILE" | grep -oP "^\s*FTP_SERVER_PORT=\".+\"" | grep -oP "\d{4}")
  FTP_AUTH_USER=$(cat "$CONFIG_FILE" | grep -oP "^\s*FTP_AUTH_USER=\".+\"" | grep -oP "\".+\"" | grep -oP "\w+")
  FTP_RAPICOPIA_PATH=$(cat "$CONFIG_FILE" | grep -oP "^\s*FTP_RAPICOPIA_PATH=\".+\"" | grep -oP "(/[\w-_]+)+")
  RAPICOPIA_APP_SUBDOMINIO=$(cat "$CONFIG_FILE" | grep -oP "^\s*RAPICOPIA_APP_SUBDOMINIO=\".+\"" | grep -oP "\".+\"" | grep -oP "\w+")

  rm -drf .nuxt dist
  node ./scripts/build.js $CONFIG_FILE &&
  # ssh-copy-id -p 5908 root@vps-1637383-x.dattaweb.com
  SERVER_PUBLIC_PATH="$FTP_RAPICOPIA_PATH/$RAPICOPIA_APP_SUBDOMINIO"
  ssh -p ${FTP_SERVER_PORT} ${FTP_AUTH_USER}@${FTP_DOMINIO} mkdir -p \"${SERVER_PUBLIC_PATH}/*\"
  ssh -p ${FTP_SERVER_PORT} ${FTP_AUTH_USER}@${FTP_DOMINIO} rm -rf \"${SERVER_PUBLIC_PATH}/*\"
  scp -P ${FTP_SERVER_PORT} -r ./dist/* ${FTP_AUTH_USER}@${FTP_DOMINIO}:${SERVER_PUBLIC_PATH}/

  git checkout ./static
  git checkout ./assets

  printf "\n\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n\n"
  printf "$CONFIG_FILE"
  printf "\n\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n\n"
}


if [[ $1 == "--all" ]]; then
  for D in ./config/* ; do
    if [ -d "${D}" ]; then
      build_and_deploy ${D}
    fi
  done
else
  build_and_deploy $1
fi
exit  0
