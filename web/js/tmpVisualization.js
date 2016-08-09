var defaultPatternNetSize = 50;

$(document).ready(function () {
//wczytanie strony startowej
    var data = {
        page_id: 1
    };
    //załadowanie strony startowej
    ajaxChangePage(data);
    //ustawienie eventów w bocznym menu
    setSidebarEvents();
});
//ustawienie obsługi przycisków w menu bocznym
function setSidebarEvents() {
    //przycisk dodający stronę
    $("button.btn-add-page").click(function () {
        createDialogPageAddSettings().dialog("open");
    });
    //przycisk dodający panel
    $("button.btn-add-panel").click(addPanel);
    //ON/OFF siatka pomocnicza
    $("button.btn-pattern-net").click(function () {
        $(this).children("span").toggleClass('off');
        var state = $(this).children("span").hasClass("off");
        if (state === true) {
            $(".pattern-net, .pattern-net-right").remove();
        } else {
            var gridSize = $("input#pattern-net-size").val();
            if (gridSize.length === 0) {
                setPatternNet(defaultPatternNetSize);
            } else {
                setPatternNet(gridSize);
            }
        }
    });
    //ustaw domyślny rozmiar siatki
    $("input#pattern-net-size").val(defaultPatternNetSize);
    //zmiana rozmiaru siatki
    $("input#pattern-net-size").change(function () {

        var x = $(this).val();
        setPatternNet(x);
    });
    //ON/OFF lista paneli
    $("button.btn-panel-list").click(function () {
        $(this).children("span").toggleClass('off');
        var state = $(this).children("span").hasClass("off");
        if (state === true) {
            $("div.panel-list-container").hide();
        } else {
            $("div.panel-list-container").show();
        }
    });
}

function addPanel() {
    $.ajax({
        type: "POST",
        url: Routing.generate('bms_visualization_add_panel'),
        success: function (ret) {
            $(".main-row div#page").hide();
            $(".main-row div#panel-form").remove();
            $(".main-row").append(ret["template"]).children(".fa-spinner").remove();
            setPanelForm();
        }
    });
    $(".main-row").append("<i class='fa fa-spinner fa-pulse fa-4x'></i>").show();
}

function setPanelForm() {
    var panelForm = $("div#panel-form");
    //zmiana zakładek
    panelForm.find("form li a").click(function () {
        panelForm.find("form li").removeClass("active");
        $("div.well").hide();
        var id = $(this).parent().attr("id");
        $(this).parent().addClass("active");
        $("div.well." + id).show();
    });
    //ustawienie numeru strony
    panelForm.find("input#page_id").val($("div.label-page.active").attr("id"));
    //zmiana border radius LT
    panelForm.find("input#panel_borderRadiusLeftTop").bind("input", function () {
        panelForm.find("input#borderRadiusTL").val($(this).val());
    });
    //zmiana border radius LB
    panelForm.find("input#panel_borderRadiusLeftBottom").bind("input", function () {
        panelForm.find("input#borderRadiusBL").val($(this).val());
    });
    //zmiana border radius BT
    panelForm.find("input#panel_borderRadiusRightTop").bind("input", function () {
        panelForm.find("input#borderRadiusTR").val($(this).val());
    });
    //zmiana border radius BR
    panelForm.find("input#panel_borderRadiusRightBottom").bind("input", function () {
        panelForm.find("input#borderRadiusBR").val($(this).val());
    });
    //zmiana opacity
    panelForm.find("input#panel_opacity").bind("input", function () {
        panelForm.find("input#opacity").val($(this).val());
    });
    //zmiana typu panela
    panelForm.find("select#panel_type").change(function () {
        var value = $(this).val();
        var buttonManager = panelForm.find("button#manager");
        var inputSourceContent = panelForm.find("input#panel-source-content");
        switch (value) {
            case "variable":
                inputSourceContent.val("").prop({"disabled": true, "required": true}).show();
                buttonManager.removeClass("disabled").show().unbind("click");
                $("li#dialog-panel-progress-bar").hide();
                $(".precision-group, .font-group, li#dialog-panel-format, li#dialog-panel-navigation, li#dialog-panel-event").show();
                setOpenVariableManager();
                break;
            case "image":
                inputSourceContent.val("").prop({"disabled": true, "required": true}).show();
                buttonManager.removeClass("disabled").show().unbind("click");
                $(".precision-group, .font-group, li#dialog-panel-progress-bar").hide();
                $("li#dialog-panel-format, li#dialog-panel-navigation, li#dialog-panel-event").show();
                setOpenImageManager();
                break;
            case "text":
                inputSourceContent.val("").prop({"disabled": false, "required": false}).show();
                buttonManager.addClass("disabled").show().unbind("click");
                $(".precision-group, li#dialog-panel-progress-bar").hide();
                $(".font-group, li#dialog-panel-format, li#dialog-panel-navigation, li#dialog-panel-event").show();
                break;
            case "widget":
                inputSourceContent.val("").prop({"disabled": true, "required": true}).hide();
                buttonManager.addClass("disabled").hide().unbind("click");
                $("li#dialog-panel-format, li#dialog-panel-navigation, li#dialog-panel-event").hide();
                $("li#dialog-panel-progress-bar").show();
                break;
        }
    });

}

function editPanel(data) {
    $.ajax({
        type: "POST",
        datatype: "application/json",
        url: Routing.generate('bms_visualization_edit_panel'),
        data: data,
        success: function (ret) {
            $(".main-row div#page").hide();
            $(".main-row div#panel-form").remove();
            $(".main-row").append(ret["template"]).children(".fa-spinner").remove();
            setPanelForm();
            setEdit(ret["panel_type"], ret["panel_id"]);

        }
    });
    $(".main-row").append("<i class='fa fa-spinner fa-pulse fa-4x'></i>").show();
}

