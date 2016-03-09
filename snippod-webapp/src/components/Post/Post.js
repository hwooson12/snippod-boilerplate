import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import $ from 'jquery';
import moment from 'moment';
import { shortenString } from 'utils/handleString';
import { checkAuth } from 'helpers/authChecker';
import { getHostPathFromUrl } from 'utils/transformUrl';
import classNames from 'classnames';
import { intlShape, defineMessages } from 'react-intl';

import { Link as LinkComponent } from 'react-router';
const Link = Radium(LinkComponent);
import { UpvoteButton } from 'components';

import { upvotePost, cancelUpvotePost } from 'ducks/posts/posts';

const styles = require('./PostStyles');

const i18n = defineMessages({
  comments: {
    id: 'comp.post.comments',
    defaultMessage: '{commentCount, plural, =0 {no comment} =1 {one comment} other {# comments}}'
  },
  deletePost: {
    id: 'comp.post.deletePost',
    defaultMessage: 'delete'
  },
});

@connect(
  null,
  { upvotePost, cancelUpvotePost }
)
@Radium
export default class Post extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    auth: PropTypes.object.isRequired,
    showLoginDialog: PropTypes.func.isRequired,
    showConfirmCheckModal: PropTypes.func.isRequired,

    post: PropTypes.object.isRequired,
    className: PropTypes.string,
    style: PropTypes.object,

    upvotePost: PropTypes.func.isRequired,
    cancelUpvotePost: PropTypes.func.isRequired
  };

  constructor() {
    super();
    this.checkAndUpvotePost = this.checkAndUpvotePost.bind(this);
    this.checkAndCancelUpvotePost = this.checkAndCancelUpvotePost.bind(this);
    this.deletePost = this.deletePost.bind(this);
  }

  checkAndUpvotePost(postId) {
    if (!checkAuth(this.props.auth, this.props.showLoginDialog)) {
      return Promise.resolve('Login first');
    }
    return this.props.upvotePost(postId);
  }

  checkAndCancelUpvotePost(postId) {
    if (!checkAuth(this.props.auth, this.props.showLoginDialog)) {
      return Promise.resolve('Login first');
    }
    return this.props.cancelUpvotePost(postId);
  }

  deletePost(event) {
    event.preventDefault();
    this.props.showConfirmCheckModal(this.props.post.id);
  }

  render() {
    const { post, intl: { formatMessage, locale } } = this.props;
    const postLink = getHostPathFromUrl(post.link);

    const meLabel = (
      <div className="ui top right attached animated fade button label" type="button"
           onClick={this.deletePost} style={styles.meLabel}>
        <span className="visible content" style={styles.meLabelContent}>
          Me
        </span>
        <span className="hidden content" style={styles.meLabelHiddenContent}>
          {formatMessage(i18n.deletePost)}
        </span>
        <i className="delete icon" style={styles.deleteIcon} />
      </div>
    );

    return (
      <div className="ui centered card" style={styles.card} key={post.id + 'card'}>
        <Link className="content" to={'/post/' + post.id} style={styles.cardHeader}>
          {post.isAuthorMe ? meLabel : null}
          <div className="header" style={styles.title}>
            {shortenString(post.title, 44)}
            {post.title.length > 44 ? (<span className="after-gradient-effect" />) : null}
          </div>
        </Link>
        <div className="content" style={styles.mainContent}>
          <div className="link-button ui center aligned container" style={styles.linkButtonContainer}>
            <a className="ui labeled icon blue basic button"
               href={post.link} target="_blank" style={styles.linkButton}>
              <i className="linkify icon" />
              {shortenString(postLink, 29)}
              {postLink.length > 29 ? (<span className="after-gradient-effect" />) : null}
            </a>
          </div>
          <Link className="user" to={'/user/' + post.author.id}>
            <i className="user icon" />{post.author.username}
          </Link>
          <div className="meta date" style={styles.meta}>
            {moment(post.createdAt).locale(locale).fromNow()}
          </div>
        </div>
        <div className="extra-infos extra content" style={styles.extraInfos}>
          <UpvoteButton
            node={post}
            onUpvoteClick={this.checkAndUpvotePost}
            onCancelUpvoteClick={this.checkAndCancelUpvotePost} />
          &nbsp;&nbsp;
          <Link className="right floated comment-info" to={'/post/' + post.id}>
            <i className="comment icon"></i>
            {formatMessage(i18n.comments, { commentCount: post.commentCount })}
          </Link>
        </div>
      </div>
    );
  }
}
