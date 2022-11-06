from flask import render_template,send_from_directory,url_for,current_app
from flask_login import login_user, login_required,current_user
from flask_uploads import UploadSet, IMAGES

from app.forms import UploadForm, BarcodeCreateForm
from werkzeug.utils import secure_filename
import json
import os
import cv2
from pyzbar import pyzbar
from models.Producto import ProductoModel,ProductoSchema

from . import loader

photos = UploadSet('photos',IMAGES)

@loader.route('/uploads/<path:filename>')
def get_file(filename):
    filename = secure_filename(filename)
    return send_from_directory('../'+current_app.config['UPLOADED_PHOTOS_DEST'], filename, as_attachment=True)


@loader.route('/', methods = ['POST'])
def index():
    try:
        form = UploadForm()
        username = current_user.username        
        context = {		
            'username': username, 
            'barcode_create_form':BarcodeCreateForm(),
            'load_form':form
        }
        response = {
                "status": False,
                "message": 'exito',
                "barcode": '',            
                } 
        if form.validate_on_submit():
            filename = photos.save(form.photo.data) 
            codigos = buscarCodigo(filename)
            response['barcode'] = codigos    
            response['status'] = True           
            os.remove(("./uploads/"+filename))   
        if len(form.errors) != 0:                
            response['status'] = False
            response['message'] = form.errors
        return json.dumps(response)
    except Exception as err:
        response = {
                "status": False,
                "message": 'ERROR CONSULTE AL ADMINISTRADOR ' +str(err)
            }
        return json.dumps(response) 
def buscarCodigo(filename):
 
    filename = secure_filename(filename)    
    barcodes = ("./uploads/"+filename)
    img = cv2.imread(barcodes)
    data = pyzbar.decode(img)
    barcodeData = []
    for barcode in data:
        barcodeData.append(barcode.data.decode("utf-8"))  
    barcodeData = buscandoCodigo(barcodeData)                      

    #os.remove(barcodes)    
    return barcodeData     


def buscandoCodigo(barcodeData):
    barcodeFinal = []    
    if(barcodeData):
        for val in barcodeData:
            existe_barcode = ProductoModel.barcode_producto(val,current_user.username) 
            barcodeFinal.insert(0,{'code':val,'status':existe_barcode})
    return  barcodeFinal 
         