function setEdit(type, id) {
    var panelForm = $("div#panel-form");
    var buttonManager = panelForm.find("button#manager");
    var inputSourceContent = panelForm.find("input#panel-source-content");
    switch (type) {
        case "variable":
            inputSourceContent.val("").prop({"disabled": true, "required": true}).show();
            buttonManager.removeClass("disabled").show().unbind("click");
            $("li#dialog-panel-progress-bar").hide();
            $(".precision-group, .font-group, li#dialog-panel-format, li#dialog-panel-navigation, li#dialog-panel-event").show();
            setOpenVariableManager();
            break;
        case "image":
            inputSourceContent.val("").prop({"disabled": true, "required": true}).show();
            buttonManager.removeClass("disabled").show().unbind("click");
            $(".precision-group, .font-group, li#dialog-panel-progress-bar").hide();
            $("li#dialog-panel-format, li#dialog-panel-navigation, li#dialog-panel-event").show();
            setOpenImageManager();
            break;
        case "text":
            inputSourceContent.val("").prop({"disabled": false, "required": false}).show();
            buttonManager.addClass("disabled").show().unbind("click");
            $(".precision-group, li#dialog-panel-progress-bar").hide();
            $(".font-group, li#dialog-panel-format, li#dialog-panel-navigation, li#dialog-panel-event").show();
            break;
        case "widget":
            inputSourceContent.val("").prop({"disabled": true, "required": true}).hide();
            buttonManager.addClass("disabled").hide().unbind("click");
            $("li#dialog-panel-format, li#dialog-panel-navigation, li#dialog-panel-event").hide();
            $("li#dialog-panel-progress-bar").show();
            break;
    }
    //set input for hidden form fields
    panelForm.find("input#panel_id").val(id);
    panelForm.find("select#href").val(panelForm.find("input#panel_href").val());
    panelForm.find("input#borderRadiusTL").val(panelForm.find("input#panel_borderRadiusLeftTop").val());
    panelForm.find("input#borderRadiusBL").val(panelForm.find("input#panel_borderRadiusLeftBottom").val());
    panelForm.find("input#borderRadiusTR").val(panelForm.find("input#panel_borderRadiusRightTop").val());
    panelForm.find("input#borderRadiusBR").val(panelForm.find("input#panel_borderRadiusRightBottom").val());
    panelForm.find("input#opacity").val(panelForm.find("input#panel_opacity").val());
    if (panelForm.find("input#panel_fontWeight").val() == "bold") {
        panelForm.find("button#panel_fontWeight").addClass("active");
    }
    if (panelForm.find("input#panel_textDecoration").val() == "underline") {
        panelForm.find("button#panel_textDecoration").addClass("active");
    }
    if (panelForm.find("input#panel_fontStyle").val() == "italic") {
        panelForm.find("button#panel_fontStyle").addClass("active");
    }
    var align = panelForm.find("input#panel_textAlign").val();
    updateTextAlign(align);
    panelForm.find("input#panel-source-content").val($("div#panel-form input#panel_contentSource").val());
}

function savePanel() {
    var form = $("form[name='panel']");
    //todo: validowanie formularza przed wysłaniem
    $.ajax({
        type: form.attr('method'),
        url: form.attr('action'),
        data: form.serialize(),
        success: function (ret) {
            $("div.main-row .fa-spinner").remove();
            $("div.main-row div#panel-form").remove();
            $("div.main-row div#page").show().children("div.well").show().append(ret['panel']);
            loadPanelList(ret["panelList"]);
            setPanelEvents();
        }
    });
    $(".main-row").append("<i class='fa fa-spinner fa-pulse fa-4x'></i>").show();
}

function closePanelForm() {
    if (confirm("Na pewno anulować dodawanie obiektu?")) {
        $("div.main-row div#panel-form").remove();
        $(".main-row div").show();
    }
}
function updateHref() {
    var panelForm = $("div#panel-form");
    panelForm.find("input#panel_href").val(panelForm.find("select#href").val());
}
function updateBorderRadius() {
    var panelForm = $("div#panel-form");
    panelForm.find("input#panel_borderRadiusLeftTop").val(panelForm.find("input#borderRadiusTL").val());
    panelForm.find("input#panel_borderRadiusLeftBottom").val(panelForm.find("input#borderRadiusBL").val());
    panelForm.find("input#panel_borderRadiusRightTop").val(panelForm.find("input#borderRadiusTR").val());
    panelForm.find("input#panel_borderRadiusRightBottom").val(panelForm.find("input#borderRadiusBR").val());
}
function updateOpacity() {
    var panelForm = $("div#panel-form");
    panelForm.find("input#panel_opacity").val(panelForm.find("input#opacity").val());
}
function updateFontWeight() {
    var panelForm = $("div#panel-form");
    var panelFormButton = panelForm.find("button#panel_fontWeight");
    var panelFormInput = panelForm.find("input#panel_fontWeight");
    panelFormButton.toggleClass("active");
    panelFormButton.hasClass("active") ? panelFormInput.val("bold") : panelFormInput.val("normal");
}
function updateTextDecoration() {
    var panelForm = $("div#panel-form");
    var panelFormButton = panelForm.find("button#panel_textDecoration");
    var panelFormInput = panelForm.find("input#panel_textDecoration");
    panelFormButton.toggleClass("active");
    panelFormButton.hasClass("active") ? panelFormInput.val("underline") : panelFormInput.val("none");
}
function updateFontStyle() {
    var panelForm = $("div#panel-form");
    var panelFormButton = panelForm.find("button#panel_fontStyle");
    var panelFormInput = panelForm.find("input#panel_fontStyle");
    panelFormButton.toggleClass("active");
    panelFormButton.hasClass("active") ? panelFormInput.val("italic") : panelFormInput.val("normal");

}
function updateTextAlign(align) {
    var panelForm = $("div#panel-form");
    var panelFormBtnCenter = panelForm.find(".btn-align-center");
    var panelFormBtnLeft = panelForm.find(".btn-align-left");
    var panelFormBtnRight = panelForm.find(".btn-align-right");
    panelForm.find("input#panel_textAlign").val(align);
    switch (align) {
        case "left":
            panelFormBtnCenter.removeClass("active");
            panelFormBtnRight.removeClass("active");
            panelFormBtnLeft.addClass("active");
            break;
        case "center":
            panelFormBtnLeft.removeClass("active");
            panelFormBtnRight.removeClass("active");
            panelFormBtnCenter.addClass("active");
            break;
        case "right":
            panelFormBtnCenter.removeClass("active");
            panelFormBtnLeft.removeClass("active");
            panelFormBtnRight.addClass("active");
            break;
    }

}
function updateContentSource() {
    $("div#panel-form input#panel_contentSource").val($("div#panel-form input#panel-source-content").val());
}

