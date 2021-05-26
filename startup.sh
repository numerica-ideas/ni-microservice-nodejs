export NODE_ENV=prod
export PORT=3000

echo "Pulling the most updated version"
git pull

echo "Installing missed dependencies"
npm i

echo "Kill the former process/deployment"
forever stop server.js
# killall -s KILL node
# sudo kill $(sudo lsof -t -i:3000)

echo "Run the project"
# PORT=3000 && nohup node server.js &
forever start server.js
