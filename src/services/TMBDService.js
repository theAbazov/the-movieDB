class TMBDService {
  constructor() {
    this.baseUrl = process.env.REACT_APP_BASE_URL;
    this.apiKey = process.env.REACT_APP_API_KEY;
    this.imgUrl = process.env.REACT_APP_IMG_URL;
  }

  _endURL(endpoint, params = '') {
    return `${this.baseUrl}${endpoint}?api_key=${this.apiKey}${params}`;
  }

  async _req(url, method = 'get', body = null) {
    const options = {};
    if (method === 'post') {
      options.method = 'POST';
      options.headers = { 'Content-Type': 'application/json;charset=utf-8' };
      options.body = JSON.stringify(body);
    }
    if (method === 'delete') {
      options.method = 'DELETE';
      options.headers = { 'Content-Type': 'application/json;charset=utf-8' };
    }
    const res = await fetch(url, options);
    if (res.ok) {
      const data = await res.json();
      return this._transformData(data);
    }
    return res.text().then((text) => {
      throw new Error(text);
    });
  }

  async requestMovies(query, page = 1) {
    const url = this._endURL('/search/movie', `&query=${query}&page=${page}`);
    return this._req(url);
  }

  async requestSession() {
    const url = this._endURL('/authentication/guest_session/new');
    return this._req(url);
  }

  async requestRatedMovies(authId) {
    const url = this._endURL(`/guest_session/${authId}/rated/movies`);
    return this._req(url);
  }

  async rateMovie(movieId, sessionId, rateValue) {
    const url = this._endURL(
      `/movie/${movieId}/rating`,
      `&guest_session_id=${sessionId}`
    );

    if (Math.ceil(rateValue)) {
      this._req(url, 'post', { value: rateValue });
    } else {
      this._req(url, 'delete');
    }
  }

  async requestGenres() {
    const url = this._endURL(`/genre/movie/list`);
    return this._req(url);
  }

  _transformData(data) {
    if (!Array.isArray(data.results)) return data;
    const movies = data.results.map((movie) => ({
      id: movie.id,
      title: movie.title,
      description: movie.overview,
      imgUrl: movie.poster_path,
      releaseDate: movie.release_date,
      voteAverage: movie.vote_average,
      genreIds: movie.genre_ids,
      rating: movie.rating,
    }));

    return {
      ...data,
      results: movies,
    };
  }
}

export default TMBDService;