//dodawanie warunku
function setDialogButtonEvent(panel_id) {
    //add term
    $("button.add-term").click(function () {
        $.ajax({
            type: "POST",
            datatype: "application/json",
            url: Routing.generate('bms_visualization_load_event_manager'),
            success: function (ret) {
                $(".main-row").children(".fa-spinner").remove();
                $(".main-row").append(ret['template']);
                createCondition(panel_id).dialog("open");
            }
        });
        $(".main-row").append("<i class='fa fa-spinner fa-pulse fa-4x'></i>").show();
    });
    //delete term
    setDeleteTerm();
}
function setDialogButtonProgressBar() {
    //zmiana kolorów
    $("input#color1").on('input', function () {
        $("div#pb1").css({backgroundColor: $(this).val()});
    });
    $("input#color2").on('input', function () {
        $("div#pb2").css({backgroundColor: $(this).val()});
    });
    $("input#color3").on('input', function () {
        $("div#pb3").css({backgroundColor: $(this).val()});
    });
    //dodanie zmiennych
    $("button#progress-bar-manager-value").click(function () {
        $.ajax({
            type: "POST",
            datatype: "application/json",
            url: Routing.generate('bms_visualization_load_variable_manager'),
            success: function (ret) {
                $(".main-row").children(".fa-spinner").remove();
                $(".main-row").append(ret["template"]);
                createVariableManager("progress-bar-value").dialog("open");
            }
        });
        $(".main-row").append("<i class='fa fa-spinner fa-pulse fa-4x'></i>").show();
    });
    $("button#progress-bar-manager-set").click(function () {
        $.ajax({
            type: "POST",
            datatype: "application/json",
            url: Routing.generate('bms_visualization_load_variable_manager'),
            success: function (ret) {
                $(".main-row").children(".fa-spinner").remove();
                $(".main-row").append(ret["template"]);
                createVariableManager("progress-bar-set").dialog("open");
            }
        });
        $(".main-row").append("<i class='fa fa-spinner fa-pulse fa-4x'></i>").show();
    });
}

function setOpenVariableManager() {
    $("button#manager").click(function () {
        $.ajax({
            type: "POST",
            datatype: "application/json",
            url: Routing.generate('bms_visualization_load_variable_manager'),
            success: function (ret) {
                $(".main-row").children(".fa-spinner").remove();
                $(".main-row").append(ret["template"]);
                createVariableManager("data-source").dialog("open");
            }
        });
        $(".main-row").append("<i class='fa fa-spinner fa-pulse fa-4x'></i>").show();
    });
}

function setOpenImageManager() {
    $(".input-group-btn button#manager").click(function () {
        $.ajax({
            type: "POST",
            datatype: "application/json",
            url: Routing.generate('bms_visualization_load_image_manager'),
            success: function (ret) {
                $(".main-row").children(".fa-spinner").remove();
                $(".main-row").append(ret["template"]);
                createImageManager("data-source").dialog("open");
            }
        });
        $(".main-row").append("<i class='fa fa-spinner fa-pulse fa-4x'></i>").show();
    });
}

function createVariableManager(fw) {
    return $("div.variable-manager").dialog({
        autoOpen: false,
        width: $(window).width() * 0.8,
        height: $(window).height() * 0.8,
        modal: true,
        buttons: [
            {
                text: "Zapisz",
                click: function () {
                    if (fw === "data-source") {
                        var value = $("div.variable-manager input#register").val();
                        var res = value.split("&");
                        $("div#panel-form input#panel-source-content").val(res[0]);
                        $("div#panel-form input#panel_contentSource").val(res[0]);
                        // $("div#panel-form input#panel_variableValue").val(res[1]);
                        $(this).dialog('destroy').remove();
                    } else if (fw === "term-register") {
                        var value = $("div.variable-manager input#register").val();
                        var res = value.split("&");
                        $("div.dialog-condition input#panel-term-register").val(res[0]);
                        $("div.dialog-condition input#panel-term-register-value").val(res[1]);
                        $(this).dialog('destroy').remove();
                    } else if (fw === "progress-bar-value") {
                        var value = $("div.variable-manager input#register").val();
                        var res = value.split("&");
                        $("input#progress-bar-value").val(res[0]);
                        $(this).dialog('destroy').remove();
                    } else if (fw === "progress-bar-set") {
                        var value = $("div.variable-manager input#register").val();
                        var res = value.split("&");
                        $("input#progress-bar-set").val(res[0]);
                        $(this).dialog('destroy').remove();
                    }
                }
            },
            {
                text: "Anuluj",
                click: function () {
                    $(this).dialog('destroy').remove();
                }
            }],
        open: function () {
            setDialogButtons();
        },
        close: function () {
            $(this).dialog('destroy').remove();
        }
    });

    function setDialogButtons() {
        $("input#deviceSearch").keyup(function () {
            $("div.variable-manager input:not(#deviceSearch)").val("");
            var data = this.value.toUpperCase().split("&");
            var rows = $("div.register-choice").find("div#deviceName");
            if (this.value == "") {
                rows.parent().show();
                return;
            }
            rows.parent().hide();
            rows.filter(function (i, v) {
                var $t = $(this);
                for (var d = 0; d < data.length; ++d) {
                    if ($t.text().toUpperCase().indexOf(data[d]) > -1) {
                        return true;
                    }
                }
                return false;
            }).parent().show();
        });
        $("input#functionSearch").keyup(function () {
            $("div.variable-manager input:not(#functionSearch)").val("");
            var data = this.value.toUpperCase().split("&");
            var rows = $("div.register-choice").find("div#function");
            if (this.value == "") {
                rows.parent().show();
                return;
            }
            rows.parent().hide();
            rows.filter(function (i, v) {
                var $t = $(this);
                for (var d = 0; d < data.length; ++d) {
                    if ($t.text().toUpperCase().indexOf(data[d]) > -1) {
                        return true;
                    }
                }
                return false;
            }).parent().show();
        });
        $("input#addressSearch").keyup(function () {
            $("div.variable-manager input:not(#addressSearch)").val("");
            var data = this.value.toUpperCase().split("&");
            var rows = $("div.register-choice").find("div#address");
            if (this.value == "") {
                rows.parent().show();
                return;
            }
            rows.parent().hide();
            rows.filter(function (i, v) {
                var $t = $(this);
                for (var d = 0; d < data.length; ++d) {
                    if ($t.text().toUpperCase().indexOf(data[d]) > -1) {
                        return true;
                    }
                }
                return false;
            }).parent().show();
        });
        $("input#registerSearch").keyup(function () {
            $("div.variable-manager input:not(#registerSearch)").val("");
            var data = this.value.toUpperCase().split("&");
            var rows = $("div.register-choice").find("div#registerName");
            if (this.value == "") {
                rows.parent().show();
                return;
            }
            rows.parent().hide();
            rows.filter(function (i, v) {
                var $t = $(this);
                for (var d = 0; d < data.length; ++d) {
                    if ($t.text().toUpperCase().indexOf(data[d]) > -1) {
                        return true;
                    }
                }
                return false;
            }).parent().show();
        });
        $("input#descriptionSearch").keyup(function () {
            $("div.variable-manager input:not(#descriptionSearch)").val("");
            var data = this.value.toUpperCase().split("&");
            var rows = $("div.register-choice").find("div#description");
            if (this.value == "") {
                rows.parent().show();
                return;
            }
            rows.parent().hide();
            rows.filter(function (i, v) {
                var $t = $(this);
                for (var d = 0; d < data.length; ++d) {
                    if ($t.text().toUpperCase().indexOf(data[d]) > -1) {
                        return true;
                    }
                }
                return false;
            }).parent().show();
        });

        $("div.register-choice").click(function () {
            var registerName = $(this).children("div#registerName").text();
            var registerValue = $(this).children("div#value").text();
            var registerId = $(this).attr('id');
            $("input#register").val(registerName + "&" + registerValue + "&" + registerId);
            $("div.register-choice").removeClass("selected");
            $(this).addClass("selected");
        });
    }
}

