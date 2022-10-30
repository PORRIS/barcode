'use strict';

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const snap = document.getElementById("snap");
const save = document.getElementById("save");
const code = document.getElementById("code");
const change_cam = document.getElementById("change_cam");
const errorMsgElement = document.querySelector('span#errorMsg');
const drop = document.getElementById('drop');

let namespace = "/foto/guardar";
let key_cam = false;
let currentStream;

let constraints = {
  audio: false,
  video: {
    width: { min: 640 },
    height: { min: 480 },
    facingMode:  'user' 
  }
   
};

// Access webcam
async function init() {
  try {

    const stream = await navigator.mediaDevices
    .getUserMedia(constraints)
    .then(stream => {
      currentStream = stream;
      video.srcObject = stream;
      window.stream = stream;
      return navigator.mediaDevices.enumerateDevices();
    })
    .then(gotDevices)
    .catch(error => {
      console.error(error);
    });
    //handleSuccess(stream);
  } catch (e) {
    errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
  }
}

// Success
function handleSuccess(stream) {
  window.stream = stream;
  video.srcObject = stream;
}

// Load init
init();

// Draw image
var context = canvas.getContext('2d');
snap.addEventListener("click", function() {
        $('#mensaje').html('')
        $('#barcode').html('')
        context.drawImage(video, 0, 0, 640, 480);
        document.getElementById('canvas').style.display	= 'block';
        document.getElementById('video').style.display	= 'none';
        document.getElementById('save').style.display	= 'block';
});

video.addEventListener("click", function() {
  $('#mensaje').html('')
  $('#barcode').html('')
  context.drawImage(video, 0, 0, 640, 480);
  document.getElementById('canvas').style.display	= 'block';
  document.getElementById('video').style.display	= 'none';
  document.getElementById('save').style.display	= 'block';
});

drop.addEventListener("click", function() {
  context.clearRect(0, 0, 640, 480);
  document.getElementById('video').style.display	= '';
  $('#mensaje').html('')
  $('#barcode').html('')
});

save.addEventListener("click", function() {
    var canva = document.getElementById('canvas');    
    var dataUrl = canva.toDataURL('image/png');
    var info = dataUrl.split(",",2)
    var myObj = {'photo': info[1]};
    $('#mensaje').html('')
    $('#barcode').html('')
   
    //var formData = new FormData();
    //formData.append("photo",dataUrl)
    
    $.ajax({
        url: location.protocol + '//' + document.domain + ':' + location.port + namespace,
        type: "POST",
        data: JSON.stringify(myObj),
       // data: FormData,
        cache: false,
        dataType: "json",
        contentType: "application/json",
      //  contentType: false,
        //processData: false,
        success: function(resp){            
            if(resp.error == 0){
                $('#mensaje').html(resp.mensaje)
            }else{
                $('#mensaje').html(resp.mensaje)
                $('#name_file').val(resp.name_file)                

            }
        }

    });    
});

change_cam.addEventListener("click", function() { 
  
  if (typeof currentStream !== 'undefined') {
    stopMediaTracks(currentStream);
  }
  const videoConstraints = {};
  if (select.value === '') {
    videoConstraints.facingMode = 'environment';
  } else {
    videoConstraints.deviceId = { exact: select.value };
  }  
  const constraints = {
    video: videoConstraints,
    audio: false
  };
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(stream => {
      currentStream = stream;
      video.srcObject = stream;
      return navigator.mediaDevices.enumerateDevices();
    })
    .then(gotDevices)
    .catch(error => {
      console.error(error);
    });
});

code.addEventListener("click", function() { 
  $('#mensaje').html('')
  $('#barcode').html('')
  $.ajax({
      url: location.protocol + '//' + document.domain + ':' + location.port + '/foto/codigo/'+ $('#name_file').val(),
      type: "GET",           
      cache: false,
      dataType: "json",
      contentType: "application/json",
      success: function(resp){            
          if(resp.error == 0){
              $('#mensaje').html('error:'+resp.mensaje)
          }else{
              $('#mensaje').html(resp.mensaje)
              $('#barcode').html('CODIGO:'+resp.barcode)                

          }
      }

  });

  
});

const select = document.getElementById('select');

function stopMediaTracks(stream) {
  stream.getTracks().forEach(track => {
    track.stop();
  });
}

function gotDevices(mediaDevices) {
  select.innerHTML = '';
  select.appendChild(document.createElement('option'));
  let count = 1;
  mediaDevices.forEach(mediaDevice => {
    if (mediaDevice.kind === 'videoinput') {
      const option = document.createElement('option');
      option.value = mediaDevice.deviceId;
      const label = mediaDevice.label || `Camera ${count++}`;
      const textNode = document.createTextNode(label);
      option.appendChild(textNode);
      select.appendChild(option);
    }
  });
}
