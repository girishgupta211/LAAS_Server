# Washbay API List

## Curl Request, Data structure, Output

### Verification module

- SignUp

  ```
  * Curl
    curl -i 'http://localhost:9135/w1/verification/signup' -X POST -d '{"name":{"fname":"Amitesh","lname":"Rai"}, "password":"washbay@123","email":"amitesh.rai@washbay.in","phone":"0000000000","utype":null}' -H 'Content-Type:application/json'
  * Data structure (required)
    {
      'name' : {'fname':'<first-name>'},
      'email' : '<something@domain.com>',
      'password' : '<password>',
      'phone' : '<phone(10 digit)>',
      'utype' : <0>
    }
  * Output
    Success message
  ```

* SignIn

  ```
  * Curl
    curl -i 'http://localhost:9135/w1/verification/signin' -X POST -d '{"username":"<email/phone>","password":"<password>"}' -H 'Content-Type:application/json'
    
    example:
    curl -i 'http://localhost:9135/w1/verification/signup' -X POST -d '{"name":{"fname":"Amitesh","lname":"Rai"}, "password":"washbay@123","email":"amitesh.rai@washbay.in","phone":"0000000000","utype":null}' -H 'Content-Type:application/json'
    
  * Data Structure (required)
    {
      'username' : '<email/phone>',
      'password' : '<password>'
    }
  * Output
    Success message and Auth Token
  ```

### Item Module

* Query Item

  ```
  * Curl
    curl -i 'http://localhost:9135/w1/itemquery?lquery=<string>' -X GET -H 'Authorization: bearer <authToken>'
  * Data Structure
  * Output
    [{"_id" : "<id>"","iName":"<name>"}]
  ```

* Add Item

  ```
  * Curl
    curl -i 'http://localhost:9135/w1/item' -X POST -H 'Content-Type:application/json' -d '{"iName":"<name>","clothType":<0/1/2/3>,"wcost":{"classic":<val>,"super":<val>,"ultra":<val>},"icost":<val>,"dcost":<val>,"bulkFactor":<val>}' -H 'Authorization: bearer <authToken>'
  * Data Structure (required)
    {
      "iName" : "<name>",
      "clothType" : <0/1/2/3>,
      "wcost" : {
        "classic" : <val>,
        "super" : <val>,
        "ultra" : <val>
      },
      "icost" : <val>,
      "dcost" : <val>
    }
  * Output
    {<itemModel with _id>}
  ```

* Delete Item

  ```
  * Curl
    curl -i 'http://localhost:9135/w1/item/<id>' -X DELETE -H 'Authorization: bearer <authToken>'
  * Data Structure
  * Output
    {<deleted item>}
  ```

* Update Item

  ```
  * Curl
    curl -i 'http://localhost:9135/w1/item/<id>' -X PUT -H 'Content-Type:application/json' -d '{"_id":"<id>", <dataToBeUpdated>}' -H 'Authorization: bearer <authToken>'
  * Data Structure
    {
      "_id" : "<id>",
      "<key>" : "<updated value>"
    }
  * Output
    {<updated Item>}
  ```

* Get Item

  ```
  * Curl
    curl -i 'http://localhost:9135/w1/item/<id>' -X GET -H 'Authorization: bearer <authToken>'
  * Data Structure
  * Output
    {<item>}
  ```

* Get Item List

  ```
  * Curl
    curl -i 'http://localhost:9135/w1/itemlist?type=<type>' -X GET -H 'Authorization: bearer <authToken>'
  * Data Structure
    <type> :
    all : 4
    men : 0
    women : 1
    kid boy : 2
    kid girl : 3
  * Output
    [{<item>}]
  ```

### Order Module

* Post Transaction

  ```
  * Curl
    curl -i 'http://localhost:9135/w1/transaction' -X POST -H 'Content-Type:application/json' -H 'Authorization: bearer <authToken>'
  * Data Structure
  * Output
    {<transaction object with _id and empty order array>}
  ```

* Get Transaction

  ```
  * Curl
    curl -i 'http://localhost:9135/w1/transaction/:tid' -X GET -H 'Authorization: bearer <authToken>'
  * Data Structure
  * Output
    {<transaction object with _id>}
  ```

* List Transaction (history)

  ```
  * Curl
    curl -i 'http://localhost:9135/w1/transaction' -X GET -H 'Authorization: bearer <authToken>'
  * Data Structure
  * Output
    [{<list transaction object with _id>}]
  ```

* Delete Transaction
  ```
  * Curl
    curl -i 'http://localhost:9135/w1/transaction/:tid' -X DELETE -H 'Authorization: bearer <authToken>'
  * Data Structure
  * Output
    {message : Deleted transaction, Status : 200}
  ```

* Put Order

  ```
  * Curl
    curl -i 'http://localhost:9135/w1/order/:tid' -X PUT -H 'Content-Type:application/json' -d '{"item":"<itemId>","tos":<constants.TOS>, "tow":<constants.TOW>,"quantity":<val>,"status":null,"cost":null,"orderType":<constants.OTYPE>,"sagent":null,"delvagent":null}' -H 'Authorization: bearer <authToken>'
  * Data Structure
    {
      "item" : <item id>,
      "tos" : <type of service - wash : 0/iron : 1/wash and iron : 2/ dry clean : 3>,
      "tow" : <type of wash - classic : 0/super : 1/ultra : 2>,
      "quantity" : <number in units - kg in common and item count in bulk and selective>,
      "status" : null,
      "cost" : null,
      "orderType" : <order type - selective : 0/common : 1/bulk : 2>,
      "sagent" : null,
      "delvagent" : null
    }
  * Output
    {<transaction object with one object(new) is order array>}
  ```

* Get Order

  ```
  * Curl
    curl -i 'http://localhost:9135/w1/:tid/:id' -X GET -H 'Authorization: bearer <authToken>'
  * Data Structure
  * Output
    {<transaction object with just _id and order array with one object as specified by :id>}
  ```

* Delete Order

  ```
  * Curl
    curl -i 'http://localhost:9135/w1/order/:tid/:id' -X DELETE -H 'Authorization: bearer <authToken>'
  * Data Structure
  * Output
    {message : Deleted the order, Status : 200}
  ```

* Update Order

  ```
  * Curl
    curl -i 'http://localhost:9135/w1/order/:tid/:id' -X PUT -H 'Content-Type:application/json' -d '{<update Order structure with _id>}' -H 'Authorization: bearer <authToken>'
  * Data Structure
    {
      <order structure with changes>,
      "_id" : "<_id of order>"
    }
  * Output
    {"_id":"transaction id", "order":[{<only the update order document>}]}
  ```

### Billing Module
