import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Table from '../Table/Table';
import { makeStyles } from '@material-ui/core/styles';

export default function AppComponent() {
  const classes = makeStyles({
    container: {
      margin: '48px auto'
    },
    content: {
      marginBottom: '32px'
    }
  })();

  return (
    <>
      <CssBaseline />
      <Container className={classes.container} maxWidth="lg">
        <Typography component="h1" variant="h3" gutterBottom>
          Hospital IQ
        </Typography>
        <Typography className={classes.content} component="p" paragraph>
          View each unit's occupancy information in the table below. Units
          highlighted in yellow require attention.
        </Typography>
        <Table />
      </Container>
    </>
  );
}
