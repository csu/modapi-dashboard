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

def get_todoist_route(base, list):
    todoist_tasks_route = base
    for task in list:
        task_text = task['task'].replace(' ', '%20')
        if '?' in todoist_tasks_route:
            todoist_tasks_route += '&query=%s' % task_text
        else:
            todoist_tasks_route += '?query=%s' % task_text

        if 'title' in task:
            task_title = task['title'].replace(' ', '%20')
            todoist_tasks_route += '--%s' % task_title
    return todoist_tasks_route


def get_dashboard_item_routes():
    routes = secrets.DASHBOARD_ITEM_ROUTES[:]
    routes.append(get_todoist_route(secrets.TODOIST_TASKS_BASE_URL, secrets.TODOIST_TASKS))
    routes.append(get_todoist_route(secrets.TODOIST_SINCE_BASE_URL, secrets.TODOIST_SINCE))
    return routes

@module.route('/')
@require_secret
def dashboard_index():
    return render_template('dashboard.html', secret_key=secret_key,
            routes=get_dashboard_item_routes())

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