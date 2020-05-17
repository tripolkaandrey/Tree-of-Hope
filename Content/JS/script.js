//Prevent page from opening files when using drag feature
$(window).on('dragover',function(e){
    e = e || event;
    e.preventDefault();
})
$(window).on('drop',function(e){
    e = e || event;
    e.preventDefault();
})

////////FILE UPLOADING/////////
//file input change
$('#file').change(async function () {
    var file = $("#file").prop('files')[0];
    var data ={"img" :await toBase64(file)};
    sendData(data);
});
var imageTypes = ['image/png', 'image/gif', 'image/bmp', 'image/jpg', 'image/jpeg'];
//Drag and Drop area
$('#drop-area').on('dragenter' , function(e) {
    e.preventDefault();
    $(this).addClass("animate__animated forever animate__headShake disable");//starts shaking
});
$('#drop-area').on('dragover' , function(e) {
    e.preventDefault();
});
$('#drop-area').on('dragleave' , function(e) {
    $(this).removeClass("animate__animated forever animate__headShake disable");//stops shaking
});
$('#drop-area').on('drop' ,async function(e) {
    $(this).removeClass("animate__animated forever animate__headShake disable");//stops shaking
    if(e.originalEvent.dataTransfer && e.originalEvent.dataTransfer.files.length) {
        e.preventDefault();
        var file = e.originalEvent.dataTransfer.files[0];
        if(imageTypes.includes(file.type)){ //Check if the file is an image
            sendData({"img" :await toBase64(file)});
        } else {
            alert("Dropped file is not an image") //alert user about wrong "drag input"
        }
    }
});
//Converter to BASE64
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.toString().replace("data:" + file.type + ";base64,", ""));//to get plain base64 data
    reader.onerror = error => reject(console.log(error));
});

//AJAX POST request to server
function sendData(data) {
    $(".modal-content").empty();//empty modal window from previous results
    $(".modal-content").append('<i class="fas fa-spinner fa-pulse"></i>');//add loading spinner
    $("#myModal").modal('show');//show it to user
    $.ajax({
        url: "Home/predict",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(data){
            $("#file").val('');//empty file input
            var image = new Image();
            image.src = "data:png;base64," + data["image"];
            $(image).css({"width" : "85%","height" : "auto","margin" : "0 auto"});
            $(".modal-content").empty();//empty modal window(remove spinner)
            $(".modal-content").append(image);//Show result
        },
        error: function(error){
            $(".modal-content").empty();//empty modal window(remove spinner)
            $(".modal-content").append('<h5>Server error. Please try again</h5>'); //notify user about error
        }
    });
}
