/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#iprIndex',
    data: {
        beginIndex:0,
        search: {name: '', phone: '', status: -1, pay:-1},
        iprDeals: [],
        url: getUrl('iprDeal/getIprDeals')
    },
    methods: {
        getIprDeals: function (msg) {
            if ("msg" != msg) {
                pageVM.current_page = 1;
            }
            var params = {
                name: this.search.name,
                phone:this.search.phone,
                status: this.search.status,
                pay: this.search.pay,
                pageIndex: pageVM.current_page,
                pageSize: 10
            };
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    this.iprDeals = response.data.obj.rows;
                    pageVM.pages = Math.ceil(response.data.obj.total / params.pageSize);
                })
        },
        updState: function (id) {
            this.url = getUrl('iprDeal/updState');
            this.$http.post(this.url,id, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        $('#txtSearch').click();
                        $('#btnClose').click();
                    } else if (response.data.code === 403) {
                        alert(response.data.msg);
                        $('#txtSearch').click();
                        $('#btnClose').click();
                    }
                    else alert('保存失败');
                })
        }

    }
});


function updState(id) {
    if (confirm("请确认该申请已处理！")) {
        $.ajax({
            url: "/iprDeal/updState", //请求的url地址
            dataType: "json", //返回格式为json
            async: true, //请求是否异步，默认为异步，这也是ajax重要特性
            data: {
                "id": id
            }, //参数值
            type: "POST", //请求方式
            success: function (response) {
                $('#txtSearch').click();
            },
            error: function (res) {
                alert(res);
            }
        });
    }
}

function setIprDealId(iprDealId) {
    $('#hidIprDealId').val(iprDealId);
}

function clearIprDealId() {
    $("#hidIprDealId").val('');
}

$(function () {
    app.getIprDeals();
    clearIprDealId();
});
