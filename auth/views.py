from flask import render_template,session,flash,redirect,url_for
from flask_login import login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash,check_password_hash #libreria para generar hash

from app.forms import LoginForm, SignUp
from models.User import UserData, get_user, UserModel, put_user

from . import auth


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

        user_doc = get_user(username)

        if(user_doc is None):
            password_hash = generate_password_hash(password)
            user_data = UserData(username,password_hash)
            put_user(user_data)

            user = UserModel(user_data)
            login_user(user)
            flash("Bienvenido nuevo usuario", category='success')
            return redirect(url_for('hello'))
        else:
            flash("El usuario ya existe", category='danger')


    return render_template('signup.html',**context)

@auth.route('logout')
@login_required #para garantizar hacer logout a un usuario que este logueado
def logout():
    logout_user()
    flash("Regresa pronto", category='info')
    return redirect(url_for('auth.login'))