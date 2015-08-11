from flask import Blueprint, request, render_template
import requests

from common import require_secret
from config import config
import secrets

module = Blueprint(config['module_name'], __name__,
                    template_folder='templates')

@module.route('/')
@require_secret
def dashboard_index():
    
    return render_template('dashboard.html', grid_items=grid_items)