function createImageManager(fw) {
    var input;
    return $("div.image-manager").dialog({
        autoOpen: false,
        width: $(window).width() * 0.8,
        height: $(window).height() * 0.8,
        modal: true,
        buttons: [
            {
                text: "Zapisz",
                click: function () {
                    var imgSource;
                    var panelForm = $("div#panel-form");
                    var imageManager = $("div.image-manager");
                    if (fw === "data-source") {
                        var w = imageManager.find("input#resolutionX").val();
                        var h = imageManager.find("input#resolutionY").val();

                        panelForm.find("input#width").val(w);
                        panelForm.find("input#height").val(h);
                        panelForm.find("input#opacity").val(0);
                        panelForm.find("input#borderWidth").val(0);
                        imgSource = imageManager.find("div.thumbnail-list div.selected img").attr("src");
                        if (imgSource.length > 200) {
                            var data = new FormData();
                            data.append('file', input.files[0]);
                            data.append("fileName", $("div.image-manager input#imageName").val());
                            data.append("resolutionX", $("div.image-manager input#resolutionX").val());
                            data.append("resolutionY", $("div.image-manager input#resolutionY").val());
                            saveData(data);
                        } else {
                            $("div.dialog-panel-settings input#panel-source-content").val(imgSource);
                            $("div.dialog-panel-settings div.panel-preview").empty().append("<img src=\"" + imgSource + "\" class=\"img-responsive\">");
                        }
                    } else if (fw === "effect") {
                        imgSource = $("div.image-manager div.thumbnail-list div.selected img").attr("src");
                        $("form#condition input#effect-value").val(imgSource);
                    }

                    $(this).dialog('destroy').remove();
                }
            },
            {
                text: "Anuluj",
                click: function () {
                    $(this).dialog('destroy').remove();
                }
            }],
        open: function () {
            setDialogButtons();
        },
        close: function () {
            $(this).dialog('destroy').remove();
        }
    });

    function setDialogButtons() {
        var img = new Image();
        var imageManager = $("div.image-manager");
        //loading image from disk
        imageManager.find("input#image").change(function (event) {
            var src;
            input = event.target;
            if (this.files && this.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    img.onload = function () {
                        src = e.target.result;
                        imageManager.find("input#resolutionX").val(this.width);
                        imageManager.find("input#resolutionY").val(this.height);
                        var data = new FormData();
                        data.append('file', input.files[0]);
                        data.append("fileName", input.files[0].name);
                        data.append("resolutionX", this.width);
                        data.append("resolutionY", this.height);
                        saveData(data);
                    };
                    img.src = e.target.result;
                    $("div.image-manager").find("div.thumbnail-list").append("<div id='" + imgName + "' class='text-center'>" +
                        "<img class='img-responsive' src='" + img.src + "' />" +
                        "</div>");
                };
                reader.readAsDataURL(input.files[0]);
            }
            var imgName = input.files[0].name;

            imageManager.find("input#imageName").val(imgName);

        });
        //choose image
        $("div.thumbnail-list div").click(function () {
            $("div.thumbnail-list div").removeClass("selected");
            $(this).addClass("selected");
            var url = $(this).children("img").attr("src");
            var img = new Image();
            img.onload = function () {
                $("div.image-manager input#resolutionX").val(this.width);
                $("div.image-manager input#resolutionY").val(this.height);
            };
            img.src = url;
            var name = $(this).attr("id");
            $("div.image-manager input#imageName").val(name);
        });
        //change size of image
        imageManager.find("input#resolutionX").change(function () {
            var ar = img.width / img.height;
            var h = $(this).val() / ar;
            $("div.image-manager input#resolutionY").val(Math.round(h));

        });
        imageManager.find("input#resolutionY").change(function () {
            var ar = img.width / img.height;
            var w = $(this).val() * ar;
            $("div.image-manager input#resolutionX").val(Math.round(w));
        });
    }

    function saveData(data) {
        $.ajax({
            type: "POST",
            url: Routing.generate('bms_visualization_add_image'),
            data: data,
            contentType: false,
            processData: false,
            success: function (ret) {
                $(".main-row").children(".fa-spinner").remove();

                $("div.dialog-panel-settings input#panel-source-content").val(ret["content"]);
                $("div.dialog-panel-settings div.panel-preview").empty().append("<img src=\"" + ret["content"] + "\" class=\"img-responsive\">");
            }
        });
        $(".main-row").append("<i class='fa fa-spinner fa-pulse fa-4x'></i>").show();
    }
}

function createEffectCssManager() {
    return $("div.effect-css-manager").dialog({
        autoOpen: false,
        width: $(window).width(),
        height: $(window).height(),
        modal: true,
        buttons: [
            {
                text: "Zapisz",
                click: function () {

                }
            },
            {
                text: "Anuluj",
                click: function () {
                    $(this).dialog('destroy').remove();
                }
            }],
        open: function () {
            setDialog();
            setDialogButtons();
        },
        close: function () {
            $(this).dialog('destroy').remove();
        }
    });
    function setDialog() {

    }

    function setDialogButtons() {

    }

}

function setDeleteTerm() {
    $("table .fa-trash-o").unbind("click").click(function () {
        var data = {
            term_id: $(this).attr("id")
        };
        $.ajax({
            type: "POST",
            datatype: "application/json",
            url: Routing.generate('bms_visualization_delete_term'),
            data: data,
            success: function (ret) {
                $(".main-row").children(".fa-spinner").remove();
                var id = parseInt(ret['term_id']);
                $("table i#" + id + ".fa-trash-o").parent().parent().remove();
                if ($("div.dialog-panel-event table tbody tr").length == 1) {
                    $("div.dialog-panel-event table tbody tr").remove().append(
                        "<tr id='no-data'>\n\
                            <td colspan='11' class='text-center'>\n\
                                <h2><span class='label label-primary'> Brak warunków</span></h2>\n\
                            </td>\n\
                        </tr>");
                }
            }
        });
        $(".main-row").append("<i class='fa fa-spinner fa-pulse fa-4x'></i>").show();
    });
}

