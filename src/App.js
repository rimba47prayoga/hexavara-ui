import Drawer from "layouts/drawer";
import HistoryCalls from "views/history";

function App() {
  return (
    <div className="App">
      <Drawer>
        <HistoryCalls />
      </Drawer>
    </div>
  );
}

export default App;
