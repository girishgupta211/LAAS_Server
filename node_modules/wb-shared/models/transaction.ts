'use strict'
import mongoose = require('mongoose');
let Schema = mongoose.Schema,
  log = require('../utils/logger.js').root.child({ 'module': __filename.substring(__dirname.length + 1, __filename.length - 3) }),
  constants = require('../utils/constants.js');

var OrderSchema = new Schema(
  {
    item: {
      type: Schema.Types.ObjectId,
      ref: 'Item'
    },
    tos: {
      type: Number,
      enum: constants.TOS
    },
    tow: {
      type: Number,
      enum: constants.TOW
    },
    quantity: {
      type: Number
    },
    status: {
      type: Number,
      enum: constants.OSTATUS
    },
    cost: {
      type: Number
    },
    orderType: {
      type: Number,
      enum: constants.OTYPE
    },
    sagent: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    delvagent: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  }
);

var TransactionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    order: [OrderSchema],
    status: {
      type: Number,
      enum: constants.OSTATUS
    },
    picktime: {
      type: Date,
      default: Date.now
    },
    pickagent: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    cost: {
      type: Number
    },
    tax: {
      type: Number
    },
    created: {
      type: Date,
      default: Date.now
    },
    modified: {
      type: Date,
      default: Date.now
    }
  },
  {
    toJSON: {
      transform: function(donM, retJ, option) {
        delete retJ.__v;
        if (retJ.created)
          retJ.created = new Date(retJ.created).getTime();
        if (retJ.modified)
          retJ.modified = new Date(retJ.modified).getTime();
        return retJ;
      }
    }
  }
);

TransactionSchema.static('defTransactionSchema', function() {
  return {
    user: null,
    order: [],
    status: constants.OBUCKET,
    picktime: null,
    pickagent: null,
    cost: null,
    tax: null
  }
});
mongoose.model('Transaction', TransactionSchema);