function createCondition(panel_id) {

    return $("div.dialog-condition").dialog({
        autoOpen: false,
        width: 1200,
        height: 400,
        modal: true,
        buttons: [
            {
                text: "Zapisz",
                click: function () {
                    var data = new FormData();
                    data.append("register_name", $("form#condition input#panel-term-register").val());
                    data.append("panel_id", panel_id);
                    data.append("condition_type", $("form#condition select#condition_type").val());
                    data.append("condition_value", $("form#condition input#condition_val").val());
                    data.append("effect_type", $("form#condition select#effect_type").val());
                    data.append("effect_content", $("form#condition input#effect-value").val());
                    var fail = false;
                    var fail_log = '';
                    $("form#condition input").each(function () {
                        if (!$(this).prop('required')) {

                        } else {
                            if (!$(this).val()) {
                                fail = true;
                                var name = $(this).attr('name');
                                $(this).parent(".form-group").addClass("has-error");
                                fail_log += name + " jest wymagane \n";
                            }
                        }
                    });
                    if (!fail) {
                        saveData(data);
                        $(this).dialog('destroy').remove();
                    } else {
                        alert(fail_log);
                    }
                }
            },
            {
                text: "Anuluj",
                click: function () {
                    $(this).dialog('destroy').remove();
                }
            }],
        open: function () {
            setDialog();
            setDialogButtons();
        },
        close: function () {
            $(this).dialog('destroy').remove();
        }
    });

    function setDialog() {
    }

    function setDialogButtons() {
        //open variable manager
        $(".input-group-btn button#variableManager").click(function () {
            $.ajax({
                type: "POST",
                datatype: "application/json",
                url: Routing.generate('bms_visualization_load_variable_manager'),
                success: function (ret) {
                    $(".main-row").children(".fa-spinner").remove();
                    $(".main-row").append(ret["template"]);
                    createVariableManager("term-register").dialog("open");
                }
            });
            $(".main-row").append("<i class='fa fa-spinner fa-pulse fa-4x'></i>").show();
        });
        setOpenEffectSrc();
        //zmiana typu efektu == zmiana przycisku managera efektów
        $("select#effect_type").change(function () {
            var effect_type = $(this).val();
            $(".input-group-btn button#effectManager").unbind("click");
            $("form#condition input#effect-value").val("");
            switch (effect_type) {
                case "css":
                    $(".input-group-btn button#effectManager").prop('disabled', false);
                    $("form#condition input#effect-value").prop('disabled', true);
                    setOpenEffectCss();
                    break;
                case "src":
                    $(".input-group-btn button#effectManager").prop('disabled', false);
                    $("form#condition input#effect-value").prop('disabled', true);
                    setOpenEffectSrc();
                    break;
                case "animation":
                    $(".input-group-btn button#effectManager").prop('disabled', true);
                    $("form#condition input#effect-value").prop('disabled', false);
                    setOpenEffectAnimation();
                    break;
                case "text":
                    $(".input-group-btn button#effectManager").prop('disabled', true);
                    $("form#condition input#effect-value").prop('disabled', false);
                    break;
                case "popup":
                    $(".input-group-btn button#effectManager").prop('disabled', true);
                    $("form#condition input#effect-value").prop('disabled', false);
                    break;
            }
        });

        function setOpenEffectCss() {
            $(".input-group-btn button#effectManager").click(function () {
                $.ajax({
                    type: "POST",
                    datatype: "application/json",
                    url: Routing.generate('bms_visualization_load_effect_css_manager'),
                    success: function (ret) {
                        $(".main-row").children(".fa-spinner").remove();
                        $(".main-row").append(ret["template"]);
                        createEffectCssManager().dialog("open");
                    }
                });
                $(".main-row").append("<i class='fa fa-spinner fa-pulse fa-4x'></i>").show();
            });
        }

        function setOpenEffectSrc() {
            $(".input-group-btn button#effectManager").click(function () {
                $.ajax({
                    type: "POST",
                    datatype: "application/json",
                    url: Routing.generate('bms_visualization_load_image_manager'),
                    success: function (ret) {
                        $(".main-row").children(".fa-spinner").remove();
                        $(".main-row").append(ret["template"]);
                        createImageManager("effect").dialog("open");
                    }
                });
                $(".main-row").append("<i class='fa fa-spinner fa-pulse fa-4x'></i>").show();
            });
        }

        function setOpenEffectAnimation() {
            $(".input-group-btn button#effectManager").click(function () {
                alert("Otwieranie Animacja");
            });
        }

    }

    function saveData(data) {
        $.ajax({
            type: "POST",
            data: data,
            contentType: false,
            processData: false,
            url: Routing.generate('bms_visualization_create_term'),
            success: function (ret) {
                $(".main-row").children(".fa-spinner").remove();
                var term = ret["term"][0];
                switch (term.effect_type) {
                    case "src":
                        var effectType = "Wyświetl obraz";
                        break;
                    case "css":
                        var effectType = "Właściwości formatu";
                        break;
                    case "animation":
                        var effectType = "Animacja";
                        break;
                }
                if ($("table tr#no-data").length > 0) {
                    $("table tbody").empty().append("<tr>\n\
                        <td></td>\n\
                        <td class='text-center'>Jeżeli żaden z poniższych warunków nie jest spełniony</td>\n\
                        <td class='text-center'></td>\n\
                        <td class=text-center'></td>\n\
                        <td class='text-center'>Właściwości formatu</td>\n\
                        <td class=''>display;none</td>\n\
                        <td class=''></td>\n\
                        <td></td>\n\
                    </tr>");
                }
                $("table tbody").append(
                    "<tr>\n\
                        <td>" + term.register_name + "</td>\n\
                            <td class='text-center'>" + term.fixedValue + "</td>\n\
                            <td class='text-center'>" + term.condition_type + "</td>\n\
                            <td class='text-center'>" + term.condition_value + "</td>\n\
                            <td class='text-center'>" + effectType + "</td>\n\
                            <td>" + term.effect_content + "</td>\n\
                            <td class='manage text-center'>\n\
                                <i id='" + term.id + "' class='fa fa-trash-o fa-fw fa-red'></i>\n\
                            </td>\n\
                            <td>\n\
                                <input name='checkedTermId[]' value='" + term.id + "' type='checkbox'></input>\n\
                            </td>\n\
                        </tr>");
                setDeleteTerm();
            }
        });
        $(".main-row").append("<i class='fa fa-spinner fa-pulse fa-4x'></i>").show();
    }

}

