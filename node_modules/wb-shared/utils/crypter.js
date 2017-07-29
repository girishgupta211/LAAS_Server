var bcrypt = require('bcrypt-nodejs');
//using native bcrypt library for cross platform implementation of
//bcrypt library (general bcrypt library is a costly overhead for windows system)

module.exports.genSalt = function(rounds){ // exporting genSalt function that creates a salt for hashing the password
  return new Promise(//genSalt is not yieldable thats why encapsulating in a promise
    function(resolve, reject){//resolve and reject are to promise methods for success and failure
      bcrypt.genSalt(rounds, function(error, salt){//rounds is the number of rounds the gensalt has to process data
        if(error){//callback function is mandatory as it encapsulates the result i.e. salt
          return reject(error);
        }
        return resolve(salt);
      });
    }
  );
};

module.exports.hash = function(toEncryptData, salt){//hashing using the salt genrated via gensalt
  return new Promise(
    function(resolve, reject){
      bcrypt.hash(toEncryptData, salt, null, function(error, hashedData){
        if(error){//null is progress function but is currently not even used in bcrypt-nodejs library at the time of writing
          return reject(error);
        }
        return resolve(hashedData);
      });
    }
  );
};

module.exports.compare = function (checkData, knownHash){
  return new Promise(
    function(resolve, reject){
      bcrypt.compare(checkData, knownHash, function(error, matched){
        //matched [true | false]
        if(error){
          return reject(error);
        }
        return resolve(matched);
      });
    }
  );
};
