
var app = new Vue({
    el: '#userIndex',
    data: {
        enterpriseId:'',
        enterpriseType:'',
        search: {name: '', email: '', userState: -1,  beginDate: '', endDate: '',position:'',department:''},
        users: [],
        beginIndex: 0,
        params: [],
        url: getUrl('user/getEnterpriseUsers')
    },
    methods: {
        getEnterpriseUsers: function (msg) {
            if ("msg" != msg) {
                pageVM.current_page = 1;
            }

            var state = this.search.userState;

            var beginDate = $("#txtBeginDate").val();
            app.search.beginDate = beginDate;
            var endDate = $("#txtEndDate").val();
            app.search.endDate = endDate;
            var pageIndex = pageVM.current_page;
            var pageSize = 10;
            this.enterpriseId=request('id');
            this.enterpriseType=request('type');
            var params = {
                enterpriseId:this.enterpriseId,
                name: this.search.name,
                position: this.search.position,
                department: this.search.department,
                email: this.search.email,
                userState: state,
                beginDate: this.search.beginDate,
                endDate: this.search.endDate,
                pageIndex: pageIndex, pageSize: pageSize
            };
            this.params = params;
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        this.users = response.data.obj.rows;
                        $("#txtBeginDate").val(app.search.beginDate);
                        $("#txtEndDate").val(app.search.endDate);
                        pageVM.pages = Math.ceil(response.data.obj.total / params.pageSize);//要进行取整处理
                        this.beginIndex = (pageIndex - 1) * pageSize;
                        // this.exportUrl = getUrl("user/exportExcel") + "?" + getExportExcelParams(this.params);
                    }
                    else alert(response.data.msg);
                })
        }
    }
});

function setUserId(userId) {
    $('#hidUserId').val(userId);
}

function clearUserId() {
    $("#hidUserId").val('');
}

function setActivated(userId,activated) {
    var allow = confirm('确定进行此操作？');
    if (allow) {
        app.$http.post(getUrl('user/updateActivated'), {userId: userId,activated:activated}, {emulateJSON: true})
            .then(function (response) {
                if(response.data.code==413)
                    alert(response.data.msg);
                app.getEnterpriseUsers();
            })
    }
}


$(function () {
        app.getEnterpriseUsers();
        clearUserId();
        $("#txtBeginDate,#txtEndDate").click(function () {
            WdatePicker();
        });
    }
);