import json
from flask import request
from flask_login import  login_required,current_user
from . import cliente
#model
from models.Producto import ProductoModel,ProductoSchema


@cliente.route('<int:barcodedata>', methods = ['GET'])
@login_required            
def index(barcodedata):
    barcodeFinal = []   
    existe_barcode = ProductoModel.barcode_producto(str(barcodedata),current_user.username) 
    barcodeFinal.insert(0,{
        'code':barcodedata,
        'status':existe_barcode,
        "error": 1,
        "mensaje": 'exito'})
    return  json.dumps(barcodeFinal)    
    


         