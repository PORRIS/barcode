import base64
import numpy as np
import json
import os
import cv2
import uuid
from flask import render_template,session,flash,jsonify,url_for,request,redirect
from flask_login import login_user, login_required,current_user
from pyzbar import pyzbar
from datetime import datetime
from . import lector
#model
from models.Producto import ProductoModel,ProductoSchema
from app.forms import BarcodeCreateForm, UploadForm
from werkzeug.utils import secure_filename
from app import db


@lector.route('/',methods = ['GET'])
@login_required
def index():
    username = current_user.username
    context = {
        'username': username,
	}
    return render_template('select_init.html',**context)


@lector.route('/tipo/<int:tipo_cliente>', methods=['GET'])
@login_required
def get_client(tipo_cliente):
    username = current_user.username
    template = 'select_init.html'
    context = {
        'username': username,
        'barcode_create_form':BarcodeCreateForm()
	}
    if(tipo_cliente == 1):
        template = 'barcode_client.html'
    elif(tipo_cliente == 2):
        template = 'barcode_server.html'
    elif(tipo_cliente == 3):
        template = 'barcode_load.html'
        context['load_form'] = UploadForm()
    return render_template(template,**context)


@lector.route('/tipo/<int:tipo_cliente>', methods=['POST'])
@login_required
def save_barcode(tipo_cliente):
    try:
        create_form = BarcodeCreateForm()
        if create_form.validate_on_submit():
            id = uuid.uuid4()
            id_user = current_user.username
            barcode  = create_form.barcode.data
            descripcion = create_form.description.data
            valor = create_form.valor.data
            created_at = datetime.now()
            producto = ProductoModel(id=id,id_user=id_user,barcode=barcode,descripcion=descripcion,valor=valor,created_at=created_at)
            db.session.add(producto)
            db.session.commit()
            return jsonify({'message':"Producto creado con exito","status":True})
        else:
           return jsonify({'message':  create_form.errors,"status":False})
    except Exception as ex:
         return jsonify({'message':"ERROR:"+str(ex),"status":False})


@lector.route('/guardar', methods = ['POST'])
@login_required
def upload_file():
    data = json.loads(request.data.decode('utf-8'))
    img_data = base64.b64decode(data['photo'])
    now = datetime.now()
    jpg_as_np = np.frombuffer(img_data, dtype=np.uint8)
    img = cv2.imdecode(jpg_as_np, flags=1)
    name = "shot_{}.jpeg".format(str(now).replace(":",'').replace(" ",''))
    p = os.path.sep.join(['/home/porris123/mysite/barcode/shots',name ])
    if not cv2.imwrite(p, img):
     raise Exception("Could not write image")
    response = {
            "error": 1,
            "mensaje": 'foto almacenada',
            "name_file": name,
        }
    return json.dumps(response)

@lector.route('/codigo/<path:filename>', methods = ['GET'])
@login_required
def codebar(filename):
    try:
        filename = secure_filename(filename)
        barcodes = ("/home/porris123/mysite/barcode/shots/"+filename)
        img = cv2.imread(barcodes)
        data = pyzbar.decode(img)
        barcodeData = []
        for barcode in data:
            barcodeData.append(barcode.data.decode("utf-8"))
        barcodeData = buscandoCodigo(barcodeData)
        response = {
                "error": 1,
                "mensaje": 'exito',
                "barcode": barcodeData,
            }
        os.remove(barcodes)
        return json.dumps(response)
    except Exception as err:
        response = {
                "error": 0,
                "mensaje": 'ERROR CONSULTE AL ADMINISTRADOR ' +str(err)
            }
        return json.dumps(response)

def buscandoCodigo(barcodeData):
    barcodeFinal = []
    if(barcodeData):
        for val in barcodeData:
            existe_barcode = ProductoModel.barcode_producto(val,current_user.username)
            barcodeFinal.insert(0,{'code':val,'status':existe_barcode})
    return  barcodeFinal

@lector.route('/historico/',methods = ['POST'])
@login_required
def historico():
    try:
        data = json.loads(request.data.decode('utf-8'))
        barcode_data = ProductoModel.get_by_cod(data['barcode'],current_user.username)
        productos_schema = ProductoSchema(many=True)
        output = productos_schema.dump(barcode_data)
        response = {
            "error": 1,
            "mensaje": 'DATOS ENCONTRAOS',
            "historico": output,
        }
    except Exception as err:
        response = {
                "error": 0,
                "mensaje": 'ERROR CONSULTE AL ADMINISTRADOR ' +str(err)
            }
    return json.dumps(response)

