/**
 * Created by Administrator on 2017/11/17.
 */

var editVM = new Vue({
    el: '#editClue',
    data: {
        clueId: '',
        validate: -1,
        validateDisplay: '',
        follow: '',
        formulate: '',
        actualize: '',
        rewardId:'',
        rewardTipster:'',
        rewardValidate: -1,
        platform:'',
        tax:'',
        isPlatform: '1',
        //isTax: '1',

        title:'',
        content:'',
        nature: 1,
        url: getUrl('clue/getFollowMessages')
    },
    methods: {
        bindClue: function (id) {
            this.$http.post(this.url, {clueId: id}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var clue = response.data.obj;
                        this.clueId = clue.clueId;
                        this.validate = parseInt(clue.validate);
                        this.validateDisplay = clue.validateDisplay;
                        this.follow = clue.follow;
                        this.formulate = clue.formulate;
                        this.actualize = clue.actualize;
                        if (clue.rewardId){
                            this.rewardId = clue.rewardId;
                            this.rewardTipster = clue.rewardTipster;
                            this.rewardValidate = parseInt(clue.rewardValidate);
                            //this.isTax = clue.isTax;
                            this.isPlatform = clue.isPlatform;
                        }
                    }
                    else alert('服务器内部错误');
                })
        },
        insertCase: function(obj){
            var msg = $(obj).data("msg");
                if(!this.title){
                    alert("请填写案件标题!");
                    return;
                }
                if(!this.content){
                    alert("请填写案件描述!");
                    return;
                }

                if (!confirm("请确认本次操作：线索跟进完结，立案调查！")) return;
                var data = {clueId: this.clueId, title: this.title, content: this.content,nature:this.nature,msg: msg};
                this.$http.post(getUrl("clue/insertCase"), data, {emulateJSON: true})
                    .then(function (response) {
                        if (response.data.code === 200) {
                            $('#txtSearch').click();
                            $('.close').click();
                        }
                        else alert('失败');
                    })
           // }
        },

        verifyClue: function (obj) {
            var msg = $(obj).data("msg");
            var pass;
            if (msg == 1) {
                pass = true;
            } else {
                pass = false;
            }

            if (msg === 2) {
                if (!confirm("请确认本次操作：非正常完结！")) return;
            }
            var content = "";
            if (this.validate == 5){
                if (!this.follow){
                    alert("请填写专人跟进结果!");
                    return;
                }
                content = this.follow;
            }else if(this.validate == 6){
                if (!this.formulate){
                    alert("请填写相关方案!");
                    return;
                }
                content = this.formulate;
            }else if(this.validate == 7){
                if (!this.actualize){
                    alert("请填写方案实施结果!");
                    return;
                }
                content = this.actualize;
            }
            var data = {clueId: this.clueId, validate: this.validate, content: content, pass: pass};
            this.$http.post(getUrl("clue/verifyClueProgress"), data, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        $('#txtSearch').click();
                        $('.close').click();
                    }
                    else alert('验证失败');
                })
        }/*,
        editReward:function () {
            if(!this.rewardTipster){
                alert("请填写奖金额度!");
                return;
            }
            if (isNaN(this.rewardTipster)){
                alert("奖金请填写数字!");
                return;
            }
            var url = getUrl("reward/addReward");
            var param = {clueId: this.clueId,caseId: "无",rewardTipster: this.rewardTipster,isPlatform: this.isPlatform};
            if (this.rewardId){
                url = getUrl("reward/updateReward");
                param = {clueId: this.clueId,caseId: "无",rewardTipster: this.rewardTipster,rewardId:this.rewardId,isPlatform: this.isPlatform};
            }
            this.$http.post(url, param, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        $('#txtSearch').click();
                        $('.close').click();
                    }
                    else alert('保存失败');
                })
        }*/
    }
});


$(function () {
        var id = $("#hidClueId").val();
        if (id != null && id.length > 0) {
            editVM.bindClue(id);
        }
        $(".editClose").click(clearClueId);
    }
);