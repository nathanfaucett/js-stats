var each = require("each"),
    utils = require("utils"),
    Chart = require("../../chart");


function NavCtrl($scope, $http) {

    function onchange() {
        var data = $scope.hosts[$scope.selectedHost][$scope.selectedRoute],
            labels, datasets;

        labels = parseLabels(data);
        datasets = parseDatasets(labels, data);

        new Chart(document.getElementById("chart").getContext("2d")).Bar({
            labels: labels,
            datasets: datasets
        });
    }

    $scope.onchange = onchange;

    $http.get("http://localhost:3000/requests").then(function(response) {
        $scope.hosts = parseData(response.data);
        $scope.selectedHost = utils.keys($scope.hosts)[0];
        $scope.selectedRoute = utils.keys($scope.hosts[$scope.selectedHost] || {})[0];

        onchange();
    });
}

function parseData(data) {
    var hosts = {};

    each(data, function(datum) {
        var host = hosts[datum.host] || (hosts[datum.host] = {}),
            pathnames = host[datum.pathname] || (host[datum.pathname] = []);

        pathnames.push(datum);
    })

    return hosts;
}

function parseLabels(data) {
    var labels = [],
        start = Infinity,
        end = -Infinity,
        delta, inc, value;

    each(data, function(datum) {
        if (datum.start <= start) {
            start = datum.start;
        }
        if (datum.end >= end) {
            end = datum.end;
        }
    });

    delta = end - start;
    inc = delta / 7;
    value = 0;

    while (value <= delta) {
        labels.push(new Date(start + value));
        value += inc;
    }

    return labels;
}

function parseDatasets(labels, data) {
    var dataset = {},
        datasetData = dataset.data = [],

        remaining = data.slice(),

        i = 0,
        labelLength = labels.length - 1,
        j,

        datum, label, next, time, nextTime;

    while (i++ < labelLength) {
        label = labels[i];
        next = labels[i + 1];

        if (!next) {
            datasetData.push.apply(datasetData, remaining.delta);
            break;
        }

        j = remaining.length;

        time = label.getTime();
        nextTime = next.getTime();

        while (j--) {
            datum = remaining[j];

            if (datum.start >= time && datum.start < nextTime) {
                datasetData.push(datum.delta);
                remaining.splice(j, 1);
            }
        }
    }

    return [dataset];
}

angular.module("app").controller("NavCtrl", [
    "$scope", "$http",
    NavCtrl
]);
