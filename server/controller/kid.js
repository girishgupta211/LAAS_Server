'use strict';
const mongoose = require('mongoose');
//let ObjectId = mongoose.Schema.ObjectId;
let Kid = mongoose.model('Kid'), 
    wbshared = require('wb-shared'), 
    log = wbshared.logger.child({ 'module': __filename.substring(__dirname.length + 1, __filename.length - 3) }), 
    constants = wbshared.utils.constants;
//    regex = require('RegExp') ;

exports.initSecured = (app) => {
    //<all : 4/men : 0/women : 1/kidb : 2/kidg : 3>
//    app.del('/w1/kid/:id', deleteKid);
};
exports.initPub = (app) => {
    app.get('/w1/kid', getListKid);
    app.get('/w1/kidquery', getQueryList);
    app.get('/w1/kid/:id', getKid);
    app.post('/w1/kid', addKid);
    app.put('/w1/kid/:id', updateKid);
    app.del('/w1/kid/:id', deleteKid);
};
function* getQueryList(next) {
	try 

	{
		let limit = 0;
		if (this.query.limit) {
			limit = this.query.limit;
			limit = Number.parseInt(limit);
		}
  
        let council = "Delhi"
        if(this. query.Council)
            council = this.query.Council.toString();
       
		let pageNumber = 0;
		if (this.query.pageNumber)
			pageNumber = this.query.pageNumber;
        
        let query = "";
        if(this.query.lquery)
        	query = this.query.lquery.toString();

        var q  = { 
            $and :[  
            { Lbl_Council :  { '$regex': council , '$options': 'i' } },
            { $or: [ 
            { Name :{ '$regex':query, '$options':'i' } }, 
            { Regis_no :{ '$regex':query, '$options':'i' } } 
                ] }
            ]   
        } ;   


        log.info("Query pattern: ", query, "Limit: " ,limit ,"Council: ",council, "pageNumber", pageNumber);

		let kidQueryList = yield Kid.find(q).select().skip((pageNumber) * limit).limit(limit).exec()
		this.body = kidQueryList;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in Kid query : ', error);
        this.body = "Error in processing Kid Query request";
        this.status = 404;
    }
}
function* getKid(next) {
    try {
        let id = this.params.id;
        log.info("Get Kid : ", id);
        let kidStruct = yield Kid.findOne({ _id: id }).exec();
        this.body = kidStruct;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in Kid get : ', error);
        this.body = "Error in processing Kid Get request";
        this.status = 404;
    }
}

function* getListKid(next) {
    try {
        log.info("Get List Kid ");
        let kidList;
        kidList = yield Kid.find({}).sort({_id:1}).limit(10).exec();
        this.body = kidList;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in populating kid list : ', error);
        this.body = "Error in processing Kid List request";
        this.status = 404;
    }
}
function* addKid(next) {
    try {
//        wbuser = this.document.wbuser;
        let body = this.request.body.fields;
        log.info('Body recieved in add kid : ', body);
        let kidStruct = yield new Kid(body).save();
        log.info("Add Kid : ", kidStruct);
        this.body = kidStruct;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in adding kid : ', error);
        this.body = "Error in processing Kid Add request";
        this.status = 404;
    }
}
function* updateKid(next) {
    try {
        let body = this.request.body.fields;
        let id = this.params.id;
        //let kidStruct = yield Kid.findOneAndUpdate({ _id: body._id }, body, { new: true });
        let kidStruct = yield Kid.findByIdAndUpdate(id,body, { new: true });
        log.info("Update Kid : ", kidStruct);
        this.body = kidStruct;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in updating Kid : ', error);
        this.body = "Error in processing Kid Update request";
        this.status = 400;
    }
}
function* deleteKid(next) {
    try {
        let kidId = this.params.id;
        let kidStruct = yield Kid.findOneAndRemove({ _id: kidId });
        log.info("Delete Kid : ", kidId);
        this.body = kidStruct;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in deleting Kid : ', error);
        this.body = "Error in processing Kid delete request";
        this.status = 400;
    }
}
