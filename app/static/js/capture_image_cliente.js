'use strict';

const code = document.getElementById("code");
const errorMsgElement = document.querySelector('span#errorMsg');

//tabs panel
const lector_tab = document.getElementById('cargador_tab');
const crear_tab = document.getElementById('crear_tab');
const historico_tab = document.getElementById('historico_tab');
const mostrar_cargador = document.getElementById('mostrar_cargador');


let barcode_global = '';

let namespace = "/cargador/guardar";
let key_cam = false;
let currentStream;
let html5QrcodeScanner;
initScaner();

function initScaner(){
html5QrcodeScanner = new Html5QrcodeScanner(
	"form_subir_imagen", { fps: 10, qrbox: 250 });

html5QrcodeScanner.render(onScanSuccess);
$('#form_subir_imagen > div > span').html('')
$('#form_subir_imagen__dashboard_section_csr > div > button').text('Solicitar permisos de cámara')
$('#form_subir_imagen__dashboard_section_swaplink').html('')
}

mostrar_cargador.addEventListener("click", function(event) {
  form_subir_imagen.style.display	= '';
  mostrar_cargador.style.display	= 'none';
  document.getElementById('table_codes').style.display	= 'none';
});

function onScanSuccess(decodedText, decodedResult) {
  $.ajax({
    url: location.protocol + '//' + document.domain + ':' + location.port + '/cliente/'+ decodedText,
    type: "GET",           
    cache: false,
    dataType: "json",
    contentType: "application/json",
    success: function(resp){   
        resp = resp[0];
        if(resp.error == 0){
            $('#mensaje').html('error:'+resp.mensaje)
        }else{
            $('#mensaje').html(resp.mensaje)                                      
            $('#table_code_body').html('');     
            DialigBarcode(resp.code,String(resp.status));            
        }
    }
});  
//  console.log(`Code scanned = ${decodedText}`, decodedResult);
  
}


function mostrarCodigos(element, index, array) {  
  let color = ''
  color = element.status? 'text-success':'text-danger';  
  $('#table_code_body').append('<tr>\
      <th scope="row">'+(index+1)+'</th>\
      <td class ="'+color+'">'+element.code+'</td>\
      <td style="display: none;">'+element.status+'</td>\
      </tr>');
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
  html5QrcodeScanner.clear();

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
  var myObj = {'barcode': String(barcode_global)};
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
          alert('error')

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
  $('.nav-tabs a[href="#cargador"]').tab('show');
  lector_tab.style.display	= '';
  crear_tab.style.display	= 'none';
  historico_tab.style.display	= 'none';
  initScaner();
});
$('#boton_cerrar').click(function(event){  
  initScaner();
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
