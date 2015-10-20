app.factory('calculator', ['$rootScope', '$http', function( $rootScope, $http ){

    var materialsList;
    var units = [
        {
            name: 'lbs',
            conversion: 0.0005
        },
        {
            name: 'kilos',
            conversion: 0.00110231
        },
        {
            name: 'tons',
            conversion: 1
        },
        {
            name: 'metric tons',
            conversion: 1.10231
        }
    ];

    /** PROMISE SYNTAX **/
    function newCalculation( calculation ){

        return $http.post('/calculations', calculation ).then(function(response) {

            response.data = Math.abs(parseFloat(response.data));

            if (response.data >= .0001) {
                return Math.floor(response.data * 10000) / 10000;
            } else if( response.data <= .0001 ) {
                return response.data.toExponential(2);
            }
        });
    }

    function saveCalculation( calculation ) {
        $http.post('/project/calculation', calculation).then(function (res) {


        })
    }


    function getUnits(){
        return units;
    }

    function getMaterials(){
        return $http.get('/materials').then(function(response) {
            var list = response.data;

            list.forEach(function(item){
                item.primary_cat = item.primary_cat.toLowerCase();
            });

            materialsList = list;
            return list;

        });
    }

    return {
        newCalculation: newCalculation,
        getMaterials: getMaterials,
        getUnits: getUnits,
        saveCalculation: saveCalculation

    }
}]);