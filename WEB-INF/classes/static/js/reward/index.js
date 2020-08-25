/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#rewardIndex',
    data: {
        search: {
            //clueId: '',
            serialNumber:'',
            userName: '',
            validate: -1,
            minAmount: '',
            maxAmount: '',
            beginDate: '',
            endDate: '',
            type: -1
        },
        authority: 0,
        rewards: [],
        beginIndex: 0,
        params: [],
        url: getUrl('reward/getRewards'),
        exportUrl: getUrl("reward/exportExcel")
    },
    methods: {
        getRewards: function (msg) {
            if ("msg" != msg) {
                pageVM.current_page = 1;
            }
            var beginDate = $("#txtBeginDate").val();
            app.search.beginDate = beginDate;
            var endDate = $("#txtEndDate").val();
            app.search.endDate = endDate;
            var pageIndex = pageVM.current_page;
            var pageSize = 10;
            var params = {
                //clueId: this.search.clueId,
                serialNumber:this.search.serialNumber,
                userName: this.search.userName,
                validate: this.search.validate,
                minAmount: this.search.minAmount,
                maxAmount: this.search.maxAmount,
                beginDate: this.search.beginDate,
                endDate: this.search.endDate,
                pageIndex: pageIndex,
                pageSize: pageSize,
                type: this.search.type
            };
            this.params = params;
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    this.rewards = response.data.obj.rows;
                    $("#txtBeginDate").val(app.search.beginDate);
                    $("#txtEndDate").val(app.search.endDate);
                    pageVM.pages = Math.ceil(response.data.obj.total / params.pageSize);
                    this.beginIndex = (pageIndex - 1) * pageSize;
                    this.exportUrl = getUrl("reward/exportExcel") + "?" + getExportExcelParams(this.params);
                    getChildesCount();
                })
        },
        getUserAuthority : function () {
            this.$http.post(getUrl("/user/currentUser"), {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var user = response.data.obj;
                        this.authority = user.admin;
                    }
                    else alert('服务器内部错误');
                })
        }/*,
        tax: function (obj) {
            var msg = $(obj).data("msg");
            var data = {rewardId: msg};
            if(!confirm('请确认税费已缴纳？')) return;
            this.$http.post(getUrl("reward/updateTaxState"), data, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                    } else if (response.data.code === 403) {
                        alert(response.data.msg);
                        $('#txtSearch').click();
                        $('.close').click();
                    }
                    else alert('失败');
                })
        }*/
    }
});

function setClueId(clueId) {
    $('#hidClueId').val(clueId);
}

function clearClueId() {
    $("#hidClueId").val('');
}

function setRewardId(rewardId) {
    $('#hidRewardId').val(rewardId);
}
function clearRewardId() {
    $('#hidRewardId').val('');
}

function tax(rewardId) {
    if(!confirm('请确认税费已缴纳？')) return;
        $.ajax({
            url: "/reward/updateTaxState", //请求的url地址
            dataType: "json", //返回格式为json
            async: true, //请求是否异步，默认为异步，这也是ajax重要特性
            data: {
                "rewardId": rewardId
            }, //参数值
            type: "POST", //请求方式
            success: function () {
                $('#txtSearch').click();
            },
            error: function (res) {
                alert(res);
            }
        });
}


$(function () {
        clearClueId();
        clearRewardId();
        app.getUserAuthority();
        app.getRewards();
        $("#txtBeginDate,#txtEndDate").click(function () {
            WdatePicker();
        });
    }
);