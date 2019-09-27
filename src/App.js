/* --------------------------------------------------------
* Author Ngô An Ninh
* Email ninh.uit@gmail.com
* Phone (+65) 8305 8687
*
* Created: 2019-09-26 23:49:05
*------------------------------------------------------- */

import React from 'react';
import { createGenerateClassName, jssPreset } from '@material-ui/core';
import Provider from 'react-redux/es/components/Provider';
import { Router } from 'react-router-dom';
import JssProvider from 'react-jss/lib/JssProvider';
import { create } from 'jss';
import jssExtend from 'jss-extend';
import history from './history';
import store from './store';
import AppContext from './AppContext';
import Theme from './components/System/Theme';
import routes from './config/routes';
import LayoutHandler from './layouts/LayoutHandler';
import './styles/index.css';

const jss = create({
	...jssPreset(),
	plugins: [...jssPreset().plugins, jssExtend()],
});

jss.options.insertionPoint = document.getElementById('jss-insertion-point');
const generateClassName = createGenerateClassName();

function App() {
	return (
		<AppContext.Provider value={{ routes }}>
			<JssProvider jss={jss} generateClassName={generateClassName}>
				<Provider store={store}>
					<Router history={history}>
						<Theme>
							<LayoutHandler />
						</Theme>
					</Router>
				</Provider>
			</JssProvider>
		</AppContext.Provider>
	);
}

export default App;
