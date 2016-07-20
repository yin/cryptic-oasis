dashboard.directive('chart', function() {
	return {
		restrict: 'E',
		template: '<canvas id="chart{{$id}}" width="320" height="200"></canvas>',
		scope: {
			chart: '=chart'
		},
		link: {
			pre: function() {},
			post: function($scope, ele, attrs) {
				var canvas = angular.element('canvas');// + $scope.$id);
				ele.css({"display": "block"});
				canvas.css({"display": "block"});

				if (canvas) {
					var labels = _.map($scope.chart.data, function(o, k) { return k });
					var barData = _.map($scope.chart.data, function(datapoint) {
                    	return datapoint.amount
                    });
                    var lineData = _.map($scope.chart.data, function() {
                    	var sum = 0;
                    	return function(datapoint) {
                    	   	return {
                    			x: new Date(datapoint.createdAt),
                    			y: sum += datapoint.amount
                    		}
						}
                    }());
			     	var barChartData = {
			            labels: labels,
			            datasets: [{
			                type: 'bar',
			                  label: "Transactions",
			                    data: barData,
			                    fill: false,
			                    backgroundColor: '#71B37C',
			                    borderColor: '#71B37C',
			                    hoverBackgroundColor: '#71B37C',
			                    hoverBorderColor: '#71B37C',
			                    xAxisID: 'x-fix',
			                    yAxisID: 'y-axis-1'
			            }, {
			                label: "Total",
			                    type:'line',
			                    data: lineData,
			                    fill: false,
			                    borderColor: '#EC932F',
			                    backgroundColor: '#EC932F',
			                    pointBorderColor: '#EC932F',
			                    pointBackgroundColor: '#EC932F',
			                    pointHoverBackgroundColor: '#EC932F',
			                    pointHoverBorderColor: '#EC932F',
			                    xAxisID: 'x-time',
			                    yAxisID: 'y-axis-2'
			            } ]
			        };
			        console.log(barChartData.datasets[0].data, barChartData.datasets[1].data)

					var ctx = canvas.get(0).getContext('2d');
					var gfx = new Chart(ctx, {
		                type: 'bar',
		                data: barChartData,
		                options: {
		                responsive: true,
		                tooltips: {
		                  mode: 'label'
			              },
			              elements: {
			                line: {
			                    fill: false
			                }
			              },
			              scales: {
			                xAxes: [{
			                	id:'x-fix',
			                    display: true,
			                    gridLines: {
			                        display: false
			                    },
			                    labels: {
			                        show: true,
			                    }
			                },{
			                	id:'x-time',
			                	type: 'time',
			                    display: true,
			                    gridLines: {
			                        display: false
			                    },
			                    labels: {
			                        show: true,
			                    }
			                }],
			                yAxes: [{
			                    type: "linear",
			                    display: true,
			                    position: "left",
			                    id: "y-axis-1",
			                    gridLines:{
			                        display: false
			                    },
			                    labels: {
			                        show:true,
			                        
			                    }
			                }, {
			                    type: "linear",
			                    display: true,
			                    position: "right",
			                    id: "y-axis-2",
			                    gridLines:{
			                        display: false
			                    },
			                    labels: {
			                        show:true,
			                        
			                    }
			                }]
			              }
			            }
		            });
				}
			}
		}
	}
});
