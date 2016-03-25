(function(){

    var _z = console;
    Object.defineProperty( window, "console", {
        get : function(){
            if( _z._commandLineAPI ){
                throw "For your protection, running scripts via the console is forbidden!";
            }
            return _z;
        },
        set : function(val){
            _z = val;
        }
    });

})();
//tinymce.init({ selector:'textarea.wsy' });
$.material.init();
$("#fabCreateCat").hide();
$("#loginError").hide();
$("#resetEmailSent").hide();
//$('#first-load-dialog').modal('show');
$("#noRubricSelect").hide();
$("#graderHeader").hide();
$("#login-to-taa").modal("show");

var totalScore = 0;
var arrayOfScores = new Array();
var arrayOfMaxPoints = new Array();
var arrayOfCategories = new Array();
var arrayOfComments = new Array();
var arrayOfNotes = new Array();
var arrayOfCommentsText = new Array();
var rubricName = "";
var maxPoints = 0;
var key = null;

var taName = ""; //= "Dan Ziegler";
var taEmail = ""; //= "dmz38@drexel.edu";
var taMessage = ""; //= "Questions?  See me during office hours Monday 4-6pm or shoot me an email!"

var cookieName = "taName";
var cookieEmail = "taEmail";
var cookieGraderNote = "taNote"
var cookies = document.cookie.split(';');
var values = "";

var indexForEdit = -1;

var indexOfMainDD = 0;

taName = getAndSetFromCookie(cookies, cookieName);
taEmail = getAndSetFromCookie(cookies, cookieEmail);
taMessage = getAndSetFromCookie(cookies, cookieGraderNote);

