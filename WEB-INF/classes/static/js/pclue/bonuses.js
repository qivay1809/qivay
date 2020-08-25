/**
 * Created by Administrator on 2017/11/17.
 */

var editVM = new Vue({
    el: '#bonusesClue',
    data: {
        clueId: '',
        isPlatform: '1',
        remark: '',
        isSelects: [],
        selectId: '',
        rewardTipster: '',
        progress: false,
        rewardId: '',
        clueValidate: ''
        //url: getUrl('clue/getFollowMessages')
    },
    methods: {
        bonusesClue: function (id) {
            this.progress = false;
            this.clueId = id;
            this.$http.post(getUrl('clue/isSelect'),{clueId: id}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var obj = response.data.obj;
                        this.isSelects = obj;
                        if(obj.length == 0){
                            $('.close').click();
                            $('#txtSearch').click();
                            alert("当前进度不能再次发放奖金！");
                        }
                    }
                    else alert('服务器内部错误');
                });


        },
        bonusesClue_x: function (id) {
            this.progress = true;
            this.rewardId = id;
            var params = {
                rewardId: this.rewardId
            };
            this.params = params;
            this.$http.post(getUrl('clue/getBonuses'), params, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var bonuses = response.data.obj;
                        for (var i = 0; i < bonuses.length; i++) {
                            var bonuse = bonuses[i];
                            this.rewardTipster = bonuse.tipster;
                            this.remark = bonuse.remark;
                            this.isPlatform = bonuse.isPlatform;
                        }
                    }
                    else alert(response.data.msg);
                })
        },
        editReward: function () {
            if (!this.rewardTipster) {
                alert("请填写奖金额度!");
                return;
            }
            if (isNaN(this.rewardTipster)) {
                alert("奖金请填写数字!");
                return;
            }
            if (!this.remark) {
                alert("请填写备注!");
                return;
            }
            var url = getUrl("reward/addReward");
            var param = {
                clueId: this.clueId,
                caseId: "无",
                rewardTipster: this.rewardTipster,
                isPlatform: this.isPlatform,
                remark: this.remark,
                clueValidate: this.clueValidate
            };
            if (this.rewardId) {
                url = getUrl("reward/updateReward");
                param = {
                    clueId: this.clueId,
                    caseId: "无",
                    rewardTipster: this.rewardTipster,
                    rewardId: this.rewardId,
                    isPlatform: this.isPlatform,
                    remark: this.remark
                };
            }
            if(this.clueValidate == 8){
                if(!confirm("提示：选择“完结”后，将结束该条线索的奖金发放！")){
                    return;
                }
            }
            this.$http.post(url, param, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        $('.close').click();
                        $('#txtSearch').click();
                    } else if (response.data.code === 301) {
                        alert(response.data.obj);
                    } else {
                        alert('保存失败')
                    }
                })
        }
    }
});


$(function () {
        var clueId = $("#hidClueId").val();
        var rewardId = $("#hidRewardId").val();
        if (clueId != null && clueId.length > 0) {
            console.log("新增");
            //document.getElementById("progress").style.display = "block";
            editVM.bonusesClue(clueId);
        }
        if (rewardId != null && rewardId.length > 0) {
            console.log("修改");
            //document.getElementById("progress").style.display = "none";
            editVM.bonusesClue_x(rewardId);
        }
        clearRewardId_x();
        clearClueId_x();
        $(".editClose").click(clearRewardId_x);
    }
);