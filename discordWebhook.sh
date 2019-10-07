#!bin/bash

if [ -z "$4" ]; then
  echo -e "Required 4 parameters, found $#" && exit
fi

TITLE="$2"
DESCRIPTION="$3"
WEBHOOK_URL="$4"

case $1 in
    "success" )
    EMBED_COLOR=3066993
    AVATAR="https://travis-ci.org/images/logos/TravisCI-Mascot-blue.png"
    ;;
    
    "failure" )
    EMBED_COLOR=15158332
    AVATAR="https://travis-ci.org/images/logos/TravisCI-Mascot-red.png"
    ;;

    * )
    EMBED_COLOR=0
    AVATAR="https://travis-ci.org/images/logos/TravisCI-Mascot-1.png"
    ;;
esac

TIMESTAMP=$(date --utc +%FT%TZ)

WEBHOOK_DATA='{
  "username": "",
  "avatar_url": "https://travis-ci.org/images/logos/TravisCI-Mascot-1.png",
  "embeds": [ {
    "color": '$EMBED_COLOR',
    "title": "'"$TITLE"'",
    "description": "'"$DESCRIPTION"'",
    "timestamp": "'"$TIMESTAMP"'"
  } ]
}'

(curl --fail --progress-bar -A "TravisCI-Webhook" -H Content-Type:application/json -H X-Author:k3rn31p4nic#8383 -d "${WEBHOOK_DATA//	/ }" "$WEBHOOK_URL" \
  && echo -e "\\n[Webhook]: Successfully sent the webhook.") || echo -e "\\n[Webhook]: Unable to send webhook."