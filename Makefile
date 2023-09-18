cypress-tests:
	cd client && CYPRESS_ADMIN_TOKEN=eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJVc2VybmFtZSI6IjRrZ2FsIn0.W64uTDo9FUrl0hYmyg19CoDDE8X25_8s46hvBTX13eA npm run cy:open

#### deployments

SSH_STRING:=root@167.71.162.23

BUNNY_AMATEUR_BB_COLLECTION_ID=f78d6a02-0840-4dbf-a316-05481ca9196d
BUNNY_AMATEUR_CB_COLLECTION_ID=15d0aacf-aa27-4890-9403-e840198c47d9
BUNNY_MAINSTREAM_CB_COLLECTION_ID=0decd551-9596-4b91-9524-ecde7ec35648
BUNNY_MAINSTREAM_PE_COLLECTION_ID=fb864cdf-e8c7-4acb-b2e7-5dee4e7955d0

connect-to-mongodb:
	mongosh "mongodb+srv://kinkycollections.irozhod.mongodb.net/" --apiVersion 1 --username 4kgal

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
	cd scripts && BUNNY_COLLECTION=${BUNNY_AMATEUR_BB_COLLECTION_ID} MONGO_COLLECTION=amateurbb node updateViews.js

update-prod-views-amateurbb:
	cd scripts && BUNNY_COLLECTION=${BUNNY_AMATEUR_BB_COLLECTION_ID} MONGO_COLLECTION=amateurbb MONGO_DATABASE=serverdata_prod node updateViews.js

update-dev-views-mainstreampe:
	cd scripts && BUNNY_COLLECTION=${BUNNY_MAINSTREAM_PE_COLLECTION_ID} MONGO_COLLECTION=mainstreampe node updateViews.js

update-prod-views-mainstreampe:
	cd scripts && BUNNY_COLLECTION=${BUNNY_MAINSTREAM_PE_COLLECTION_ID} MONGO_COLLECTION=mainstreampe MONGO_DATABASE=serverdata_prod node updateViews.js

update-dev-views-all:
	${MAKE} update-dev-views-mainstreambb
	${MAKE} update-dev-views-amateurbb
	${MAKE} update-prod-views-mainstreambb
	${MAKE} update-prod-views-amateurbb

get-missing-and-duplicate-imports:
	# cd scripts && node missing.js
	cd scripts && BUNNY_COLLECTION=${BUNNY_AMATEUR_BB_COLLECTION_ID} MONGO_COLLECTION=amateurbb node missing.js
	# cd scripts && BUNNY_COLLECTION=${BUNNY_MAINSTREAM_PE_COLLECTION_ID} MONGO_COLLECTION=mainstreampe node missing.js

create-mongo-import-mainstreambb:
	cd scripts && node index.js && code mongoimport-mainstreambb.json

create-mongo-import-mainstreamcb:
	cd scripts &&  BUNNY_COLLECTION=${BUNNY_MAINSTREAM_CB_COLLECTION_ID} MONGO_COLLECTION=mainstreamcb node index.js && code mongoimport-mainstreamcb.json

create-mongo-import-amateurbb:
	cd scripts && BUNNY_COLLECTION=${BUNNY_AMATEUR_BB_COLLECTION_ID} MONGO_COLLECTION=amateurbb node index.js && code mongoimport-amateurbb.json

create-mongo-import-mainstreampe:
	cd scripts && BUNNY_COLLECTION=${BUNNY_MAINSTREAM_PE_COLLECTION_ID} MONGO_COLLECTION=mainstreampe node index.js && code mongoimport-mainstreampe.json

create-mongo-import-amateurcb:
	cd scripts &&  BUNNY_COLLECTION=${BUNNY_AMATEUR_CB_COLLECTION_ID} MONGO_COLLECTION=amateurcb node index.js && code mongoimport-amateurcb.json

create-mongo-import-all:
	${MAKE} create-mongo-import-mainstreambb
	${MAKE} create-mongo-import-amateurbb
	${MAKE} create-mongo-import-mainstreamcb
	${MAKE} create-mongo-import-mainstreampe
	${MAKE} create-mongo-import-amateurcb

insert-dev-mainstreambb-documents:
	cd scripts && node importToMongo.js

insert-prod-mainstreambb-documents:
	cd scripts && MONGO_DATABASE=serverdata_prod node importToMongo.js

insert-dev-amateurbb-documents:
	cd scripts && BUNNY_COLLECTION=${BUNNY_AMATEUR_BB_COLLECTION_ID} MONGO_COLLECTION=amateurbb node importToMongo.js

