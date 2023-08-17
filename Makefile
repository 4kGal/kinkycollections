SSH_STRING:=root@167.71.162.23

update-remote:
	ssh ${SSH_STRING} -f 'cd kinkycollections && git pull origin main'

deploy:
	cd server && npm install
	cd client && npm install && npm run build
	ssh ${SSH_STRING} -f 'cd kinkycollections/client && rm -r build && cd ../server && rm -r static' 
	cd client && scp -r build/ ${SSH_STRING}:/root/kinkycollections/client/build && scp -r build/ ${SSH_STRING}:/root/kinkycollections/server/static
	ssh ${SSH_STRING} -f 'cd kinkycollections/server && pm2 kill && pm2 start app.mjs'
send-build:
	 cd client && npm run build
	 scp -r build/ root@167.71.162.23:/root/kinkycollections/server/static

view-pm2-logs:
	ssh ${SSH_STRING} -f 'pm2 logs'

restart-pm2:
	ssh ${SSH_STRING} -f 'pm2 kill && cd kinkycollections/server && pm2 start app.mjs'

restart-nginx:
	ssh ${SSH_STRING} -f 'sudo systemctl restart nginx'

view-nginx-access-logs:
	ssh ${SSH_STRING} -f 'tail -f /var/log/nginx/access.log'

view-nginx-error-logs:
	ssh ${SSH_STRING} -f 'tail -f /var/log/nginx/error.log'
