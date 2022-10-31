import React, { Component } from 'react';

import './App.css';
import 'antd/dist/antd.css';

import { Pagination, Tabs } from 'antd';
import { debounce } from 'lodash/function';

import TMBDService from '../../services/TMBDService';
import { Movies } from '../Movies';
import { SearchForm } from '../SearchForm';

const { TabPane } = Tabs;
const Genres = React.createContext([]);

class App extends Component {
  api = new TMBDService();

  constructor(props) {
    super(props);
    this.state = {
      totalPages: null,
      currentPage: 1,
      loading: false,
      error: false,
      errorMessage: null,
      query: undefined,
      moviesData: [],
      guestSession: null,
      activeTab: '1',
      genres: [],
    };
  }

  componentDidMount() {
    const { guestSession } = this.state;
    this.getGenres();
    if (!guestSession) this.getSession();
  }

  componentDidUpdate(prevProps, prevState) {
    const { activeTab, currentPage } = this.state;
    let { query } = this.state;
    if (query !== prevState.query) {
      if (query.match(/^\s*/)) query = query.trim();
      if (query) this.getMovies(query);
      if (!query) this.setState({ loading: false });
    }

    if (currentPage !== prevState.currentPage) {
      this.getMovies(query, currentPage);
    }

    if (activeTab !== prevState.activeTab) {
      if (activeTab === '1') {
        this.onSearchProgress();
        this.getMovies(query);
      }
      if (activeTab === '2') {
        this.onSearchProgress();
        this.getRatedMovies();
      }
    }
  }

  onContentLoaded = (movies) => {
    this.setState({
      loading: false,
      totalPages: movies.total_pages,
      currentPage: movies.page,
      moviesData: movies.results,
    });
  };

  onError = (error) => {
    const errorData = JSON.parse(error.message);
    this.setState({
      error: true,
      loading: false,
      errorMessage: errorData.status_message,
    });
  };

  onSessionSuccess = (session) => {
    this.setState({ guestSession: session.guest_session_id });
  };

  onPaginationChange = (page) => {
    this.setState({ currentPage: page, loading: true });
  };

  onSearchChange = debounce((query) => {
    this.setState({ query });
  }, 1500);

  getMovies(query, page = 1) {
    this.api
      .requestMovies(query, page)
      .then(this.onContentLoaded)
      .catch(this.onError);
  }

  getSession() {
    const { api, onSessionSuccess } = this;
    api.requestSession().then(onSessionSuccess);
  }

  getRatedMovies = () => {
    const { guestSession } = this.state;
    this.api
      .requestRatedMovies(guestSession)
      .then(this.onContentLoaded)
      .catch(this.onError);
  };

  getGenres = () => {
    this.api.requestGenres().then((genres) => this.setState({ genres }));
  };

  onTabChange = (activeTab) => {
    this.setState({ activeTab });
  };

  onSearchProgress = () => {
    this.setState({ loading: true });
  };

  render() {
    const {
      totalPages,
      currentPage,
      moviesData,
      loading,
      error,
      errorMessage,
      query,
      guestSession,
      genres,
      activeTab,
    } = this.state;
    return (
      <Genres.Provider value={genres}>
        <main className="app">
          <div className="container app__container">
            <div className="app__tabs app-tabs">
              <Tabs
                className="app-tabs__nav"
                defaultActiveKey="1"
                centered
                onChange={this.onTabChange}
              >
                <TabPane tab="Search" key="1">
                  <SearchForm
                    onSearchChange={this.onSearchChange}
                    onSearchProgress={this.onSearchProgress}
                    query={query}
                  />
                </TabPane>
                <TabPane tab="Rated" key="2" />
              </Tabs>
            </div>
            <Genres.Consumer>
              {(genresConsumer) => (
                <Movies
                  moviesData={moviesData}
                  isLoading={loading}
                  isError={error}
                  errorMessage={errorMessage}
                  guestSession={guestSession}
                  genres={genresConsumer}
                  activeTab={activeTab}
                />
              )}
            </Genres.Consumer>

            <div className="app__pagination">
              {totalPages > 1 && !error && !loading && (
                <Pagination
                  size="small"
                  total={totalPages}
                  showSizeChanger={false}
                  current={currentPage}
                  onChange={this.onPaginationChange}
                />
              )}
            </div>
          </div>
        </main>
      </Genres.Provider>
    );
  }
}

export default App;
