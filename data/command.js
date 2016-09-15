mongoexport -d washbay-dev -c vaccine  > vaccine.json
mongoimport -d washbay-dev -c kids --drop < data.json
mongoimport -d washbay-dev -c vaccines --type csv --file vaccine.csv --headerline --drop

