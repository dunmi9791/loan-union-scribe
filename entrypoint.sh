#!/bin/sh

# Replace environment variables in the env.js file
envsubst < /usr/share/nginx/html/env.js.template > /usr/share/nginx/html/env.js

# Start nginx
exec nginx -g 'daemon off;'