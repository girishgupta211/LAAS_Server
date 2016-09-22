'use strict';
const mongoose = require('mongoose');
//let ObjectId = mongoose.Schema.ObjectId;
let Clinic = mongoose.model('Clinic'), 
    wbshared = require('wb-shared'), 
    log = wbshared.logger.child({ 'module': __filename.substring(__dirname.length + 1, __filename.length - 3) }), 
    constants = wbshared.utils.constants;
//    regex = require('RegExp') ;

exports.initSecured = (app) => {
    //<all : 4/men : 0/women : 1/kidb : 2/kidg : 3>
//    app.del('/w1/clinic/:id', deleteClinic);
};
exports.initPub = (app) => {
    app.get('/w1/clinic', getListClinic);
    app.get('/w1/city', getListCities);
    app.get('/w1/specialization', getListSpecialization);
    app.get('/w1/clinicquery', getQueryList);
    app.get('/w1/clinic/:id', getClinic);
    app.post('/w1/clinic', addClinic);
    app.put('/w1/clinic/:id', updateClinic);
    app.del('/w1/clinic/:id', deleteClinic);
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

        let cityQuery = {};
        let city = "" //"Hyderabad"
        if(this.query.city)
            city = this.query.city.toString();
            cityQuery = {"Practice.City":  {   '$regex':city, '$options' : 'i' } };
        
        let areaQuery = {};
        let area = "" //"Balkampet"
        if(this.query.area)
            area = this.query.area.toString();
            areaQuery = {"Practice.Area":  {   '$regex':area, '$options' : 'i' } };

        
        let specQuery = {};
        let spec = "" //"Balkampet"
        if(this.query.specializaion)
            spec = this.query.specializaion.toString();
            specQuery = {"Specialization":  {   '$regex':spec, '$options' : 'i' } };


        let clinic =  ""//"Delhi"
        if(this.query.clinic)
           clinic = this.query.clinic.toString();

        let query = ""; 
        if(this.query.lquery)
            query = this.query.lquery.toString();

        let name = ""; 
        if(this.query.name)
            name = this.query.name.toString();

        log.info("Query pattern: ", query, "Specialization: " ,spec ,"City: ",city, "Area: ", area, "clinic Pattern: " , clinic,
        "pageNumber", pageNumber, "Limit: " );
        
      let  q = [
       {'$unwind':'$Practice'} ,
       { '$match' : {
         '$and' : [
              cityQuery ,
              areaQuery ,
              specQuery ,
            { '$or' :  [
                {'FirstName' : {   '$regex':query, '$options' : 'i' } } , 
                {'LastName' : {   '$regex':query, '$options' : 'i' } } , 
                {'Practice.Hospital' : {   '$regex': query , '$options' : 'i' } } 
             ]}
        ]}} //,
        
//       { '$project' : { 'name':1 ,"gender" :1
//       ,"practicing_start_year":1,"specializations_to_show_beneath_name":1,"relations.consultation_fee":1 ,
//       "relations.practice.locality":1 , "relations.practice.street_address":1,
//       "relations.practice.latitude":1,"relations.practice.longitude":1,"relations.practice.timings":1 }  }

        ];

	    let clinicQueryList = yield Clinic.aggregate(q).skip((pageNumber) * limit).limit(limit).exec()
		this.body = clinicQueryList;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in Clinic query : ', error);
        this.body = "Error in processing Clinic Query request";
        this.status = 404;
    }
}
function* getClinic(next) {
    try {
        let id = this.params.id;
        log.info("Get Clinic : ", id);
        let clinicStruct = yield Clinic.findOne({ _id: id }).exec();
        this.body = clinicStruct;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in Clinic get : ', error);
        this.body = "Error in processing Clinic Get request";
        this.status = 404;
    }
}

function* getListCities(next) {
     try {
        log.info("Get List Cities ");
        let cityList;
        cityList = yield Clinic.distinct("Practice.City").sort().exec();
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

function* getListSpecialization(next) {
    try {
        log.info("Get List Cities ");
        let specializationList;
        specializationList = yield Clinic.distinct("Specialization").sort().exec();
        this.body = specializationList;
        this.status = 200;
        yield next;
    }   
    catch (error) {
        log.error('Exception caught in populating specializationList  : ', error);
        this.body = "Error in  processing City List request";
        this.status = 404;
    }   
}


function* getListClinic(next) {
    try {
        log.info("Get List Clinic ");
        let clinicList;
        clinicList = yield Clinic.find({}).sort({_id:1}).limit(10).exec();
        this.body = clinicList;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in populating clinic list : ', error);
        this.body = "Error in processing Clinic List request";
        this.status = 404;
    }
}
function* addClinic(next) {
    try {
//        wbuser = this.document.wbuser;
        let body = this.request.body.fields;
        log.info('Body recieved in add clinic : ', body);
        let clinicStruct = yield new Clinic(body).save();
        log.info("Add Clinic : ", clinicStruct);
        this.body = clinicStruct;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in adding clinic : ', error);
        this.body = "Error in processing Clinic Add request";
        this.status = 404;
    }
}
function* updateClinic(next) {
    try {
        let body = this.request.body.fields;
        let id = this.params.id;
        //let clinicStruct = yield Clinic.findOneAndUpdate({ _id: body._id }, body, { new: true });
        let clinicStruct = yield Clinic.findByIdAndUpdate(id,body, { new: true });
        log.info("Update Clinic : ", clinicStruct);
        this.body = clinicStruct;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in updating Clinic : ', error);
        this.body = "Error in processing Clinic Update request";
        this.status = 400;
    }
}
function* deleteClinic(next) {
    try {
        let clinicId = this.params.id;
        let clinicStruct = yield Clinic.findOneAndRemove({ _id: clinicId });
        log.info("Delete Clinic : ", clinicId);
        this.body = clinicStruct;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in deleting Clinic : ', error);
        this.body = "Error in processing Clinic delete request";
        this.status = 400;
    }
}
