//index.js
var express = require('express');
var router = express.Router();

//mongo db 연결
var db = require('./mongoDB');

//url 패턴 중 collectionName 을 db table로 지정
router.param('collectionName', function(req, res, next, collectionName) {
	req.collection = db.collection(collectionName)
	return next()
});

// 해당 테이블 전체 조회
router.get('/api/:collectionName', function(req, res) {

	req.collection.find().toArray(function(err, results) {
		if (err) return next(err)
		if (!results) return res.json({ "resultCode" : "NODATA", "resultDesc" : "No data."});
		var collectionName = req.params.collectionName;
		// json 키값 동적 할당
		var jsonData = {};
		jsonData[collectionName + "s"] = results;
		// 이미 json 형태이기 때문에 json함수 사용안해도 된다.
//		res.send(jsonData);
		res.json(jsonData);
	})
});

// 특정 이름 조회(api용)
router.get('/api/:collectionName/:key', function(req, res) {
	var collectionName = req.params.collectionName;
	var key = req.params.key;
	var jsonData = {};
	
	// 동적으로 table 조회 하기 위해
	var keyName = "";
	if(collectionName=="user"){
		keyName = "name";
	}else if(collectionName=="note"){
		keyName = "title";
	}else if(collectionName=="pizza"){
		keyName = "pizzaName";
	}
	jsonData[keyName] = key;
	
	req.collection.findOne(jsonData, function(err, result) {
		if (err) return next(err)
		if (!result) return res.json({ "resultCode" : "NODATA", "resultDesc" : "No data."});

		var jsonData = {};
		jsonData[collectionName + "s"] = result;
		console.log(result);
		res.json(jsonData);
	})
})
//_id 값을 그냥 넘겨주면 안된다. ObjectID로 변환
var ObjectID = require('mongodb').ObjectID;
// 글 저장하기
router.post('/api/:collectionName/save',(req, res, next) => {
	// 1.넘어온 값을 받는다.
	var _id = req.body._id;
	var objectId = new ObjectID(_id);
	var title = req.body.title;
	var contents = req.body.contents;
	var user = req.body.user;
	var regdate = req.body.regdate;
	
	//2. json 형태로 만든다.
	var data = {
		"_id": objectId,
		"title": title,
		"contents": contents,
		"user": user,
		"regdate": regdate
	}
	
	console.log('save');
	console.log(req.body);
	 
	//3. db에 저장한다.	
	req.collection.save(data, function(err, result) {
		if (err) return next(err)
		console.log('result : '+result);
         res.json({
         	"result":"success"
         });
         
     });
})


//node의 기타 에러 처리
process.on('unhandledRejection', function (err) {
    throw err;
});

process.on('uncaughtException', function (err) {
	throw err;
});

module.exports = router;
