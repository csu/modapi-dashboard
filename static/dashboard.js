function modapiRequest(route) {
    if (route.indexOf("?") > -1) {
        return route + '&secret=' + secret_key;
    }
    return route + '?secret=' + secret_key;
}

function createGridCell() {
    var gridCell = $('<div class="pure-u-1-2 pure-u-md-1-4 pure-u-lg-1-8 dashboard-item"></div>');
    return gridCell;
}

function createDashboardItem(item) {
    var dashboardItem = $('<div class="l-box"></div>');
    if (item['color'] !== undefined) {
        dashboardItem.css('background-color', item['color']);
    }

    var itemTitle = $('<h3 class="dashboard-title">' + item['title'] + '</h3>');
    var itemBody = $('<p class="dashboard-body">' + item['body'] + '</p>');
    dashboardItem.append(itemTitle);
    dashboardItem.append(itemBody);

    return dashboardItem;
}

function buildItem(title, body, color) {
    return {
        'title': title,
        'body': body,
        'color': color
    };
}

function createRequest(index, route, items) {
    var req = $.get(modapiRequest(route), function(data) {
        items[index] = data;
    });
    return req;
}

$(document).ready(function() {
    var requests = [];
    var items = [];
    for (var i = 0; i < routes.length; i++) {
        requests[i] = createRequest(i, routes[i], items);
    }
    $.when.apply($, requests).then(function() {
        for (var i = 0; i < items.length; i++) {
            var currentItems = items[i]['items'];
            for (var j = 0; j < currentItems.length; j++) {
                var gridCell = createGridCell();
                gridCell.append(createDashboardItem(currentItems[j]));
                $('#dashboard').append(gridCell);
            }
        }
    });
});