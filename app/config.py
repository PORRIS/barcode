from decouple import config
class Config:
    SECRET_KEY = config('SECRET_KEY')
    UPLOADED_PHOTOS_DEST = config('UPLOADED_PHOTOS_DEST')
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://porris123:mysql0328@porris123.mysql.pythonanywhere-services.com/porris123$flask_barcode'
    SQLALCHEMY_TRACK_MODIFICATIONS = False #deshabilito que se envíe una señal cada vez que se modifica un objeto
    MAIL_SERVER = config('MAIL_SERVER')
    MAIL_PORT = config('MAIL_PORT')
    MAIL_USERNAME = config('MAIL_USERNAME')
    MAIL_PASSWORD = config('MAIL_PASSWORD')
    # MAIL_USE_TLS = config('MAIL_USE_TLS')
    MAIL_USE_SSL = config('MAIL_USE_SSL')

class DevelopmentConfig(Config):
    DEBUG = config('DEBUG')
    MAIL_DEBUG = True

config = {
    'development': DevelopmentConfig
}

