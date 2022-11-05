'use strict';

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const snap = document.getElementById("snap");
const save = document.getElementById("save");
const code = document.getElementById("code");
const change_cam = document.getElementById("change_cam");
const errorMsgElement = document.querySelector('span#errorMsg');
const drop = document.getElementById('drop');
//tabs panel
const lector_tab = document.getElementById('lector_tab');
const crear_tab = document.getElementById('crear_tab');
const historico_tab = document.getElementById('historico_tab');

let barcode_global = '';

let namespace = "/lector/guardar";
let key_cam = false;
let currentStream;

let constraints = {
  audio: false,
  video: {
    width: { max: 480,min:380 },
    height: { max: 500, min:380 },
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
        context.drawImage(video, 0, 0, 480, 480);
        document.getElementById('canvas').style.display	= 'block';
        document.getElementById('video').style.display	= 'none';
        document.getElementById('save').style.display	= 'block';                
        document.getElementById('drop').style.display	= 'block';
        document.getElementById('table_codes').style.display	= 'none';
});

video.addEventListener("click", function() {
  $('#mensaje').html('')
  $('#barcode').html('')
  context.drawImage(video, 0, 0, 480, 480);
  document.getElementById('canvas').style.display	= 'block';
  document.getElementById('video').style.display	= 'none';
  document.getElementById('save').style.display	= 'block';                 
  document.getElementById('drop').style.display	= 'block';
  document.getElementById('table_codes').style.display	= 'none';
});

drop.addEventListener("click", function() {
  context.clearRect(0, 0, 640, 480);
  document.getElementById('video').style.display	= '';
  document.getElementById('canvas').style.display	= 'none';
  document.getElementById('save').style.display	= 'none';                
  document.getElementById('drop').style.display	= 'none';
  document.getElementById('table_codes').style.display	= 'none';
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
                $('#mensaje').html(resp.mensaje);
            }else{
                $('#mensaje').html(resp.mensaje);
                $('#name_file').val(resp.name_file);
                $('#code').click();
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
      url: location.protocol + '//' + document.domain + ':' + location.port + '/lector/codigo/'+ 'imagen4.jpeg',//$('#name_file').val(),
      type: "GET",           
      cache: false,
      dataType: "json",
      contentType: "application/json",
      success: function(resp){            
          if(resp.error == 0){
              $('#mensaje').html('error:'+resp.mensaje)
          }else{
              $('#mensaje').html(resp.mensaje)
              let data = resp.barcode;
              if(data.length){                
                $('#table_code_body').html('');
                if(data.length > 1){           
                  document.getElementById('canvas').style.display	= 'none'; 
                  data.forEach(mostrarCodigos);
                  document.getElementById('table_codes').style.display	= '';
                }else{
                  DialigBarcode(data[0].code,String(data[0].status))                 
                }
                
              }else{
                $('#barcode').html('NO SE DETECTO EL CODIGO')
              }    
          }
      }
  });  
});

function mostrarCodigos(element, index, array) {  
  let color = ''
  color = element.status? 'text-success':'text-danger';  
  $('#table_code_body').append('<tr>\
      <th scope="row">'+(index+1)+'</th>\
      <td class ="'+color+'">'+element.code+'</td>\
      <td style="display: none;">'+element.status+'</td>\
      </tr>');
    }
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

$('#table_code_body').on('click', 'tr', function () {  
  var currentRow=$(this).closest("tr");         
  var barcode=currentRow.find("td:eq(0)").text(); // barcode
  var status=currentRow.find("td:eq(1)").text(); // bool  
  DialigBarcode(barcode,status)
});

function DialigBarcode(barcode,status){
  const bt_registrar = document.getElementById('boton_registrar');
  const bt_historico = document.getElementById('boton_historico');
  const bt_crear = document.getElementById('boton_crear');
  barcode_global = barcode;

  bt_registrar.style.display	= 'none';
  bt_historico.style.display	= 'none';
  bt_crear.style.display	= 'none';

  let icono = '<ion-icon name="checkmark-circle"></ion-icon>';
  let title = 'Codigo Detectado'
  let message = 'El codigo se encuentra creado' 
  
  if(status === 'false'){
    icono = '<ion-icon name="information-circle"></ion-icon>';
    title = 'Codigo no registrado'
    message = 'El codigo no existe'        
    bt_registrar.style.display	= 'none';
    bt_historico.style.display	= 'none';
    bt_crear.style.display	= '';
    $('#icon_modal').addClass('text-warning');
    $('#icon_modal').removeClass('text-success');
  }else{
    bt_registrar.style.display	= '';
    bt_historico.style.display	= '';
    bt_crear.style.display	= 'none';
    $('#icon_modal').addClass('text-success');
    $('#icon_modal').removeClass('text-warning');
  }
  $('#icon_modal').html(icono);
  $('#title_modal').text(title);
  $('#message_modal').text(message);
  $('#code_modal').text(barcode);  
  $('#DialogBarcode').modal('show'); 

}