function getAndSetFromCookie(cookie, cookieVal) {
    for(var i=0; i<cookie.length; i++) {
        var c = cookie[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        var search = cookieVal + "=";
        if (c.indexOf(search) == 0)
            return c.substring(search.length,c.length);
    }
    return "";
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    var cValue = cname + "=" + cvalue + "; " + expires;
    console.log(cValue);
    document.cookie = cValue;
    console.log(document.cookie);
}

//$("#totalCalcPts").html(totalScore);

function generateComments() {
    totalScore = 0;
    $.each($(".assignedPoints"), function(index, value) {
        if(value.value != "" && value.value != "-"){
            totalScore = totalScore + parseFloat(value.value);
            arrayOfScores[index] = parseFloat(value.value);
        } else {
            arrayOfScores[index] = 0;
        }
    });
    maxPoints = 0;
    for(var i in arrayOfMaxPoints) {
        maxPoints += parseFloat(arrayOfMaxPoints[i]);
    }
    $("#totalPossiblePts").html(maxPoints);

    $("#totalCalcPts").html(totalScore);
    $.each($(".taComments"), function(index, value) {
        var comment = value.value;
        arrayOfCommentsText[index] = comment;
        //console.log(comment);
        while(comment.indexOf("\n") > -1) {
            comment = comment.replace("\n", "<br>");
        }
        arrayOfComments[index] = comment;
    });

    var commentString = "";
    var commentStringText = "";
    $.each(arrayOfCategories, function(index, value) {
        commentString = commentString + value + ": " + arrayOfScores[index] + "/" + arrayOfMaxPoints[index] + "<br>";
        commentStringText = commentStringText + value + ": " + arrayOfScores[index] + "/" + arrayOfMaxPoints[index] + "\n";
        if(arrayOfComments[index] != "") {
            commentString = commentString + arrayOfComments[index] + "<br><br>";
            commentStringText = commentStringText + arrayOfCommentsText[index] + "\n\n";
        }
        //commentString = commentString + "<br>";
    });
    commentString = commentString + "<br>Total Score: " + totalScore + "/" + maxPoints + "<br><br>";
    commentStringText = commentStringText + "\nTotal Score: " + totalScore + "/" + maxPoints + "\n\n";
    commentString = commentString + "Graded by " + taName + " (" + taEmail + ").<br>" + taMessage;
    commentStringText = commentStringText + "Graded by " + taName + " (" + taEmail + ").\n" + taMessage;
    $("#combinedComments").html(commentString);
    $("#copyCombinedComments").html(commentStringText);
}

$('#btnCreate').click(function(){
    $('#first-load-dialog').modal('hide');
    $("#create-new-rubric-dialog").modal('show');
    key = null;
});

$("#btnRubricCreateCancel").click(function () {
    $("#create-new-rubric-dialog").modal('hide');
    $('#first-load-dialog').modal('show');
    $("#newRubricName").val("");
});

$("#fabCreateCat").click(function() {
    $("#create-new-category-dialog").modal('show');
});

$(function () {
    $('[data-toggle="tooltip"]').tooltip()
});


$(".row").on("keyup", ".assignedPoints", function () {
    if($(this).val() > $(this).data("max")) {
        $(this).parent().addClass("has-warning");
        $(this).parent().next().show();
    } else {
        $(this).parent().removeClass("has-warning");
        $(this).parent().next().hide();
    }
    generateComments();
});

$("#btnAll100").click(function() {
    $.each($(".assignedPoints"), function(index, value) {
        $(this).val(arrayOfMaxPoints[index]);
        $(this).parent().removeClass("has-warning");
        $(this).parent().next().hide();
    });
    generateComments();
});

//btnClearOnlyComments

$("#btnClearOnlyComments").click(function() {
    $.each($(".taComments"), function(index, value) {
        $(this).val("");
    });
    generateComments();
});

$(".row").on("focusout", ".taComments", function () {
    generateComments();
});

/*
 $(".taComments").on('keyup', function(e) {
 var code = e.keyCode || e.which;
 if(code == 13) { //Enter keycode
 event.preventDefault();
 var s = $(this).val();
 $(this).val(s+"\n");
 }
 });*/

function copyToClipboard(elem) {
    // create hidden text element, if it does not already exist
    var targetId = "_hiddenCopyText_";
    var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
    var origSelectionStart, origSelectionEnd;
    if (isInput) {
        // can just use the original source element for the selection and copy
        target = elem;
        origSelectionStart = elem.selectionStart;
        origSelectionEnd = elem.selectionEnd;
    } else {
        // must use a temporary form element for the selection and copy
        target = document.getElementById(targetId);
        if (!target) {
            var target = document.createElement("textarea");
            target.style.position = "absolute";
            target.style.left = "-9999px";
            target.style.top = "0";
            target.id = targetId;
            document.body.appendChild(target);
        }
        target.textContent = elem.textContent;
    }
    // select the content
    var currentFocus = document.activeElement;
    target.focus();
    target.setSelectionRange(0, target.value.length);

    // copy the selection
    var succeed;
    try {
        succeed = document.execCommand("copy");
    } catch(e) {
        succeed = false;
    }
    // restore original focus
    if (currentFocus && typeof currentFocus.focus === "function") {
        currentFocus.focus();
    }

    if (isInput) {
        // restore prior selection
        elem.setSelectionRange(origSelectionStart, origSelectionEnd);
    } else {
        // clear temporary content
        target.textContent = "";
    }
    return succeed;
}

$("#btnCopyRubric").click(function() {
    var success = copyToClipboard(document.getElementById("copyCombinedComments"));
    //console.log(success);
});

$("#btnTAInfo").click(function() {
    $("#taName").val(taName);
    $("#taEmail").val(taEmail);
    $("#taMessage").val(taMessage);
    $("#previewTAName").html(taName);
    $("#previewTAEmail").html(taEmail);
    $("#previewTAMessage").html(taMessage);
    $("#edit-ta-info-dialog").modal('show');
});

$("#taName").keyup(function() {
    $("#previewTAName").html($("#taName").val());
});

$("#taEmail").keyup(function() {
    $("#previewTAEmail").html($("#taEmail").val());
});

$("#taMessage").keyup(function() {
    $("#previewTAMessage").html($("#taMessage").val());
});

$("#saveTAInfo").click(function() {
    taName = $("#taName").val();
    taEmail = $("#taEmail").val();
    taMessage = $("#taMessage").val();
    setCookie(cookieName, taName, 365);
    setCookie(cookieEmail, taEmail, 365);
    setCookie(cookieGraderNote, taMessage, 365);
    generateComments();
});

$("#btnClearComments").click(function() {
    $(".assignedPoints").val("");
    $(".taComments").val("");
    generateComments();
});

$("#btnRubricCreate").click(function () {
    $('#first-load-dialog').modal("hide");
    $("#fabCreateCat").show();
    rubricName = $("#newRubricName").val();
    $("#create-new-category-dialog").modal("show");
});

function clearCategoryBox() {
    $("#newCatName").val("");
    $("#newPointValue").val("");
    $("#newGraderNotes").val("");
}

function generateCategories() {
    $("#categoryArea").html("");
    $.each(arrayOfCategories, function(index, value) {
        var template = $("#sampleCatRow").html();//.trim();
        $template = $(template);
        //console.log(value +  ", " + arrayOfMaxPoints[index] +  ", " + arrayOfNotes[index]);
        $(".catTitle", $template).html(value);
        $(".maxPts", $template).html(arrayOfMaxPoints[index]);
        $(".assignedPoints", $template).attr("data-max", arrayOfMaxPoints[index]);
        $(".graderNotes", $template).html(arrayOfNotes[index]);
        $("#categoryArea").append($template.html());
    });
    $("#rubricNameTitle").html(rubricName);
    $.material.init();
    $(".overPts").hide();
    $("#main-area").removeClass("hidden");
}

function generateCategoriesEdit() {
    $("#categoryArea").html("");
    $.each(arrayOfCategories, function(index, value) {
        var template = $("#sampleCatRowEdit").html();//.trim();
        $template = $(template);
        //console.log(value +  ", " + arrayOfMaxPoints[index] +  ", " + arrayOfNotes[index]);
        $(".catTitle", $template).html(value);
        $(".maxPts", $template).html(arrayOfMaxPoints[index]);
        $(".graderNotes", $template).html(arrayOfNotes[index]);
        $(".btnOpenEdit", $template).attr("data-index", index);
        $(".btnCatDel", $template).attr("data-index", index);
        $(".btnCatCpy", $template).attr("data-index", index);
        $("#categoryArea").append($template.html());
    });
    $("#rubricNameTitle").html(rubricName);
    $.material.init();
    $('[data-toggle="tooltip"]').tooltip();
    $("#main-area").removeClass("hidden");
}

$("#btnCreateCat").click(function () {
    arrayOfCategories.push($("#newCatName").val());
    arrayOfMaxPoints.push($("#newPointValue").val());
    arrayOfNotes.push($("#newGraderNotes").val());
    $("#create-new-category-dialog").modal("hide");
    saveRubric();
    generateCategoriesEdit();
    generateComments();
    clearCategoryBox();
});

$("#btnCancelCat").click(function () {
    $("#create-new-category-dialog").modal("hide");
    clearCategoryBox();
});

var ws = null;
/*
new cloudmine.WebService({
    appid: '16855e52dba049e5b04d22e9b4f6104f',
    apikey: 'c17f1497b955442b8bf77dfa5164dbb6'
    //session_token: (window.localStorage ? localStorage.getItem('cm_session') : null)
});
*/

var ws2 = null;
var appID1 = '';

$.ajax({
    url: "js/info.php",
    type: "POST",
    data: { p: window.location.href },
    cache: false,
    success: function (response) {
        appID1 = response;
    }
});

$.ajax({
    url: "js/blank.php",
    type: "POST",
    data: { p: window.location.href.length },
    cache: false,
    success: function (response) {
        ws2 = new cloudmine.WebService({
            appid: appID1,
            apikey: response
            //session_token: (window.localStorage ? localStorage.getItem('cm_session') : null)
        });
    }
});

var arrayOfCreatedRubrics = new Array();
var namesOfRubrics = new Array();
var keysOfObjects = new Array();

function generateAvailableRubrics() {
    var dropdown = $("#ddCreatedRubrics");
    dropdown.html("");
    dropdown.append("<option>Select a rubric...</option>");
    for(var name in namesOfRubrics) {
        dropdown.append("<option>" + namesOfRubrics[name] + "</option>");
    }
}

function getRubricsOnline() {
    ws.search('[type = "rubric"]', {sort: 'name'}, {applevel: false}).on('success', function(data, response) {
        console.log(data);
        namesOfRubrics = new Array();
        arrayOfCreatedRubrics = new Array();
        for(var id in data) {
            keysOfObjects.push(id);
            var obj = data[id];
            //console.log(obj);
            var currentValues = new Array();
            for (var nId in obj) {
                if(nId == "name") {
                    //console.log("SHOULD BE NAME -> " + obj["name"]);
                    namesOfRubrics.push(obj["name"]);
                } else if (nId == "categories") {
                    var cats = new Array();
                    for(var ctg = 0; ctg < obj["categories"].length; ctg++) {//  in obj["categories"]) {
                        cats.push(obj["categories"][ctg]);
                    }
                    currentValues.push(cats);
                    //console.log(cats);
                } /*else {
                 //console.log("SHOULD BE RUBRIC -> " + nId + ":" + obj[nId]);
                 }*/

            }
            arrayOfCreatedRubrics.push(currentValues);
        }
        //console.log(arrayOfCreatedRubrics);
        //console.log(namesOfRubrics);
        //console.log(id);
        generateAvailableRubrics();
    });
}

//getRubricsOnline();

$("#btnGradeRubric").click(function () {
    var selectedIndex = $("#ddCreatedRubrics").prop("selectedIndex") - 1;
    if (selectedIndex > -1) {
        indexOfMainDD  = selectedIndex;
        $("#noRubricSelect").hide();
        rubricName = namesOfRubrics[selectedIndex];
        for (var i in arrayOfCreatedRubrics[selectedIndex]) {
            var curVal = arrayOfCreatedRubrics[selectedIndex][i];
            for(var cat in curVal) {
                arrayOfCategories.push(curVal[cat][0]);
                arrayOfMaxPoints.push(parseFloat(curVal[cat][1]));
                arrayOfNotes.push(curVal[cat][2]);
            }
        }
        key = keysOfObjects[selectedIndex];
        $("#graderHeader").show();
        generateCategories();
        generateComments();
        $("#fabCreateCat").hide();
        $('#first-load-dialog').modal("hide");
        if( taName == "") {
            $("#edit-ta-info-dialog").modal('show');
        }
    } else {
        $("#noRubricSelect").show();
    }
});

$("#btnEditRubric").click(function () {
    var selectedIndex = $("#ddCreatedRubrics").prop("selectedIndex") - 1;
    if (selectedIndex > -1) {
        indexOfMainDD  = selectedIndex;
        $("#noRubricSelect").hide();
        rubricName = namesOfRubrics[selectedIndex];
        for (var i in arrayOfCreatedRubrics[selectedIndex]) {
            var curVal = arrayOfCreatedRubrics[selectedIndex][i];
            for(var cat in curVal) {
                arrayOfCategories.push(curVal[cat][0]);
                arrayOfMaxPoints.push(parseFloat(curVal[cat][1]));
                arrayOfNotes.push(curVal[cat][2]);
            }
        }
        key = keysOfObjects[selectedIndex];
        $("#graderHeader").hide();
        generateCategoriesEdit();
        generateComments();
        $("#fabCreateCat").show();
        $('#first-load-dialog').modal("hide");
    } else {
        $("#noRubricSelect").show();
    }
});

function openEditDialog() {
    $("#editCatName").val(arrayOfCategories[indexForEdit]);
    $("#editPointValue").val(arrayOfMaxPoints[indexForEdit]);
    $("#editGraderNotes").val(arrayOfNotes[indexForEdit]);
    $("#edit-category-dialog").modal('show');
}

$("#btnSaveCat").click(function () {
    arrayOfCategories[indexForEdit] = $("#editCatName").val();
    arrayOfMaxPoints[indexForEdit] = $("#editPointValue").val();
    arrayOfNotes[indexForEdit] = $("#editGraderNotes").val();
    saveRubric();
    generateCategoriesEdit();
    generateComments();
    indexForEdit = -1;
    $("#edit-category-dialog").modal('hide');
});

$("#btnCancelEditCat").click(function () {
    $("#edit-category-dialog").modal('hide');
});

$(".row").on("click", ".btnOpenEdit", function() {
    indexForEdit = $(this).attr("data-index");
    openEditDialog();
});

var rowToDelete = -1;

$(".row").on("click", ".btnCatDel", function() {
    rowToDelete = $(this).attr("data-index");
    $("#confirmCatDelete").modal("show");
});

$("#deleteCatNow").click(function() {
    arrayOfScores.splice(rowToDelete, 1);
    arrayOfMaxPoints.splice(rowToDelete, 1);
    arrayOfCategories.splice(rowToDelete, 1);
    arrayOfComments.splice(rowToDelete, 1);
    arrayOfNotes.splice(rowToDelete, 1);
    arrayOfCommentsText.splice(rowToDelete, 1);
    generateCategoriesEdit();
    generateComments();
    saveRubric();
    $("#confirmCatDelete").modal("hide");
});

var rowToCpy = -1;

$(".row").on("click", ".btnCatCpy", function() {
    rowToCpy = $(this).attr("data-index");
    $("#copyDialog").modal("show");
});

$("#copyBelow").click(function() {
    console.log(rowToCpy);
    arrayOfScores.splice(rowToCpy, 0, arrayOfScores[rowToCpy]);
    arrayOfMaxPoints.splice(rowToCpy, 0, arrayOfMaxPoints[rowToCpy]);
    arrayOfCategories.splice(rowToCpy, 0, arrayOfCategories[rowToCpy]);
    arrayOfComments.splice(rowToCpy, 0, arrayOfComments[rowToCpy]);
    arrayOfNotes.splice(rowToCpy, 0, arrayOfNotes[rowToCpy]);
    arrayOfCommentsText.splice(rowToCpy, 0, arrayOfCommentsText[rowToCpy]);
    generateCategoriesEdit();
    generateComments();
    saveRubric();
    rowToCpy = -1;
    $("#copyDialog").modal("hide");
});

$("#copyToEnd").click(function() {
    var rowToCpy2 = arrayOfScores.length;
    arrayOfScores.splice(rowToCpy2, 0, arrayOfScores[rowToCpy]);
    arrayOfMaxPoints.splice(rowToCpy2, 0, arrayOfMaxPoints[rowToCpy]);
    arrayOfCategories.splice(rowToCpy2, 0, arrayOfCategories[rowToCpy]);
    arrayOfComments.splice(rowToCpy2, 0, arrayOfComments[rowToCpy]);
    arrayOfNotes.splice(rowToCpy2, 0, arrayOfNotes[rowToCpy]);
    arrayOfCommentsText.splice(rowToCpy2, 0, arrayOfCommentsText[rowToCpy]);
    generateCategoriesEdit();
    generateComments();
    saveRubric();
    $("#copyDialog").modal("hide");
});

$("#btnHome").click(function () {
    $("#fabCreateCat").hide();
    clearArrays();
    getRubricsOnline();
    $("#main-area").addClass("hidden");
    $("#ddCreatedRubrics").prop("selectedIndex", indexOfMainDD);
    $("#first-load-dialog").modal("show");
});

function clearArrays() {
    arrayOfScores = new Array();
    arrayOfMaxPoints= new Array();
    arrayOfCategories = new Array();
    arrayOfComments = new Array();
    arrayOfNotes = new Array();
}

function saveRubric() {
    var genCatArray = new Array();

    for(var i in arrayOfCategories) {
        var tempArray = new Array();
        tempArray.push(arrayOfCategories[i]);
        tempArray.push(arrayOfMaxPoints[i]);
        tempArray.push(arrayOfNotes[i]);
        genCatArray.push(tempArray);
    }

    console.log("Key: " + key);

    ws.set(key, {
        type : "rubric",
        name : rubricName,
        categories : genCatArray
    }).on('success', function(data, apicall) {
        console.log(data);
        for(var k in data) {
            key = k;
        }
    }).on('error', function(err, apicall) {
        console.log(err);
    }).on('complete', function(data, apicall) {
        //console.log("Finished set on 'car':", data);
    });

}

$("#dda").click(function () {
    var node = document.getElementById("ddCreatedRubrics");
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent ("mousedown", true, true);
    node.dispatchEvent (clickEvent);
});

$("#processLogin").click(function() {
    ws2.login({username: $("#username").val(), password: $("#pswd").val()}).on('success', function(data, response) {
        $.ajax({
            url: "js/info.php",
            type: "POST",
            data: { p: window.location.href.length },
            cache: false,
            success: function (response) {
                ws = new cloudmine.WebService({
                    appid: appID1,
                    apikey: response
                    //session_token: (window.localStorage ? localStorage.getItem('cm_session') : null)
                });
                $("#loginError").hide();
                console.log(data);
                $("#login-to-taa").hide();
                $("#first-load-dialog").modal("show");
                // Now you can save the session token using localStorage
                //localStorage.setItem('cm_session', response.session_token);
                getRubricsOnline();
            }
        });
    }).on('error', function (data, response) {
        console.log(response);
        $("#loginError").show();
    });
});

$("#pswdReset").click(function() {
    ws2.resetPassword($("#emailForReset").val()).on('success', function() {
        $("#resetEmailSent").show();
    }).on('error', function(data, reason) {
        console.log(reason);
    });
});

$("#pswdResetModalOpen").click(function() {
    $("#pswdResetModal").modal("show");
});