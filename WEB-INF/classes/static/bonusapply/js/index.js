/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#bonusApplyIndex',
    data: {
        loading:true,
        beginIndex:0,
        search: {bonusType: -1, validate: -1, name:'',cellphone:'',amount:''},
        bonusApplys: [],
        allAmount: 0,
        total:0,
        applys:[],
        url: getUrl('bonusApply/getBonusApplys')
        //exportUrl: getUrl('bonus/exportExcel')
    },
    methods: {
        getBonusApplys: function (msg) {
            if ("msg" != msg) {
                pageVM.current_page = 1;
            }
            var params = {
                bonusType: this.search.bonusType,
                validate: this.search.validate,
                name: this.search.name,
                cellphone: this.search.cellphone,
                amount: this.search.amount,
                pageIndex: pageVM.current_page,
                pageSize: 15
            };
            this.params = params;
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    var allAmountStr = response.data.msg;
                    this.allAmount = Math.round(allAmountStr * 100) / 100;
                    this.total = response.data.obj.total;
                    this.bonusApplys = response.data.obj.rows;
                    pageVM.pages = Math.ceil(response.data.obj.total / params.pageSize);
                    //this.exportUrl = getUrl("bonus/exportExcel") + "?" + getExportExcelParams(this.params);
                    if(response.data.code === 200){
                        this.loading=false;
                    }
                });
            clearCheckBox();
        },
        batchCheck: function (msg) {
            this.loading=true;
            if ($('input[type=checkbox]:checked').length < 1){
                alert("请选择要审核的列!");
                return;
            }
            $('#sendType').val(msg);

            $('td input[type=checkbox]:checked').each(function () {
                app.applys.push($(this).val());
            });
            if(!confirm("确认要批量通过"+this.applys.length + "条数据？")) return;
            var count = 0;
            for(var i = 0;i < this.applys.length; i++ ){
                var data = {bonusApplyId: this.applys[i], validate: 1, remark: ""};
                //$.ajaxSettings.async = false;
                this.$http.post(getErpUrl("transfer/checkBonusApply"), data, {emulateJSON: true})
                    .then(function (response) {
                        if (response.data.code === 200) {
                            $('#txtSearch').click();
                            $('.checkClose').click();
                        } else if (response.data.code === 313) {
                            var msg = response.data.msg;
                            alert(msg);
                            $('#txtSearch').click();
                            if(msg == '未通过'){
                                $('.checkClose').click();
                            }
                        }
                        else alert('保存失败：'+response.data.msg);
                    });
                //$.ajaxSettings.async = false;
                sleep(10000);
                count++;
            }
        }
    }
});

function sleep(milliSeconds) {
    var startTime = new Date().getTime();
    while (new Date().getTime() < startTime + milliSeconds) {
        //console.log(new Date().getTime());
    }//暂停一段时间 10000=1S。
}

function clearCheckBox() {
    $(':checkbox').prop("checked",false);
}

function selectAll() {
    $("td :checkbox").prop("checked",$("#myCheckBox").prop("checked"));
}

/*function setSendType(msg) {
    app.loading=true;
    console.log(app.loading);
    if ($('input[type=checkbox]:checked').length < 1){
        alert("请选择要审核的列!");
        return;
    }
    $('#sendType').val(msg);
    app.batchCheck();
}*/



function setbonusApplyId(applyId) {
    $('#hidbonusApplyId').val(applyId);
}

function clearbonusApplyId() {
    $("#hidbonusApplyId").val('');
}



$(function () {
    app.getBonusApplys();
    clearbonusApplyId();
});
