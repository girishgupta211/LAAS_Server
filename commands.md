mongoimport -d washbay-dev -c hospitals --type csv --file ~/dataHack/hospital_database-may_2016.csv --headerline

node washbayServer.js | node_modules/bunyan/bin/bunyan
cp -r wb-shared node_modules/

curl -i 'http://localhost:9135/w1/verification/signup' -X POST -d '{"name":{"fname":"Amitesh","lname":"Rai"}, "password":"washbay@123","email":"amitesh.raiji@washbay.in","phone":"0000000001","utype":1}' -H 'Content-Type:application/json'

curl -i 'http://localhost:9135/w1/verification/signin' -X POST -d '{"password":"washbay@123","username":"amitesh.raiji@washbay.in"}' -H 'Content-Type:application/json'
mongoimport -d washbay-dev -c hospital --type csv --file ~/dataHack/hospital_database-may_2016.csv --headerline

curl -i 'http://localhost:9135/w1/hospital' -X GET -H 'Authorization: bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NzdlNzU4NThiNTM0YTA3MjZjYTU3NWMiLCJpYXQiOjE0Njc5MDU3NzJ9.KbsO1x17bAZ88-irh4KDasWcb3_1wuev4ydyoBRxljM'


db.hospitals.find({_id:ObjectId("5790b876b4d3f7bf16416a23")}).pretty()

node-inspector washbayServer.js | node_modules/bunyan/bin/bunyan

node-debug  washbayServer.js | node_modules/bunyan/bin/bunyan
curl -i 'http://localhost:9135/w1/hospital/577fb4a814ca6f4b6f239267' -X GET
curl -i 'http://localhost:9135/w1/hospitalquery?lquery=Radha'
curl -i 'http://localhost:9135/w1/hospitalquery?lquery=Radha&limit=10&pageNumber=2'
curl -i 'http://localhost:9135/w1/hospitalquery?lquery=Saraswati&limit=10&pageNumber=0&district=Pune'

curl -i 'http://localhost:9135/w1/hospital' -X GET
curl -i 'http://localhost:9135/w1/hospital/577fb4a814ca6f4b6f239273' -X PUT -d '{ "Emergency_Num":"9013001299"}' -H 'Content-Type:application/json' 

curl -i 'http://localhost:9135/w1/restroom' -X POST -d '{ "name":"Sulabh Sauchalaya"}' -H 'Content-Type:application/json'
curl -i 'http://localhost:9135/w1/restroom/579613421293333a1172181c' -X PUT -d '{ "name":"Public Toilet"}' -H
'Content-Type:application/json' 
curl -i 'http://localhost:9135/w1/restroom' -X GET
curl -i 'http://localhost:9135/w1/restroomquery?lquery=oilet' -X GET
curl -i 'http://localhost:9135/w1/restroom/579613421293333a1172181c' -X GET
curl -i 'http://localhost:9135/w1/restroom/579613421293333a1172181c' -X DELETE
curl -i 'http://localhost:9135/w1/restroom' -X POST -d '{ "name":"public toilet", "facilities":"paper shop, urinals, tissue papers"}' -H 'Content-Type:application/json'

http://52.77.213.22:9135/w1/hospitalquery?lquery=Delhi&limit=10&pageNumber=2

Get MCI data
 curl -i 'http://localhost:9135/w1/mciquery?limit=10&pageNumber=2' -X GET
curl -i 'http://localhost:9135/w1/mci' -X GET
