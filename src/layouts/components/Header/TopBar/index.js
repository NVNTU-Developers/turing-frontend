/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Link, Badge, Hidden, CircularProgress } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar/index';
import Toolbar from '@material-ui/core/Toolbar/index';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import styles from './styles';
import * as alertActions from '../../../../store/actions/alerts';
import { getCustomerProfile, logoutRequest } from '../../../../store/actions/auth.actions';
import { generateUniqueId, getCartProducts } from '../../../../store/actions/shopping_cart.actions';
import AuthStorage from '../../../../utils/AuthStorage';
import CartStorage from '../../../../utils/CartStorage';

const links = [{
	title: 'Daily Deals',
	link: '/',
}, {
	title: 'Sell',
	link: '/',
}, {
	title: 'Help & Contact',
	link: '/',
}];

class TopBar extends React.Component {
    state = {
    	loading: false,
    }

    componentWillMount() {
    	if (AuthStorage.loggedIn) {
    		this.props.getCustomerProfile();
    	}
    	if (!CartStorage.hasCartId) {
    		this.props.generateUniqueId((res) => {
    			const data = {
    				cart_id: res.cart_id,
    			};
    			CartStorage.value = data;
    		});
    	} else {
    		this.props.getCartProducts(CartStorage.cart_id);
    	}
    }

    handleLogout = () => {
    	this.setState({
    		loading: true,
    	});
    	this.props.logoutRequest(() => {
    		this.setState({
    			loading: false,
    		});
    	});
    }

    render() {
    	const {
    		classes,
    		Profile,
    		shoppingCart,
    	} = this.props;
    	const totalPrice = shoppingCart.products && shoppingCart.products.reduce((preVal, el) => {
    		return parseFloat(preVal +
                (parseFloat(el.discounted_price) > 0 ? parseFloat(el.discounted_price) * el.quantity
                	: parseFloat(el.price) * el.quantity)).toFixed(2);
    	}, 0);
    	return (
    		<AppBar className={classes.topBar}>
    			<Toolbar className={classes.toolbar}>
    				{!Profile.customer_id &&
                        <div className={classes.authText + ' ' + classes.divTopBar}>
                        	<Link
                        		onClick={() => {
                        			this.props.showAuth(false);
                        		}}
                        		className={classes.authLink}
                        		id="btnSignIn"
                        		style={{ color: 'red' }}
                        	>
                                Sign in
                        	</Link>
                        	<span>or</span>
                        	<Link
                        		onClick={() => {
                        			this.props.showAuth(true);
                        		}}
                        		className={classes.authLink}
                        		id="btnRegister"
                        		style={{ color: 'red' }}
                        	>
                                Register
                        	</Link>
                        </div>
    				}
    				{Profile.customer_id &&
                        <div className={classes.authText + ' ' + classes.divTopBar}>
                        	<span>{`Hi ${Profile.name}`}</span>
                        	<Link className={classes.authLink} style={{ color: 'red' }}>
                                My Profile
                        	</Link>
                        	<span>|</span>
                        	<Link className={classes.authLink} id="btnLogout" style={{ color: 'red' }} onClick={this.handleLogout}>
                                Logout {this.state.loading && <CircularProgress color="inherit" size={15} />}
                        	</Link>
                        </div>
    				}
    				<Hidden mdDown className={classes.divTopBar}>
    					<div className={classes.linksContainer}>
    						{
    							links.map((item, index) => (
    								<Button key={index} classes={{ root: classes.button }}>
    									<Link to={item.link} className={classes.navLink}>
    										{item.title}
    									</Link>
    								</Button>
    							))
    						}
    					</div>
    				</Hidden>
    				<Hidden mdDown className={classes.divTopBar}>
    					<div className={classes.currencyIconContainer}>
    						<span className="flag-icon flag-icon-gb" />
    					</div>
    					<div className={classes.currencyContainer}>
    						<div className={classes.currencyText}>GBR</div>
    					</div>
    				</Hidden>
    				<div className={classes.divTopBar}>
    					<div
    						className={classes.iconContainer}
    						id="menuCartQuantity"
    						onClick={() => {
    							this.props.showCart();
    						}}
    					>
    						<Badge
    							classes={{ badge: classes.badge }}
    							badgeContent={shoppingCart && shoppingCart.products ? shoppingCart.products.length : 0}
    							color="primary"
    						>
    							<img alt="Shopping Cart Icon" src="/assets/icons/shopping-cart-black.svg" />
    						</Badge>
    					</div>
    					<div className={classes.yourBag} style={{ color: 'black' }}>Your Bag: $<span id="menuCartTotalPrice">{totalPrice}</span></div>
    				</div>
    			</Toolbar>
    		</AppBar>
    	);
    }
}

TopBar.propTypes = {
	classes: PropTypes.object.isRequired,
	Profile: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
	return bindActionCreators({
		showCart: alertActions.showCart,
		showAuth: alertActions.showAuth,
		getCustomerProfile,
		generateUniqueId,
		getCartProducts,
		logoutRequest,
	}, dispatch);
}

function mapStateToProps({ customer, ShoppingCart }) {
	return {
		Profile: customer.profile.data,
		shoppingCart: ShoppingCart.products,
	};
}


export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(TopBar));
