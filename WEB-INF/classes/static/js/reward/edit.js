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
        rewardTipster: '',
        rewardValidate: -1,
        authority: 0,

        isPlatform: '',
        //isTax: '',
        platform: "",
        //amount: "",
        //tax: "",
        spending: "",
        payee: "",  //收款人
        idCard:"",
        url: getUrl('clue/getFollowMessages')
    },
    methods: {
        bindClue: function (id) {
            this.rewardId = id;
            this.$http.post(getUrl("/reward/getById"), {rewardId: this.rewardId}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var reward = response.data.obj;
                        this.clueId = reward.clueId;
                        this.rewardTipster = reward.tipster;
                        this.rewardValidate = reward.validate;

                        this.platform = reward.platform;
                        //this.amount = clue.amount;
                        //this.tax = clue.tax;
                        this.spending = reward.spending;
                        //this.clueAuthor = reward.clueAuthor;
                        //this.idCard= reward.idCard;

                        //this.isTax = clue.isTax;
                        this.isPlatform = reward.isPlatform;


                        this.$http.post(getUrl('clue/getFollowMessages'), {clueId: reward.clueId}, {emulateJSON: true})
                            .then(function (response) {
                                if (response.data.code === 200) {
                                    var clue = response.data.obj;
                                    //this.clueId = clue.clueId;
                                    this.validate = parseInt(clue.validate);
                                    this.validateDisplay = clue.validateDisplay;
                                    this.follow = clue.follow;
                                    this.formulate = clue.formulate;
                                    this.actualize = clue.actualize;
                                    this.payee = clue.payee;
                                    this.idCard= clue.idCard;
                                    /*if (clue.rewardId) {
                                        this.rewardId = clue.rewardId;
                                        this.rewardTipster = clue.rewardTipster;
                                        this.rewardValidate = parseInt(clue.rewardValidate);

                                        this.platform = clue.platform;
                                        //this.amount = clue.amount;
                                        //this.tax = clue.tax;
                                        this.spending = clue.spending;
                                        this.clueAuthor = clue.clueAuthor;
                                        this.idCard= clue.idCard;

                                        //this.isTax = clue.isTax;
                                        this.isPlatform = clue.isPlatform;
                                    }*/
                                }
                                else alert('服务器内部错误');
                            })
                    }
                    else alert('服务器内部错误！');
                });

        },
        getUserAuthority: function () {
            this.$http.post(getUrl("/user/currentUser"), {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var user = response.data.obj;
                        this.authority = user.admin;
                    }
                    else alert('服务器内部错误！');
                })
        },
        verifyReward: function (obj) {
            var msg = $(obj).data("msg");
            var data = {rewardId: this.rewardId, validate: msg};
            if (msg === 1) {
                if (!confirm("本次操作会将奖金直接转到收益人账户，请谨慎操作！")) return;
            }
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
});


$(function () {
        //var id = $("#hidClueId").val();
        var rewardId = $("#hidRewardId").val();
        if (rewardId != null && rewardId.length > 0) {
            editVM.getUserAuthority();
            editVM.bindClue(rewardId);
        }
        $(".editClose").click(clearClueId);
    }
);