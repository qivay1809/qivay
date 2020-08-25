/**
 * Created by Administrator on 2017/11/17.
 */

var editVM = new Vue({
    el: '#editMenu',
    data: {
        menuId: '',
        menuName: '',
        menuCode: '',
        menuUrl: '',
        menuOrder: '',
        parentId: '',
        parents: [],
        url: getUrl('menu/addMenu')
    },
    methods: {
        editMenu: function () {
            if (!this.menuName) {
                alert("请填写菜单名!");
                return;
            }
            if (!this.menuOrder) {
                alert("请填写菜单顺序!");
                return;
            }
            var menu = {
                menuId: this.menuId
                , menuName: this.menuName
                , menuCode: this.menuCode
                , menuUrl: this.menuUrl
                , menuOrder: this.menuOrder
                , parentId: this.parentId
            };
            if (this.menuId) {
                this.url = getUrl('menu/updateMenu');
            }
            this.$http.post(this.url, menu, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        $('#txtSearch').click();
                        $('#btnClose').click();
                    }else if(response.data.code === 403){
                        alert(response.data.msg);
                    }
                    else alert('保存失败');
                })
        },
        bindMenu: function (id) {
            this.$http.post(getUrl('menu/getMenu'), {menuId: id}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var menu = response.data.obj;
                        this.menuId = menu.menuId;
                        this.menuName = menu.menuName;
                        this.menuCode = menu.menuCode;
                        this.menuUrl = menu.menuUrl;
                        this.menuOrder = menu.menuOrder;
                        if (menu.parentId) {
                            this.parentId = menu.parentId;
                        }
                    }
                    else alert('服务器内部错误');
                })
        },
        getParents: function () {
            this.$http.post(getUrl('menu/getAll'), {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        this.parents = response.data.obj;
                    }
                    else alert('服务器内部错误');
                })
        }
    }
});

$(function () {
        editVM.getParents();
        var id = $("#hidMenuId").val();
        if (id != null && id.length > 0) {
            $('#divPassword').hide();
            editVM.bindMenu(id);
        } else {
            editVM.gender = null;
        }
        $(".editClose").click(clearMenuId);
    }
);