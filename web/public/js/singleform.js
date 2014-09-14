
    singleeditor  = new ace.edit("singleeditor");
    singleeditor.setTheme("ace/theme/twilight");
    singleeditor.getSession().setMode("ace/mode/javascript");
    singleeditor.setShowPrintMargin(false);
    singleeditor.getSession().setUseSoftTabs(true);

    window.onresize = function () {
        $('#singlehint').height($('#singleeditor').height());
    }
    window.onload = function () {
        $('#singlehint').height($('#singleeditor').height());
    };
    createProject = function () {
        var code = singleeditor.getValue();
        var name = $('#project').val();
        var ntolang = parseInt($('#tolang').val());
        var nfromlang = parseInt($('#fromlang').val());
        var delim = $('#delim').val();
        var challenges = [];

        if (code && delim) {
            console.log("doing stuff w/ code");
            challenges = code.split(delim);
        }
        console.log("herinasd ");
        var fromlang = "java";
        if (nfromlang == 2) {
            fromlang = "javascript";
        } else if (nfromlang == 3) {
            fromlang = "python";
        } else if (nfromlang == 4) {
            fromlang = "ruby";
        } else if (nfromlang == 5) {
            fromlang = "c";
        }

        var tolang = "python";
        if (ntolang == 2) {
            tolang = "javascript";
        } else if (ntolang == 3) {
            tolang = "java";
        } else if (ntolang == 4) {
            tolang = "ruby";
        } else if (ntolang == 5) {
            tolang = "c";
        }

        var data = {};
        data.project = name;
        data.challenges = challenges;
        data.fromLang = fromlang;
        data.toLang = tolang;

        $.ajax({
            type: "post",
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/request-project',
            success: function (data) {
                window.location = '/project';
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
