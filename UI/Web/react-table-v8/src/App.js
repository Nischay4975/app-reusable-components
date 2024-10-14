// @ts-nocheck
import logo from './logo.svg';
import './App.css';
import BaseTable from './baseReactTableV8';
import BaseTable2 from './baseTable2';

function App() {
  return (
    <div className="App">
      <div style={{width: '100%'}}>
        <BaseTable
          isColumnFooterVisible={false}
          isColumnHidingVisible={true}
          isGlobalFilter={true}
          pagination={true}
          sorting={true}
          multiSort={true}
          maxMultiSortColCount={5}
          flexiblePageSize={true}
        />
      </div>
    </div>
  );
}

export default App;
