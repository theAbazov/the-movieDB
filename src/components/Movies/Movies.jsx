import React from 'react';

import './Movies.css';

import { Alert, Spin, Tag } from 'antd';
import { format } from 'date-fns';
import PropTypes from 'prop-types';

import { MoviesItem } from '../MoviesItem';

class Movies extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: null,
    };
  }

  componentDidMount() {
    const { activeTab } = this.props;
    const message =
      Number(activeTab) === 1 ? 'Enter your search term' : 'No rated films';
    this.setState({
      message,
    });
  }

  componentDidUpdate(prevProps) {
    const { moviesData, activeTab } = this.props;
    if (prevProps.moviesData !== moviesData) {
      const message =
        Number(activeTab) === 1
          ? 'The search not given any results'
          : 'No rated films';
      this.setState({
        message,
      });
    }
  }

  render() {
    const {
      moviesData,
      isLoading,
      isError,
      errorMessage,
      guestSession,
      genres: { genres },
    } = this.props;

    const makeTeaser = (text) => {
      if (!text) return null;
      let teaser = text.split(' ').splice(0, 18).join(' ');

      if (teaser.match(/[.,!?]$/)) teaser = teaser.replace(/[.,!?]$/, ' ...');
      else teaser += ' ...';

      return teaser;
    };

    let movies;
    if (!moviesData.length) {
      const { message } = this.state;
      movies = <Alert message={message} type="info" />;
    } else
      movies = moviesData.map((movie) => {
        const {
          id,
          title,
          description,
          imgUrl,
          releaseDate,
          voteAverage,
          rating,
          genreIds,
        } = movie;

        const imgSrc = (img) =>
          img
            ? `https://image.tmdb.org/t/p/original/${imgUrl}`
            : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE1BFq0h-RvrEBWCMPudD2QMYcG2BDJVDYNw&usqp=CAU';

        const genreTags = genres
          .filter((genre) => genreIds.includes(genre.id))
          .map((element) => (
            <Tag key={element.id} className="categories__item">
              {element.name}
            </Tag>
          ));

        const voteColor = (vote) => {
          let voteAverageColor;
          if (vote > 7) voteAverageColor = '#66e900';
          else if (vote > 5) voteAverageColor = '#e9d100';
          else if (vote > 3) voteAverageColor = '#e97e00';
          else voteAverageColor = '#e90000';
          return voteAverageColor;
        };

        return (
          <MoviesItem
            key={id}
            id={id}
            title={title}
            description={makeTeaser(description)}
            imgUrl={imgSrc(imgUrl)}
            releaseDate={
              releaseDate ? format(new Date(releaseDate), 'PP') : 'Date unknown'
            }
            voteAverage={+voteAverage.toFixed(1)}
            rating={rating}
            genres={genreTags}
            guestSession={guestSession}
            voteAverageColor={voteColor(voteAverage)}
          />
        );
      });

    const error =
      isError || !navigator.onLine ? (
        <Alert
          message={!navigator.onLine ? 'No internet connection' : errorMessage}
          type="error"
        />
      ) : null;
    const spinner = !isError && isLoading && navigator.onLine ? <Spin /> : null;
    const content = isLoading || isError || !navigator.onLine ? null : movies;

    return (
      <div className="app__movies movies">
        {error}
        {spinner}
        {content}
      </div>
    );
  }
}

Movies.defaultProps = {
  moviesData: null,
  guestSession: null,
  errorMessage: null,
};

Movies.propTypes = {
  moviesData: PropTypes.instanceOf(Array),
  activeTab: PropTypes.string.isRequired,
  genres: PropTypes.instanceOf(Object).isRequired,
  guestSession: PropTypes.string,
  errorMessage: PropTypes.string,
  isError: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default Movies;
