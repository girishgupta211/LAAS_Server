'use strict';
const mongoose = require('mongoose');
//let ObjectId = mongoose.Schema.ObjectId;
let Restroom = mongoose.model('Restroom'), 
    wbshared = require('wb-shared'), 
    log = wbshared.logger.child({ 'module': __filename.substring(__dirname.length + 1, __filename.length - 3) }), 
    constants = wbshared.utils.constants;
//    regex = require('RegExp') ;

exports.initSecured = (app) => {
    //<all : 4/men : 0/women : 1/kidb : 2/kidg : 3>

};
exports.initPub = (app) => {
    app.get('/w1/restroom', getListRestroom);
    app.get('/w1/restroomquery', getQueryList);
    app.get('/w1/restroom/:id', getRestroom);
    app.post('/w1/restroom', addRestroom);
    app.put('/w1/restroom/:id', updateRestroom);
    app.del('/w1/restroom/:id', deleteRestroom);
};
function* getQueryList(next) {
    try {
        let query = this.query.lquery.toString();
        log.info("Query Restroom : ", query);
        
        var q =  query ?  { $or: [ 
//            { Restroom_Name : new regexp(query,'i')  }  gkg issue RegExp not found
            { name :{ '$regex':query } } 
            ,{ Location :{ '$regex':query } } 
//            ,{ Pincode :{ '$regex':query.toNumber()  } } 
            ]} : {} ;


        //let restroomQueryList = yield Restroom.find(  { Restroom_Name : { '$regex': query.toString() }
//        let restroomQueryList = yield Restroom.find(q).select('_id name Location Pincode').exec();
        let restroomQueryList = yield Restroom.find(q).exec();
        this.body = restroomQueryList;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in Restroom query : ', error);
        this.body = "Error in processing Restroom Query request";
        this.status = 404;
    }
}
function* getRestroom(next) {
    try {
        let id = this.params.id;
        log.info("Get Restroom : ", id);
        let restroomStruct = yield Restroom.findOne({ _id: id }).exec();
        this.body = restroomStruct;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in Restroom get : ', error);
        this.body = "Error in processing Restroom Get request";
        this.status = 404;
    }
}
function* getListRestroom(next) {
    try {
        log.info("Get List Restroom ");
        let restroomList;
        restroomList = yield Restroom.find({}).sort({_id:1}).limit(10).exec();
        this.body = restroomList;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in populating restroom list : ', error);
        this.body = "Error in processing Restroom List request";
        this.status = 404;
    }
}
function* addRestroom(next) {
    try {
//        wbuser = this.document.wbuser;
        let body = this.request.body.fields;
        log.info('Body recieved in add restroom : ', body);
        let restroomStruct = yield new Restroom(body).save();
        log.info("Add Restroom : ", restroomStruct);
        this.body = restroomStruct;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in adding restroom : ', error);
        this.body = "Error in processing Restroom Add request";
        this.status = 404;
    }
}
function* updateRestroom(next) {
    try {
        let body = this.request.body.fields;
        let id = this.params.id;
        //let restroomStruct = yield Restroom.findOneAndUpdate({ _id: body._id }, body, { new: true });
        let restroomStruct = yield Restroom.findByIdAndUpdate(id,body, { new: true });
        log.info("Update Restroom : ", restroomStruct);
        this.body = restroomStruct;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in updating Restroom : ', error);
        this.body = "Error in processing Restroom Update request";
        this.status = 400;
    }
}
function* deleteRestroom(next) {
    try {
        let restroomId = this.params.id;
        let restroomStruct = yield Restroom.findOneAndRemove({ _id: restroomId });
        log.info("Delete Restroom : ", restroomId);
        this.body = restroomStruct;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in deleting Restroom : ', error);
        this.body = "Error in processing Restroom delete request";
        this.status = 400;
    }
}
