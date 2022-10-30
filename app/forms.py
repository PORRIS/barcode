from flask_wtf import FlaskForm
from wtforms.fields import StringField, PasswordField, SubmitField, FileField
from flask_wtf.file import FileField, FileRequired,FileAllowed
from wtforms.validators import DataRequired, InputRequired, EqualTo
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

class TodoForm(FlaskForm):
    description = StringField('Descripción',validators=[DataRequired()])    
    submit = SubmitField('Crear')        

class DeleteTodoForm(FlaskForm):    
    submit = SubmitField('Eliminar')    

class UpdateTodoForm(FlaskForm):    
    submit = SubmitField('Actualizar')       

 