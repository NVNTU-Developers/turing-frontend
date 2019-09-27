/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, InputBase, Badge, Drawer, Hidden, IconButton, Button, Toolbar, AppBar } from '@material-ui/core';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import SearchIcon from '@material-ui/icons/Search';
import Menu from '@material-ui/icons/Menu';
import {
	NavDropdown,
} from 'react-bootstrap';
import styles from './styles';
import * as alertActions from '../../../../store/actions/alerts';
import { getDepartmentAndCategory } from '../../../../store/actions/departments.actions';
import { getList as getAllProducts, getSizeColorRange, storeFilter } from '../../../../store/actions/product.actions';
import './style.css';

let timeout = null;
class NavBar extends React.Component {
    state = {
    	mobileOpen: false,
    };

	filter = {};

	componentDidMount() {
    	this.props.action.getDepartmentAndCategory();
    	window.addEventListener('scroll', (event) => {
    		const scrollpos = window.scrollY;
    		if (scrollpos > 10) {
    			this.setState({
    				activeClass: 'is-scrolled',
    			});
    		} else {
    			this.setState({
    				activeClass: 'is-ontop',
    			});
    		}
    	});
	}

	handleQueryProduct = (filter) => {
		console.log('filter', filter);
		const { conditions, ...rest } = filter;
		this.props.action.storeFilter(filter);
		this.props.action.getAllProducts({ ...rest, conditions: JSON.stringify(conditions || {}) });
	}

    handleChangeFilter = () => {
    	this.props.action.getSizeColorRange({
    		...this.props.store.productsFilter,
    		page: 1,
    		where: JSON.stringify(this.filter),
    	});
    	this.handleQueryProduct({
    		...this.props.store.productsFilter,
    		page: 1,
    		where: JSON.stringify(this.filter),
    	});
    }

    handleSelectDepartment = (e, dep) => {
    	e.stopPropagation();
    	delete this.filter.category_id;
    	delete this.filter.category_name;
    	this.filter = {
    		...this.filter,
    		department_id: dep.department_id,
    		department_name: dep.name,
    	};
    	this.handleChangeFilter();
    }

    handleSelectCategory = (e, cat) => {
    	e.stopPropagation();
    	this.filter = {
    		...this.filter,
    		category_id: cat.category_id,
    		category_name: cat.name,
    	};
    	this.handleChangeFilter();
    }

    _buildUrl = (query) => {
        Object.keys(query).forEach((key) => (query[key] === '') && delete query[key]); // eslint-disable-line

    	let url = '';

    	Object.entries(query).forEach((el, i) => {
    		if (el[0] && el[1]) {
    			if (i === 0) {
    				url += '?' + el[0] + '=' + el[1];
    			} else if (i === Object.keys(query).length - 1) {
    				url += '&' + el[0] + '=' + el[1];
    			} else {
    				url += '&' + el[0] + '=' + el[1];
    			}
    		}
    	});

    	return url;
    }

    handleSearch = (val) => {
    	clearTimeout(timeout);
    	timeout = setTimeout(() => {
    		let conditions = this.props.store.productsFilter.conditions || {};
    		if (val) {
    			conditions = {
    				...conditions,
    				name: val,
    			};
    		} else {
    			delete conditions.name;
    		}
    		this.handleQueryProduct({
    			...this.props.store.productsFilter,
    			conditions,
    		});
    	}, 800);
    }

    handleDrawerToggle() {
    	this.setState({ mobileOpen: !this.state.mobileOpen });
    }

    render() {
    	const { classes, brand, store } = this.props;
		const { departments, productsFilter } = store;
    	const brandComponent =
        <Link to="/" className={classes.brand}>
        	{brand}
        </Link>;

    	return (
    		<div>
    			<AppBar className={`mainHeaderHolder ${classes.navBar + ' ' + this.state.activeClass}`}>
    				<Toolbar className={classes.toolbar}>
    					<div className={classes.flex}>
    						{brandComponent}
    					</div>
    					<Hidden mdDown>
    						<div className={`departments categories ${classes.linksContainer}`}>
    							{departments.map(dep => (
    								<NavDropdown
    									key={dep.department_id}
    									title={dep.name}
    									onClick={(e) => { this.handleSelectDepartment(e, dep); }}
    									className="department navDropdown"
    								>
    									{dep.Categories.map(cat => (
    										<NavDropdown.Item
    											key={cat.category_id}
    											onClick={(e) => { this.handleSelectCategory(e, cat); }}
    											className="category"
    										>
    											{cat.name}
    										</NavDropdown.Item>
    									))}
    								</NavDropdown>
    							))}
    						</div>
    					</Hidden>
    					<Hidden mdDown>
    						<div className={classes.search}>
    							<div className={classes.searchIcon}>
    								<SearchIcon />
    							</div>
    							<InputBase
    								onChange={(e) => this.handleSearch(e.target.value)}
    								placeholder="Search…"
									name="search"
									defaultValue={productsFilter.conditions && productsFilter.conditions.name || ''}
    								classes={{
    									root: classes.inputRoot,
    									input: classes.inputInput,
    								}}
    							/>
    						</div>
    					</Hidden>
    					<Hidden mdUp>
    						<IconButton
    							color="inherit"
    							aria-label="open drawer"
    							onClick={this.handleDrawerToggle.bind(this)}
    						>
    							<Menu />
    						</IconButton>
    					</Hidden>
    				</Toolbar>
    				<Hidden mdUp implementation="css">
    					<Drawer
    						variant="temporary"
    						anchor="right"
    						className="py-12"
    						open={this.state.mobileOpen}
    						onClose={this.handleDrawerToggle.bind(this)}
    					>
    						<Button classes={{
    							root: classes.button,
    						}}
    						>
    							<Link to="/department/1" className={classes.navDrawerLink}>
                                        Regional
    							</Link>
    						</Button>
    					</Drawer>
    				</Hidden>
    			</AppBar>
    		</div>
    	);
    }
}

NavBar.propTypes = {
	classes: PropTypes.object.isRequired,
	brand: PropTypes.string.isRequired,
	store: PropTypes.shape({
		departments: PropTypes.array.isRequired,
		productsFilter: PropTypes.object.isRequired,
	}).isRequired,
	// action
	action: PropTypes.shape({
		showCart: PropTypes.func.isRequired,
		getDepartmentAndCategory: PropTypes.func.isRequired,
		getAllProducts: PropTypes.func.isRequired,
		getSizeColorRange: PropTypes.func.isRequired,
		storeFilter: PropTypes.func.isRequired,
	}).isRequired,
};

const mapStateToProps = ({ products, department }) => {
	return {
		store: {
			departments: department.all.departments,
			productsFilter: products.all.filter,
		},
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		action: bindActionCreators({
			showCart: alertActions.showCart,
			getDepartmentAndCategory,
			getAllProducts,
			storeFilter,
			getSizeColorRange,
		}, dispatch),
	};
};

export default withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps, mapDispatchToProps)(NavBar)));
