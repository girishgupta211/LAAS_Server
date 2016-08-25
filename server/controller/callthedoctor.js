'use strict';
const mongoose = require('mongoose');
//let ObjectId = mongoose.Schema.ObjectId;
let Callthedoctor = mongoose.model('Callthedoctor'), 
    wbshared = require('wb-shared'), 
    log = wbshared.logger.child({ 'module': __filename.substring(__dirname.length + 1, __filename.length - 3) }), 
    constants = wbshared.utils.constants;
//    regex = require('RegExp') ;

exports.initSecured = (app) => {
    //<all : 4/men : 0/women : 1/kidb : 2/kidg : 3>
//    app.del('/w1/callthedoctor/:id', deleteCallthedoctor);
};
exports.initPub = (app) => {
    app.get('/w1/callthedoctor', getListCallthedoctor);
    app.get('/w1/cities', getListCities);
    app.get('/w1/callthedoctorquery', getQueryList);
    app.get('/w1/callthedoctor/:id', getCallthedoctor);
    app.post('/w1/callthedoctor', addCallthedoctor);
    app.put('/w1/callthedoctor/:id', updateCallthedoctor);
    app.del('/w1/callthedoctor/:id', deleteCallthedoctor);
};
function* getQueryList(next) {
	try 

	{
		let limit = 0;
		if (this.query.limit) {
			limit = this.query.limit;
			limit = Number.parseInt(limit);
		}
  
		let pageNumber = 0;
		if (this.query.pageNumber)
			pageNumber = this.query.pageNumber;
      
        let city = "Delhi"
        if(this. query.city)
            city = this.query.city.toString();

        let query = ""; 
        if(this.query.lquery)
            query = this.query.lquery.toString

//    db.callthedoctors.aggregate(
      let  q = [
       {'$unwind':'$relations'} ,
       { '$match' : {
         '$and' : [ 
            {'relations.practice.locality.city.name' : {   '$regex':city, '$options' : 'i' } },
            { '$or' :  [
//                {'name' : {   '$regex':'ravi', '$options' : 'i' } } , 
                {'relations.practice.locality.name' : {   '$regex': 'pra' , '$options' : 'i' } } 
             ]}
        ]}} ,
        
       { '$project' : { 'name':1 ,"gender" :1
       ,"practicing_start_year":1,"specializations_to_show_beneath_name":1,"relations.consultation_fee":1 ,
       "relations.practice.locality":1 , "relations.practice.street_address":1,
       "relations.practice.latitude":1,"relations.practice.longitude":1,"relations.practice.timings":1 }  }

        ];



                       


		//let callthedoctorQueryList = yield Callthedoctor.find({}).select('_id Callthedoctor_Name Location Pincode District State Location_Coordinates  ').skip((pageNumber) * limit).limit(limit).exec()
		//let callthedoctorQueryList = yield Callthedoctor.find({}).skip((pageNumber) * limit).limit(limit).exec()
		let callthedoctorQueryList = yield Callthedoctor.aggregate(q).skip((pageNumber) * limit).limit(limit).exec()
		this.body = callthedoctorQueryList;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in Callthedoctor query : ', error);
        this.body = "Error in processing Callthedoctor Query request";
        this.status = 404;
    }
}
function* getCallthedoctor(next) {
    try {
        let id = this.params.id;
        log.info("Get Callthedoctor : ", id);
        let callthedoctorStruct = yield Callthedoctor.findOne({ _id: id }).exec();
        this.body = callthedoctorStruct;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in Callthedoctor get : ', error);
        this.body = "Error in processing Callthedoctor Get request";
        this.status = 404;
    }
}

function* getListCities(next) {
     try {
        log.info("Get List Cities ");
        let cityList;
        cityList = yield Callthedoctor.distinct("relations.practice.locality.city.name").sort().exec();
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

function* getListCallthedoctor(next) {
    try {
        log.info("Get List Callthedoctor ");
        let callthedoctorList;
        callthedoctorList = yield Callthedoctor.find({}).sort({_id:1}).limit(10).exec();
        this.body = callthedoctorList;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in populating callthedoctor list : ', error);
        this.body = "Error in processing Callthedoctor List request";
        this.status = 404;
    }
}
function* addCallthedoctor(next) {
    try {
//        wbuser = this.document.wbuser;
        let body = this.request.body.fields;
        log.info('Body recieved in add callthedoctor : ', body);
        let callthedoctorStruct = yield new Callthedoctor(body).save();
        log.info("Add Callthedoctor : ", callthedoctorStruct);
        this.body = callthedoctorStruct;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in adding callthedoctor : ', error);
        this.body = "Error in processing Callthedoctor Add request";
        this.status = 404;
    }
}
function* updateCallthedoctor(next) {
    try {
        let body = this.request.body.fields;
        let id = this.params.id;
        //let callthedoctorStruct = yield Callthedoctor.findOneAndUpdate({ _id: body._id }, body, { new: true });
        let callthedoctorStruct = yield Callthedoctor.findByIdAndUpdate(id,body, { new: true });
        log.info("Update Callthedoctor : ", callthedoctorStruct);
        this.body = callthedoctorStruct;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in updating Callthedoctor : ', error);
        this.body = "Error in processing Callthedoctor Update request";
        this.status = 400;
    }
}
function* deleteCallthedoctor(next) {
    try {
        let callthedoctorId = this.params.id;
        let callthedoctorStruct = yield Callthedoctor.findOneAndRemove({ _id: callthedoctorId });
        log.info("Delete Callthedoctor : ", callthedoctorId);
        this.body = callthedoctorStruct;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in deleting Callthedoctor : ', error);
        this.body = "Error in processing Callthedoctor delete request";
        this.status = 400;
    }
}
