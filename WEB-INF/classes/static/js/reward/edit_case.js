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
        rewardId: '',
        rewardAmount: '',
        rewardValidate: -1,
        authority: 0,

        caseTitle: '',
        caseContent: '',
        brandName: '',
        product: '',
        progress: 0,
        region: '',
        industry: '',
        reward: '',
        caseImages: '',
        createTime: '',
        url: getUrl('reward/getById')
    },
    methods: {
        /*bindClue: function (id) {
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
                            this.rewardAmount = clue.rewardAmount;
                            this.rewardValidate = parseInt(clue.rewardValidate);
                        }
                    }
                    else alert('服务器内部错误');
                })
        },*/
        bindClue: function (id) {
            this.$http.post(this.url, {rewardId: id}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var clue = response.data.obj;
                        this.rewardAmount = clue.amount;
                        //根据案件ID查询案件
                        this.url = getUrl('case/getCase');
                        this.$http.post(this.url, {caseId: clue.caseId}, {emulateJSON: true})
                            .then(function (response) {
                                if (response.data.code === 200) {
                                    var caseInfo = response.data.obj;
                                    this.caseTitle = caseInfo.caseTitle;
                                    this.caseContent = caseInfo.caseContent;
                                    this.brandName = caseInfo.brandName;
                                    this.product = caseInfo.product;
                                    this.region = caseInfo.region;
                                    this.industry = caseInfo.industry;
                                    this.reward = caseInfo.reward;
                                    this.caseImages = caseInfo.caseImages;
                                    this.createTime = caseInfo.createTime;
                                }
                                else alert('服务器内部错误');
                            });
                    }
                    else alert('服务器内部错误');
                })
        },
        getUserAuthority: function () {
            this.$http.post(getUrl("/user/currentUser"), {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var user = response.data.obj;
                        this.authority = user.admin;
                    }
                    else alert('服务器内部错误');
                })
        },
        verifyReward: function (obj) {
            var msg = $(obj).data("msg");
            var data = {rewardId: $("#hidRewardId").val(), validate: msg};
            var value =$(obj).val();
            if(confirm("确认该操作："+value)) {
                this.$http.post(getUrl("reward/verifyReward"), data, {emulateJSON: true})
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
        var id = $("#hidRewardId").val();
        if (id != null && id.length > 0) {
            editVM.getUserAuthority();
            editVM.bindClue(id);
        }
        $(".editClose").click(clearRewardId);
    }
);