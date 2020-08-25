/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#menuIndex',
    data: {
        search: {menuName: '', createBeginDate: '', createEndDate: '', updateBeginDate: '', updateEndDate: ''},
        menus: [],
        url: getUrl('menu/getMenus')
    },
    methods: {
        getMenus: function (msg) {
            if ("msg" != msg) {
                pageVM.current_page = 1;
            }
            this.search.createBeginDate = $("#txtCreateBeginDate").val();
            this.search.createEndDate = $("#txtCreateEndDate").val();
            this.search.updateBeginDate = $("#txtUpdateBeginDate").val();
            this.search.updateEndDate = $("#txtUpdateEndDate").val();
            var params = {
                menuName: this.search.menuName
                , createBeginDate: this.search.createBeginDate, createEndDate: this.search.createEndDate
                , updateBeginDate: this.search.updateBeginDate, updateEndDate: this.search.updateEndDate, pageIndex: pageVM.current_page, pageSize: 10
            };
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    this.menus = response.data.obj.rows;
                    $("#txtCreateBeginDate").val(this.search.createBeginDate);
                    $("#txtCreateEndDate").val(this.search.createEndDate);
                    $("#txtUpdateBeginDate").val(this.search.updateBeginDate);
                    $("#txtUpdateEndDate").val(this.search.updateEndDate);
                    pageVM.pages = Math.ceil(response.data.obj.total / params.pageSize);//要进行取整处理
                })
        }

    }
});

function setMenuId(menuId) {
    $('#hidMenuId').val(menuId);
}

function clearMenuId() {
    $("#hidMenuId").val('');
}

$(function () {
        $(".date").click(function () {
            WdatePicker();
        });
        app.getMenus();
        clearMenuId();
    }
);