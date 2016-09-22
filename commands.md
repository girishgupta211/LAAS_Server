pm2 start washbayServer.js
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
curl -i 'http://localhost:9135/w1/mci/57b3f1427edd76d3dd777b5a'
curl -i 'http://localhost:9135/w1/council/'
curl -i 'http://localhost:9135/w1/mciquery?Council=Maharashtra&lquery=mukesh&limit=10&pageNumber=0'
curl -i 'http://localhost:9135/w1/mciquery?Council=''&lquery=pritum&limit=10&pageNumber=0'
curl -i 'localhost:9135/w1/mciquery?Council=Maharashtra&lquery=40183&limit=10&pageNumber=0'

//Get Blood Bank Data
curl -i 'http://localhost:9135/w1/bloodbank' -X GET
curl -i 'http://localhost:9135/w1/bloodbank/57b477167edd76d3dd815af0' -X GET
curl -i 'http://localhost:9135/w1/cityBloodBank' -X GET
curl -i 'http://localhost:9135/w1/bloodbankquery?lquery=Guru&limit=10&pageNumber=0&city=delhi'


Get Doctors  Data
curl -i 'http://localhost:9135/w1/cities' -X GET
curl -i 'http://localhost:9135/w1/doctorquery?lquery=pr&limit=10&pageNumber=0&city=jaipur'
curl -i 'http://localhost:9135/w1/doctor/57b3f9b27edd76d3dd7fd3b7'

Sign IN
curl -i http://localhost:9135/v1/signin -d '{"password":"q", "userId" : "msaa@gmail.com"}' -X POST -H 'Content-Type:application/json'
curl -i 'http://localhost:9135/v1/user' -d '{"name" : {"first" : "Girish"},"password":"q", "gender": "M", "email" : "girishgargdce@gmail.com", "phone":"9013001288" }' -X POST -H 'Content-Type:application/json'

//Clinic APIs
curl -i  'http://localhost:9135/w1/clinicquery?lquery=pr&limit=2&pageNumber=0&city=Hyderabad&area=Balkampet&specializaion=Gastroenterologis'
curl -i 'http://localhost:9135/w1/clinic/57ba6b423458d1f0fda7db92'
curl -i 'http://localhost:9135/w1/clinic'
curl -i 'http://localhost:9135/w1/specialization' -X GET


// CallTheDoc
curl -i 'http://localhost:9135/w1/callthedoctor'
curl -i 'http://localhost:9135/w1/callthedoctor' -X POST -d '{"details":{"id":406,"status":0,"fname":"Dr Lavish","lname":"Gupta","email":"drlavish@sapphiredentalhospital.com","email2":"","phone":"","mobile":"+919950765090,9314868244","city":16,"lat":"26.800557","lng":"75.82298400000002","experience":"10years","consultant_fee":100,"logo":"144594671413.jpg","tags":null,"locality":"Pratap Nagar","address":"Sapphire Dental Hospital & Orthodontic Center,Kumbha Marg Near Community Center, Sector11 Pratap Nagar","country":"INDIA","postel":"302033","dob":"","anniversary":"","blood_group":"","sex":"m","distance":"0","qualification":"BDS,PGMHA","cityname":"Jaipur","image":"/uploads/node/cache.php?src=/doctors/144594671413.jpg&w=120&h=150&id=406","sno":null},"timing":[{"day":"MON-SAT","start":"09:30 AM","end":"08:00 PM"},{"day":"SUN","start":"10:00 AM","end":"01:00 PM"}],"speciality":[{"name":"Dentist"}],"awards":{},"qualification":[{"qualification":"BDS,PGMHA","year":0}],"experience":{}}' -H 'Content-Type:application/json'
pm2 logs washbayServer
pm2 show washbayServer
pm2 monit

## Kids APIs ##
curl -i  'http://localhost:9135/w1/kid' -X GET
curl -i 'http://localhost:9135/w1/kid' -d '{"_id":"57d9633acd91ebb2c8c2a5c0","Name":"Anetru Gupta","DOB":"28/02/2015","BithTime":"8 pm","Gastation":"40 weeks","ModeOfDelivery":"Cesarian Section","MotherHeight":"5.2 ft","FatherHeight":"5.6 ft","MPH":"","Gender":"M","BirthWeight":"2kg","BirthLength":"50 cms","HeadCircumference":"32 cms","FatherMob":"9899336565","MotherMob":"9999123456","FatherEmail":"iamabhinav.akg@gmail.com","MotherEmail":"","RegistrationNo":"SWA001"}'  -H 'Content-Type:application/json'
mongoimport -d washbay-dev -c kids --drop < data.json
