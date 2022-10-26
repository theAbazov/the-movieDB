import React, { Component } from 'react';

import './SearchForm.css';

import { Input } from 'antd';
import PropTypes from 'prop-types';

class SearchForm extends Component {
  constructor(props) {
    super(props);
    const { query } = this.props;
    this.state = {
      searchValue: query,
    };
  }

  onUpdateValue = (event) => {
    const { onSearchChange, onSearchProgress } = this.props;
    this.setState({ searchValue: event.target.value });
    onSearchProgress();
    onSearchChange(event.target.value);
  };

  render() {
    const { searchValue } = this.state;
    return (
      <form
        className="app__search-form search-form"
        onSubmit={(event) => event.preventDefault()}
      >
        <label>
          <Input
            className="search-form__input"
            placeholder="Type to search..."
            onChange={this.onUpdateValue}
            value={searchValue}
          />
        </label>
      </form>
    );
  }
}

SearchForm.defaultProps = {
  query: undefined,
};

SearchForm.propTypes = {
  onSearchProgress: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  query: PropTypes.string,
};

export default SearchForm;
