import React, { Component, PropTypes } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Link } from 'react-router';

const i18n = defineMessages({
  helloWorld: {
    id: 'home.helloWorld',
    defaultMessage: 'Hello guys'
  }
});

@connect(
  createSelector([
    state => state.auth
  ], (auth) => {
    return { auth };
  })
)
export default class Home extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired
  };

  render() {
    const link = (<Link to="/stargazers/gaearon"><code>@gaearon</code></Link>);
    const redux = (<code>Redux</code>);

    return (
      <div className="home ui text container">
        <Helmet title="Home"/>

        <div className="topic main-container content full-width" >
          { /*<TopicCard/>*/ }
          { /*<PostComposer {...this.props} /> */ }
          {this.props.auth.loggedIn ? (
            <h3 className="margin-bottom-0">로그인 했어요!!</h3>
          ) : (
            <h3 className="margin-bottom-0">로그인 부터 하시죠. admin@admin.com pw:admin</h3>
          )}
          <p>
            홈asdkjlaskdjlkajs
          </p>
          <p>
            <FormattedMessage {...i18n.helloWorld} />
          </p>
          { /*<Posts {...this.props} />*/ }
        </div>
      </div>
    );
  }
}
