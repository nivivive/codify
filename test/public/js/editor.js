    editor = new ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/json");
    editor.setShowPrintMargin(false);
    editor.getSession().setUseSoftTabs(true);

    output = new ace.edit("output");
    output.setTheme("ace/theme/monokai");
    output.getSession().setMode("ace/mode/objectivec");
    output.setShowPrintMargin(false);
    output.getSession().setUseSoftTabs(true);

    htmlout = new ace.edit("htmlout");
    htmlout.setTheme("ace/theme/monokai");
    htmlout.getSession().setMode("ace/mode/html");
    htmlout.setShowPrintMargin(false);
    htmlout.getSession().setUseSoftTabs(true);

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
                console.log(JSON.stringify(data.code));
                editor.setValue(JSON.stringify(data.code, undefined, 4));
            }
        });
    }

    editor.getSession().on('change', function(e){
        parseCurrent();
        parseHTMLCurrent();
    });

    $(document).ready(function(){
        getData();
        stopDemHaterz();
        parseCurrent();
        parseHTMLCurrent();
    });

    $(window).resize(stopDemHaterz);

    editor.addEventListener('keydown', function(e) {
        if (e.keyCode === 13) {
            parseCurrent();
            parseHTMLCurrent();
        }
    }, false);
