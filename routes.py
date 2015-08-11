import datetime
from dateutil import parser

from flask import Blueprint, request, render_template
import requests

from common import require_secret
from config import config
import secrets

module = Blueprint(config['module_name'], __name__,
                    template_folder='templates',
                    static_folder='static')

@module.route('/')
@require_secret
def dashboard_index():
    grid_items = []

    # GitHub module
    github_item = {}
    github_item['title'] = 'GitHub Commit'
    is_complete = requests.get(secrets.modapi_url('/github/streak/?onlyNotifyWhenIncomplete=true')).json()
    is_complete = is_complete['is_complete']
    github_item['body'] = 'Complete' if is_complete else 'Incomplete'
    github_item['color'] = '#CAE2B0' if is_complete else '#FFCC80'
    grid_items.append(github_item)

    # Countdowns
    today = datetime.date.today()
    for item in secrets.COUNTDOWN_ITEMS:
        then = parser.parse(item['date']).date()
        diff = then - today
        grid_items.append({
            'title': item['title'],
            'body': '%s days' % diff.days,
            'color': 'papayawhip'
        })

    return render_template('dashboard.html', grid_items=grid_items)