function ajaxMovePanel(data) {
    $.ajax({
        type: "POST",
        datatype: "application/json",
        url: Routing.generate('bms_visualization_move_panel'),
        data: data,
        success: function (ret) {
            $(".main-row").children(".fa-spinner").remove();
            loadPanelList(ret["panelList"]);
        }
    });
    $(".main-row").append("<i class='fa fa-spinner fa-pulse fa-4x'></i>").show();
}

/*
 function copyPanel(data) {
 $.ajax({
 type: "POST",
 datatype: "application/json",
 url: Routing.generate('bms_visualization_copy_panel'),
 data: data,
 success: function (ret) {
 $(".main-row").children(".fa-spinner").remove();
 $("div.main-row div.well").append(ret["template"]);
 $(".main-row").append(ret["dialog"]);
 loadPanelList(ret["panelList"]);

 setPanelEvents();
 createPanelDialog(ret["panel_id"]).dialog("open");
 }
 });
 $(".main-row").append("<i class='fa fa-spinner fa-pulse fa-4x'></i>").show();
 }
 */
function ajaxDeletePanel(data) {
    $.ajax({
        type: "POST",
        datatype: "application/json",
        url: Routing.generate('bms_visualization_delete_panel'),
        data: data,
        success: function (ret) {
            $(".main-row").children(".fa-spinner").remove();
            loadPanelList(ret["panelList"]);
        }
    });
    $(".main-row").append("<i class='fa fa-spinner fa-pulse fa-4x'></i>").show();
}

//dodanie obsługi zdarzeń na każdym panelu na stronie
function setPanelEvents() {
    var panels = $(".bms-panel");

    panels.each(function () {
        //pobranie id panelu
        var id = $(this).attr("id");
        var aR;
        $(this).children("img").length > 0 ? aR = true : aR = false;
        $(this).show().removeAttr("onclick").unbind("mouseenter mouseleave");
        //draggable and resizable
        $(this).draggable({
            containment: "parent",
            snap: ".pattern-net",
            snapTolerance: 10,
            snapMode: "both",
            distance: 5,
            stop: function (event, ui) {
                var data = {
                    panel_id: id,
                    topPosition: ui.helper.css("top"),
                    leftPosition: ui.helper.css("left"),
                    width: ui.helper.css("width"),
                    height: ui.helper.css("height"),
                    zIndex: ui.helper.css("z-index")
                };
                ajaxMovePanel(data);
            }
        }).resizable({
            containment: "parent",
            snap: ".pattern-net",
            snapTolerance: 10,
            snapMode: "both",
            aspectRatio: aR,
            handles: "se",
            resize: function (event, ui) {
                if (ui.element.hasClass("image-panel")) {
                    var image = $(this).children("img");
                    var mW = image[0].naturalWidth;
                    if (ui.size.width > mW) {
                        ui.size.width = mW;
                    }
                    var mH = image[0].naturalHeight;
                    if (ui.size.height > mH) {
                        ui.size.height = mH;
                    }
                } else {
                    var bw = ui.element.css("border-top-width");
                    bw = parseInt(bw);
                    var delta_x = ui.size.width - (ui.originalSize.width + 2 * bw);
                    var delta_y = ui.size.height - (ui.originalSize.height + 2 * bw);
                    if (delta_x !== 0) {
                        ui.size.width += 2 * bw;
                    }
                    if (delta_y !== 0) {
                        ui.size.height += 2 * bw;
                    }
                    ui.element.css({lineHeight: ui.element.height() + "px"});
                }
                ui.element.addClass("hover");
            },
            stop: function (event, ui) {
                ui.element.removeClass("hover");
                var data = {
                    panel_id: id,
                    topPosition: ui.helper.css("top"),
                    leftPosition: ui.helper.css("left"),
                    width: ui.element.css("width"),
                    height: ui.element.css("height"),
                    zIndex: ui.element.css("zIndex")
                };
                ajaxMovePanel(data);
            }
        });
        $(this).hover(function () {
            $(".panel-list-container div#" + id + " span.label").css({backgroundColor: "#FF0000"});
        }, function () {
            if ($("div#" + id + ".panel-list").hasClass("active")) {

            } else {
                $(".panel-list-container div#" + id + " span.label").css({backgroundColor: ""});
            }
        });
        $(this).click(function (e) {
            var panelLabel = $("span.label-bms-panel");
            $(this).css({zIndex: 100});
            if (panelLabel.length > 0) {
                var relX = parseInt(panelLabel.css("left"));
                var relY = parseInt(panelLabel.css("top"));
            } else {
                var relX = e.pageX - $(this).offset().left;
                var relY = e.pageY - $(this).offset().top;
                if ((parseInt($(this).css("left"))) + relX > parseInt($(this).parent().css("width")) / 2) {
                    relX = relX - 116;
                } else {
                    relX = relX - 4;
                }
                if ((parseInt($(this).css("top"))) + relY > parseInt($(this).parent().css("height")) / 2) {
                    relY = relY - 21;
                } else {
                    relY = relY - 4;
                }
            }
            panelLabel.remove();
            var label = "<span id=" + id + " class='label label-bms-panel' \n\
                               style='top: " + relY + "px; \n\
                                      left: " + relX + "px;\n\
                                      font-size: initial;\n\
                                      font-weight: initial;\n\
                                      text-decoration: none;\n\
                                      font-style: initial;'>\n\
                            <div>\n\
                                " + id + "\n\
                                <i class='fa fa-fw fa-clone fa-blue'></i>\n\
                                <i class='fa fa-fw fa-cogs fa-yellow'></i>\n\
                                <i class='fa fa-fw fa-trash-o fa-red'></i>\n\
                            </div>\n\
                        </span>";
            $(this).append(label);
            setPanelLabelEvents(id);
        });
        $(this).mouseleave(function () {
            var zI = $(".panel-list-container div#" + id + " span.label").attr("value");
            $(this).css({zIndex: zI});
            $("span.label-bms-panel").remove();
        });
    });
    //ustawienie przełączania między stronami
    function setPanelLabelEvents(id) {
        var label = "span#" + id + ".label-bms-panel";
        $(label).unbind("click");
        //kopiowania
        $(label + " i.fa-clone").click(function () {
            var data = {
                panel_id: id
            };
            copyPanel(data);
        });
        //ustawienia
        $(label + " i.fa-cogs").click(function () {
            var panel = $("div#" + id + ".bms-panel");
            var data = {panel_id: id};
            editPanel(data);
            panel.remove();
        });
        //usuwanie
        $(label + " i.fa-trash-o").click(function () {
            if (confirm("Na pewno chcesz usunąć ten panel? Zostaną usunięte również wszystkie zdarzenia przypisane do tego panelu.")) {
                $("div#" + id + ".bms-panel").remove();
                var data = {
                    panel_id: id
                };
                ajaxDeletePanel(data);
            }
        });
    }
}

