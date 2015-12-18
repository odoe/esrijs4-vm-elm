'use strict';

define(['esri/Map', 'esri/views/MapView', 'esri/widgets/Search/SearchViewModel', 'dojo/domReady!'], function (_Map, _MapView, _SearchViewModel) {
  var _Map2 = _interopRequireDefault(_Map);

  var _MapView2 = _interopRequireDefault(_MapView);

  var _SearchViewModel2 = _interopRequireDefault(_SearchViewModel);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var map = new _Map2.default({
    basemap: 'topo'
  });
  var viewNode = document.createElement('div');
  var searchNode = document.createElement('div');
  viewNode.setAttribute('id', 'viewDiv');
  searchNode.setAttribute('id', 'searchDiv');
  document.body.appendChild(searchNode);
  document.body.appendChild(viewNode);
  var view = new _MapView2.default({
    container: viewNode,
    map: map,
    center: [-100.33, 25.69],
    zoom: 10,
    ui: {
      components: []
    }
  });
  view.then(function (_) {
    var elmApp = Elm.embed(Elm.Search, searchNode, {
      item: {
        suggestions: [],
        value: '',
        placeholder: '',
        selectedValue: ''
      }
    });
    view.popup.viewModel.docked = false;
    var vm = new _SearchViewModel2.default({
      view: view
    });
    vm.watch('suggestResults', function (results) {
      var suggestions = [];

      if (results) {
        var xs = results[0];
        suggestions = xs.map(function (x) {
          return x.text;
        });
      }

      elmApp.ports.item.send({
        value: vm.value,
        placeholder: vm.placeholder,
        suggestions: suggestions,
        selectedValue: ''
      });
    });
    vm.watch('searchResults', function (results) {
      vm.popupTemplate.set({
        title: 'Found via Elm',
        content: '<div>' + vm.value + '</div>'
      });
      elmApp.ports.item.send({
        value: vm.value,
        placeholder: vm.placeholder,
        suggestions: [],
        selectedValue: ''
      });
    });
    vm.watch('value', function (val) {
      vm.suggest(val);

      if (val.length === 0) {
        elmApp.ports.item.send({
          value: vm.value,
          placeholder: vm.placeholder,
          suggestions: [],
          selectedValue: ''
        });
      }
    });
    var value = vm.value;
    var placeholder = vm.placeholder;
    elmApp.ports.item.send({
      value: value,
      placeholder: placeholder,
      suggestions: [],
      selectedValue: ''
    });
    elmApp.ports.modelChanges.subscribe(function (model) {
      if (model.value !== vm.value) {
        vm.value = model.value;
        elmApp.ports.item.send({
          value: model.value,
          placeholder: model.placeholder,
          suggestions: [],
          selectedValue: ''
        });
      }

      if (model.selectedValue.length) {
        vm.search(model.selectedValue);
      }
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOltdfQ==