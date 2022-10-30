
from marshmallow_sqlalchemy import auto_field
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app import db
from app import ma


class ProductoModel(db.Model):
    __tablename__ = 'fb_productos'
    id = db.Column(UUID(as_uuid=True), primary_key=True,default=uuid.uuid4)
    id_user = db.Column(UUID(as_uuid=True),  db.ForeignKey('fb_users.id', ondelete='CASCADE'),nullable=False)
    barcode = db.Column(db.String(256), unique=False, nullable=False)
    descripcion = db.Column(db.Text, nullable=False)    
    valor = db.Column(db.Float, nullable=False)    
    created_at = db.Column(db.Date, nullable=False)  

    def __repr__(self):
        return "<ProductoModel(name={self.barcode!r})>".format(self=self)

    ''' def __repr__(self):
        return f'<User {self.email}>'
    def set_password(self, password):
        self.password = generate_password_hash(password)
    def check_password(self, password):
        return check_password_hash(self.password, password)'''

    def save(self):
        if not self.id:
            db.session.add(self)
        db.session.commit()

        '''
        if not self.title_slug:
            self.title_slug = slugify(self.title)
        '''

        '''
        saved = False
        count = 0
        while not saved:
            try:
                db.session.commit()
                saved = True
            except IntegrityError:
                count += 1
                self.title_slug = f'{slugify(self.title)}-{count}'''
  
    @staticmethod
    def get_by_id(id):
        return ProductoModel.query.get(id)
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