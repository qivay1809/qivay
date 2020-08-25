var app = new Vue({
    el: '#rewardIndex',
    data: {
        beginIndex:0,
        search: {serialNumber: ''},
        bonuses: [],
        params: [],
        clueId: '',
        url: getUrl('clue/getBonuses')
    },
    methods: {
        getBonuses: function () {
            this.clueId = request('id');
            //sessionStorage.setItem("clueId", this.clueId);
            var params = {
                clueId: this.clueId,
                serialNumber: this.search.serialNumber
            };
            this.params = params;
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        this.bonuses = response.data.obj;
                    }
                    else alert(response.data.msg);
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

function setRewardId_x(rewardId) {
    $('#hidRewardId').val(rewardId);
}

function clearRewardId_x() {
    $("#hidRewardId").val('');
}

function setClueId_x(clueId) {
    $('#hidClueId').val(clueId);
}

function clearClueId_x() {
    $("#hidClueId").val('');
}

$(function () {
    app.getBonuses();
    clearRewardId_x();
    clearClueId_x();
    }
);