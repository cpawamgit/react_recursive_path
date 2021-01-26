import './App.css';
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useRouteMatch,
  useLocation
} from "react-router-dom";
import datas from "./site.json";

function App(){
    return (
      <div>
        {<RecursiveExample />}
      </div>
    )
}


// Sometimes you don't know all the possible routes
// for your application up front; for example, when
// building a file-system browsing UI or determining
// URLs dynamically based on data. In these situations,
// it helps to have a dynamic router that is able
// to generate routes as needed at runtime.
//
// This example lets you drill down into a friends
// list recursively, viewing each user's friend list
// along the way. As you drill down, notice each segment
// being added to the URL. You can copy/paste this link
// to someone else and they will see the same UI.
//
// Then click the back button and watch the last
// segment of the URL disappear along with the last
// friend list.

function RecursiveExample() {
  return (
    <Router>
      <Switch>
        <Route path="/browse">
          <Browse />
        </Route>
        <Route exact path="/">
          <Redirect to={`/browse?dirPath=folder1&type=dir`}/>
        </Route>
      </Switch>
    </Router>
  );
}

function Browse() {
  let { url } = useRouteMatch();
  let query = new URLSearchParams(useLocation().search);
  let dirPath = query.get("dirPath").split("/");
  let type = query.get("type");
  let jsonPath = [...datas];
  
  if(type === "dir"){    
    for (let i = 0; i < dirPath.length; i++){
      jsonPath = jsonPath.find(item => item.name === dirPath[i]).content;
    }
    type = jsonPath[0].content[0].type === "dir" ? "dir" : "file";
    const toDisplay = jsonPath.map(item => {
      return(
        <button><Link to={`${url}?dirPath=${dirPath.join("/")}/${item.name}&type=${type}`}>{item.name}</Link></button>
      )
    })
    return (
      <div>
        {toDisplay}
        <Switch>
          <Route path={`${url}/:id`}>
            <Browse />
          </Route>
        </Switch>
      </div>
  
    );
  } else if (!query.has("display")) {
    for (let i = 0; i < dirPath.length; i++){
      jsonPath = jsonPath.find(item => item.name === dirPath[i]).content;
    }
    const toDisplay = jsonPath.map(item => {
      return(
        <button><Link to={`${url}/display?dirPath=${dirPath.join("/")}/${item.name}&display=true`}>{item.name}</Link></button>
      )
    })
    return(
      <div>
      {toDisplay}
      <Switch>
          <Route path={`${url}/:id`}>
            <Browse />
          </Route>
        </Switch>
      </div>
    );
  } else {
    for (let i = 0; i < dirPath.length - 1; i++){
      jsonPath = jsonPath.find(item => item.name === dirPath[i]).content;
    }
    let tmp = [...dirPath];
    tmp.pop();
    const toDisplay = jsonPath.map(item => {
      return(
        <button><Link to={`${url}/display?dirPath=${tmp.join("/")}/${item.name}&display=true`}>{item.name}</Link></button>
        
      )
    });
    return(
      <div>
      {toDisplay}
      <Switch>
          <Route path={`${url}/:id`}>
            <Display path={dirPath}/>
          </Route>
        </Switch>
      </div>
    );
  }
  
  
}

function Display(props) {
  const toDisplay = require(`../public/${props.path.join("/")}`);
  return(
    <div>
      <h1>{toDisplay}</h1>
    </div>
  )
}

export default App;
