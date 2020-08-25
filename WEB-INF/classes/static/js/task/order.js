/**
 * Created by Administrator on 2017/11/17.
 */

var editVM = new Vue({
    el: '#taskOrder',
    data: {
        taskId: '',
        taskOrder: -1,
        taskWeight: -1,
        url: getUrl('task/updateWeightAndOrder')
    },
    methods: {
        editTask: function () {
            this.$http.post(this.url, {taskId: this.taskId, taskOrder: this.taskOrder, taskWeight: this.taskWeight}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        $('#btnSearch').click();
                        $('#btnClose').click();
                    }
                    else alert('保存失败');
                })
        },
        bindTask: function (id) {
            this.$http.post(getUrl('task/findTask'), {taskId: id}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var task = response.data.obj;
                        this.taskId = task.taskId;
                        this.taskOrder = task.taskOrder;
                        this.taskWeight = task.taskWeight;
                    }
                    else alert('服务器内部错误');
                })
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