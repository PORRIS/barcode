from flask_wtf import FlaskForm
from wtforms.fields import StringField, PasswordField, SubmitField, FileField, FloatField
from flask_wtf.file import FileField, FileRequired,FileAllowed
from wtforms.validators import DataRequired, InputRequired, EqualTo, length, NumberRange
from wtforms import SubmitField as SubmitFieldFile

'''
usando flask_wtf para crear un formulario

'''


class LoginForm(FlaskForm):
    username = StringField('Nombre de usuario', validators=[DataRequired()]) #validando con wtforms.validators 
    password = PasswordField('Contraseña', validators=[DataRequired()])
    submit = SubmitField('Enviar')

class SignUp(FlaskForm):
    username = StringField('Nombre de Usuario',validators=[DataRequired()])
    password = PasswordField('Password',validators=[DataRequired(), InputRequired()])
    password_repeat = PasswordField('Repite tu Password',validators=[DataRequired(),InputRequired(),EqualTo('password')])
    submit = SubmitField('Enviar')    

class BarcodeCreateForm(FlaskForm):
    barcode = StringField('Codigo',validators=[DataRequired(message='Codigo obligatorio'),length(min=2,max=80, message='Codigo debe estar entre 2 y 80')])    
    valor = FloatField('Valor',validators=[DataRequired( message='Valor obligatorio y numerico'),NumberRange(min=5,max=99999999999999999999999999999999999, message='Valor debe estar entre 5 y 50')])    
    description = StringField('Descripción',validators=[DataRequired( message='Descripción obligatorio'),length(min=5,max=50, message='Descripción debe estar entre 5 y 50')])    
    submit = SubmitField('Crear')        

class DeleteTodoForm(FlaskForm):    
    submit = SubmitField('Eliminar')    

class UpdateTodoForm(FlaskForm):    
    submit = SubmitField('Actualizar')       

 