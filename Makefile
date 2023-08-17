SSH_STRING:=root@167.71.162.23

deploy:
	cd server
	npm install
	cd ../client
	npm install 
	npm run build 
	scp -r build/ ${SSH_STRING}:/root/kinkycollections/client/build
	scp -r build/ ${SSH_STRING}:/root/kinkycollections/server/static

send-build:
	 cd client 
	 scp -r build/ root@167.71.162.23:/root/kinkycollections/server/static

#on localmachine, install packages

# npm run build
# ssh in and delete kinkycollections/server/static
#  scp -r build root@167.71.162.23:/root/kinkycollections/server/static