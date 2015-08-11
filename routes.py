from flask import Blueprint, request, jsonify
import requests

from common import require_secret
from config import config
import secrets

module = Blueprint(config['module_name'], __name__)

@module.route('/')
@require_secret
def dashboard_index():
    return jsonify({'status': 'ok'})