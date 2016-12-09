//db.mcis.createIndex({Lbl_Council:1})
//db.mcis.createIndex({Regis_no:"text", Name:"text"})

db.mcis.createIndex({"Name" : "text", "Regis_no": "text"})
db.mcis.find({ $text : { $search : "pritum]" }  })

//db.mcis.createIndex({ Lbl_Council : 1 , Name:"text", Regis_no:"text" } , { weights : { Name :10 }} )
db.mcis.createIndex({ Lbl_Council : 1 , Name:"text", Regis_no:"text" } )


//db.mcis.explain("allPlansExecution").remove( { Lbl_Council : "Rajasthan Medical Council" ,   Name: { $regex : "amit", '$options':'i' } } , { score: { $meta: "textScore" } }  )

//db.hospitals.createIndex({district:1})
//db.hospitals.createIndex({Hospital_Name:"text", Location:"text"})

//db.bloodbanks.createIndex({city:1})
//db.bloodbanks.createIndex({h_name:"text"})

db.students.find({"scores.type":"exam"}).explain("allPlansExecution")
db.students.find({"scores.score": { '$gt':1 }}).explain("allPlansExecution")
