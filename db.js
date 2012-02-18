var db={}

db.fields=["mid","content","status"];
db.table="contents_";
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
			var sql="insert into "+db.table+"("+ f.join(",")+ ") values(" +w.join(",")+")";
			//console.log(sql);
			tx.executeSql(
				sql,
				v, null, 
				function(tx, error) {
					var sql;
					sql="update "+db.table+" set "+ update.join(",")+"where mid=?"
				
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
				"delete from "+db.table,
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
				"delete from "+db.table+" where mid=?",
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
				"select * from "+db.table+" where mid=?",
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
				"select count(*) as c from "+db.table+" where status=0",
				[], 
				function(tx, result) {
					total = result.rows.item(0)['c'];
					db.db.transaction(
						function(tx) {
							tx.executeSql(
								"select * from "+db.table+" where status=0 ORDER BY mid desc limit ? offset ?",
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
		db.db =  openDatabase('weibo', '', 'weibo', 1024*1024);
		/*, function (db) {
					db.create_table();
				}
			);
		*/
		db.create_table();

	}
}
db.create_table=function(){
	db.db.transaction(
		function(tx) {
			tx.executeSql(
				"SELECT COUNT(*) FROM "+db.table,
				[], function(tx, result){
				}, 
				function(tx, error) {
					tx.executeSql(
						"CREATE TABLE "+db.table+" (mid TEXT UNIQUE,content TEXT,status REAL KEY)",
						[], null, null);
				} 
			); 
		}
	);
}
