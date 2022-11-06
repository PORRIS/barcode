from flask import Blueprint

loader = Blueprint('loader', __name__, url_prefix='/cargador')

from . import views