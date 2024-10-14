// @ts-nocheck
import logo from './logo.svg';
import './App.css';
import BaseTable from './baseReactTableV8';

function App() {
  return (
    <div className="App">
      <div style={{width: '100%'}}>
        <BaseTable
          isColumnFooterVisible={false}
          isColumnHidingVisible={true}
          isGlobalFilter={true}
          paginatedTable={true}
          sortingTable={true}
          multiSort={true}
          columnFilters={true}
          maxMultiSortColCount={5}
          flexiblePageSize={true}
          initialState={{
            columnVisibility: { lastName: false },
            sorting: [
              {
                id: "progress",
                desc: false,
              },
            ],
          }}
        />
      </div>
    </div>
  );
}

export default App;
