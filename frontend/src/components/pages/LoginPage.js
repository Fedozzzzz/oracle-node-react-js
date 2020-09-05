import React, { Component } from 'react';
import { login } from '../../ajax/users';
import { withRouter } from 'react-router';
import LoginForm from '../forms/LoginForm';
import PropTypes from 'prop-types';

class LoginPage extends Component {
    static propTypes = {
        history: PropTypes.string
    };

    constructor(props) {
        super(props);
        this.state = {
            response: [],
            email: '',
            password: '',
            error: '',
            showPages: false
        };
    }

  handleLoginChange = (e) => {
      this.setState({
          email: e.target.value
      });
  }

  handlePasswordChange = (e) => {
      this.setState({
          password: e.target.value
      });
  }

  handleSubmit = async (e) => {
      e.preventDefault();
      const { history } = this.props;
      const { email, password } = this.state;
      const body = {
          email,
          password
      };
      try {
          const res = await login(body);
          if (res.ok) {
              history.push('/journal');
          }
      } catch (e) {
          this.setState({ error: e });
      }
  }

  render() {
      const { email, password } = this.state;

      return (
          <div className="container">
              <LoginForm
                  email={email}
                  password={password}
                  handleSubmit={this.handleSubmit}
                  handlePasswordChange={this.handlePasswordChange}
                  handleLoginChange={this.handleLoginChange}
              />
          </div>
      );
  }
}

export default withRouter(LoginPage);
