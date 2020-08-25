/**
 * Created by Administrator on 2017/11/17.
 */

var editVM = new Vue({
    el: '#assign',
    data: {
        clueId: '',
        enterpriseId: '',
        isSelects: [],
        isSelects1: [],
        isSelects2: [],
        userId: '',
        enterpriseSurveyId: '',
        surveyId: '',
        type: 0,
        url: ''
    },
    methods: {
        bindClue: function () {
            this.clueId = request('id');
        },
        getSelect: function () {
            var opt = $("#getSelect").val();
            this.type = opt;
            var no1 = document.getElementById("no1");
            var no2 = document.getElementById("no2");
            var no3 = document.getElementById("no3");
            if (opt == 0) {//举报者本人
                no1.style.display = 'none';
                no2.style.display = 'none';
                no3.style.display = 'none';
            } else if (opt == 1) {//个人调查员
                no1.style.display = 'block';
                no2.style.display = 'none';
                no3.style.display = 'none';
                //获取所有个人调查员
                this.$http.post(getUrl("user/findUserByNameOrPhone"), {emulateJSON: true})
                    .then(function (response) {
                        if (response.data.code === 200) {
                            var obj = response.data.obj;
                            this.isSelects = obj;

                            setTimeout(function () {
                                $(".selectpicker").selectpicker('refresh');
                            }, 500);
                        }
                        else alert('服务器内部错误');
                    });
            } else if (opt == 2) {//企业调查员
                no1.style.display = 'none';
                no2.style.display = 'block';
                no3.style.display = 'block';
                //先获取所有调查企业
                this.$http.post(getUrl("enterprise/findSurveyEnterprise"), {emulateJSON: true})
                    .then(function (response) {
                        if (response.data.code === 200) {
                            var obj = response.data.obj;
                            this.isSelects1 = obj;
                            setTimeout(function () {
                                $(".selectpicker").selectpicker('refresh');
                            }, 500);
                        }
                        else alert('服务器内部错误');
                    });
            }
        },
        findSurvey: function () {
            var opt = $("#bs1Select").val();
            this.enterpriseId = opt;
            //根据企业ID查询调查企业下的调查员
            this.$http.post(getUrl("enterprise/findSurvey"), {enterpriseId: opt, keywords: ""}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var obj = response.data.obj;
                        this.isSelects2 = obj;
                        setTimeout(function () {
                            $(".selectpicker").selectpicker('refresh');
                        }, 500);
                    }
                    else alert('服务器内部错误');
                });
        },
        survey: function () {
            var opt = $("#bs2Select").val();
            this.surveyId = opt;
        },
        enterpriseSurvey: function () {
            var opt = $("#bs0Select").val();
            this.enterpriseSurveyId = opt;
        },
        saveAssign: function () {
            console.log("调查员类别：" + this.type);
            console.log("个人调查员：" + this.surveyId);
            console.log("调查企业：" + this.enterpriseId);
            console.log("企业调查员：" + this.enterpriseSurveyId);

            if (this.type == 0) {

            } else if (this.type == 1) {
                if (!this.surveyId) {
                    alert("请先选择个人调查员！");
                    return;
                }
                this.userId = this.surveyId;
            } else if (this.type == 2) {
                if (!this.enterpriseId) {
                    alert("请先选择调查企业！");
                    return;
                }
                if (!this.enterpriseSurveyId) {
                    alert("请先选择企业调查员！");
                    return;
                }
                this.userId = this.enterpriseSurveyId;
            } else {
                alert("请指定调查员类别！");
                return;
            }

            this.$http.post(getUrl("clueAssign/add"), {
                assignType: this.type,
                clueId: this.clueId,
                enterpriseId: this.enterpriseId,
                userId: this.userId
            }, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        alert(response.data.msg);
                        parent.closeTab(response.data.obj);
                    } else if(response.data.code === 302){
                        alert(response.data.obj);
                        parent.closeTab(response.data.obj);
                    }
                    else alert('服务器内部错误');
                });
        }
    }
});


$(function () {
        editVM.bindClue();
    }
);