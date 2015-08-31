function modapiRequest(route) {
    if (route.indexOf("?") > -1) {
        return route + '&secret=' + secret_key;
    }
    return route + '?secret=' + secret_key;
}

function createCard(item) {
    var wrapper = $('<div class="col-xs-6 col-md-2 dashboard-item"></div>');
    var card = $('<div class="card card-block"></div>');
    if (item['color'] !== undefined) {
        card.css('background-color', item['color']);
    }

    var cardTitle = $('<h4 class="card-title">' + item['title'] + '</h4>');
    var cardBody = $('<p class="card-text">' + item['body'] + '</p>');
    card.append(cardTitle);
    card.append(cardBody);
    wrapper.append(card);
    return wrapper;
}

function createRow() {
    return $('<div class="row"></div>');
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
        var currentRow;
        var itemCount = 0;
        for (var i = 0; i < items.length; i++) {
            var currentItems = items[i]['items'];
            for (var j = 0; j < currentItems.length; j++) {
                if (itemCount % 6 == 0) {
                    currentRow = createRow();
                    $('#dashboard').append(currentRow);
                }
                currentRow.append(createCard(currentItems[j]));
                itemCount++;
            }
        }
    });
});