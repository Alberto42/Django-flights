prefix="wwwApp/static/wwwApp"
cd $prefix
tsc "proxy.ts" > /dev/null
tsc "utils.ts" > /dev/null
tsc "fetch_flight.ts" > /dev/null
tsc "script.ts" > /dev/null
browserify script.js proxy.js utils.js fetch_flight.js > bundle.js
cd -
