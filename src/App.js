import { BrowserRouter, Switch, Route } from "react-router-dom";

import Drawer from "layouts/drawer";
import Customer from "views/customers";
import HistoryCalls from "views/history";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Drawer>
          <Switch>
            <Route exact path="/customers" component={Customer} />
            <Route
              exact
              path="/customers/:id/history"
              component={HistoryCalls}
            />
          </Switch>
        </Drawer>
      </BrowserRouter>
    </div>
  );
}

export default App;
