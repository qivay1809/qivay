/**
 * Created by Administrator on 2017/11/17.
 */
var participantVM = new Vue({
    el: '#participant',
    data: {
        search: {name: '', taskId: '', userRole: -1},
        participants: [],
        url: getUrl('task/findParticipants')
    },
    methods: {
        getParticipants: function () {
            var params = {
                taskId: this.search.taskId
                , pageIndex: pageVM.current_page, pageSize: 10
            };
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    this.participants = response.data.obj.rows;
                })
        }

    }
});


$(function () {
        var id = $("#hidTaskId").val();
        participantVM.search.taskId = id;
        participantVM.getParticipants();
    }
);