from flask import render_template,session,flash,redirect,url_for
from flask_login import login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash,check_password_hash #libreria para generar hash

from app.forms import LoginForm, SignUp, ResetEmail
from models.User import UserData, get_user, UserModel, put_user, get_user_email_exist, get_user_email_data

from flask_mail import Message

from . import auth
from app import mail
import uuid

@auth.route('/login',methods=['GET'])
def login():
    if current_user.is_authenticated:
        flash("Ya estabas logueado", category='warning')
        return redirect(url_for('index'))
    else:    
        #pasando el formulario aun template
        context = {
            'login_form': LoginForm()
        }
        return render_template('login.html', **context)

@auth.route('/login',methods=['POST'])
def login_post():    
    #pasando el formulario aun template
    login_form = LoginForm()    
    if login_form.validate_on_submit():

        username = login_form.username.data
        password = login_form.password.data

        #usanso sesiones
        #session['username'] = username 

        user_doc = get_user(username)
        if user_doc is not None:            
            password_from_db = user_doc.password
            #if password == password_from_db: #antes
            if check_password_hash(password_from_db, password):#ahora
                user_data = UserData(username,password)
                user = UserModel(user_data)
                login_user(user)
                #usando flash para enviar mensajes y renderearlo en el html
                flash("Bienvenido de nuevo", category='success')
                redirect(url_for('hello'))
            else:
                flash("la informacion no coincide ", category='danger')          
        else:
            flash("El usuario no existe", category='danger')
    else:
        flash("Error registrando al usuario", category='danger')

    return redirect(url_for('index'))

@auth.route('signup', methods=['GET', 'POST'])
def signup():
    signup_form = SignUp()
    context = {
        'signup_form': signup_form
    }

    if signup_form.validate_on_submit():
        username = signup_form.username.data
        password = signup_form.password.data
        email = signup_form.email.data

        user_doc = get_user(username)

        if(user_doc is None):
            password_hash = generate_password_hash(password)
            user_data = UserData(username,password_hash,str(uuid.uuid4()),email,password)
            put_user(user_data)

            user = UserModel(user_data)
            login_user(user)
            flash("Bienvenido nuevo usuario", category='success')
            return redirect(url_for('hello'))
        else:
            flash("El usuario ya existe", category='danger')


    return render_template('signup.html',**context)

@auth.route("/send_email", methods=['GET', 'POST'])
def reset():
    reset_form = ResetEmail()
    context = {
    'reset_form': reset_form
    }
    if reset_form.validate_on_submit():               
        email = reset_form.email.data

        user_doc = get_user_email_exist(email)

        if(user_doc):
            user_data = get_user_email_data(email)
            msg = Message('Recuperación de contraseña', sender =   'barcode@mailtrap.io', recipients = [email])
            msg.body = "Hola, tu usuario es %s y tu contraseña: %s"%(str(user_data[0]),str(user_data[1]))
            mail.send(msg)           
            flash("Correo enviado", category='danger')
        else:
            flash("El correo no existe", category='danger')

    return render_template('reset_password.html',**context)   
       

@auth.route('logout')
@login_required #para garantizar hacer logout a un usuario que este logueado
def logout():
    logout_user()
    flash("Regresa pronto", category='info')
    return redirect(url_for('auth.login'))