from decouple import config
class Config:
    SECRET_KEY = config('SECRET_KEY')    
    UPLOADED_PHOTOS_DEST = config('UPLOADED_PHOTOS_DEST')
    SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:postgres@localhost:5432/flask_barcode'
    SQLALCHEMY_TRACK_MODIFICATIONS = False #deshabilito que se envíe una señal cada vez que se modifica un objeto

class DevelopmentConfig(Config):
    DEBUG = config('DEBUG')
    
config = {
    'development': DevelopmentConfig
}  
    
