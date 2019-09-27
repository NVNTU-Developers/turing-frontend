/**
 *
 * if a user select a department and category in the navigation menu
 * - Filter should display Department and category dynamically when a user select a department and category
 *  on the navigation bar
 * - Filter should dynamically dislay attribute values like Size and Color from backend
 * - Price on the Price slider should change as the user slide through in the Filter
 * - Implement functionalities for search in the Nav bar and filter bar
 * - Implement funtionality for reset on filter component
 * - Implement pagination for products
 *
 */
import React, { Component } from 'react';
import {
	withStyles,
	Paper,
	Radio,
	Checkbox,
	Button,
	Fab,
	TextField,
} from '@material-ui/core';
import { Slider } from 'material-ui-slider';
import Pagination from 'react-bootstrap/Pagination';
import withWidth from '@material-ui/core/withWidth';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import FiberManualRecord from '@material-ui/icons/FiberManualRecord';
import Close from '@material-ui/icons/Close';
import { getList as getAllProducts, getSizeColorRange, storeFilter } from '../../store/actions/product.actions';
import styles from './styles';
import { Container, Section } from '../../components/Layout';
import ListProduct from '../../components/ListProduct';
import Banner from '../../components/Banner';
import SubscribeBar from '../../components/SubscribeBar';
import './styles.css';

let timeout = null;
class Home extends Component {
	conditions = {}

	static propTypes = {
		// classes: PropTypes.object.isRequired,
		classes: PropTypes.object.isRequired,
		store: PropTypes.shape({
			products: PropTypes.array.isRequired,
			productMetaData: PropTypes.object.isRequired,
			productsFilter: PropTypes.object,
			colors: PropTypes.array.isRequired,
			sizes: PropTypes.array.isRequired,
		}).isRequired,
		// action
		action: PropTypes.shape({
			getSizeColorRange: PropTypes.func.isRequired,
			getAllProducts: PropTypes.func.isRequired,
			storeFilter: PropTypes.func.isRequired,
		}).isRequired,
	}

	static defaultProps = {
	}

	constructor(props) {
		super(props);
		this.state = {
			priceRange: [1, 100],
			queryText: '',
		};
	}

	componentWillMount() {
		this.props.action.getSizeColorRange({
			page: 1,
			limit: 9,
			description_length: 120,
		});
		this.handleQueryProduct({
			page: 1,
			limit: 9,
			description_length: 120,
		});
	}

	handleQueryProduct = (filter) => {
		const { conditions, ...rest } = filter;
		this.props.action.storeFilter(filter);
		this.props.action.getAllProducts({ ...rest, conditions: JSON.stringify(conditions || {}) });
	}

	handleClickPaginationItem = (page) => {
		this.handleQueryProduct({
			...this.props.store.productsFilter,
			page,
		});
	}

	handleSliderChange = (newValue) => {
		clearTimeout(timeout);
		this.setState({ priceRange: newValue });
		timeout = setTimeout(() => {
			this.conditions = {
				...this.conditions,
				discounted_price: {
					'between': newValue,
				},
			};
			this.handleQueryProduct({
				...this.props.store.productsFilter,
				conditions: this.conditions,
			});
		}, 800);
	}

	resetFilter = () => {
		this.setState({ priceRange: [0, 100], queryText: '' });
		this.props.action.getSizeColorRange({
			page: 1,
			limit: 9,
			description_length: 120,
		});
		this.handleQueryProduct({
			page: 1,
			limit: 9,
			description_length: 120,
		});
	}

	handleSearch = () => {
		if (this.state.queryText) {
			this.conditions = {
				...this.conditions,
				name: this.state.queryText,
			};
		} else {
			delete this.conditions.name;
		}
		this.handleQueryProduct({
			...this.props.store.productsFilter,
			conditions: this.conditions,
		});
	}

