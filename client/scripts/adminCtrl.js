/**
 * ADMIN
 */
app.controller('adminCtrl', ['$http', '$scope','$parse', function( $http, $scope, $parse ){
    // INIT
    init();

    var self = this;
    self.suggestions = '';
    self.markComplete = markComplete;

    function markComplete( suggestion ) {
        var id = suggestion.id;
        console.log(id);
        $http.put('/suggestion/complete/' + id).then(function( res ) {
            init();
        });
    }

    function init() {
        $http.get('/suggestion').then(function (res) {
            var suggestions = res.data;
            console.log(suggestions);
            self.suggestions = suggestions;
        });
    }

        $scope.csv = {
            content: null,
            header: true,
            headerVisible: true,
            separator: ',',
            separatorVisible: true,
            result: null,
            encoding: 'ISO-8859-1',
            encodingVisible: true
        };

        var _lastGoodResult = '';
        $scope.toPrettyJSON = function (json, tabWidth) {
            var objStr = JSON.stringify(json);
            var obj = null;
            try {
                obj = $parse(objStr)({});
            } catch(e){
                // eat $parse error
                return _lastGoodResult;
            }

            var result = JSON.stringify(obj, null, Number(tabWidth));
            _lastGoodResult = result;

            return result;
        };

}]);