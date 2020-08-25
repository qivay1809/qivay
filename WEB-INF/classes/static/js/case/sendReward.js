/**
 * Created by Administrator on 2017/11/17.
 */

var editVM = new Vue({
    el: '#sendReward',
    data: {
        clueId: '',
        caseId :'',
        status: '',
        rewardAmount:'',
        rewardId:'',
        url: getUrl('case/getCase')
    },
    methods: {
        bindCase: function (id) {
            this.$http.post(this.url, {caseId: id}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var res = response.data.obj;
                        this.clueId = res.clueId;
                        this.caseId = res.caseId;
                        this.status = res.status;
                    }
                    else alert('服务器内部错误');
                })
        },
        reward_id: function(id){
            this.rewardId = id;
        },
        editReward:function () {
            if(!this.rewardAmount){
                alert("请填写奖金额度!");
                return;
            }
            if (isNaN(this.rewardAmount)){
                alert("奖金请填写数字!");
                return;
            }

            var url = getUrl("reward/updateReward");
            var param = {rewardAmount: this.rewardAmount, avlidate: 0, rewardId:this.rewardId};
            if (!this.rewardId){
                url =getUrl("reward/addReward");
                param = {clueId: this.clueId,caseId:this.caseId,rewardAmount: this.rewardAmount};
                /*if(this.status != 33 && this.status != 44){
                    alert("案件未完结!");
                    return;
                }*/
            }
            this.$http.post(url, param, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        $('#txtSearch').click();
                        $('.close').click();
                    }
                    else alert('保存失败');
                })
        }
    }
});


$(function () {
        var id = $("#hidCaseId").val();
        if (id != null && id.length > 0) {
            editVM.bindCase(id);
        }
        var rewardId = $("#hidRewardId").val();
        if(rewardId != null && rewardId.length>0){
            //赋值
            editVM.reward_id(rewardId);
        }
        $(".editClose").click(clearClueId);
    }
);