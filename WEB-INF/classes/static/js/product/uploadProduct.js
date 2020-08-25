$(function () {
    $("#fileUploadFont").fileinput({
        language: 'zh', //设置语言
        uploadUrl: editVM.uploadUrl, //上传的地址(访问接口地址)
        allowedFileExtensions: ['jpg', 'gif', 'png'],//接收的文件后缀
        //uploadExtraData:{"id": 1, "fileName":'123.mp3'},
        uploadAsync: true, //默认异步上传
        showUpload: true, //是否显示上传按钮
        showRemove : true, //显示移除按钮
        showPreview : true, //是否显示预览
        showCaption: false,//是否显示标题
        browseClass: "btn btn-primary", //按钮样式
        dropZoneEnabled: false,//是否显示拖拽区域
        maxFileCount: 10, //表示允许同时上传的最大文件个数
        enctype: 'multipart/form-data',
        validateInitialCount:true,
        msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！"
    });
//异步上传返回错误结果处理
    $('#fileUploadFont').on('fileerror', function(event, data, msg) {
        // get message
        alert(msg);
    });
//异步上传返回结果处理
    $("#fileUploadFont").on("fileuploaded", function (event, data, previewId, index) {
        var obj = data.response;
        editVM.fontFile = obj.obj.substr(0,obj.obj.length-1);
    });
    $("#fileUploadBack").fileinput({
        language: 'zh', //设置语言
        uploadUrl: editVM.uploadUrl, //上传的地址(访问接口地址)
        allowedFileExtensions: ['jpg', 'gif', 'png'],//接收的文件后缀
        //uploadExtraData:{"id": 1, "fileName":'123.mp3'},
        uploadAsync: true, //默认异步上传
        showUpload: true, //是否显示上传按钮
        showRemove : true, //显示移除按钮
        showPreview : true, //是否显示预览
        showCaption: false,//是否显示标题
        browseClass: "btn btn-primary", //按钮样式
        dropZoneEnabled: false,//是否显示拖拽区域
        maxFileCount: 1, //表示允许同时上传的最大文件个数
        enctype: 'multipart/form-data',
        validateInitialCount:true,
        msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！"
    });
//异步上传返回错误结果处理
    $('#fileUploadBack').on('fileerror', function(event, data, msg) {
        // get message
        alert(msg);
    });
//异步上传返回结果处理
    $("#fileUploadBack").on("fileuploaded", function (event, data, previewId, index) {
        var obj = data.response;
        editVM.backFile = obj.obj.substr(0,obj.obj.length-1);
    });

});