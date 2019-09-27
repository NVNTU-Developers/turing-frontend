import React, { Component } from 'react';
import { Button, InputAdornment, withStyles } from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email';
import PasswordIcon from '@material-ui/icons/VpnKey';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import Formsy from 'formsy-react';
import { TextFieldFormsy } from '../../../../components/Formsy';
import { loginRequest, loginFacebook } from '../../../../store/actions/auth.actions';
import * as alertActions from "../../../../store/actions/alerts";
import styles from './styles';
import './styles.css';

class LoginForm extends Component {

    form = React.createRef();
    state = {
        canSubmit: false,
        error: false,
    }

    enableButton() {
        this.setState({ canSubmit: true });
    }

    disableButton() {
        this.setState({ canSubmit: false });
    }

    onSubmit = (data) => {
        this.props.loginRequest(data, () => {
            this.props.hideAuth();
        }, (err) => {
            this.setState({
                error: true,
            });
        });
    }

    handleResponseFacebook = (resultUser) => {
        this.props.loginFacebook(resultUser.accessToken, () => {
            this.props.hideAuth();
        });
    }

    render() {
        const { classes } = this.props;

        return (
            <div className="w-full flex flex-row justify-center">
                <Formsy
                    onSubmit={this.onSubmit}
                    ref={(form) => this.form = form}
                    onValid={() => this.enableButton()}
                    onInvalid={() => this.disableButton()}
                    className="bg-white shadow-md rounded px-8 pt-6 mt-6 pb-8 mb-4"
                    id="signInForm"
                >
                    <TextFieldFormsy
                        className="w-full mb-4"
                        type="text"
                        name="email"
                        label="Email"
                        validationError="This is not a valid email"
                        validations="isEmail"
                        InputProps={{
                            endAdornment: <InputAdornment position="end"><EmailIcon className="text-20" color="action" /></InputAdornment>
                        }}
                        variant="outlined"
                        helperText=''
                        required
                    />

                    <TextFieldFormsy
                        className="w-full mb-4"
                        type="password"
                        name="password"
                        label="Password"
                        InputProps={{
                            endAdornment: <InputAdornment position="end"><PasswordIcon className="text-20"
                                color="action" /></InputAdornment>
                        }}
                        variant="outlined"
                        helperText=''
                        required
                    />

                    <div className="buttonsHolder">
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={!this.state.canSubmit}
                            className="w-full logInBtn"
                            aria-label="LOG IN"
                            value="legacy"
                            id="btnFormSignIn"
                        >
                            Log In
                      </Button>
                      {
                          this.state.error && <p style={{ color: 'red' }}>The password or account is incorrect</p>
                      }

                        <div>- or -</div>

                        <div className="socialButtonsHolder">
                            <FacebookLogin
                                appId="103913873803490"
                                fields="email,name,gender,photos,cover,picture,link"
                                callback={this.handleResponseFacebook}
                                // icon={<FacebookIcon />}
                                // cssClass={styles.buttonFb}
                                render={renderProps => (
                                    <Button
                                        variant="contained"
                                        className="w-full btnFacebook"
                                        aria-label="Login with Facebook"
                                        onClick={renderProps.onClick}
                                        className={classes.buttonFb}
                                    >
                                        Login with Facebook
                                </Button>
                                )}
                            />
                            <div>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                    className="w-full btnGoogle"
                                    aria-label="LOG IN"
                                    value="legacy"
                                    id="btnGoogle"
                                    className={classes.buttonGG}
                                >
                                    Login with Google
                          </Button>
                            </div>
                        </div>
                    </div>

                </Formsy>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        loginRequest,
        loginFacebook,
        showAuth: alertActions.showAuth,
        hideAuth: alertActions.hideAuth,
    }, dispatch);
}

function mapStateToProps() {
    return {
    }
}

export default withStyles(styles)(withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginForm)));
