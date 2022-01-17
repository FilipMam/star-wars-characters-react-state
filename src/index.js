import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router } from 'react-router-dom';

import CharacterList from './CharacterList';

import dummyData from './dummy-data';

import './styles.scss';
import endpoint from './endpoint';

const initialState = {
  result: [],
  loading: true,
  error: null,
};

const fetchReducer = (state, action) => {
  if (action.type === 'LOADING') {
    return { ...state, loading: true };
  }

  if (action.type === 'RESPONSE_COMPLETE') {
    debugger;
    return {
      error: null,
      loading: false,
      result: action.payload,
    };
  }

  if (action.type === 'ERROR') {
    return { ...state, loading: false, error: action.payload };
  }

  return state;
};

const useFetch = (url) => {
  const [state, dispatch] = React.useReducer(fetchReducer, initialState);

  // const [response, setResposne] = useState(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  React.useEffect(() => {
    dispatch({ type: 'LOADING' });
    fetch(url)
      .then((res) => res.json())
      .then((response) => {
        dispatch({ type: 'RESPONSE_COMPLETE', payload: response });
      })
      .catch((error) => {
        console.error(error);
        dispatch({ type: 'ERROR', payload: error });
      });
  }, []);

  return [state.result, state.loading, state.error];
};

const Application = () => {
  const [response, loading, error] = useFetch(endpoint + '/characters');
  const characters = (response && response.characters) || [];
  return (
    <div className="Application">
      <header>
        <h1>Star Wars Characters</h1>
      </header>
      <main>
        <section className="sidebar">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <CharacterList characters={characters} />
          )}
          {error & <p className="error">{error}</p>}
        </section>
      </main>
    </div>
  );
};

const rootElement = document.getElementById('root');

ReactDOM.render(
  <Router>
    <Application />
  </Router>,
  rootElement,
);
