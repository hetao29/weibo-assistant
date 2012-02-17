

function check(r,o){
	var mid= $(o).attr("mid");
	if(r){
		if(parseInt(r.status)==1){
			//console.log("已经读" +mid);
			$("dl[mid="+r.mid+"]").addClass("readed");
			
		}else{
			//console.log("没有读" +mid);
		}

	}else{
		//console.log("新记录" +mid);
		db.add(mid,{content:"x33333333333"});
	}

}
//$(document).ready(function(){

	{

		var xMousePos = 0;
		var yMousePos = 0;
		var lastScrolledLeft = 0;
		var lastScrolledTop = 0;

		$(document).mousemove(function(event) {
			captureMousePosition(event);
		})  

		$(window).scroll(function(event) {
			if(lastScrolledLeft != $(document).scrollLeft()){
				xMousePos -= lastScrolledLeft;
				lastScrolledLeft = $(document).scrollLeft();
				xMousePos += lastScrolledLeft;
			}
			if(lastScrolledTop != $(document).scrollTop()){
				yMousePos -= lastScrolledTop;
				lastScrolledTop = $(document).scrollTop();
				yMousePos += lastScrolledTop;
			}

			
			$("dl[mid]:not(.readed)").each(function(i,dom){
				if(xMousePos >=$(this).offset().left && xMousePos<=$(this).offset().left+$(this).width()){
					if(yMousePos >=$(this).offset().top && yMousePos<=$(this).offset().top+$(this).height()){
						//已经阅读
						//console.log($(this).attr("mid"));
						var o = $(this);
						setTimeout(function(){
							var mid=$(o).attr("mid");
							$(o).attr("readed","true");
							//已经阅读
							db.add(mid,{status:1});
							$(o).addClass("readed");
						},1000);
					}

				}
			});
		});
		function captureMousePosition(event){
			xMousePos = event.pageX;
			yMousePos = event.pageY;
		}


		$("#pl_content_publisherTop [node-type='publishBtn']").live("click",function(){

			 if($("#mypic").size()>0){
				 $("#mypic").remove();
			 }

		});


		$("dl[mid]:not(.readed)").live("mouseover",function(){
			var o = $(this);
			setTimeout(function(){
				var mid=$(o).attr("mid");
				$(o).attr("readed","true");
				//已经阅读
				db.add(mid,{status:1});
				$(o).addClass("readed");
			},1000);
		});

		$("#pl_content_homeFeed [node-type='feed_list']").live("DOMSubtreeModified",function(){

			

				
			var r=$("dl.W_no_border").removeClass("W_no_border");
			var r=$("dl[mid]:not(.readed)");
			r.each(function(i,dom){
				var mid=$(this).attr("mid");
				db.get(mid,check,$(this));
			});
		});
		
		$("dl[mid]:not(.readed)").each(function(i,dom){
			console.log("init");
			var mid=$(this).attr("mid");
			db.get(mid,check,$(this));
		});
	}
	
//});







function pasteIntercept(e) {
	var items = e.clipboardData.items;
	for (var i = 0; i < items.length; ++i) {
		var item = e.clipboardData.items[i];
		if (items[i].kind == 'file' && items[i].type == 'image/png') {

			var html='<div class="W_layer" id="mypic" node-type="outer" style="left: 358px; top: 213px; ">	<div class="bg"><table ellspacing="0" cellpadding="0" border="0"><tbody><tr><td><div class="content" node-type="layoutContent"><div node-type="inner"><div node-type="outer"><div class="layer_send_pic" node-type="wrap" style=""><div node-type="uploaded"><div ode-type="picWrap" class="laPic_Pic"><br>正在上传图片中...	<div ode-type="flashPanel"></div></div></div></div></td></tr></tbody></table><div class="arrow rrow_t" node-type="arrow"></div></div></div>';

			if($("#mypic").size()>0){
			$("#mypic").remove();
			}
			$("body").append(html).show();


			var fileReader = new FileReader();
			var file = item.getAsFile()

			fileReader.onloadend = function () {
				upload(this.result);
			};
			fileReader.readAsBinaryString(file);
			break; 
		}
	}
}
document.onpaste=pasteIntercept
if (!window.BlobBuilder && window.WebKitBlobBuilder)
    window.BlobBuilder = window.WebKitBlobBuilder;

XMLHttpRequest.prototype.sendAsBinary = function(datastr) {
        var bb = new BlobBuilder();
        var data = new ArrayBuffer(1);
        var ui8a = new Uint8Array(data, 0);
        for (var i in datastr) {
                if (datastr.hasOwnProperty(i)) {
                        var chr = datastr[i];
                        var charcode = chr.charCodeAt(0)
                        var lowbyte = (charcode & 0xff)
                        ui8a[0] = lowbyte;
                        bb.append(data);
                }
        }
        var blob = bb.getBlob();
        this.send(blob);
}

