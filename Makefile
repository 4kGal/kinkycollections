deploy:
	cd client && npm install && npm run build && scp -r build root@167.71.162.23:/root/kinkycollections/server/static

send-build:
	 cd client 
	 scp -r build root@167.71.162.23:/root/kinkycollections/server/static

#npm run build
# ssh in and delete kinkycollections/server/static
#  scp -r build root@167.71.162.23:/root/kinkycollections/server/static