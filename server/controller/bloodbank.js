'use strict';
const mongoose = require('mongoose');
//let ObjectId = mongoose.Schema.ObjectId;
let Bloodbank = mongoose.model('Bloodbank'), 
    wbshared = require('wb-shared'), 
    log = wbshared.logger.child({ 'module': __filename.substring(__dirname.length + 1, __filename.length - 3) }), 
    constants = wbshared.utils.constants;
//    regex = require('RegExp') ;

exports.initSecured = (app) => {
    //<all : 4/men : 0/women : 1/kidb : 2/kidg : 3>
//    app.del('/w1/bloodbank/:id', deleteBloodbank);
};
exports.initPub = (app) => {
    app.get('/w1/bloodbank', getListBloodbank);
    app.get('/w1/cityBloodBank', getListCity);
    app.get('/w1/bloodbankquery', getQueryList);
    app.get('/w1/bloodbank/:id', getBloodbank);
    app.post('/w1/bloodbank', addBloodbank);
    app.put('/w1/bloodbank/:id', updateBloodbank);
    app.del('/w1/bloodbank/:id', deleteBloodbank);
};
function* getQueryList(next) {
	try 

	{
		let limit = 0;
		if (this.query.limit) {
			limit = this.query.limit;
			limit = Number.parseInt(limit);
		}
  
        //let district = "Alwar"
        let city = "delhi"
        if(this.query.city)
            city = this.query.city.toString();
       
		let pageNumber = 0;
		if (this.query.pageNumber)
			pageNumber = this.query.pageNumber;
        
        let query = "";
        if(this.query.lquery)
        	query = this.query.lquery.toString();

		log.info("Query pattern: ", query, "Limit: " ,limit ,"City: ",city, "pageNumber", pageNumber);

        //var q =  query ?  { 
        var q  = { 
            $and :[ 
                   { city :  { '$regex': city , '$options': 'i' } },
                   { $or: [ 
                         { h_name :{ '$regex':query, '$options':'i' } } 
                      ]
                   }
                  ]
                }
             ;


		let bloodbankQueryList = yield Bloodbank.find(q).skip((pageNumber) * limit).limit(limit).exec()
		this.body = bloodbankQueryList;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in Bloodbank query : ', error);
        this.body = "Error in processing Bloodbank Query request";
        this.status = 404;
    }
}
function* getBloodbank(next) {
    try {
        let id = this.params.id;
        log.info("Get Bloodbank : ", id);
        let bloodbankStruct = yield Bloodbank.findOne({ _id: id }).exec();
        this.body = bloodbankStruct;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in Bloodbank get : ', error);
        this.body = "Error in processing Bloodbank Get request";
        this.status = 404;
    }
}

function* getListCity(next) {
     try {
        log.info("Get List City ");
        let cityList;
        cityList = yield Bloodbank.distinct("city").sort().exec();
        this.body = cityList;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in populating cityList  : ', error);
        this.body = "Error in processing City List request";
        this.status = 404;
    }


}

function* getListBloodbank(next) {
    try {
        log.info("Get List Bloodbank ");
        let bloodbankList;
        bloodbankList = yield Bloodbank.find({}).sort({_id:1}).limit(10).exec();
        this.body = bloodbankList;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in populating bloodbank list : ', error);
        this.body = "Error in processing Bloodbank List request";
        this.status = 404;
    }
}
function* addBloodbank(next) {
    try {
//        wbuser = this.document.wbuser;
        let body = this.request.body.fields;
        log.info('Body recieved in add bloodbank : ', body);
        let bloodbankStruct = yield new Bloodbank(body).save();
        log.info("Add Bloodbank : ", bloodbankStruct);
        this.body = bloodbankStruct;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in adding bloodbank : ', error);
        this.body = "Error in processing Bloodbank Add request";
        this.status = 404;
    }
}
function* updateBloodbank(next) {
    try {
        let body = this.request.body.fields;
        let id = this.params.id;
        //let bloodbankStruct = yield Bloodbank.findOneAndUpdate({ _id: body._id }, body, { new: true });
        let bloodbankStruct = yield Bloodbank.findByIdAndUpdate(id,body, { new: true });
        log.info("Update Bloodbank : ", bloodbankStruct);
        this.body = bloodbankStruct;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in updating Bloodbank : ', error);
        this.body = "Error in processing Bloodbank Update request";
        this.status = 400;
    }
}
function* deleteBloodbank(next) {
    try {
        let bloodbankId = this.params.id;
        let bloodbankStruct = yield Bloodbank.findOneAndRemove({ _id: bloodbankId });
        log.info("Delete Bloodbank : ", bloodbankId);
        this.body = bloodbankStruct;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in deleting Bloodbank : ', error);
        this.body = "Error in processing Bloodbank delete request";
        this.status = 400;
    }
}
