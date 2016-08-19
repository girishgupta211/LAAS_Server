'use strict';
var mongoose = require('mongoose');
let constants = require('../utils/constants');
var Schema = mongoose.Schema;
var responsePageSchema = new Schema();
var responseQuestionSchema = new Schema();
var responseAnswerSchema = new Schema();
var ResponseSchema = new Schema({
    surId: {
        type: Schema.Types.ObjectId,
        ref: 'Form'
    },
    piping: [{
            qId: {
                type: Schema.Types.ObjectId,
                ref: 'Field'
            },
            answer: [{
                    row: {
                        type: Schema.Types.ObjectId
                    },
                    text: {
                        type: String
                    }
                }]
        }],
    resPObj: {
        type: Schema.Types.Mixed
    },
    resAObj: {
        type: Schema.Types.Mixed
    },
    currPage: {
        type: Schema.Types.ObjectId,
        ref: 'Page'
    },
    topQues: {
        type: Schema.Types.ObjectId,
        ref: 'Field'
    },
    absPageNum: {
        type: Number
    },
    totPages: {
        type: Number
    },
    currPageNum: {
        type: String,
        default: 1
    },
    currQuesNum: {
        type: String,
        default: 1
    },
    collectId: {
        type: Schema.Types.ObjectId,
        ref: 'Collector'
    },
    contDet: {
        type: Schema.Types.ObjectId,
        ref: 'Contact'
    },
    sendMail: {
        type: Schema.Types.ObjectId,
        ref: 'SendMail'
    },
    ipAdd: {
        type: String,
        default: 'Anonymous'
    },
    manual: {
        type: Number,
        default: constants.MANUAL.NO
    },
    agent: {
        type: String,
        default: null
    },
    preview: {
        type: Number,
        default: 0
    },
    created: {
        type: Date,
        default: Date.now
    },
    modified: {
        type: Date,
        default: Date.now
    },
    totTime: {
        type: Number
    },
    resStatus: {
        type: String
    }
}, {
    toJSON: {
        transform: function (doc, ret, options) {
            delete ret.__v;
            if (ret.modified)
                ret.modified = new Date(ret.modified).getTime();
            if (ret.created)
                ret.created = new Date(ret.created).getTime();
        }
    }
});
ResponseSchema.static("defResponsePageSchema", function () {
    return {
        prevPId: "",
        prevQId: ""
    };
});
ResponseSchema.static("defResponseSchema", function () {
    return {
        surId: null,
        piping: [],
        resPObj: {},
        resAObj: {},
        ipAdd: 'Anonymous',
        currPage: null,
        topQues: null,
        sendMail: null,
        contDet: null,
        absPageNum: null,
        totPages: null,
        currPageNum: 1,
        currQuesNum: 1,
        agent: null,
        manual: constants.MANUAL.NO,
        created: new Date(),
        modified: new Date(),
        totTime: null,
        collectId: null,
        resStatus: constants.RSTATUS.incomplete
    };
});
mongoose.model('Response', ResponseSchema);
