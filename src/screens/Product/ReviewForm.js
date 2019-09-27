/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Button, withStyles, TextField, CircularProgress } from '@material-ui/core';
import StarRatings from 'react-star-ratings';
import styles from './styles';

import { postAProductReview } from '../../store/actions/review.actions';

class RegisterForm extends Component {

	static propTypes = {
		// classes: PropTypes.object.isRequired,
		classes: PropTypes.object.isRequired,
		postAProductReview: PropTypes.func.isRequired,
		productId: PropTypes.string.isRequired,
	}

	state = {
		rating: 1,
		review: '',
		validated: false,
		loading: false,
	}

	handleChangeRating = (val) => {
		this.setState({
			rating: val,
		});
	}

	handleChangeReview = (e, val) => {
		this.setState({
			review: e.target.value,
		});
	}

	handleSubmit = () => {
		const { rating, review } = this.state;

		this.setState({
			validated: true,
			loading: true,
		});

		if (rating === 0 || review === '') {
			this.setState({
				loading: false,
			});
			return;
		}

		this.props.postAProductReview({ product_id: this.props.productId, rating, review }, () => {
			this.setState({
				rating: 0,
				review: '',
				validated: false,
				loading: false,
			});
		}, () => {
			this.setState({
				loading: false,
			});
		});
	}

	render() {
		const { classes } = this.props;

		return (
			<div className="w-full flex flex-row justify-center">
				<div className="px-8 pt-6 mt-6 pb-8 mb-4">
					<div className="w-full py-4 mb-4">
						<StarRatings
							changeRating={this.handleChangeRating}
							starRatedColor="#ffc94f"
							starEmptyColor="#797979"
							starHoverColor="#ffc94f"
							starDimension="20px"
							starSpacing="1px"
							numberOfStars={5}
							name="rating"
							className="review-star"
							rating={this.state.rating}
						/>
					</div>

					<TextField
						className="w-full mb-4"
						label="Your Review"
						rows="4"
						variant="outlined"
						multiline
						rowsMax="6"
						onChange={this.handleChangeReview}
						value={this.state.review}
						error={!this.state.review && this.state.validated}
					/>

					<Button
						type="submit"
						variant="contained"
						color="primary"
						className="w-full mx-auto mt-16 normal-case"
						value="legacy"
						onClick={this.handleSubmit}
					>
							Add Review
						{this.state.loading && <CircularProgress color="inherit" size={24} className={classes.buttonProgress} />}
					</Button>

				</div>
			</div>
		);
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({
		postAProductReview,
	}, dispatch);
}

function mapStateToProps(state) {
	return {};
}


export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(RegisterForm));