function createDialogPageAddSettings() {

    return $("div.dialog-page-add-settings").dialog({
        autoOpen: false,
        height: 450,
        width: 450,
        modal: true,
        buttons: [
            {
                text: "Dodaj",
                click: function () {
                    var data = {
                        width: $("div.dialog-page-add-settings input#width").val(),
                        height: $("div.dialog-page-add-settings input#height").val(),
                        name: $("div.dialog-page-add-settings input#name").val(),
                        backgroundColor: $("div.dialog-page-add-settings input#backgroundColor").val()
                    };
                    ajaxAddPage(data);
                    $(this).dialog("close");
                }
            },
            {
                text: "Anuluj",
                click: function () {
                    $(this).dialog("close");
                }
            }],
        open: function () {

        },
        close: function () {
            $(this).dialog("close");
        }
    });
}

function createDialogPageEditSettings(page_id) {

    return $("div.dialog-page-edit-settings").dialog({
        autoOpen: false,
        height: 300,
        width: 450,
        modal: true,
        buttons: [
            {
                text: "Zapisz",
                click: function () {
                    var data = {
                        page_id: page_id,
                        width: $("div.dialog-page-edit-settings input#width").val(),
                        height: $("div.dialog-page-edit-settings input#height").val(),
                        name: $("div.dialog-page-edit-settings input#name").val()
                    };
                    ajaxEditPage(data);
                    $(this).dialog("close");
                }
            },
            {
                text: "Anuluj",
                click: function () {
                    $(this).dialog("close");
                }
            }],
        open: function () {
            if (page_id !== null) {
                setFormField();
            }
        },
        close: function () {
            $(this).dialog("close");
        }
    });
    function setFormField() {
        var width = parseInt($('div.main-row div.well').css("width"));
        var height = parseInt($('div.main-row div.well').css("height"));
        var name = $('div.label-page.active span#name').text();
        $("div.dialog-page-edit-settings input#width").val(width);
        $("div.dialog-page-edit-settings input#height").val(height);
        $("div.dialog-page-edit-settings input#name").val(name);
    }
}

function ajaxAddPage(data) {
    $.ajax({
        type: "POST",
        datatype: "application/json",
        url: Routing.generate('bms_visualization_add_page'),
        data: data,
        success: function (ret) {
            $(".main-row").children(".fa-spinner").remove();
            createPage(ret['page'], ret['panelList']);
        }
    });
    $(".main-row").append("<i class='fa fa-spinner fa-pulse fa-4x'></i>").show();
}

function ajaxDeletePage(data) {
    $.ajax({
        type: "POST",
        url: Routing.generate('bms_visualization_delete_page'),
        data: data,
        success: function () {
            $(".main-row").children(".fa-spinner").remove();
            var data = {
                page_id: 1
            };
            ajaxChangePage(data);
        }
    });
    $(".main-row").append("<i class='fa fa-spinner fa-pulse fa-4x'></i>").show();
}

function ajaxEditPage(data) {
    $.ajax({
        type: "POST",
        url: Routing.generate('bms_visualization_edit_page'),
        data: data,
        success: function (ret) {
            $(".main-row").children(".fa-spinner").remove();
            var data = {
                page_id: ret['page_id']
            };
            ajaxChangePage(data);
        }
    });
    $(".main-row").append("<i class='fa fa-spinner fa-pulse fa-4x'></i>").show();
}

function ajaxChangePage(data) {
    $.ajax({
        type: "POST",
        datatype: "application/json",
        url: Routing.generate('bms_visualization_change_page'),
        data: data,
        success: function (ret) {
            $(".main-row").children(".fa-spinner").remove();
            createPage(ret['page'], ret['panelList']);
            setVariables(ret['registers']);
        }
    });
    $(".main-row").append("<i class='fa fa-spinner fa-pulse fa-4x'></i>").show();

    function setVariables(registers) {
        $.each(registers, function (key, value) {
            if (value !== null) {
                var displayPrecision = parseInt($("div.bms-panel-variable").children("span#" + key).attr("value"));
                var roundValue = parseFloat(value).toFixed(displayPrecision);
            }
            $("div.bms-panel").children("span#" + key).empty().append(roundValue);

            if ($("div.bms-panel-widget").find("div#value" + key).length > 0) {
                var rangeMin = parseFloat($("div.bms-panel-widget").find("div#value" + key).parent().parent().find("div#rangeMin").text().trim());
                var rangeMax = parseFloat($("div.bms-panel-widget").find("div#value" + key).parent().parent().find("div#rangeMax").text().trim());

                var widgetValue = (value - rangeMin) / (rangeMax - rangeMin) * 100;
                if (widgetValue < 0) {
                    widgetValue = 0;
                    $("div.bms-panel-widget").find("div#value" + key).hide();
                }
                $("div.bms-panel-widget").find("div#value" + key).show().animate({
                    left: widgetValue + "%"
                }, 2000);
            }
            if ($("div.bms-panel-widget").find("div#set" + key).length > 0) {
                var rangeMin = parseFloat($("div.bms-panel-widget").find("div#set" + key).parent().parent().find("div#rangeMin").text().trim());
                var rangeMax = parseFloat($("div.bms-panel-widget").find("div#set" + key).parent().parent().find("div#rangeMax").text().trim());
                var widgetValue = (value - rangeMin) / (rangeMax - rangeMin) * 100;
                if (widgetValue < 0) {
                    widgetValue = 0;
                    $("div.bms-panel-widget").find("div#set" + key).hide();
                }
                $("div.bms-panel-widget").find("div#set" + key).show().animate({
                    left: widgetValue + "%"
                }, 2000);
            }

        });
    }

}

//utworzenie nowej strony
function createPage(page, panelList) {
    $(".main-row div.col-md-12").children().remove();
    $(".main-row div.col-md-12").append(page).fadeIn("slow");
    setPatternNet($("input#pattern-net-size").val());
    setPageLabelsEvent();
    setPanelEvents();
    loadPanelList(panelList);

    function setPageLabelsEvent() {
        var pageLabels = $(".label-page");
        pageLabels.unbind("click");
        pageLabels.each(function () {
            var id = $(this).attr("id");
            $(this).click(function () {
                var data = {
                    page_id: id
                };
                ajaxChangePage(data);
            });
            if ($(this).hasClass("active")) {
                $(this).unbind("click");
            }
            deletePageEvent($(this), id);
            editPageEvent($(this), id);
        });
        //usuwanie strony
        function deletePageEvent(label, page_id) {
            label.children("i.fa-remove").click(function () {
                var data = {
                    page_id: page_id
                };
                ajaxDeletePage(data);
                label.remove();
                $("div.main-row div.well").remove();
            });
        }

        //edycja strony
        function editPageEvent(label, page_id) {
            label.children("i.fa-cogs").click(function () {
                createDialogPageEditSettings(page_id).dialog("open");
            });
        }


    }

}

