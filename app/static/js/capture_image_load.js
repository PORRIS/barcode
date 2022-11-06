'use strict';

const code = document.getElementById("code");
const errorMsgElement = document.querySelector('span#errorMsg');

const subir_imagen = document.getElementById('subir_imagen');
const form_subir_imagen = document.getElementById('form_subir_imagen');

//tabs panel
const lector_tab = document.getElementById('cargador_tab');
const crear_tab = document.getElementById('crear_tab');
const historico_tab = document.getElementById('historico_tab');
const mostrar_cargador = document.getElementById('mostrar_cargador');


let barcode_global = '';

let namespace = "/cargador/guardar";
let key_cam = false;
let currentStream;
mostrar_cargador.addEventListener("click", function(event) {
  form_subir_imagen.style.display	= '';
  mostrar_cargador.style.display	= 'none';
  document.getElementById('table_codes').style.display	= 'none';
});

subir_imagen.addEventListener("click", function(event) {
  event.preventDefault();
  var formData = new FormData(form_subir_imagen);
  $.ajax({
    type: "POST",
    url: location.protocol + '//' + document.domain + ':' + location.port + '/cargador',
    data: formData,
    processData: false,
    dataType: "json",    
    contentType: false,
    success:function (data) {
      console.log(data.status)
      event.preventDefault();
      if(data.status){                
        let barcode = data.barcode;
        if(barcode.length){
          $('#table_code_body').html('');
          if(barcode.length > 1){                       
            barcode.forEach(mostrarCodigos);
            document.getElementById('table_codes').style.display	= '';
            form_subir_imagen.style.display	= 'none';
            mostrar_cargador.style.display	= '';
          }else{
            DialigBarcode(barcode[0].code,String(barcode[0].status))                 
          }
          
        }else{          
          $('.error_from2').html('<h4 class="title btn-text-danger">NO SE DETECTO UN CODIGO</h4>') 
        }
      }else{
        let errors = data.message;
        jQuery.each(errors,function(i, val) {
          $('.error_from2').html('<h4 class="title btn-text-danger">'+val[0]+'</h4>') 
        })               
        $('.error_from2').show()                
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
  $('.nav-tabs a[href="#cargador"]').tab('show');
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
