import React from 'react';
import { Box, Card } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import CurvesListAPI from '../../helper/CurvesListAPI';
import CurvesListComponent from '../common/CurvesListComponent';

class UsersList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.api = new CurvesListAPI();
  }

  componentDidMount() {
    this.api.history()
      .then(res => {
        return res.json()
      })
      .then(curves => {
        this.setState({
          curves: curves
        })
      })
      .catch(err => {
        console.log(err)
      });
  }

  render() {
    const { curves } = this.state;
    const handlePaginate = (e, page) => {
      this.api.history(page)
        .then(res => {
          return res.json()
        })
        .then(curves => {
          this.setState({
            curves: curves
          })
        })
        .catch(err => {
          console.log(err)
        });
    };
    if(curves) {
      return <CurvesListComponent 
        curves={curves} 
        handlePaginate={handlePaginate} />
    } else {
      return (
        <Card>
          <Box>
            LOAD DATA...
          </Box>
        </Card>
      );
    }
  };
}

export default UsersList;