//ustaw siatkę pomocniczą
function setPatternNet(x) {

    var state = $("button.btn-pattern-net span").hasClass("off");
    if (state === false) {
        $(".pattern-net, .pattern-net-right").remove();
        var divItem;
        if (x.length === 0) {
            x = defaultPatternNetSize;
        } else if (x < 25) {
            x = 25;
        }
        var mainWell = $("div.main-row div.well");
        var nx = mainWell.width() / x,
            ny = mainWell.height() / x;
        for (var i = 0; i < Math.floor(nx) * Math.floor(ny) + Math.floor(nx); i++) {
            divItem = "<div id=" + i + " class='pattern-net'></div>";
            mainWell.append(divItem);
            $("div#" + i + ".pattern-net").width(x).height(x);
        }
        for (i = 0; i < ny; i++) {
            divItem = "<div id=" + i + " class='pattern-net-right'></div>";
            mainWell.append(divItem);
            $("div#" + i + ".pattern-net-right").height(x);
        }
    }
}

//usuń obrazek z serwera
function ajaxDeleteImage(data) {
    $.ajax({
        type: "POST",
        url: Routing.generate('bms_visualization_delete_image'),
        data: data,
        success: function () {
            $(".main-row").children(".fa-spinner").remove();
        }
    });
    $(".main-row").append("<i class='fa fa-spinner fa-pulse fa-4x'></i>").show();
}

//załaduj listę paneli
function loadPanelList(panelList) {
    $("input#panel-list-text, input#panel-list-image, input#panel-list-variable").prop("checked", true).unbind("click, change");
    $("div.bms-panel").removeClass("active");
    //załaduj panele na listę
    $("div.panel-list-container").empty().append(panelList).show();
    //ukryj pokaż panele typu text na liście
    $('input#panel-list-text').change(function () {
        $(this).is(':checked') ? $("span.panel-list-text").parent().parent().parent("div.panel-list").show() : $("span.panel-list-text").parent().parent().parent("div.panel-list").hide();
    });
    //ukryj pokaż panele typu image na liście
    $('input#panel-list-image').change(function () {
        $(this).is(':checked') ? $("span.panel-list-image").parent().parent().parent("div.panel-list").show() : $("span.panel-list-image").parent().parent().parent("div.panel-list").hide();
    });
    //ukryj pokaż panele typu variable na liście
    $('input#panel-list-variable').change(function () {
        $(this).is(':checked') ? $("span.panel-list-variable").parent().parent().parent("div.panel-list").show() : $("span.panel-list-variable").parent().parent().parent("div.panel-list").hide();
    });
    //ukryj pokaż panele typu widget na liście
    $('input#panel-list-widget').change(function () {
        $(this).is(':checked') ? $("span.panel-list-widget").parent().parent().parent("div.panel-list").show() : $("span.panel-list-widget").parent().parent().parent("div.panel-list").hide();
    });
    //obsługa najechania na panel na liscie
    $('div.panel-list').hover(function () {
        var id = $(this).attr("id");
        $("div#" + id + ".bms-panel").addClass("active");
        $(this).find("span").css({backgroundColor: "#FF0000", width: "20px"});
        $(this).find("i.icon-type").hide();
        $(this).find("div.panel-list-controls").show();
        $(this).find("div.panel-list-label").removeClass("col-md-12").addClass("col-md-5").css({overflow: "hidden"});
    }, function () {
        var id = $(this).attr("id");
        $(this).find("span").css({backgroundColor: "", width: ""});
        $(this).find("div.panel-list-label").css({overflow: ""});
        if (!$(this).hasClass("active")) {
            $(this).find("div.panel-list-label").removeClass("col-md-5").addClass("col-md-12");
            $(this).find("i.icon-type").show();
            $(this).find("div.panel-list-controls").hide();
            $("div#" + id + ".bms-panel").removeClass("active");
        }
    });
    //obsługa zaznaczania paneli na liście
    $("div.panel-list").click(function () {
        $(this).toggleClass("active");
    });
    //edycja kolejności w górę
    $("div.panel-list i.fa-arrow-up").click(function () {
        var id = $(this).parent().parent().parent().attr("id");
        var panel = $("div#" + id + ".bms-panel");
        var zIndex = $(this).parent().parent().parent().find("span").attr("value");
        zIndex++;
        panel.css({zIndex: zIndex});
        $(this).parent().parent().parent().find("span").attr("value", zIndex);
        var data = {
            panel_id: id,
            topPosition: panel.css("top"),
            leftPosition: panel.css("left"),
            width: panel.css("width"),
            height: panel.css("height"),
            zIndex: panel.css("zIndex")
        };
        ajaxMovePanel(data);
    });
    //edycja kolejności w dół
    $("div.panel-list i.fa-arrow-down").click(function () {
        var id = $(this).parent().parent().parent().attr("id");
        var panel = $("div#" + id + ".bms-panel");
        var zIndex = $(this).parent().parent().parent().find("span").attr("value");
        zIndex--;
        if (zIndex < 0) {
            zIndex = 0;
        }
        panel.css({zIndex: zIndex});
        var data = {
            panel_id: id,
            topPosition: panel.css("top"),
            leftPosition: panel.css("left"),
            width: panel.css("width"),
            height: panel.css("height"),
            zIndex: panel.css("zIndex")
        };
        ajaxMovePanel(data);
    });
    //kopiowanie
    // $("div.panel-list i.fa-clone").click(function () {
    //     var id = $(this).parent().parent().parent().attr("id");
    //     var data = {
    //         panel_id: id
    //     };
    //     copyPanel(data);
    // });
    // ustawienia
    $("div.panel-list i.fa-cogs").click(function () {
        var id = $(this).parent().parent().parent().attr("id");
        var panel = $("div#" + id + ".bms-panel");
        var data = {panel_id: id};
        editPanel(data);
        panel.remove();
    });
    // usuwanie
    $("div.panel-list i.fa-trash-o").click(function () {
        var id = $(this).parent().parent().parent().attr("id");
        if (confirm("Na pewno chcesz to usunąć?")) {
            $("div#" + id + ".bms-panel").remove();
            var data = {
                panel_id: id
            };
            ajaxDeletePanel(data);
        }
    });
}