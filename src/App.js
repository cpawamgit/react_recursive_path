import './App.css';
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useRouteMatch,
  useLocation,
  useHistory
} from "react-router-dom";
import datas from "./site.json";
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import { CSSTransition, TransitionGroup } from "react-transition-group";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function App() {
  return (
    <div>
      {<RecursiveExample />}
    </div>
  )
}

function RecursiveExample() {
  return (
    <Router>
          <Switch>
            <Route path="/browse">
              <FileBrowser/>
            </Route>
            <Route exact path="/">
              <Redirect to={`/browse/sitePdfs`} />
            </Route>
          </Switch>
    </Router>
  );
}

function FileBrowser() {
  return (
    <div className="browse-wrapper">
      {console.log("FileBrowser")}
      <Browse />
    </div>
  );
}



function Browse(params) {
  let location = useLocation();
  console.log(location)
  let history = useHistory();
  let { url } = useRouteMatch();
  let query = new URLSearchParams(location.search);
  let isFile = query.has("file");
  let actualPath = location.pathname;
  let jsonPath = [...datas];
  let dirPath = url.split("/");
  dirPath = dirPath.slice(2);
  let backButton = null;
  let buttonClass = null;

  function goToLink(params) {
  
    history.push(params);
  }
  /*
  if (dirPath.length > 1) {
    let tmp = url.split("/");
    tmp.pop();
    tmp = tmp.join("/");
    backButton = <Link className={buttonClass} to={tmp}><button>Back</button></Link>
  }*/

  try {
    for (let i = 0; i < dirPath.length; i++) {
      jsonPath = jsonPath.find(item => item.name === dirPath[i]).content;
    }

  } catch (err) {
    return <h1>File not found / Fichier non trouvé</h1>
  }



  if (!isFile) {
    buttonClass = jsonPath.length > 20 ? "small-btn" : jsonPath.length > 8 ? "medium-btn" : "big-btn";
    let buttons = jsonPath.map(item => {
      if (item.type === "dir") {
        return (
          <Link key={`${item.name}`} to={`${url}/${item.name}`}><button className={buttonClass}>{item.name}</button></Link>
        );
      } else {
        return (
          <Link key={`${item.name}`} to={`${url}?file=${item.name}`}><button className={buttonClass}>{item.name}</button></Link>
        );
      }
    });
    if (dirPath.length > 1) {
      let tmp = url.split("/");
      tmp.pop();
      tmp = tmp.join("/");
      backButton = <Link to={tmp}><button className={buttonClass}>Back</button></Link>
    }
    let buttonWrapper = <div className="btn-wrapper">
      {backButton}
      {buttons}
    </div>
    return (
      <div className="app-wrapper">
        {actualPath === url && buttonWrapper}
        <TransitionGroup>
          <CSSTransition
          key={location.key}
          classNames="btns"
          timeout={300}
          appear={true}
          >
        <Switch location={location}>
          <Route path={`${url}/:id`} children={<Browse/>}/>
        </Switch>
        </CSSTransition>
        </TransitionGroup>
      </div>
    );
  } else {
    buttonClass = jsonPath.length > 20 ? "small-btn" : jsonPath.length > 8 ? "medium-btn" : "big-btn";
    let buttons = jsonPath.map(item => {
      return (
        <Link key={`${item.name}`} to={`${url}?file=${item.name}`}><button className={buttonClass} >{item.name}</button></Link>
      );
    });
    if (dirPath.length > 1) {
      let tmp = url.split("/");
      tmp.pop();
      tmp = tmp.join("/");
      backButton = <Link to={tmp}><button className={buttonClass}>Back</button></Link>
    }
    let buttonWrapper = <div className="btn-wrapper">
      {backButton}
      {buttons}
    </div>
    let fName = query.get("file");
    let isDisplayed = actualPath === url ? true : false;
    return (
      <div className="app-wrapper">
        {isDisplayed && buttonWrapper}
        {isDisplayed && <Displayer fName={`${process.env.PUBLIC_URL}/${dirPath.join("/")}/${fName}`} />}
        <Switch>
          <Route path={`${url}/:id`}>
            <Browse />
          </Route>
        </Switch>
      </div>
    )
  }
}

function Displayer(props) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset) {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  return (
    <>
      <Document
        file={props.fName}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page pageNumber={pageNumber}
          scale={1}
          height={document.documentElement.clientHeight} />
      </Document>
      <div>
        <p>
          Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
        </p>
        <button
          type="button"
          disabled={pageNumber <= 1}
          onClick={previousPage}
        >
          Previous
        </button>
        <button
          type="button"
          disabled={pageNumber >= numPages}
          onClick={nextPage}
        >
          Next
        </button>
        <h1>{props.fName}</h1>
      </div>
    </>
  );
}

export default App;