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
  useParams
} from "react-router-dom";
import datas from "./site.json";
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
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
          <Browse />
        </Route>
        <Route exact path="/">
          <Redirect to={`/browse/sitePdfs`} />
        </Route>
      </Switch>
    </Router>
  );
}

function Browse(params) {
  let { url, path } = useRouteMatch();
  let { id } = useParams();
  let query = new URLSearchParams(useLocation().search);
  let isFile = query.has("file");
  let actualPath = useLocation().pathname;
  let jsonPath = [...datas];
  let dirPath = url.split("/");
  dirPath = dirPath.slice(2);
  let backButton = null;

  if (dirPath.length > 1) {
    let tmp = url.split("/");
    tmp.pop();
    tmp = tmp.join("/");
    backButton = <button><Link to={tmp}>Back</Link></button>
  }

  try {
    for (let i = 0; i < dirPath.length; i++) {
      jsonPath = jsonPath.find(item => item.name === dirPath[i]).content;
    }

  } catch (err) {
    return <h1>File not found / Fichier non trouvé</h1>
  }



  if (!isFile) {
    let buttons = jsonPath.map(item => {
      if (item.type === "dir") {
        return (
          <button><Link to={`${url}/${item.name}`}>{item.name}</Link></button>
        );
      } else {
        return (
          <button><Link to={`${url}?file=${item.name}`}>{item.name}</Link></button>
        );
      }
    });
    return (
      <div>
        {actualPath === url && buttons}
        {actualPath === url && backButton}
        <Switch>
          <Route path={`${url}/:id`}>
            <Browse />
          </Route>
        </Switch>
      </div>
    );
  } else {
    let buttons = jsonPath.map(item => {
      return (
        <button><Link to={`${url}?file=${item.name}`}>{item.name}</Link></button>
      );
    })
    let fName = query.get("file");
    let isDisplayed = actualPath === url ? true : false;
    console.log(`dirPath : ${dirPath}`)
    console.log(`url : ${url}`)
    console.log(`isDisplayed : ${isDisplayed}`)
    return (
      <div>
        {isDisplayed && buttons}
        {isDisplayed && backButton}
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
          scale={0.8} />
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