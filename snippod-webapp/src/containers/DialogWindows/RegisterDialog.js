import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import _ from 'lodash';
import $ from 'jquery';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { reduxForm } from 'redux-form';
import { defineMessages, FormattedMessage } from 'react-intl';

import { closeDialog } from 'ducks/application/application';

//Do not connect this action
import { register } from 'ducks/authentication/auth';
import { switchLangAndDeleteLanguageQuery } from 'ducks/application/application';

import registerValidation from './registerValidation';

const Styles = require('./DialogStyles');

const i18n = defineMessages({
  title: {
    id: 'registerDialog.title',
    defaultMessage: 'Sign-up!'
  },
  emailId: {
    id: 'registerDialog.emailId',
    defaultMessage: 'Email ID'
  },
  password: {
    id: 'registerDialog.password',
    defaultMessage: 'Password'
  },
  confirmPassword: {
    id: 'registerDialog.confirmPassword',
    defaultMessage: 'Confirm Password'
  },
  username: {
    id: 'registerDialog.username',
    defaultMessage: 'Username'
  },
  button: {
    id: 'registerDialog.button',
    defaultMessage: 'Register'
  },
  registerForwarding1: {
    id: 'registerDialog.loginForwarding1',
    defaultMessage: 'Already on Snippod-Boilerplate?'
  },
  registerForwarding2: {
    id: 'registerDialog.loginForwarding2',
    defaultMessage: 'Login'
  }
});

@connect(
  null,
  { closeDialog }
)
@reduxForm({
  form: 'register',
  fields: ['emailId', 'password', 'confirmPassword', 'username'],
  validate: registerValidation
})
@Radium
export default class RegisterDialog extends Component {

  static propTypes = {
    auth: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    closeDialog: PropTypes.func.isRequired,

    fields: PropTypes.object.isRequired,
    error: PropTypes.string,
    errors: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    initializeForm: PropTypes.func.isRequired,
    invalid: PropTypes.bool.isRequired,
    dirty: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    values: PropTypes.object.isRequired
  };

  constructor() {
    super();
    this.state = { changed: false };
    this._closeDialog = this._closeDialog.bind(this);
    this._onSubmit = this._onSubmit.bind(this);
  }

