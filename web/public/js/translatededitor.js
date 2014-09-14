    // convert langs to modes
    var convertLangToMode = {
        "10" : "ace/mode/java",
        "35" : "ace/mode/javascript",
        "4" : "ace/mode/python",
        "17": "ace/mode/ruby",
        "11": "ace/mode/c"
    };
    editor = new ace.edit("editor");
    editor.setTheme("ace/theme/twilight");
    editor.getSession().setMode(convertLangToMode[fromLang]);
    // editor.setShowPrintMargin(false);
    // editor.getSession().setUseSoftTabs(true);

    output = new ace.edit("output");
    output.setTheme("ace/theme/twilight");
    output.getSession().setMode(convertLangToMode[toLang]);
    // output.setShowPrintMargin(false);
    // output.getSession().setUseSoftTabs(true);

    window.onresize = function () {
        $('#hints').height($('#editor').height());
        $('#edit-window').height($('#editor').height() + 1);
    }
    window.onload = function () {
        $('#hints').height($('#editor').height());
        $('#edit-window').height($('#editor').height() + 1);
        // set value of editor w/ ajax call
        $.ajax({
            type: "get",
            url: "/translated-code/" + projectId,
            success: function (data) {
                editor.setValue(data.original);
                output.setValue(data.translated);
            }
        });
    };


    editor.getSession().on('change', function(e){

    });

    $(document).ready(function(){
        resizeEditors();
    });

    $(window).resize(resizeEditors);

    editor.addEventListener('keydown', function(e) {
        if (e.keyCode === 13) {
        }
    }, false);
