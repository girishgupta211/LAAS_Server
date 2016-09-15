'use strict';
const mongoose = require('mongoose');
//let ObjectId = mongoose.Schema.ObjectId;
let Vaccine = mongoose.model('Vaccine'), 
    wbshared = require('wb-shared'), 
    log = wbshared.logger.child({ 'module': __filename.substring(__dirname.length + 1, __filename.length - 3) }), 
    constants = wbshared.utils.constants;
//    regex = require('RegExp') ;

exports.initSecured = (app) => {
    //<all : 4/men : 0/women : 1/vaccineb : 2/vaccineg : 3>
//    app.del('/w1/vaccine/:id', deleteVaccine);
};
exports.initPub = (app) => {
    app.get('/w1/vaccine', getListVaccine);
    app.get('/w1/vaccinequery', getQueryList);
    app.get('/w1/vaccine/:id', getVaccine);
    app.post('/w1/vaccine', addVaccine);
    app.put('/w1/vaccine/:id', updateVaccine);
    app.del('/w1/vaccine/:id', deleteVaccine);
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
        
        let query = "";
        if(this.query.lquery)
        	query = this.query.lquery.toString();

        var q  = { 
            $and :[  
            { $or: [ 
            { Name :{ '$regex':query, '$options':'i' } } 
//           , { Regis_no :{ '$regex':query, '$options':'i' } } 
                ] }
            ]   
        } ;   


        log.info("Query pattern: ", query, "Limit: " ,limit , "pageNumber", pageNumber);

		let vaccineQueryList = yield Vaccine.find(q).select().skip((pageNumber) * limit).limit(limit).exec()
		this.body = vaccineQueryList;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in Vaccine query : ', error);
        this.body = "Error in processing Vaccine Query request";
        this.status = 404;
    }
}
function* getVaccine(next) {
    try {
        let id = this.params.id;
        log.info("Get Vaccine : ", id);
        let vaccineStruct = yield Vaccine.findOne({ _id: id }).exec();
        this.body = vaccineStruct;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in Vaccine get : ', error);
        this.body = "Error in processing Vaccine Get request";
        this.status = 404;
    }
}

function* getListVaccine(next) {
    try {
        log.info("Get List Vaccine ");
        let vaccineList;
        vaccineList = yield Vaccine.find({}).sort({_id:1}).limit(10).exec();
        this.body = vaccineList;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in populating vaccine list : ', error);
        this.body = "Error in processing Vaccine List request";
        this.status = 404;
    }
}
function* addVaccine(next) {
    try {
//        wbuser = this.document.wbuser;
        let body = this.request.body.fields;
        log.info('Body recieved in add vaccine : ', body);
        let vaccineStruct = yield new Vaccine(body).save();
        log.info("Add Vaccine : ", vaccineStruct);
        this.body = vaccineStruct;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in adding vaccine : ', error);
        this.body = "Error in processing Vaccine Add request";
        this.status = 404;
    }
}
function* updateVaccine(next) {
    try {
        let body = this.request.body.fields;
        let id = this.params.id;
        //let vaccineStruct = yield Vaccine.findOneAndUpdate({ _id: body._id }, body, { new: true });
        let vaccineStruct = yield Vaccine.findByIdAndUpdate(id,body, { new: true });
        log.info("Update Vaccine : ", vaccineStruct);
        this.body = vaccineStruct;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in updating Vaccine : ', error);
        this.body = "Error in processing Vaccine Update request";
        this.status = 400;
    }
}
function* deleteVaccine(next) {
    try {
        let vaccineId = this.params.id;
        let vaccineStruct = yield Vaccine.findOneAndRemove({ _id: vaccineId });
        log.info("Delete Vaccine : ", vaccineId);
        this.body = vaccineStruct;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in deleting Vaccine : ', error);
        this.body = "Error in processing Vaccine delete request";
        this.status = 400;
    }
}
