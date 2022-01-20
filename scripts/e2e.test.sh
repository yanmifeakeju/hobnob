#!/usr/bin/env bash
clear

#Make sure the port is not already bound
if ss -int | grep -q :$SERVER_PORT; then
  echo "Another process is already listening to the port $SERVER_PORT"
  exit 1;
fi

RETRY_INTERVAL=${RETRY_INTERVAL:-0.2}
if ! systemctl --quiet is-active elasticsearch.service; then
  sudo systemctl start elasticsearch.service
  # Wait unitl Elasticsearch is ready to respond
  until curl --silent $ELASTICSEARCH_HOSTNAME:$ELASTICSEARCH_PORT -w ""  -o /dev/null; do
    sleep $RETRY_INTERVAL
  done
fi

yarn run serve &

RETRY_INTERVAL=0.2
until ss -lnt | grep -q :$SERVER_PORT; do
  sleep $RETRY_INTERVAL
done

npx cucumber-js spec/cucumber/features --require-module @babel/register --require spec/cucumber/steps --publish-quiet

# Terminate all processes within the same group by sending a SIGTERM signal
kill -15 0