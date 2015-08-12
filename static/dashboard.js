var routes = [
    "/todoist/today/dashboard/",
    "/lastfm/today/dashboard/",
    "/dashboard/countdowns/"
];

function modapiRequest(route) {
    if (route.indexOf("?") > -1) {
        return route + '&secret=' + secret_key;
    }
    return route + '?secret=' + secret_key;
}

function createDashboardItem(item) {
    var gridCell = $('<div class="pure-u-1-2 pure-u-md-1-4 pure-u-lg-1-8"></div>');

    var dashboardItem = $('<div class="l-box dashboard-item"></div>');
    if (item['color'] !== undefined) {
        dashboardItem.css('background-color', item['color']);
    }

    var itemTitle = $('<h3 class="dashboard-title">' + item['title'] + '</h3>');
    var itemBody = $('<p class="dashboard-body">' + item['body'] + '</p>');
    dashboardItem.append(itemTitle);
    dashboardItem.append(itemBody);

    gridCell.append(dashboardItem);
    return gridCell;
}

function buildItem(title, body, color) {
    return {
        'title': title,
        'body': body,
        'color': color
    };
}

// Maybe should put this in the GitHub module
function githubItem() {
    $.get(modapiRequest('/github/streak/?onlyNotifyWhenIncomplete=true'), function(data) {
        var itemBody = data['is_complete'] ? 'Complete' : 'Incomplete';
        var itemColor = data['is_complete'] ? '#CAE2B0' : '#FFCC80';
        $('#dashboard').append(createDashboardItem(buildItem('GitHub Commit', itemBody, itemColor)));
    });
}

function addCustomItems() {
    githubItem();
}

$(document).ready(function() {
    addCustomItems();

    routes.forEach(function(route) {
        $.get(modapiRequest(route), function(data) {
            data['items'].forEach(function(item) {
                $('#dashboard').append(createDashboardItem(item));
            });
        });
    });
});