var addVM = new Vue({
    el: '#participant',
    data: {
        caseId: '',
        userId: '',
        pay: 0.00,
        url: getUrl('case/addParticipant')
    },
    methods: {
        addParticipant: function () {
            if (!this.userId) {
                alert("请添加用户!");
                return;
            }
            if (!this.pay) {
                alert("请填写报酬!");
                return;
            }
            var caseParticipant = {
                userId: this.userId
                , pay: this.pay
                , caseId: this.caseId
            };
            this.$http.post(this.url, caseParticipant, {emulateJSON: true})
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
        }
    }
});

$(function () {
        $('#textSearch').typeahead({
            source: function (query, process) {
                addVM.$http.post(getUrl("user/getVerifyUsersByName"), {keyword: query}, {emulateJSON: true})
                    .then(function (response) {
                        process(response.data.obj);
                    });
            },
            items: 8,
            displayText: function (item) {
                return item.userName;
            }
        }).change(function () {
            var item = $(this).typeahead("getActive");
            addVM.userId = item.userId;
        });
        var id = $("#hidCaseId").val();
        if (id != null && id.length > 0) {
            addVM.caseId = id;
            addVM.pay = '';
        }
        $(".editClose").click(clearCaseId);
    }
);