var editVM = new Vue({
    el: '#editCaseReport',
    data: {
        progress: -1,
        content:'',
        file: '',
        url: getUrl('caseReport/addCaseReport')
    },
    methods: {
        editReport: function () {
            if (this.progress==-1) {
                alert("请选择进度");
                return;
            }

            this.content = UE.getEditor('editor').getContent();
            if (!this.content) {
                alert("请填写内容");
                return;
            }
            var caseReport = {
                progress: this.progress, content: this.content,images: this.file,caseId:request("id")
            };
            
            this.$http.post(this.url, caseReport, {emulateJSON: true})
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

    }
});



$(function () {
        var ue = UE.getEditor('editor', {
            toolbars: [
                ['undo', 'redo', 'bold']
            ],
            autoHeightEnabled: false,
            autoFloatEnabled: false,
            'enterTag': 'br'
        });

    }
);