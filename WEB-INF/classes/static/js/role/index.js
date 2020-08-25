/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#roleIndex',
    data: {
        search: {
            roleId: '',
            roleName: '',
            description: ''
        },
        roles: [],
        beginIndex: 0,
        params: [],
        url: getUrl('role/getRoles')
    },
    methods: {
        getRoles: function (msg) {
            if ("msg" != msg) {
                pageVM.current_page = 1;
            }
            var pageIndex = pageVM.current_page;
            var pageSize = 10;
            var params = {
                roleId: this.search.roleId,
                roleName: this.search.roleName,
                description: this.search.description,
                pageIndex: pageIndex,
                pageSize: pageSize
            };
            this.params = params;
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    this.roles = response.data.obj.rows;
                    pageVM.pages = Math.ceil(response.data.obj.total / params.pageSize);
                    this.beginIndex = (pageIndex - 1) * pageSize;
                })
        }

    }
});

function setRoleId(roleId) {
    $('#hidRoleId').val(roleId);
}


function clearRoleId() {
    $("#hidRoleId").val('');
}

$(function () {
        clearRoleId();
        app.getRoles();
    }
);