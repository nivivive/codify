
    singleeditor  = new ace.edit("singleeditor");
    singleeditor.setTheme("ace/theme/twilight");
    singleeditor.getSession().setMode("ace/mode/javascript");
    singleeditor.setShowPrintMargin(false);
    singleeditor.getSession().setUseSoftTabs(true);

    verifyCode = function () {
        var submission = output.getValue();
        $.ajax({
            type: "post",
            code: submission,
            success: function (data) {
                // todo: update scores
            }
        });
    }

    saveData = function() {
        var currentcode = singleeditor.getValue();
        console.log(currentcode);
        $.ajax({
            type: "post",
            data: {code: currentcode},
            url: "/savedCode",
            success: true
        });
    }

    function getData() {
        $.ajax({
            type: "get",
            url: "/savedCode",
            success: function(data) {
                // console.log(JSON.stringify(data.code));
                singleeditor.setValue(JSON.stringify(data.code, undefined, 4), -1);
            }
        });
    }

    singleeditor.getSession().on('change', function(e){

    });

    $(document).ready(function(){
        getData();
        stopDemHaterz();
    });

    $(window).resize(stopDemHaterz);

    singleeditor.addEventListener('keydown', function(e) {
        if (e.keyCode === 13) {
        }
    }, false);