//{{{
	/*

function addScriptContent(content){
    js=unescape(content);
    var g = document.createElement("script");
    g.type = "text/javascript";
    g.text = js;
    document.getElementsByTagName('head')[0].appendChild(g);
};
	*/
//}}}
function upload(d){
	

	var self = this;
	var data = this.getBuild(d);
	
	this.XHR = new XMLHttpRequest();
	this.XHR.onuploadprogress = self.onprogress; 
	this.XHR.onreadystatechange = function(e){
		if(this.readyState == this.DONE){
		 var parser = new DOMParser()
        xmlDoc = parser.parseFromString(this.responseText, "application/xml")
		//	 console.log(xmlDoc);
		 var x = xmlDoc.getElementsByTagName('pid');
		 var pid=x[0].firstChild.nodeValue;
		 console.log(pid);
		 var html='<div class="W_layer" id="mypic" node-type="outer" style="left: 358px; top: 213px; ">	<div class="bg">		<table ellspacing="0" cellpadding="0" border="0"><tbody><tr><td><div class="content" node-type="layoutContent"><div node-type="inner"><div node-type="outer"><div class="layer_send_pic" node-type="wrap" style=""><div node-type="uploaded"><div style="height:20px"></div><div ode-type="picWrap" class="laPic_Pic"><img src="http://ww4.sinaimg.cn/small/'+pid+'.jpg"></div><div class="lapic_edit"><a class="delete" href="#" ref="javascript:void(0);" action-type="delete">删除</a></div></div></div><div ode-type="flashPanel"></div></div></div></div></td></tr></tbody></table><div class="arrow rrow_t" node-type="arrow"></div>	</div></div>';
		
		 if($("#mypic").size()>0){
			 $("#mypic").remove();
		 }
		$("body").append(html).show();
		 
		$("#pl_content_publisherTop textarea").attr("extra",pid);
		 $("#mypic .delete").live("click",function(){
			 $("#pl_content_publisherTop textarea").attr("extra",null);
			$("#mypic").remove();
		 });
		}
	}; 

	var nickname = $("#pl_leftNav_common .name").html();
	var url = "weibo.com"+$("#pl_content_top [node-type='home']").attr("href");
//	console.log(nickname);console.log(url);
	this.XHR.open("POST", "http://picupload.service.weibo.com/interface/pic_upload.php?app=miniblog&marks=1&logo=1&nick="+nickname+"&url="+url+"&markpos=1&s=xml&cb=http://weibo.com/upimgback.html&rq=http%3A%2F%2Fphoto.i.weibo.com%2Fpic%2Fadd.php%3Fapp%3D1", true);

	//this.XHR.open("POST", "http://picupload.service.weibo.com/interface/pic_upload.php?app=miniblog&marks=1&logo=1&nick=%40%E4%BA%BA%E5%8F%AF%E6%B0%B4%E5%85%BD&url=weibo.com/231073376&markpos=1&s=xml&cb=http://weibo.com/upimgback.html&rq=http%3A%2F%2Fphoto.i.weibo.com%2Fpic%2Fadd.php%3Fapp%3D1", true);

	this.XHR.setRequestHeader("Content-type", "multipart/form-data; boundary=" + data.boundary);
	this.XHR.overrideMimeType("text/plain; charset=x-user-defined-binary");		//read.readAsDataURL(file);
	if(this.XHR.sendAsBinary){
	//	console.log("this.XHR.sendAsBinary");
		this.XHR.sendAsBinary(data.builder);
	}else{
		console.log("send");
	//	this.XHR.send(data.builder);
	}
}

function getBuild(o){
	//"http 数据区域"
	
	// --分隔符回车换行
	// Content-Disposition:... 回车换行
	// Content-Type:...回车换行回车换行
	// 2进制数据回车换行
	// --分隔符--回车换行
	
	var boundary = '-----------------' + (new Date).getTime();
	var dashdash = '--';
	var crlf     = '\r\n';
	
	var builder = '';
	/*请求开始分隔符*/
	builder += dashdash+boundary+crlf;
	
	/* 生成请求头 */            
	builder += 'Content-Disposition: form-data; name="'+'pic1' +'"; filename="' + 'screen.png' + '"'+ crlf;
	//builder += 'Content-Type: application/octet-stream'+ crlf + crlf; // http://blog.csdn.net/fanweiwei/archive/2007/09/17/1787747.aspx
	builder += 'Content-Type: image/png'+ crlf + crlf; // http://blog.csdn.net/fanweiwei/archive/2007/09/17/1787747.aspx
	//builder +='Content-Type:text/plain; '+ crlf + crlf

	/* 二进制数据 */
	builder += o + crlf;
 
	/* 请求结束分隔符 */
	builder += dashdash + boundary + dashdash + crlf;

 
	return {
		boundary : boundary,
		builder : builder
	};
}