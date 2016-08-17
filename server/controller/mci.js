'use strict';
const mongoose = require('mongoose');
//let ObjectId = mongoose.Schema.ObjectId;
let Mci = mongoose.model('Mci'), 
    wbshared = require('wb-shared'), 
    log = wbshared.logger.child({ 'module': __filename.substring(__dirname.length + 1, __filename.length - 3) }), 
    constants = wbshared.utils.constants;
//    regex = require('RegExp') ;

exports.initSecured = (app) => {
    //<all : 4/men : 0/women : 1/kidb : 2/kidg : 3>
//    app.del('/w1/mci/:id', deleteMci);
};
exports.initPub = (app) => {
    app.get('/w1/mci', getListMci);
    app.get('/w1/district', getListDistrict);
    app.get('/w1/mciquery', getQueryList);
    app.get('/w1/mci/:id', getMci);
    app.post('/w1/mci', addMci);
    app.put('/w1/mci/:id', updateMci);
    app.del('/w1/mci/:id', deleteMci);
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
        let district = "Alwar"
        if(this.query.district)
            district = this.query.district.toString();
       
		let pageNumber = 0;
		if (this.query.pageNumber)
			pageNumber = this.query.pageNumber;
        
        let query = "";
        if(this.query.lquery)
        	query = this.query.lquery.toString();

		log.info("Query pattern: ", query, "Limit: " ,limit ,"District: ", district, "pageNumber", pageNumber);

        //var q =  query ?  { 
        var q  = { 
            $and :[ 
                   { District :  { '$regex': district , '$options': 'i' } },
                   { $or: [ 
                         { Mci_Name :{ '$regex':query, '$options':'i' } } ,
                         { Location :{ '$regex':query , '$options':'i' } } 
                      ]
                   }
                  ]
                }
             ;
//                : {} ;


//            { Pincode : Number.parseInt(this.query.pincode) } 

//let mciQueryList = yield Mci.find(  { Mci_Name : { '$regex': query.toString() }
		//let mciQueryList = yield Mci.find(q).select('_id Mci_Name Location Pincode').skip((pageNumber) * limit).limit(limit).exec()

		let mciQueryList = yield Mci.find(q).select('_id Mci_Name Location Pincode District State Location_Coordinates  ').skip((pageNumber) * limit).limit(limit).exec()
		this.body = mciQueryList;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in Mci query : ', error);
        this.body = "Error in processing Mci Query request";
        this.status = 404;
    }
}
function* getMci(next) {
    try {
        let id = this.params.id;
        log.info("Get Mci : ", id);
        let mciStruct = yield Mci.findOne({ _id: id }).exec();
        this.body = mciStruct;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in Mci get : ', error);
        this.body = "Error in processing Mci Get request";
        this.status = 404;
    }
}

function* getListDistrict(next) {
     try {
        log.info("Get List District ");
        let districtList;
        districtList = yield Mci.distinct("District").sort().exec();
        this.body = districtList;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in populating districtList  : ', error);
        this.body = "Error in processing District List request";
        this.status = 404;
    }


}

function* getListMci(next) {
    try {
        log.info("Get List Mci ");
        let mciList;
        mciList = yield Mci.find({}).sort({_id:1}).limit(10).exec();
        this.body = mciList;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in populating mci list : ', error);
        this.body = "Error in processing Mci List request";
        this.status = 404;
    }
}
function* addMci(next) {
    try {
//        wbuser = this.document.wbuser;
        let body = this.request.fields;
        log.info('Body recieved in add mci : ', body);
        let mciStruct = yield new Mci(body).save();
        log.info("Add Mci : ", mciStruct);
        this.body = mciStruct;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in adding mci : ', error);
        this.body = "Error in processing Mci Add request";
        this.status = 404;
    }
}
function* updateMci(next) {
    try {
        let body = this.request.fields;
        let id = this.params.id;
        //let mciStruct = yield Mci.findOneAndUpdate({ _id: body._id }, body, { new: true });
        let mciStruct = yield Mci.findByIdAndUpdate(id,body, { new: true });
        log.info("Update Mci : ", mciStruct);
        this.body = mciStruct;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in updating Mci : ', error);
        this.body = "Error in processing Mci Update request";
        this.status = 400;
    }
}
function* deleteMci(next) {
    try {
        let mciId = this.params.id;
        let mciStruct = yield Mci.findOneAndRemove({ _id: mciId });
        log.info("Delete Mci : ", mciId);
        this.body = mciStruct;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in deleting Mci : ', error);
        this.body = "Error in processing Mci delete request";
        this.status = 400;
    }
}