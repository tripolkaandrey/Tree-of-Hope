$(window).on('dragover',function(e){
    e = e || event;
    e.preventDefault();
})
$(window).on('drop',function(e){
    e = e || event;
    e.preventDefault();
})

$(function() {
    $('#file').change(async function () {
        event.preventDefault();
        if ($("#file").val() == "")
        {
            alert('Please select an image');
        }
        var file = $("#file").prop('files')[0];
        var data ={"img" :await toBase64(file)};
        sendData(data);
    });
})


$('#drop-area').on('dragenter' , function(e) {
    e.preventDefault();
    $(this).addClass("animate__animated forever animate__headShake disable");
});
$('#drop-area').on('dragover' , function(e) {
    e.preventDefault();
});
$('#drop-area').on('dragleave' , function(e) {
    $(this).removeClass("animate__animated forever animate__headShake disable");
});
$('#drop-area').on('drop' ,async function(e) {
    $(this).removeClass("animate__animated forever animate__headShake disable");
    if(e.originalEvent.dataTransfer && e.originalEvent.dataTransfer.files.length) {
        e.preventDefault();
        e.stopPropagation();
        sendData({"img" :await toBase64(e.originalEvent.dataTransfer.files[0])});
    }
});

function sendData(data) {
    $(".modal-content").empty();
    $(".modal-content").append('<i class="fas fa-spinner fa-pulse"></i>');
    $("#myModal").modal('show');
    $.ajax({
        url: "Home/predict",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(data){
            $("#file").val('');
            var image = new Image();
            image.src = "data:png;base64," + data["image"];
            $(image).css({"width" : "85%","height" : "auto","margin" : "0 auto"});
            $(".modal-content").empty();
            $(".modal-content").append(image);
            console.log("success");
        },
        error: function(error){
            console.log("error");
            console.log(error);
        }
    });
}

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.toString().replace("data:" + file.type + ";base64,", ""));
    reader.onerror = error => reject(console.log(error));
});