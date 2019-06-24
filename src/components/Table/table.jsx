import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Icon from '@material-ui/core/Icon';

import ky from 'ky';

export default function TableComponent() {
  const [units, setUnits] = useState(false);
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('desc');

  const sortFunc = (a, b) => {
    a = a[orderBy];
    b = b[orderBy];
    const aIsNumber = parseInt(a);
    const bIsNumber = parseInt(b);
    const bothNumbers = aIsNumber && bIsNumber;
    const bothStrings = !aIsNumber && !bIsNumber;

    if (bothNumbers) return parseInt(a) - parseInt(b);
    if (bothStrings) {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    }
    if (aIsNumber) return -1;
    if (bIsNumber) return 1;
  };

  const sortUnits = () => {
    const sortOrder =
      order === 'desc'
        ? (a, b) => sortFunc(a, b, orderBy)
        : (a, b) => -sortFunc(a, b, orderBy);
    return units.sort(sortOrder);
  };
  const handleSortClick = rowId => {
    const isDesc = orderBy === rowId && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(rowId);
  };

  const classes = makeStyles(theme => ({
    table: {
      minWidth: 750
    },
    tableWrapper: {
      overflowX: 'auto'
    },
    warning: {
      backgroundColor: '#ffecb3'
    },
    icon: {
      position: 'relative',
      top: '2px',
      fontSize: '19px',
      marginRight: '4px'
    }
  }))();

  useEffect(() => {
    const fetchUnits = async () => {
      const units = await ky
        .get('https://private-66479-hospiqtest.apiary-mock.com/units')
        .json();

      const unitsAndAlarms = units.map(unit => {
        const lowWarning = unit.lowAlarm && unit.census <= unit.lowAlarm;
        const highWarning = unit.highAlarm && unit.census >= unit.highAlarm;
        return {
          ...unit,
          lowWarning,
          highWarning,
          hasWarning: lowWarning || highWarning
        };
      });

      setUnits(unitsAndAlarms);
    };

    fetchUnits();
  }, []);
  const headRows = [
    { label: 'ID', id: 'id' },
    { label: 'Name', id: 'name' },
    { label: 'Census', id: 'census' },
    { label: 'Capacity', id: 'capacity' },
    { label: 'Low Alarm', id: 'lowAlarm' },
    { label: 'High Alarm', id: 'highAlarm' }
  ];
  return (
    <div className={classes.tableWrapper}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            {headRows.map(row => (
              <TableCell key={row.id} align="center">
                <TableSortLabel
                  active={orderBy === row.id}
                  direction={order}
                  onClick={() => handleSortClick(row.id)}
                >
                  {row.label}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {!units.length && (
            <TableRow>
              <TableCell colSpan="6" align="center">
                Loading...
              </TableCell>
            </TableRow>
          )}

          {units.length &&
            sortUnits().map(unit => (
              <TableRow
                className={unit.hasWarning ? classes.warning : ''}
                key={unit.id}
              >
                <TableCell align="center">{unit.id}</TableCell>
                <TableCell align="center">{unit.name}</TableCell>
                <TableCell align="center">
                  {unit.hasWarning && (
                    <Icon className={classes.icon}>warning</Icon>
                  )}
                  {unit.census}
                </TableCell>
                <TableCell align="center">{unit.capacity}</TableCell>

                <TableCell align="center">
                  {unit.lowWarning && (
                    <Icon className={classes.icon}>warning</Icon>
                  )}
                  {unit.lowAlarm || '-'}
                </TableCell>

                <TableCell align="center">
                  {unit.highWarning && (
                    <Icon className={classes.icon}>warning</Icon>
                  )}
                  {unit.highAlarm || '-'}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
