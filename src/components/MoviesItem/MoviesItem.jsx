import React, { Component } from 'react';

import './MoviesItem.css';

import { Rate } from 'antd';
import PropTypes from 'prop-types';

import TMBDService from '../../services/TMBDService';

class MoviesItem extends Component {
  api = new TMBDService();

  constructor() {
    super();
    this.state = {
      starRating: null,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { starRating } = this.state;
    if (!starRating > 0 && !starRating === null) this.deleteRating();
    if (starRating !== prevState.starRating) this.setRating();
  }

  setRating = () => {
    const { id: movieId, guestSession: guestSessionId } = this.props;
    const { starRating } = this.state;
    this.api.rateMovie(movieId, guestSessionId, starRating);
  };

  render() {
    const {
      title,
      description,
      imgUrl,
      releaseDate,
      voteAverage,
      rating,
      voteAverageColor,
      genres,
    } = this.props;
    const { starRating } = this.state;
    return (
      <div className="movies__item movies-item">
        <div className="movies-item__image">
          <img src={imgUrl} alt="img" />
        </div>
        <div className="movies-item__content">
          <header className="movies-item__header">
            <div className="movies-item__header-top">
              <h3 className="movies-item__title">{title}</h3>
              <div
                className="movies-item__number-rating"
                style={{ borderColor: voteAverageColor }}
              >
                {voteAverage}
              </div>
            </div>
            <div className="movies-item__date">{releaseDate}</div>
            <div className="movies-item__categories categories">{genres}</div>
          </header>
          <div className="movies-item__description">{description}</div>
          <Rate
            count={10}
            allowHalf
            defaultValue={rating || starRating}
            onChange={(st) => this.setState({ starRating: st })}
          />
        </div>
      </div>
    );
  }
}

MoviesItem.defaultProps = {
  rating: undefined,
  guestSession: null,
  imgUrl: null,
  releaseDate: undefined,
  description: null,
  title: null,
  voteAverage: null,
  voteAverageColor: '#e90000',
};

MoviesItem.propTypes = {
  id: PropTypes.number.isRequired,
  voteAverageColor: PropTypes.string,
  genres: PropTypes.instanceOf(Object).isRequired,
  guestSession: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  releaseDate: PropTypes.string,
  voteAverage: PropTypes.number,
  rating: PropTypes.number,
  imgUrl: PropTypes.string,
};

export default MoviesItem;
