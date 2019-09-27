import React, { useCallback, memo } from 'react';
import PropTypes from 'prop-types';

import {
    withStyles,
    Fab,
} from '@material-ui/core';

import SubtractIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';

const styles = theme => ({
    addRemoveIcon: {
        boxShadow: "none",
        color: theme.palette.dark
    },
    addRemoveText: {
        color: theme.palette.dark,
        fontFamily: 'Montserrat',
        fontSize: '16px',
        fontWeight: 700,
        lineHeight: "42px"
    },
});

const InputNumber = memo((props) => {
    const { classes, value, className, onChange } = props;

    const handleDecrease = useCallback(() => {
        if (value > 1) {
            onChange(value - 1);
        }
    }, [value, onChange]);

    const handleIncrease = useCallback(() => {
        onChange(value + 1);
    }, [value, onChange]);

    return (
        <div className={'flex flex-row ' + className}>
            <Fab size="small" aria-label="Subtract" className={classes.addRemoveIcon} onClick={handleDecrease}>
                <SubtractIcon/>
            </Fab>

            <div
                className="shadow appearance-none border rounded w-16 text-gray-700 rounded-full text-center mx-2">
                <span className={classes.addRemoveText} name="product-details-quantity">{value}</span>
            </div>

            <Fab size="small" aria-label="Add" className={`increase-quantity ${classes.addRemoveIcon}`} onClick={handleIncrease}>
                <AddIcon />
            </Fab>
        </div>
    );
});

InputNumber.propTypes = {
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string,
};

InputNumber.defaultProps = {
    value: 0,
    onChange: f => f,
    className: '',
};

export default withStyles(styles, {withTheme: true})(InputNumber);