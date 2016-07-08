'use strict';
const mongoose = require('mongoose');
let Hospital = mongoose.model('Hospital'), wbshared = require('wb-shared'), log = wbshared.logger.child({ 'module': __filename.substring(__dirname.length + 1, __filename.length - 3) }), constants = wbshared.utils.constants;
exports.initSecured = (app) => {
    //<all : 4/men : 0/women : 1/kidb : 2/kidg : 3>
    app.get('/w1/hospital', getListHospital);
    app.get('/w1/hospital/:id', getHospital);
    app.get('/w1/hospitalquery', getQueryList);
};
exports.initAdmin = (app) => {
    app.post('/w1/hospital', addHospital);
    app.put('/w1/hospital', updateHospital);
    app.del('/w1/hospital/:id', deleteHospital);
    app.put('/w1/discount');
};
function* getQueryList(next) {
    try {
        let wbuser = this.document.wbuser;
        let query = this.query.lquery;
        log.info("Query Hospital : ", query);
        let hospitalQueryList = yield Hospital.find({ iName: { '$regex': query.toString() } }).select('iName clothType').exec();
        this.body = hospitalQueryList;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in Hospital query : ', error);
        this.body = "Error in processing Hospital Query request";
        this.status = 404;
    }
}
function* getHospital(next) {
    try {
        let wbuser = this.document.wbuser;
        let id = this.params.id;
        log.info("Get Hospital : ", id);
        let hospitalStruct = yield Hospital.findOne({ _id: id }).exec();
        this.body = hospitalStruct;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in Hospital get : ', error);
        this.body = "Error in processing Hospital Get request";
        this.status = 404;
    }
}
function* getListHospital(next) {
    try {
        let wbuser = this.document.wbuser;
        log.info("Get List Hospital ");
        let hospitalList;
        hospitalList = yield Hospital.find({}).exec();
        this.body = hospitalList;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in populating hospital list : ', error);
        this.body = "Error in processing Hospital List request";
        this.status = 404;
    }
}
function* addHospital(next) {
    try {
        wbuser = this.document.wbuser;
        let body = this.request.fields;
        log.info('Body recieved in add hospital : ', body);
        let hospitalStruct = yield new Hospital(body).save();
        log.info("Add Hospital : ", hospitalStruct);
        this.body = hospitalStruct;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in adding hospital : ', error);
        this.body = "Error in processing Hospital Add request";
        this.status = 404;
    }
}
function* updateHospital(next) {
    try {
        let body = this.request.fields;
        let hospitalStruct = yield Hospital.findOneAndUpdate({ _id: body._id }, body, { new: true });
        log.info("Update Hospital : ", hospitalStruct);
        this.body = hospitalStruct;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in updating Hospital : ', error);
        this.body = "Error in processing Hospital Update request";
        this.status = 400;
    }
}
function* deleteHospital(next) {
    try {
        let hospitalId = this.params.id;
        let hospitalStruct = yield Hospital.findOneAndRemove({ _id: hospitalId });
        log.info("Delete Hospital : ", hospitalId);
        this.body = hospitalStruct;
        this.status = 200;
        yield next;
    }
    catch (error) {
        log.error('Exception caught in deleting Hospital : ', error);
        this.body = "Error in processing Hospital delete request";
        this.status = 400;
    }
}
