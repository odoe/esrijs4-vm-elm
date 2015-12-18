import Map from 'esri/Map';
import MapView from 'esri/views/MapView';
import SearchVM from 'esri/widgets/Search/SearchViewModel';
import 'dojo/domReady!';

const map = new Map({ basemap: 'topo' });

const viewNode = document.createElement('div');
const searchNode = document.createElement('div');
viewNode.setAttribute('id', 'viewDiv');
searchNode.setAttribute('id', 'searchDiv');
document.body.appendChild(searchNode);
document.body.appendChild(viewNode);

const view = new MapView({
  container: viewNode,
  map,
  center: [-100.33, 25.69],
  zoom: 10,
  ui: {
    components: [] // empty the UI
  }
});

view.then(_ => {
  let elmApp = Elm.embed(Elm.Search, searchNode, { item: {
    suggestions: [],
    value: '',
    placeholder: '',
    selectedValue: ''
  }});

  view.popup.viewModel.docked = false;

  let vm = new SearchVM({ view });

  vm.watch('suggestResults', (results) => {
    let suggestions = [];
    if (results) {
      let xs = results[0];
      suggestions = xs.map(x => x.text);
    }
    elmApp.ports.item.send({
      value: vm.value,
      placeholder: vm.placeholder,
      suggestions,
      selectedValue: ''
    });
  });

  vm.watch('searchResults', (results) => {
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

  vm.watch('value', (val) => {
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

  let {
    value,
    placeholder
  } = vm;

  // provide some initial values
  elmApp.ports.item.send({
    value,
    placeholder,
    suggestions: [],
    selectedValue: ''
  });

  elmApp.ports.modelChanges.subscribe(model => {
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