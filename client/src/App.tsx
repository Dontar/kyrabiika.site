import RepoList from './repo-list/RepoList';
import BuildList from './build-list/BuildList';
import BuildItem from "./build-item/BuildItem";

import {
  HashRouter as Router,
  Switch,
  Route
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/"><RepoList /></Route>
        <Route exact path="/:repo"><BuildList /></Route>
        <Route path="/:repo/:build"><BuildItem /></Route>
      </Switch>
    </Router>
  );
}

export default App;
