var db={}

db.fields=["mid","userid","nickname","userlink","content","content_link",
			"date","source_name","source_link","status","forward_userid","forward_nickname","forward_userlink","forward_content"
		];
/**
 * @param params
 * params={userid:"","nickname":"",...}
 */
db.add=function(mid,params){
	var ct=1;
	db.db.transaction(
		function(tx) {
			var f=[];
			var w=[];
			var v=[];
			var update=[];
			for(var field in params){
				for(var x in db.fields){
					if(db.fields[x]==field){
						f.push(db.fields[x]);
						w.push("?");
						v.push(params[field]);
						update.push(db.fields[x]+"=?");
						break;
					}
				}
			}
			f.push("mid");
			w.push("?");
			v.push(mid);
			if(f.length==0)return;
			var sql="insert into contents("+ f.join(",")+ ") values(" +w.join(",")+")";
			//console.log(sql);
			tx.executeSql(
				sql,
				v, null, 
				function(tx, error) {
					var sql;
					sql="update contents set "+ update.join(",")+"where mid=?"
				
					tx.executeSql(
						sql,
						v, null, 
						function(tx, error) {
							console.log(error);
							//alert(error.code+":"+error.message);
						} 
					);
				} 
			); 
		}
	);
			
}
db.clear=function(){
	db.db.transaction(
		function(tx) {
			tx.executeSql(
				"delete from contents",
				[], null, 
				function(tx, error) {
					console.log(error);
				} 
			); 
		}
	);
}
db.del=function(mid){
	db.db.transaction(
		function(tx) {
			tx.executeSql(
				"delete from contents where mid=?",
				[mid], null, 
				function(tx, error) {
					console.log(error);
				} 
			); 
		}
	);
}
db.get=function(mid,callback,o){
	db.db.transaction(
		function(tx) {
			tx.executeSql(
				"select * from contents where mid=?",
				[mid],
				function(tx, result) {
					var r;
					for(var i = 0; i < result.rows.length; i++){
						r = (result.rows.item(i));//['url']);
					}
					if(callback)callback(r,o);
					return r;
				},function(tx,error){
					console.log(error);
				}
			); 
		}
	);
}
db.list = function(page,pageSize,callback){
	page = page?page:1;
	pageSize = pageSize?pageSize:15;
	
	var total;
	db.db.transaction(
		function(tx) {
			tx.executeSql(
				"select count(*) as c from contents",
				[], 
				function(tx, result) {
					total = result.rows.item(0)['c'];
					db.db.transaction(
						function(tx) {
							tx.executeSql(
								"select * from contents ORDER BY mid desc limit ? offset ?",
								[pageSize,(page-1)*pageSize], 
								function(tx, result) {
									var d= new Array();//[];
									for(var i = 0; i < result.rows.length; i++){
										d.push(result.rows.item(i));//['url']);
									}
									var r={
										totalSize:total, 
										totalPage:Math.ceil(total/pageSize),
										page:page,
										pageSize:pageSize,
										items:d
									};
									if(callback)callback(r);
								},
								function(tx, error) {
									//alert(error.code+":"+error.message);
									console.log(error);
								}
							); 
						}
					);	


				},
				function(tx, error) {
					//alert(error.code+":"+error.message);
					console.log(error);
				}
			); 
		}
	);		
}
db.init = function(){
	if (window.openDatabase){
		// openDatabase(name, version, displayName, in unsigned long estimatedSize, in optional creationCallback);
		db.db =  openDatabase('weibo', '', 'weibo', 1024*1024, function (db) {
			db.transaction(
				function(tx) {
					tx.executeSql(
						"SELECT COUNT(*) FROM contents",
						[], null, 
						function(tx, error) {
							console.log(error);
							tx.executeSql(
								"CREATE TABLE contents ( mid TEXT UNIQUE,  userid REAL,  nickname TEXT, userlink TEXT, content TEXT, content_link TEXT, date REAL, source_name TEXT, source_link TEXT, status REAL, forward_userid REAL,  forward_nickname TEXT, forward_userlink TEXT, forward_content TEXT)",
								[], null, null);
						} 
					); 
				}
			);
							
		});
	}
}
db.init();
//db.clear();
/*
db.add("xx",{content:"x33333333333"});
function x(r){alert(r);}
db.get("xx",x);
//db.list(1,100);
*/