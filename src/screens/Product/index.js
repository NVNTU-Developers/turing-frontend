/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/**
  This component display single product using the product ID
  To complete this component, you need to implement the following:
  done - Dynamically render product attributes, size and color
  done - Show all reviews on the product
  done - Hide review submission form if user is not logged in
  done - Hide review submission form if a user is logged in but haven't previously ordered for the product
  done - Review submission form should be visible if a logged in user has once ordered for the item
  done Hide login message if user is logged in
  done - If a user click the `Add to Cart` button, the user should see an animation of how the product fly into the
    cart bag with an auto close success message, and the quantity of the item in the cart bag in the NavBar should increase
  done - Dynamically render product reviews from the backend
  done - Add functionality to post review
  done  - Add functionality to select product size, color and item quantity
  - Take initiatives to customize this component and add live to the page

  NB: YOU CAN STYLE AND CUSTOMISE THIS PAGE, BUT YOU HAVE TO USE OUR DEFAULT CLASSNAME, IDS AND HTML INPUT NAMES
*/
import React, { Component } from 'react';
import {
	withStyles,
	Radio,
	Fab, CircularProgress, Hidden, Link,
} from '@material-ui/core';
import withWidth from '@material-ui/core/withWidth';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import FiberManualRecord from '@material-ui/icons/FiberManualRecord';
import StarRatings from 'react-star-ratings';
import classNames from 'classnames';
import { Carousel } from 'react-responsive-carousel';
import systemConfig from '../../config/system';
import { getOne as getSingleProduct, getProductLocations, checkCustomerByProduct } from '../../store/actions/product.actions';
import * as alertActions from '../../store/actions/alerts';
import styles from './styles';
import { Container, Section } from '../../components/Layout';
import Review from '../../components/Review';
import ReviewForm from './ReviewForm';
import { addProductToShoppingCart, getCartProducts } from '../../store/actions/shopping_cart.actions';
import { getReviewsOfAProduct } from '../../store/actions/review.actions';
import CartStorage from '../../utils/CartStorage';
import AuthStorage from '../../utils/AuthStorage';

import InputNumber from '../../components/InputNumber';

class Product extends Component {
	state = {
		color: 'blue',
		size: 'XS',
		quantity: 1,
		addToCartLoading: false,
	}

	static propTypes = {
		// classes: PropTypes.object.isRequired,
		classes: PropTypes.object.isRequired,
		match: PropTypes.object.isRequired,
		store: PropTypes.shape({
			product: PropTypes.object.isRequired,
			isBuy: PropTypes.bool.isRequired,
			locations: PropTypes.array.isRequired,
			locationsLoading: PropTypes.bool.isRequired,
			reviewList: PropTypes.array.isRequired,
			loading: PropTypes.bool.isRequired,
			profile: PropTypes.object.isRequired,
		}).isRequired,
		// action
		action: PropTypes.shape({
			getSingleProduct: PropTypes.func.isRequired,
			getProductLocations: PropTypes.func.isRequired,
			addProductToShoppingCart: PropTypes.func.isRequired,
			getReviewsOfAProduct: PropTypes.func.isRequired,
			getCartProducts: PropTypes.func.isRequired,
			checkCustomerByProduct: PropTypes.func.isRequired,
			showAuth: PropTypes.func.isRequired,
			getAllProducts: PropTypes.func.isRequired,
		}).isRequired,
	}

	componentWillMount() {
		const { match: { params } } = this.props;
		this.props.action.getSingleProduct(params.id);
		this.props.action.getReviewsOfAProduct({ product_id: params.id });
		this.props.action.getProductLocations(params.id);
		this.props.action.checkCustomerByProduct(params.id);
	}

	handleChangeColor = (event) => {
		this.setState({
			color: event.target.value,
		});
	}

	handleChangeSize = (event) => {
		this.setState({
			size: event.target.value,
		});
	}

	handleChangeQuantity = (quantity) => {
		this.setState({
			quantity,
		});
	}

  handleAddToCart = () => {
  	const { match: { params } } = this.props;
  	const { color, size, addToCartLoading, quantity } = this.state;

  	if (addToCartLoading) {
  		return;
  	}
  	this.setState({
  		addToCartLoading: true,
  	});

  	this.props.action.addProductToShoppingCart({
  		product_id: params.id,
  		cart_id: CartStorage.cart_id,
  		quantity,
  		attributes: `${color}-${size}`,
  	}, () => {
  		const imgToDrag = document.getElementById('img-main');
  		const viewCart = document.getElementById('menuCartQuantity');

  		if (viewCart && imgToDrag) {
  			const disLeft = imgToDrag.getBoundingClientRect().left;
  			const disTop = imgToDrag.getBoundingClientRect().top;
  			const cartLeft = viewCart.getBoundingClientRect().left;
  			const cartTop = viewCart.getBoundingClientRect().top;
  			const image = imgToDrag.cloneNode(true);

  			image.style = 'z-index: 1111; width: 300px; opacity:0.8; position:fixed; top:' + disTop + 'px; left:' + disLeft + 'px; transition: left 1s, top 1s, width 1s, opacity 1s cubic-bezier(1, 1, 1, 1)';
  			const reChange = document.body.appendChild(image);

  			setTimeout(() => {
  				image.style.left = cartLeft + 'px';
  				image.style.top = cartTop + 'px';
  				image.style.width = '20px';
  				image.style.opacity = '0';
  			}, 200);

  			setTimeout(() => {
  				reChange.parentNode.removeChild(reChange);
  				this.props.action.getCartProducts(CartStorage.cart_id);
  			}, 2000);
  		}

  		this.setState({
  			addToCartLoading: false,
  		});
  	}, () => {
  		this.setState({
  			addToCartLoading: false,
  		});
  	});
  }

