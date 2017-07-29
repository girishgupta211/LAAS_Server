'use strict';
const mongoose = require('mongoose');
let Schema = mongoose.Schema, log = require('../utils/logger').root.child({ 'module': __filename.substring(__dirname.length + 1, __filename.length - 3) }), bcrypt = require('..').utils.crypter, co = require('co'), constants = require('../utils/constants.js');
var HospitalSchema = new Schema({

        Sr_No: { type: Number },
        Location_Coordinates : { type: String },
        Location : { type: String },
        Hospital_Name : { type: String },
        Hospital_Category : { type: String },
        Hospital_Care_Type : { type: String },
        Discipline_Systems_of_Medicine : { type: String },
        Address_Original_First_Line : { type: String },
        State : { type: String },
        District  : { type: String },
        Subdistrict  : { type: String },
        Pincode : { type: Number },
        Telephone : { type: String },
        Mobile_Number : { type: String },
        Emergency_Num : { type: String },
        Ambulance_Phone_No : { type: String },
        Bloodbank_Phone_No : { type: String },
        Foreign_pcare : { type: String },
        Tollfree : { type: String },
        Helpline : { type: String },
        Hospital_Fax : { type: String },
        Hospital_Primary_Email_Id : { type: String },
        Hospital_Secondary_Email_Id : { type: String },
        Website : { type: String },
        Specialties : { type: String },
        Facilities : { type: String },
        Accreditation : { type: String },
        Hospital_Regis_Number : { type: String },
        Registeration_Number_Scan : { type: String },
        Nodal_Person_Info : { type: String },
        Nodal_Person_Tele : { type: String },
        Nodal_Person_Email_Id : { type: String },
        Town : { type: String },
        Subtown : { type: String },
        Village : { type: String },
        Establised_Year : { type: String },
        Ayush : { type: String },
        Miscellaneous_Facilities : { type: String },
        Number_Doctor : { type: String },
        Num_Mediconsultant_or_Expert : { type: String },
        Total_Num_Beds : { type: String },
        Number_Private_Wards : { type: String },
        Num_Bed_for_Eco_Weaker_Sec : { type: String },
        Empanelment_or_Collaboration_with : { type: String },
        Emergency_Services : { type: String },
        Tariff_Range : { type: String },
        State_ID  : { type: Number },
        District_ID  : { type: Number }
}, {
    toJSON: {
        transform: function (docM, retJ, option) {
            delete retJ.__v;
            return retJ;
        }
    }
});
HospitalSchema.static('defHospitalSchema', function () {
    return {
        Hospital_Name: null
        }
});
mongoose.model('Hospital', HospitalSchema);
        