	render() {
		const { store, classes } = this.props;
		const { products, productMetaData, sizes, colors, productsFilter } = store;
		const query = productsFilter.where ? JSON.parse(productsFilter.where) : {};
		const currentProducts = products;
		const items = [];
		if (productMetaData) {
			for (let number = 1; number <= productMetaData.totalPages; number++) {
				items.push(
					<Pagination.Item
						key={number}
						onClick={() => this.handleClickPaginationItem(number)}
						active={number === productMetaData.currentPage}
					>
						{number}
					</Pagination.Item>,
				);
			}
		}

		return (
			<div className={classes.root}>
				<Container>
					<Section>
						<div className="flex mb-4 contentHolder">
							<div className="w-1/4 filterSection">
								<Paper className={classes.controlContainer} elevation={1}>
									<div className={classes.filterBlock}>
										<div className={classes.titleContainer}>
											<span className={classes.controlsTopTitle}>Filter Items</span>
										</div>
										<div className={classes.filterItems}>
											<div className="py-1">
												<span className={classes.isGrey}>Category: </span>
												<span>{query.category_name || '-'}</span>
											</div>
											<div className="py-1 pb-2">
												<span className={classes.isGrey}>Department: </span>
												<span>{query.department_name || '-'}</span>
											</div>
										</div>
									</div>
									<div className={classes.filterBodyContainer}>
										<div className={classes.colorBlock}>
											<div className={classes.titleContainer}>
												<span className={classes.controlsTitle}>Color</span>
											</div>
											<div className={classes.colorRadiosContainer}>
												{colors.map(color => (
													<Radio
														key={color.value}
														style={{ padding: 0, color: color.value }}
														size="small"
														icon={<FiberManualRecord />}
														value={color.value}
														name="radio-button-demo"
														aria-label="A"
													/>
												))}
											</div>
										</div>
										<div className={classes.sizesBlock}>
											<div className={classes.titleContainer}>
												<span className={classes.controlsTitle}>Size</span>
											</div>
											<div className={classes.sizeCheckboxes}>
													{sizes.map(size => (
													<Checkbox
														key={size.value}
														style={{ padding: 0 }}
														checkedIcon={<div className={classes.sizeCheckboxChecked}>{size.value}</div>}
														icon={<div className={classes.sizeCheckboxUnchecked}>{size.value}</div>}
														value={size.value}
													/>
												))}
											</div>
										</div>
										<div className={classes.sliderBlock}>
											<div className={classes.titleContainer}>
												<span className={classes.controlsTitle}>Price Range</span>
											</div>
											<div className={classes.sliderContainer}>
													<Slider
													onChange={this.handleSliderChange}
													color="#f62f5e"
													value={this.state.priceRange}
													min={1}
													max={100}
													range
													/>
											</div>
											<div style={{
												width: '100%',
												display: 'flex',
												flexDirection: 'row',
												height: '24px',
													}}
											>
												<div className={classes.rangesText}>{`£ ${this.state.priceRange[0]}`}</div>
													<div style={{ flexGrow: 1 }} />
												<div className={classes.rangesText}>{`£ ${this.state.priceRange[1]}`}</div>
											</div>
										</div>
										<div className={classes.searchBlock}>
											<div className={classes.titleContainer}>
												<span className={classes.controlsTitle}>Search keyword</span>
											</div>
										<div className={classes.searchContainer}>
												<TextField
												inputProps={{ className: classes.filterSearchInput }}
												value={this.state.queryText}
												onChange={(e) => this.setState({ queryText: e.target.value })}
												placeholder="Enter a keyword to search..."
												margin="dense"
												variant="outlined"
												name="search"
											/>
										</div>
										</div>
									</div>
									<div className={classes.footerBlock}>
										<Fab
											color="primary"
											size="small"
											className={classes.coloredButton}
											onClick={this.handleSearch}
											style={{ borderRadius: 24, height: 35, width: 90 }}
										>
											<span className={classes.submitButtonText}>Apply</span>
										</Fab>
										<Button className={classes.clearText} onClick={this.resetFilter}>
											<Close className={classes.boldIcon} />
											<span>Reset</span>
										</Button>
									</div>
								</Paper>
							</div>
							<div className="w-3/4 flex flex-wrap ml-6 productsSection">
								{currentProducts.map((product, index) => (
									<div key={index} className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/3 mb-4">
										<ListProduct product={product} />
									</div>
								))}
								<div className={classes.paginationWrapper}>
									<Pagination>{items}</Pagination>
								</div>
							</div>
						</div>
					</Section>
					<Section>
						<Banner />
					</Section>
					<Section>
						<SubscribeBar />
					</Section>
				</Container>
			</div>
		);
	}
}

const mapStateToProps = ({ products }) => {
	return {
		store: {
			products: products.all.data.rows,
			productMetaData: products.all.data.paginationMeta,
			productsFilter: products.all.filter,
			colors: products.all.colors,
			sizes: products.all.sizes,
		},
	};
}

const mapDispatchToProps = (dispatch) => {
	return {
		action: bindActionCreators({
			getAllProducts,
			storeFilter,
			getSizeColorRange,
		}, dispatch),
	};
};

export default withWidth()(
	withStyles(styles, { withTheme: true })(withRouter(
		connect(mapStateToProps, mapDispatchToProps)(Home)),
	),
);
