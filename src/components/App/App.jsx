import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Table from '../Table/table';

export default function AppComponent() {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg">
        <Typography component="h1" variant="h3" gutterBottom>
          Hospital IQ
        </Typography>
        <Typography component="p" paragraph>
          View each unit's occupancy information in the table below. Units
          highlighted in yellow require attention.
        </Typography>
        <Table />
      </Container>
    </>
  );
}
