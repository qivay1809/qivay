var secondDialog = new Vue({
        el: "#example2",
        data: {
            current: 0,
            count: 0,
            width: 0,
            height: 0,
            normal: 1380
        },
        methods: {
            rotate: function (msg) {
                if (!msg) {
                    this.current = (this.current + 90) % 360;
                }
                var image = $("#imagePath");
                if (image.width() > this.normal){
                    image.height(this.normal * image.height() / image.width());
                    image.width(this.normal);
                }
                image.css("transform", 'rotate(' + secondDialog.current + 'deg)');
                if (this.count == 0) {
                    this.width = image.width() + 50;
                    this.height = image.height() + 50;
                }
                var dialog = $("#dialogBody");
                if ((this.current / 90) % 2 == 0) {
                    dialog.width(this.width);
                    dialog.height(this.height);
                    $("#mainBody").height(this.height - 50);
                    image.css("margin-top", 5);
                    if (this.width > this.height) {
                        image.css("margin-left", 10);
                    }
                } else {
                    if (this.width > this.height) {
                        image.css("margin-left", -(this.width - this.height) / 2);
                    }
                    dialog.width(this.height);
                    dialog.height(this.width);
                    image.css("margin-top", (this.width - this.height) / 2);
                    $("#mainBody").height(this.width - 50);
                }
                this.count += 1;
            }
        }
    }
);

function setCurrent() {
    if ((this.current / 90) % 2 != 0) {
        secondDialog.rotate();
    }
    secondDialog.current = 0;
    secondDialog.count = 0;
    secondDialog.width = 0;
    secondDialog.height = 0;
    $("#imagePath").css("width",'');
    $("#imagePath").css("height",'');
    $("#imagePath").css("transform", 'rotate(' + secondDialog.current + 'deg)');
    $("#imagePath").css("margin-top",'');
    $("#imagePath").css("margin-left",'');
}

function setOpenSize() {
    secondDialog.rotate("msg");
}