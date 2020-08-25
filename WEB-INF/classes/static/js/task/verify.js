/**
 * Created by Administrator on 2017/11/17.
 */

var editVM = new Vue({
    el: '#verifyTask',
    data: {
        taskId: '',
        taskTitle: '',
        taskContent: '',
        reward: '',
        clues: '',
        taskOrder: 0,
        taskWeight: 0,
        taskTypeDisplay: '',
        createTimeDisplay: '',
        deadlineDisplay: '',
        brand: '',
        number: '',
        content: '',
        industry: '',
        province:'',
        city:'',
        url: getUrl('task/verifyTask')
    },
    methods: {
        bindTask: function (id) {
            this.$http.post(getUrl('task/findTask'), {taskId: id}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var task = response.data.obj;
                        this.taskId = task.taskId;
                        this.taskTitle = task.taskTitle;
                        this.taskContent = task.taskContent;
                        this.reward = task.reward;
                        this.clues = task.clues;
                        this.taskOrder = task.taskOrder;
                        this.taskWeight = task.taskWeight;
                        this.taskTypeDisplay = task.taskTypeDisplay;
                        this.brand = task.brand.brandName;
                        this.createTimeDisplay = task.createTimeDisplay;
                        this.deadlineDisplay = task.deadlineDisplay;
                        this.number = task.number;
                        this.industry=task.industry;
                        this.province=task.province;
                        this.city=task.city;
                        $("#txtRegion").val(task.province+" "+task.city);

                    }
                    else alert('服务器内部错误');
                })
        },
        verifyTask: function (obj) {
            var msg = $(obj).data("msg");
            var data = {taskId: this.taskId, taskVerify: msg, content: this.content};
            var value =$(obj).val();
            if(confirm("请确认该操作："+value)) {
                this.$http.post(this.url, data, {emulateJSON: true})
                    .then(function (response) {
                        if (response.data.code === 200) {
                            $('#txtSearch').click();
                            $('.close').click();
                        } else if (response.data.code === 403) {
                            alert(response.data.msg);
                            $('#txtSearch').click();
                            $('.close').click();
                        }
                        else alert('验证失败');
                    })
            }
        }
    }
});

$(function () {
        var id = $("#hidTaskId").val();
        if (id != null && id.length > 0) {
            editVM.bindTask(id);
        }
        $(".editClose").click(clearTaskId);
    }
);