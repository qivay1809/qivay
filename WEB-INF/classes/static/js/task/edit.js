/**
 * Created by Administrator on 2017/11/17.
 */

var editTaskVM = new Vue({
    el: '#editTask',
    data: {
        taskTitle: '',
        taskContent: '',
        reward: '',
        taskOrder: 0,
        taskWeight: 0,
        taskType: -1,
        brandId: '',
        deadlineDisplay: '',
        clues: -1,
        brands: [],
        industry: '',
        province: '',
        provinceId: '',
        city: '',
        provinces: [],
        cities: [],
        url: getUrl('task/addTask')
    },
    methods: {
        editTask: function () {
            if (!this.taskTitle) {
                alert("请填写任务标题!");
                return;
            }
            if (!this.taskContent) {
                alert("请填写任务内容!");
                return;
            }
            if (!this.reward) {
                alert("请填写奖金!");
                return;
            }
            if (!this.clues || this.clues == -1) {
                alert("请填写需求线索数量!");
                return;
            }
            if (this.taskType == -1) {
                alert("请选择任务类型!");
                return;
            }
            // if (!this.brandId) {
            //     alert("请选择品牌!");
            //     return;
            // }
            this.deadlineDisplay = $("#txtDeadlineDisplay").val();
            if (!this.deadlineDisplay) {
                alert("请填写截止日期!");
                return;
            }
            var str = $("#selProvinceId").find("option:selected").text();
            var task = {
                taskTitle: this.taskTitle
                , taskContent: this.taskContent
                , reward: this.reward
                , taskOrder: this.taskOrder
                , taskWeight: this.taskWeight
                , taskType: this.taskType
                , brandId: this.brandId
                , taskId: '',
                deadlineDisplay: this.deadlineDisplay,
                clues: this.clues,
                industry: this.industry,
                province: str.replace(/[\r\n]/g, "").replace(/\s+/g, ""),

                city: this.city
            };
            var id = $("#hidTaskId").val();
            if (id != null && id.length > 0) {
                this.url = getUrl('task/updateTask');
                task.taskId = id;
            }
            this.$http.post(this.url, task, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        $('#txtSearch').click();
                        $('#btnClose').click();
                    } else if (response.data.code === 403) {
                        alert(response.data.msg);
                        // $('#txtSearch').click();
                        // $('#btnClose').click();
                    }
                    else alert('保存失败');
                })
        },
        bindTask: function (id) {
            this.$http.post(getUrl('task/findTask'), {taskId: id}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var task = response.data.obj;
                        this.taskTitle = task.taskTitle;
                        this.taskContent = task.taskContent;
                        this.reward = task.reward;
                        this.taskOrder = task.taskOrder;
                        this.taskWeight = task.taskWeight;
                        this.taskType = task.taskType;
                        // this.brandId = task.brand.brandId;
                        this.clues = task.clues;
                        this.deadlineDisplay = task.deadlineDisplay;
                        $("#txtDeadlineDisplay").val(this.deadlineDisplay);
                        this.industry = task.industry;
                        this.province = task.province;
                        this.city = task.city;

                        // $("#selProvinceId option[text="+task.province+"]").attr("selected", true);
                        // alert($("#selProvinceId option[text="+task.province+"]").val());
                        setTimeout(this.bindProvinceId(task.province,task.city), 1500);

                    }
                    else alert('服务器内部错误');
                })
        },
        getBrands: function () {
            this.$http.post(getUrl('brand/getAllBrands'), {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var brands = response.data.obj;
                        this.brands = brands;
                    }
                    else alert('服务器内部错误');
                })
        },
        getAllProvince: function () {
            this.$http.post(getUrl('region/getProvinces'), {emulateJSON: true})
                .then(function (response) {
                    this.provinces = response.data.obj;
                })
        },
        getAllSubrange: function (id, msg) {

            // alert("id:" + this.provinceId);
            if (id) {
                this.$http.post(getUrl('region/getChildes'), {regionId: id}, {emulateJSON: true})
                    .then(function (response) {
                        this.cities = response.data.obj;
                        // if (!msg) {
                        //     this.cityId = '';
                        // }
                    })
            }
        },
        bindProvinceId: function (province,city) {
            // alert("province:" + province);
            // alert("this.provinces.length:" + this.provinces.length);

            for (var i = 0; i < this.provinces.length; i++) {
                if (this.provinces[i].regionName == province) {
                    this.provinceId = this.provinces[i].regionId;
                    this.getAllSubrange(this.provinceId);
                    this.city=city;
                    // alert("provinceId:" + this.provinceId);
                    break;
                }
            }
        }
    }
});

$(function () {
        $("#txtDeadlineDisplay").click(function () {
            WdatePicker();
        });
        editTaskVM.getAllProvince();
        var id = $("#hidTaskId").val();
        editTaskVM.getBrands();
        if (id != null && id.length > 0) {
            editTaskVM.bindTask(id);
        } else {
            editTaskVM.taskOrder = null;
            editTaskVM.taskWeight = null;
            editTaskVM.clues = null;
        }
        $(".editClose").click(clearTaskId);


    }
);