  render() {
	  const { classes, match: { params }, store } = this.props;
  	const { product, isBuy, loading, locations, locationsLoading, reviewList = [] } = store;
  	const isLoading = loading || !product.image || locationsLoading;
  	const isDiscounted = parseFloat(product.discounted_price) > 0;

  	return (
  		<div className={classes.root}>
  			<Container className="product-details">
  				{isLoading ?
  					<Section>
  						<div className="flex flex-wrap shadow flex justify-center py-24 bg-white">
  							<CircularProgress size={40} color="primary" />
  						</div>
  					</Section>
  					:
  					<div>
  						<Section>
  							<div className="flex flex-wrap shadow bg-white">
  								<div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 flex justify-center align-middle pt-10">
  									<Carousel showArrows showIndicators={false} showStatus={false}>
  										<div className={classes.carouselImageContainer}>
  											<img id="img-main" src={`${systemConfig.imageBaseUrl}${product.image}`} alt="Product" />
  										</div>
  										<div className={classes.carouselImageContainer}>
  											<img src={`${systemConfig.imageBaseUrl}${product.image_2}`} alt="Product" />
  										</div>
  									</Carousel>
  								</div>
  								<div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 p-10">
  									<div className={`w-full h-8 ${classes.breadcrumbsText}`}>
											Home <span className="ml-4" /> • <span className="ml-4" /> {locations[0].department_name} <span className="ml-4" /> • <span className="ml-4" /> {locations[0].category_name}
  									</div>
  									<div className="w-full h-8 mt-2">
  										<StarRatings
  											rating={product.display}
  											starRatedColor="#ffc94f"
  											starEmptyColor="#eeeeee"
  											starHoverColor="#ffc94f"
  											starDimension="20px"
  											starSpacing="1px"
  											numberOfStars={5}
  											name="rating"
  										/>
  									</div>
  									<div className="w-full h-8">
  										<span className={`product-details-title ${classes.productTitleText}`}>
  											{product.name}
  										</span>
  									</div>
  									<div className="w-full mt-4">
  										<span className={classes.productPrice}>
  											<span className={classNames({ [classes.strikeThrough]: isDiscounted })}>
													£ {product.price}
  											</span>
  											{isDiscounted && <span> | £ {product.discounted_price}</span>}
  										</span>
  									</div>
  									<div className="w-full my-8">
  										<div className="w-full mb-2">
  											<span className={classes.lightTitle}> Colour </span>
  										</div>
  										<div>
  											<Radio
  												style={{ padding: 2, color: '#6eb2fb' }}
  												size="small"
  												icon={<FiberManualRecord />}
  												value="blue"
  												name="color"
  												aria-label="blue"
  												className="product-details-color"
  												onChange={this.handleChangeColor}
  												checked={this.state.color === 'blue'}
  											/>
  											<Radio
  												style={{ padding: 2, color: '#00d3ca' }}
  												size="small"
  												icon={<FiberManualRecord />}
  												value="cyan"
  												name="color"
  												aria-label="cyan"
  												className="product-details-color"
  												onChange={this.handleChangeColor}
  												checked={this.state.color === 'cyan'}
  											/>
  											<Radio
  												style={{ padding: 2, color: '#f62f5e' }}
  												size="small"
  												icon={<FiberManualRecord />}
  												value="red"
  												name="color"
  												aria-label="red"
  												className="product-details-color"
  												onChange={this.handleChangeColor}
  												checked={this.state.color === 'red'}
  											/>
  											<Radio
  												style={{ padding: 2, color: '#fe5c07' }}
  												size="small"
  												icon={<FiberManualRecord />}
  												value="orange"
  												name="color"
  												aria-label="orange"
  												className="product-details-color"
  												onChange={this.handleChangeColor}
  												checked={this.state.color === 'orange'}
  											/>
  											<Radio
  												style={{ padding: 2, color: '#f8e71c' }}
  												size="small"
  												icon={<FiberManualRecord />}
  												value="yellow"
  												name="color"
  												aria-label="yellow"
  												className="product-details-color"
  												onChange={this.handleChangeColor}
  												checked={this.state.color === 'yellow'}
  											/>
  											<Radio
  												style={{ padding: 2, color: '#7ed321' }}
  												size="small"
  												icon={<FiberManualRecord />}
  												value="green"
  												name="color"
  												aria-label="green"
  												className="product-details-color"
  												onChange={this.handleChangeColor}
  												checked={this.state.color === 'green'}
  											/>
  											<Radio
  												style={{ padding: 2, color: '#9013fe' }}
  												size="small"
  												icon={<FiberManualRecord />}
  												value="purple"
  												name="color"
  												aria-label="purple"
  												className="product-details-color"
  												onChange={this.handleChangeColor}
  												checked={this.state.color === 'purple'}
  											/>
  										</div>
  									</div>
  									<div className="w-full my-8">
  										<div className="w-full mb-2">
  											<span className={classes.lightTitle}> Size </span>
  										</div>
  										<div>
  											<Radio
  												style={{ padding: 0 }}
  												checkedIcon={<div className={classes.sizeCheckboxChecked}>XS</div>}
  												icon={<div className={classes.sizeCheckboxUnchecked}>XS</div>}
  												className="product-details-size"
  												value="XS"
  												name="size"
  												onChange={this.handleChangeSize}
  												checked={this.state.size === 'XS'}
  											/>
  											<Radio
  												style={{ padding: 0 }}
  												checkedIcon={<div className={classes.sizeCheckboxChecked}>S</div>}
  												icon={<div className={classes.sizeCheckboxUnchecked}>S</div>}
  												className="product-details-size"
  												value="S"
  												name="size"
  												onChange={this.handleChangeSize}
  												checked={this.state.size === 'S'}
  											/>
  											<Radio
  												style={{ padding: 0 }}
  												checkedIcon={<div className={classes.sizeCheckboxChecked}>M</div>}
  												icon={<div className={classes.sizeCheckboxUnchecked}>M</div>}
  												className="product-details-size"
  												value="M"
  												name="size"
  												onChange={this.handleChangeSize}
  												checked={this.state.size === 'M'}
  											/>
  											<Radio
  												style={{ padding: 0 }}
  												checkedIcon={<div className={classes.sizeCheckboxChecked}>L</div>}
  												icon={<div className={classes.sizeCheckboxUnchecked}>L</div>}
  												className="product-details-size"
  												value="L"
  												name="size"
  												onChange={this.handleChangeSize}
  												checked={this.state.size === 'L'}
  											/>
  											<Radio
  												style={{ padding: 0 }}
  												checkedIcon={<div className={classes.sizeCheckboxChecked}>XL</div>}
  												icon={<div className={classes.sizeCheckboxUnchecked}>XL</div>}
  												className="product-details-size"
  												value="XL"
  												name="size"
  												onChange={this.handleChangeSize}
  												checked={this.state.size === 'XL'}
  											/>
  										</div>
  									</div>
  									<div className="my-8">
  										<InputNumber
  											value={this.state.quantity}
  											onChange={this.handleChangeQuantity}
  										/>
  									</div>
  									<div className="w-full my-8 flex flex-row">
  										<div className="relative">
  											<Fab color="primary" size="large" id="btnCart" onClick={this.handleAddToCart} style={{ borderRadius: 60, height: 60, width: 220 }}>
  												<span className={classes.submitButtonText}>Add to Cart</span>
  												{this.state.addToCartLoading && <CircularProgress color="inherit" size={24} className={classes.buttonProgress} />}
  											</Fab>
  										</div>
  									</div>
  								</div>
  							</div>
  						</Section>
  						<div>
  							<Hidden mdDown>
  								<Section>
  									<div className="flex flex-wrap px-32">
  										<div className="w-full flex">
  											<span className={classes.reviewTitleText}>
													Product Reviews
  											</span>
  										</div>
  										{
  											reviewList.length > 0 ?
  												reviewList.map((el) => {
  													return <Review key={el.created_on} rating={el.rating} name={el.name} review={el.review} />;
  												}) :
  												<div>There are no reviews for this product</div>
  										}
  									</div>
  								</Section>
  							</Hidden>
  							{
  								isBuy && AuthStorage.loggedIn ?
  									<ReviewForm productId={params.id} /> :
  									<div className="w-full flex justify-center align-middle py-8">
  										{!AuthStorage.loggedIn &&
												<div>
													<Link onClick={() => { this.props.action.showAuth(false); }} color="primary" style={{ cursor: 'pointer', color: 'red' }}>Log In</Link>
													<span className="ml-2">to Add a Review.</span>
												</div>
  										}
  									</div>
  							}
  						</div>
  					</div>}
  			</Container>
  		</div>
  	);
  }
}

const mapStateToProps = ({ product, cart, auth, review, customer }) => {
	return {
		store: {
			product: product.item.data,
			isBuy: product.item.isBuy,
			locations: product.locations.data,
			locationsLoading: product.locations.isLoading,
			reviewList: review.list,
			loading: product.item.isLoading,
			profile: customer.profile.data,
		},
	};
}

const mapDispatchToProps = (dispatch) => {
	return {
		action: bindActionCreators({
			getSingleProduct,
			getProductLocations,
			addProductToShoppingCart,
			getReviewsOfAProduct,
			getCartProducts,
			checkCustomerByProduct,
			showAuth: alertActions.showAuth,
		}, dispatch),
	};
};

export default withWidth()(withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps, mapDispatchToProps)(Product))));
