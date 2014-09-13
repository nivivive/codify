
    editor = new ace.edit("editor");
    editor.setTheme("ace/theme/twilight");
    editor.getSession().setMode("ace/mode/javascript");
    // editor.setShowPrintMargin(false);
    // editor.getSession().setUseSoftTabs(true);

    output = new ace.edit("output");
    output.setTheme("ace/theme/twilight");
    output.getSession().setMode("ace/mode/java");
    // output.setShowPrintMargin(false);
    // output.getSession().setUseSoftTabs(true);

    window.onresize = function () {
        $('#hints').height($('#editor').height());
    }
    window.onload = function () {
        $('#hints').height($('#editor').height());
    };
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
        var currentcode = editor.getValue();
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
                editor.setValue(JSON.stringify(data.code, undefined, 4), -1);
            }
        });
    }

    editor.getSession().on('change', function(e){

    });

    $(document).ready(function(){
        getData();
        stopDemHaterz();
    });

    $(window).resize(stopDemHaterz);

    editor.addEventListener('keydown', function(e) {
        if (e.keyCode === 13) {
        }
    }, false);
