/**
 * Created by Administrator on 2017/11/17.
 */
var permissionVM = new Vue({
    el: '#selectDataType',
    data: {
        dataType: -1,
        dataObjects: []
    },
    methods: {
        getDataObjects: function () {
            this.$http.post(getUrl('role/getDataObjects'), {emulateJSON: true})
                .then(function (response) {
                    this.dataObjects = response.data.obj;
                })
        },
        setDataType: function () {
            if (this.dataType == -1){
                alert("请选择数据类型!");
                return;
            }
            $("#dataType").val(this.dataType);
            var href = '';
            if (this.dataType == 0){
                href = "region.html";
            }else if (this.dataType == 1){
                href = "clue.html";
                $(".modal-dialog").addClass("dialogSize");
            }
            var permission = $(".addPermission");
            permission.attr("href",href);
            permission.click();
        }
    }
});


$(function () {
        $(".modal-dialog").removeClass("dialogSize");
        permissionVM.getDataObjects();
    }
);