$('#boton_registrar').click(function(event){
  $('.nav-tabs a[href="#crear"]').tab('show');
  lector_tab.style.display	= 'none';
  crear_tab.style.display	= '';
  historico_tab.style.display	= 'none';  
  $('#DialogBarcode').modal('hide'); 
  $("#input_bardoce").val(barcode_global)
  $('#href_cr').text('Registrar')
  $('#tab_title_cr').html('Registrar')
  $('#create_barcode').val('Registrar')
});
function random_item(items)
{  
return items[Math.floor(Math.random()*items.length)];     
}

$('#boton_historico').click(function(event){
  $('#DialogBarcode').modal('hide');   
  var myObj = {'barcode': barcode_global};
  $.ajax({
    url: location.protocol + '//' + document.domain + ':' + location.port + '/lector/historico',
    type: "POST",
    data: JSON.stringify(myObj),    
    cache: false,
    dataType: "json",
    contentType: "application/json",    
    success: function(resp){            
        if(resp.error == 1){
          let historico = resp.historico;
          let time = '';
          let colors = ['','bg-danger','bg-warning','bg-info"','bg-success',' bg-primary','bg-']
          let date = ''          
          historico.forEach(element => {
            date = element.created_at
            date = date.split('T');
             time +='<div class="item"><span class="time">'+date[0]+'</span>\
            <div class="dot '+random_item(colors)+'"></div>\
            <div class="content">\
                <h4 class="title">Valor: '+element.valor+'</h4>\
                <div class="text">Descripción: '+element.descripcion+' </div>\
                <div class="text">Hora: '+date[1]+' </div>\
            </div>\
          </div>'
            
          });
          $('.historico_line').html(time);
            
        }else{
          

        }
        $('#title_historico').html('Historico '+barcode_global);
        $('.nav-tabs a[href="#historico"]').tab('show');
        lector_tab.style.display	= 'none';
        crear_tab.style.display	= 'none';
        historico_tab.style.display	= '';  
    }
});
});

$('#boton_crear').click(function(event){
  $('.nav-tabs a[href="#crear"]').tab('show');
  lector_tab.style.display	= 'none';
  crear_tab.style.display	= '';
  historico_tab.style.display	= 'none';  
  $('#DialogBarcode').modal('hide'); 
  $("#input_bardoce").val(barcode_global)
  $('#href_cr').text('Crear')
  $('#tab_title_cr').html('Crear')
  $('#create_barcode').val('Crear')
});

$('.tab_init').click(function(event){
  $('.nav-tabs a[href="#lector"]').tab('show');
  lector_tab.style.display	= '';
  crear_tab.style.display	= 'none';
  historico_tab.style.display	= 'none';
  
});


$(document).ready(function () {
  $("#create_barcode").click(function (event) {
    event.preventDefault();
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function (form) {
         if (form.checkValidity() !== false) {
            var formData = new FormData(document.getElementById('create_code_form'));
            $.ajax({
              type: "POST",
              url: location.protocol + '//' + document.domain + ':' + location.port + '/lector/tipo/2',
              data: formData,
              processData: false,
              contentType: false,
            }).done(function (data) {
              event.preventDefault();
              if(data.status){
                notification('notification-10');
                $('.tab_init').click();
                setTimeout(() => {
                  notification('notification-welcome', 5000);		
                }, 2000);
              }else{
                let errors = data.message;
                jQuery.each(errors,function(i, val) {
                  $('.error_from').html('<h4 class="title btn-text-danger">'+val[0]+'</h4>') 
              })               
                $('.error_from').show()                
              }
            });
            }
            form.classList.add('was-validated');
    });
    
  });



  
});
