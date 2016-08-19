'use strict';
const mongoose = require('mongoose');
//let ObjectId = mongoose.Schema.ObjectId;
let Doctor = mongoose.model('Doctor'), 
    wbshared = require('wb-shared'), 
    log = wbshared.logger.child({ 'module': __filename.substring(__dirname.length + 1, __filename.length - 3) }), 
    constants = wbshared.utils.constants;
//    regex = require('RegExp') ;

exports.initSecured = (app) => {
    //<all : 4/men : 0/women : 1/kidb : 2/kidg : 3>
//    app.del('/w1/doctor/:id', deleteDoctor);
};
exports.initPub = (app) => {
    app.get('/w1/doctor', getListDoctor);
    app.get('/w1/cities', getListCities);
    app.get('/w1/doctorquery', getQueryList);
    app.get('/w1/doctor/:id', getDoctor);
    app.post('/w1/doctor', addDoctor);
    app.put('/w1/doctor/:id', updateDoctor);
    app.del('/w1/doctor/:id', deleteDoctor);
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

//    db.doctors.aggregate(
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



                       


		//let doctorQueryList = yield Doctor.find({}).select('_id Doctor_Name Location Pincode District State Location_Coordinates  ').skip((pageNumber) * limit).limit(limit).exec()
		//let doctorQueryList = yield Doctor.find({}).skip((pageNumber) * limit).limit(limit).exec()
		let doctorQueryList = yield Doctor.aggregate(q).skip((pageNumber) * limit).limit(limit).exec()
		this.body = doctorQueryList;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in Doctor query : ', error);
        this.body = "Error in processing Doctor Query request";
        this.status = 404;
    }
}
function* getDoctor(next) {
    try {
        let id = this.params.id;
        log.info("Get Doctor : ", id);
        let doctorStruct = yield Doctor.findOne({ _id: id }).exec();
        this.body = doctorStruct;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in Doctor get : ', error);
        this.body = "Error in processing Doctor Get request";
        this.status = 404;
    }
}

function* getListCities(next) {
     try {
        log.info("Get List Cities ");
        let cityList;
        cityList = yield Doctor.distinct("relations.practice.locality.city.name").sort().exec();
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

function* getListDoctor(next) {
    try {
        log.info("Get List Doctor ");
        let doctorList;
        doctorList = yield Doctor.find({}).sort({_id:1}).limit(10).exec();
        this.body = doctorList;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in populating doctor list : ', error);
        this.body = "Error in processing Doctor List request";
        this.status = 404;
    }
}
function* addDoctor(next) {
    try {
//        wbuser = this.document.wbuser;
        let body = this.request.fields;
        log.info('Body recieved in add doctor : ', body);
        let doctorStruct = yield new Doctor(body).save();
        log.info("Add Doctor : ", doctorStruct);
        this.body = doctorStruct;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in adding doctor : ', error);
        this.body = "Error in processing Doctor Add request";
        this.status = 404;
    }
}
function* updateDoctor(next) {
    try {
        let body = this.request.fields;
        let id = this.params.id;
        //let doctorStruct = yield Doctor.findOneAndUpdate({ _id: body._id }, body, { new: true });
        let doctorStruct = yield Doctor.findByIdAndUpdate(id,body, { new: true });
        log.info("Update Doctor : ", doctorStruct);
        this.body = doctorStruct;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in updating Doctor : ', error);
        this.body = "Error in processing Doctor Update request";
        this.status = 400;
    }
}
function* deleteDoctor(next) {
    try {
        let doctorId = this.params.id;
        let doctorStruct = yield Doctor.findOneAndRemove({ _id: doctorId });
        log.info("Delete Doctor : ", doctorId);
        this.body = doctorStruct;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in deleting Doctor : ', error);
        this.body = "Error in processing Doctor delete request";
        this.status = 400;
    }
}