insert-prod-amateurbb-documents:
	cd scripts && BUNNY_COLLECTION=${BUNNY_AMATEUR_BB_COLLECTION_ID} MONGO_COLLECTION=amateurbb MONGO_DATABASE=serverdata_prod node importToMongo.js

insert-dev-amateurcb-documents:
	cd scripts && BUNNY_COLLECTION=${BUNNY_AMATEUR_CB_COLLECTION_ID} MONGO_COLLECTION=amateurcb node importToMongo.js

insert-prod-amateurcb-documents:
	cd scripts && BUNNY_COLLECTION=${BUNNY_AMATEUR_CB_COLLECTION_ID} MONGO_COLLECTION=amateurcb MONGO_DATABASE=serverdata_prod node importToMongo.js

insert-dev-mainstreamcb-documents:
	cd scripts && BUNNY_COLLECTION=${BUNNY_MAINSTREAM_CB_COLLECTION_ID} MONGO_COLLECTION=mainstreamcb node importToMongo.js

insert-prod-mainstreamcb-documents:
	cd scripts && BUNNY_COLLECTION=${BUNNY_MAINSTREAM_CB_COLLECTION_ID} MONGO_COLLECTION=mainstreamcb MONGO_DATABASE=serverdata_prod node importToMongo.js

insert-dev-mainstreampe-documents:
	cd scripts && BUNNY_COLLECTION=${BUNNY_MAINSTREAM_PE_COLLECTION_ID} MONGO_COLLECTION=mainstreampe node importToMongo.js

insert-prod-mainstreampe-documents:
	cd scripts && BUNNY_COLLECTION=${BUNNY_MAINSTREAM_PE_COLLECTION_ID} MONGO_COLLECTION=mainstreampe MONGO_DATABASE=serverdata_prod node importToMongo.js


insert-all-dev-documents:
	${MAKE} insert-dev-mainstreambb-documents
	${MAKE} insert-dev-amateurbb-documents
	${MAKE} insert-dev-mainstreamcb-documents
	${MAKE} insert-dev-mainstreampe-documents
	${MAKE} insert-dev-amateurcb-documents

insert-all-prod-documents:
	${MAKE} insert-prod-mainstreambb-documents
	${MAKE} insert-prod-amateurbb-documents
	${MAKE} insert-prod-mainstreamcb-documents
	${MAKE} insert-prod-mainstreampe-documents
	${MAKE} insert-prod-amateurcb-documents

insert-dev-prod-amateurcb-documents:
	${MAKE} insert-dev-amateurcb-documents
	${MAKE} insert-prod-amateurcb-documents

insert-dev-prod-mainstreambb-documents:
	${MAKE} insert-dev-mainstreambb-documents
	${MAKE} insert-prod-mainstreambb-documents

insert-dev-prod-amateurbb-documents:
	${MAKE} insert-dev-amateurbb-documents
	${MAKE} insert-prod-amateurbb-documents

insert-dev-prod-mainstreamcb-documents:
	${MAKE} insert-dev-mainstreamcb-documents
	${MAKE} insert-prod-mainstreamcb-documents

insert-dev-prod-mainstreampe-documents:
	${MAKE} insert-dev-mainstreampe-documents
	${MAKE} insert-prod-mainstreampe-documents

insert-all-documents:
	${MAKE} insert-dev-prod-mainstreambb-documents
	${MAKE} insert-dev-prod-amateurbb-documents
	${MAKE} insert-dev-prod-mainstreamcb-documents
	${MAKE} insert-dev-prod-mainstreampe-documents
	${MAKE} insert-dev-prod-amateurcb-documents

delete-mainstreambb-files:
	cd scripts && node deletefiles.js

delete-amateurbb-files:
	cd scripts && BUNNY_COLLECTION=${BUNNY_AMATEUR_BB_COLLECTION_ID} MONGO_COLLECTION=amateurbb node deletefiles.js

delete-amateurcb-files:
	cd scripts && BUNNY_COLLECTION=${BUNNY_AMATEUR_CB_COLLECTION_ID} MONGO_COLLECTION=amateurcb node deletefiles.js

delete-mainstreamcb-files:
	cd scripts && BUNNY_COLLECTION=${BUNNY_MAINSTREAM_CB_COLLECTION_ID} MONGO_COLLECTION=mainstreamcb node deletefiles.js

delete-mainstreampe-files:
	cd scripts && BUNNY_COLLECTION=${BUNNY_MAINSTREAM_PE_COLLECTION_ID} MONGO_COLLECTION=mainstreampe node deletefiles.js

delete-all-files:
	${MAKE} delete-mainstreambb-files
	${MAKE} delete-amateurbb-files
	${MAKE} delete-amateurcb-files
	${MAKE} delete-mainstreamcb-files
	${MAKE} delete-mainstreampe-files