  componentDidMount() {
    $('.ui.modal')
      .modal({
        detachable: false,
        onHidden: () => {
          this._closeDialog();
        }
      })
      .modal('show');
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.values, nextProps.values) && !this.state.changed && nextProps.dirty) {
      this.setState({ changed: true });
    }
  }

  componentWillUpdate(nextProps) {
    if (!this.props.auth.loggedIn && nextProps.auth.loggedIn) {
      this._closeDialog();
    }
  }

  componentDidUpdate(prevProps) {
    //Show up general error message
    if (!prevProps.error && this.props.error && !$('.ui.general.error.message').transition('is visible')) {
      $('.ui.general.error.message')
        .transition('fade up');
    }
    //Hide general error message
    if (!_.isEqual(prevProps.values, this.props.values) && this.props.error) {
      $('.ui.general.error.message')
        .transition({
          animation: 'fade up',
          onHide: () => {this.props.initializeForm();},
          queue: false
        });
    }

    //Show up email ID Field error message
    if (this.props.fields.emailId.dirty && this.props.errors.emailId && !$('.ui.email.label').transition('is visible')) {
      $('.ui.email.pointing.label')
        .transition('fade up');
    }
    //Hide email ID Field error message
    if (prevProps.errors.emailId && !this.props.errors.emailId && $('.ui.email.label').transition('is visible')) {
      $('.ui.email.pointing.label')
        .transition('hide');
    }

    //Show up password Field error message
    if (this.props.fields.password.dirty && this.props.errors.password && !$('.ui.password.label').transition('is visible')) {
      $('.ui.password.pointing.label')
        .transition('fade up');
    }
    //Hide password Field error message
    if (prevProps.errors.password && !this.props.errors.password && $('.ui.password.label').transition('is visible')) {
      $('.ui.password.pointing.label')
        .transition('hide');
    }

    //Show up confirmPassword Field error message
    if (this.props.fields.confirmPassword.dirty && this.props.errors.confirmPassword && !$('.ui.confirmPassword.label').transition('is visible')) {
      $('.ui.confirmPassword.pointing.label')
        .transition('fade up');
    }
    //Hide confirmPassword Field error message
    if (prevProps.errors.confirmPassword && !this.props.errors.confirmPassword && $('.ui.confirmPassword.label').transition('is visible')) {
      $('.ui.confirmPassword.pointing.label')
        .transition('hide');
    }

    //Show up username Field error message
    if (this.props.fields.username.dirty && this.props.errors.username && !$('.ui.username.label').transition('is visible')) {
      $('.ui.username.pointing.label')
        .transition('fade up');
    }
    //Hide username Field error message
    if (prevProps.errors.username && !this.props.errors.username && $('.ui.username.label').transition('is visible')) {
      $('.ui.username.pointing.label')
        .transition('hide');
    }

  }

  _onSubmit(values, dispatch) {
    this.props.initializeForm();
    return new Promise((resolve, reject) => {
      dispatch(
        register(values)
      ).then((result) => {
        dispatch(switchLangAndDeleteLanguageQuery(result.account.language.split('-')[0]));
        resolve(result);
      }).catch((error) => {
        const errors = {};
        if (error.errors.email) errors.emailId = error.errors.email[0];
        if (error.errors.password) errors.password = error.errors.password[0];
        if (error.errors.confirmPassword) errors.confirmPassword = error.errors.confirmPassword[0];
        if (error.errors.username) errors.username = error.errors.username[0];
        if (error.message) errors._error = error.message;
        reject(errors);
      });
    });
  }

  _closeDialog() {
    console.log('close register dialog');
    $('.ui.modal').modal('hide dimmer');
    this.props.closeDialog();
  }

  render() {
    const { error, errors, fields: { emailId, password, confirmPassword, username }, handleSubmit, invalid,
      submitting } = this.props;
    const { changed } = this.state;

    return (
      <div className="register dialog ui small modal" >
        <i className="close icon"></i>
        <h2 className="ui image header blue">
          <img src="images/logo.png" className="image" style={ Styles.logo }/>
          <div className="content">
            <FormattedMessage {...i18n.title} />
          </div>
        </h2>
        <form className={'ui large form content' + (invalid && changed ? ' error' : '')} onSubmit={handleSubmit(this._onSubmit)}>
          <div className="ui stacked segment">
            <div className={'field' + (emailId.invalid && changed ? ' error' : '') }>
              <label><FormattedMessage {...i18n.emailId} /></label>
              <div className="ui left icon email input">
                <i className="user icon"></i>
                <input type="text" name="email" placeholder="E-mail address" ref="emailId" {...emailId} />
              </div>
              <div className="ui email pointing red basic small label transition hidden" style={Styles.errorText}>
                { errors.emailId && errors.emailId.id ? <FormattedMessage {...errors.emailId} /> : errors.emailId ? errors.emailId : null}
              </div>
            </div>
            <div className={'field' + (password.invalid && changed ? ' error' : '') }>
              <label><FormattedMessage {...i18n.password} /></label>
              <div className="ui left icon password input">
                <i className="lock icon"></i>
                <input type="password" name="password" placeholder="Password" ref="password" {...password} />
              </div>
              <div className="ui password pointing red basic small label transition hidden" style={Styles.errorText}>
                { errors.password && errors.password.id ? <FormattedMessage {...errors.password} /> : errors.password ? errors.password : null}
              </div>
            </div>
            <div className={'field' + (confirmPassword.invalid && changed ? ' error' : '') }>
              <label><FormattedMessage {...i18n.confirmPassword} /></label>
              <div className="ui left icon confirmPassword input">
                <i className="lock icon"></i>
                <input type="password" name="confirmPassword" placeholder="Confirm Password" ref="confirmPassword" {...confirmPassword} />
              </div>
              <div className="ui confirmPassword pointing red basic small label transition hidden" style={Styles.errorText}>
                { errors.confirmPassword && errors.confirmPassword.id ? <FormattedMessage {...errors.confirmPassword} /> : errors.confirmPassword ? errors.confirmPassword : null}
              </div>
            </div>
            <div className={'field' + (username.invalid && changed ? ' error' : '') }>
              <label><FormattedMessage {...i18n.username} /></label>
              <div className="ui left icon username input">
                <i className="smile icon"></i>
                <input type="text" name="username" placeholder="Username" ref="username" {...username} />
              </div>
              <div className="ui username pointing red basic small label transition hidden" style={Styles.errorText}>
                { errors.username && errors.username.id ? <FormattedMessage {...errors.username} /> : errors.username ? errors.username : null}
              </div>
            </div>
            <button type="submit" className={'ui fluid large blue button' + (submitting ? ' loading' : '')}
                    disabled={submitting || invalid} >
              <FormattedMessage {...i18n.button} />
            </button>
          </div>
          <div className="ui general error message hidden" style={Styles.errorText}>
            {error}
          </div>
        </form>
        <div className="ui message">
          <FormattedMessage {...i18n.registerForwarding1} />&nbsp;
          <a><FormattedMessage {...i18n.registerForwarding2} /></a>
        </div>
      </div>
    );
  }
}
