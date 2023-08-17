SSH_STRING:=root@167.71.162.23

update-remote:
	ssh ${SSH_STRING} -f 'cd kinkycollections && git pull origin main && exit'

deploy:
	cd server && npm install
	cd client && npm install && npm run build
	ssh ${SSH_STRING} -f 'cd kinkycollections/client && rm -r build && cd ../server && rm -r static && exit' 
	cd client && scp -r build/ ${SSH_STRING}:/root/kinkycollections/client/build && scp -r build/ ${SSH_STRING}:/root/kinkycollections/server/static

send-build:
	 cd client && npm run build
	 scp -r build/ root@167.71.162.23:/root/kinkycollections/server/static

#on localmachine, install packages

# npm run build
# ssh in and delete kinkycollections/server/static
#  scp -r build root@167.71.162.23:/root/kinkycollections/server/static