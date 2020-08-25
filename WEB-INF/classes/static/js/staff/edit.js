/**
 * Created by Administrator on 2017/11/17.
 */

var editVM = new Vue({
    el: '#editStaff',
    data: {
        staffId: '',
        staffName: '',
        staffIcon: '',
        iconCompress: '',
        file: '',
        staffOrder: '',
        staffShow: 0,
        staffDesc: '',
        staffType: 0,
        url: getUrl('staff/addStaff'),
        uploadUrl: getUrl("fastdfs/uploadImages")
    },
    methods: {
        editStaff: function () {
            if (!this.staffName) {
                alert("请填写员工名!");
                return;
            }
            if (!this.staffDesc) {
                alert("请填写员工描述!");
                return;
            }
            if (this.file) {
                this.staffIcon = this.file;
            }
            if (!this.staffIcon) {
                alert("请上传员工头像!");
                return;
            }
            if (!this.staffOrder) {
                alert("请填写员工排序!");
                return;
            }
            var staff = {
                staffId: this.staffId
                , staffName: this.staffName
                , staffIcon: this.staffIcon
                , staffOrder: this.staffOrder
                , staffShow: this.staffShow
                , staffDesc: this.staffDesc
                , staffType: this.staffType
            };
            if (this.staffId) {
                this.url = getUrl("staff/updateStaff");
            }
            this.$http.post(this.url, staff, {emulateJSON: true})
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
        },
        bindStaff: function (id) {
            this.$http.post(getUrl('staff/getStaff'), {staffId: id}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var staff = response.data.obj;
                        this.staffId = staff.staffId;
                        this.staffName = staff.staffName;
                        this.staffIcon = staff.staffIcon;
                        this.iconCompress = staff.iconCompress;
                        this.staffOrder = staff.staffOrder;
                        this.staffShow = staff.staffShow;
                        this.staffDesc = staff.staffDesc;
                        this.staffType = staff.staffType;
                    }
                    else alert('服务器内部错误');
                })
        }
    }
});

$(function () {
        var id = $("#hidStaffId").val();
        if (id != null && id.length > 0) {
            editVM.bindStaff(id);
        }
        $(".editClose").click(clearStaffId());
    }
);