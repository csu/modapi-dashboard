import datetime
from dateutil import parser

from flask import Blueprint, request, render_template, jsonify
import requests

from common import MODAPI_SECRET_KEY as secret_key
from common import require_secret, dashboard_items
from config import config
import secrets

module = Blueprint(config['module_name'], __name__,
                    template_folder='templates',
                    static_folder='static')

@module.route('/')
@require_secret
def dashboard_index():
    return render_template('dashboard.html', secret_key=secret_key,
            routes=secrets.DASHBOARD_ITEM_ROUTES)

@module.route('/countdowns')
@module.route('/countdowns/')
@require_secret
def countdowns_route():
    grid_items = []
    today = datetime.date.today()
    for item in secrets.COUNTDOWN_ITEMS:
        then = parser.parse(item['date']).date()
        diff = then - today
        grid_items.append({
            'title': item['title'],
            'body': '%s days' % diff.days,
            'color': 'papayawhip'
        })
    return dashboard_items(grid_items)