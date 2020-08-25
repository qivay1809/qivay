/**
 * Created by Administrator on 2017/11/17.
 */
var permissionVM = new Vue({
    el: '#permissions',
    data: {
        search: {roleId: '',dataType: -1,objectId:'',fieldName:''},
        permissions: [],
        dataObjects: [],
        beginIndex: 0,
        url: getUrl('role/getRolePermissions')
    },
    methods: {
        getPermissions: function () {
            var pageIndex = participantPageVM.current_page;
            var pageSize = 10;
            var params = {
                roleId: this.search.roleId
                , dataType: this.search.dataType
                , fieldName: this.search.fieldName
                , objectId: this.search.objectId,
                pageIndex: pageIndex, pageSize: pageSize
            };
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    this.permissions = response.data.obj.rows;
                    participantPageVM.pages = Math.ceil(response.data.obj.total / params.pageSize);
                    this.beginIndex = (pageIndex - 1) * pageSize;
                })
        },
        getDataObjects: function () {
            this.$http.post(getUrl('role/getDataObjects'), {emulateJSON: true})
                .then(function (response) {
                    this.dataObjects = response.data.obj;
                })
        }

    }
});

function deletePermission(rolePermissionId) {
    $.confirm({
        title: '删除权限',
        content: '<h4>您确定要删除吗？</h4>',
        buttons: {
            '确定': {
                btnClass: 'btn-primary',
                action: function () {
                    var params = {
                        rolePermissionId: rolePermissionId
                    };
                    app.$http.post(getUrl('role/deletePermission'),params, {emulateJSON: true}).then(function (response) {
                        if (response.data.code === 200) {
                            $('#btnSearch2').click();
                        }
                        else alert('保存失败');
                    })
                }
            },
            '取消': {
                btnClass: 'btn-default',
                action: function () {
                }
            }
        }
    });
}

function removeDialogClass() {
    $(".modal-dialog").removeClass("dialogSize2");
}


$(function () {
        $(".modal-dialog").addClass("dialogSize2");
        permissionVM.getDataObjects();
        var id = $("#hidRoleId").val();
        permissionVM.search.roleId = id;
        permissionVM.getPermissions();
    }
);