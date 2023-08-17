#### deployments

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
	ssh ${SSH_STRING} -f 'cd kinkycollections/server && pm2 kill && pm2 start app.mjs'

restart-nginx:
	ssh ${SSH_STRING} -f 'sudo systemctl restart nginx'

view-nginx-access-logs:
	ssh ${SSH_STRING} -f 'tail -f /var/log/nginx/access.log'

view-nginx-error-logs:
	ssh ${SSH_STRING} -f 'tail -f /var/log/nginx/error.log'

### Database updates

update-dev-views-mainstreambb:
	cd scripts && node updateViews.js

update-prod-views-mainstreambb:
	cd scripts && MONGO_DATABASE=serverdata_prod node updateViews.js

update-dev-views-amateurbb:
	cd scripts && MONGO_COLLECTION=amateurbb node updateViews.js

update-prod-views-amateurbb:
	cd scripts && MONGO_COLLECTION=amateurbb MONGO_DATABASE=serverdata_prod node updateViews.js

update-dev-views-all:
	${MAKE} update-dev-views-mainstreambb
	${MAKE} update-dev-views-amateurbb
	${MAKE} update-prod-views-mainstreambb
	${MAKE} update-prod-views-amateurbb

create-mongo-import-mainstreambb:
	cd scripts && node index.js && code mongoimport-mainstreambb.json

create-mongo-import-amateurbb:
	cd scripts && MONGO_COLLECTION=amateurbb node index.js && code mongoimport-amateurbb.json

create-mongo-import-all:
	${MAKE} create-mongo-import-mainstreambb
	${MAKE} create-mongo-import-amateurbb

insert-dev-mainstreambb-documents:
	cd scripts && node importToMongo.js

insert-prod-mainstreambb-documents:
	cd scripts && MONGO_DATABASE=serverdata_prod node importToMongo.js

insert-dev-amateurbb-documents:
	cd scripts && MONGO_COLLECTION=amateurbb node importToMongo.js

insert-prod-amateurbbdocuments:
	cd scripts && MONGO_COLLECTION=amateurbb MONGO_DATABASE=serverdata_prod node importToMongo.js

insert-all-dev-documents:
	${MAKE} insert-dev-mainstreambb-documents
	${MAKE} insert-dev-amateurbb-documents

insert-all-prod-documents:
	${MAKE} insert-prod-mainstreambb-documents
	${MAKE} insert-prod-amateurbb-documents
