import unittest
from flask import  request, make_response, redirect, render_template, session, url_for, flash
from flask_login import login_required, current_user

from app import create_app
from app.forms import TodoForm, DeleteTodoForm, UpdateTodoForm

app = create_app()


#creando comando necesario para usar flask-test y unittest
@app.cli.command()
def test():
    tests = unittest.TestLoader().discover('tests')
    unittest.TextTestRunner().run(tests)

'''
importamos make_response y redirect para redireccionar a otra ruta y enviar una cookie
'''
@app.route('/')
def index():
    user_ip = request.remote_addr
    response = make_response(redirect('/hello'))
   #response.set_cookie('user_ip',user_ip)
    session['user_ip'] = user_ip
    return response

'''
importamos render_template para que flask traiga la plantilla de una carpeta llamada templates y le pasamos como parametro la ip
'''
@app.route('/hello',methods=['GET','POST'])
@login_required #protegiendo una ruta
def hello():
    #recuperando cookie del navegador
    #user_ip = request.cookies.get('user_ip')
    user_ip = session.get('user_ip')
    #forma de obtener la ip de un usuaurio: user_ip = request.remote_addr
	#forma de poner una variable dentro de un string: f'Hello World Platzi, tu IP es {user_ip}'

    #id del usuario logueado
    username = current_user.id

    todo_form = TodoForm()
    delete_form = DeleteTodoForm()
    update_form = UpdateTodoForm()
    context = {
		'user_ip': user_ip,
		#'todos': get_todos(user_id=username),
        'username': username,
        'todo_form': todo_form,
        'delete_form': delete_form,
        'update_form': update_form,        
	}
    if todo_form.validate_on_submit():       
        flash("Tarea creada con exito", category='success')
        return redirect(url_for('hello'))
	#los ** expande un diccionario	
    return  render_template('hello.html', **context)
    

@app.route('/error')
def error():
   raise(Exception('500 error'))

''' 
controlar error 404
'''
@app.errorhandler(404)
def not_found(error):
    return render_template('404.html',error = error)    

'''
controlar cualquier excepcion
'''
'''@app.errorhandler(Exception)
def error_handler(excepcion):
	return render_template('error.html',excepcion = excepcion)    '''   


if __name__ == "__main__":
    app.run(port=8080)    
