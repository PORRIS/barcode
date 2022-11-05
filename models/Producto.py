
from marshmallow_sqlalchemy import auto_field
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import UUID

import uuid
import datetime
from app import db
from app import ma


class ProductoModel(db.Model):
    __tablename__ = 'fb_productos'
    id = db.Column(UUID(as_uuid=True), primary_key=True,default=uuid.uuid4)
    id_user = db.Column(UUID(as_uuid=True),  db.ForeignKey('fb_users.id', ondelete='CASCADE'),nullable=False)
    barcode = db.Column(db.String(256), unique=False, nullable=False)
    descripcion = db.Column(db.Text, nullable=False)    
    valor = db.Column(db.Float, nullable=False)    
    created_at = db.Column(db.DateTime(timezone=True),default=datetime.datetime.utcnow ,nullable=False)  

    def __repr__(self):
        return "<ProductoModel(name={self.barcode!r})>".format(self=self)
  
    @staticmethod
    def get_by_cod(barcode,id_user):
        return ProductoModel.query.filter_by(barcode=barcode).filter_by(id_user=id_user).order_by(ProductoModel.created_at.desc()).all()
    @staticmethod
    def get_by_user(id_user):
        return ProductoModel.query.filter_by(id_user=id_user).first()
    
    @staticmethod
    def get_all():
        return ProductoModel.query.all()   
 
    @staticmethod
    def delete_producto(id):
        producto = ProductoModel.query.filter_by(id=id).first()
        db.session.delete(producto)
        db.session.commit() 

    @staticmethod
    def barcode_producto(barcode,id_user):              
        return db.session.query(ProductoModel).filter_by(barcode=barcode).filter_by(id_user=id_user).first() is not None

class ProductoSchema(ma.SQLAlchemySchema):
    class Meta:
        model = ProductoModel
        include_relationships = True
        include_fk = True
        load_instance = True  # Optional: deserialize to model instances
    
    id = auto_field()
    id_user = auto_field()
    barcode = auto_field()
    descripcion = auto_field()   
    valor = auto_field()
    created_at = auto_field()        
        