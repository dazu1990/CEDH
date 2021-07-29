import React from 'react';
import { withStyles } from '@material-ui/styles';


import styles from './style';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import SearchIcon from '@material-ui/icons/Search';



const AdvancedSearch= (Props) => {
  let searchOptions = {}
  const classes = Props.classes;
  const handleDrawerClose = () => {
    Props.updateParent(false);
    Props.updateParentSearch(searchOptions);
  };
  const updateField = (event) => {
    searchOptions[event.target.name] = event.target.value;
  };

  return (
    <div>
      <Drawer
        className={classes.someting}
        variant="persistent"
        anchor="left"
        open={Props.open}
      >
        <div className={classes.drawerHeader}>
          <span>Advanced Search</span>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <div>
          <TextField 
            name="name"
            label="Name" 
            placeholder='"Kard, The Seeking"'
            onChange={updateField}
            InputProps={{
              startAdornment: <SearchIcon></SearchIcon>,
            }}
            InputLabelProps={{
              focused: 'true',

            }}
            variant="outlined"
          />
          <br/>
          <TextField 
            name="type"
            label="Type" 
            placeholder='"Salamander Warlock"'
            onChange={updateField}
            InputProps={{
              startAdornment: <SearchIcon></SearchIcon>,
            }}
            InputLabelProps={{
              focused: 'true',

            }}
            variant="outlined"
          />
          <br/>
          <TextField 
            name="text"
            label="Text" 
            placeholder='"Whenever a bird..."'
            onChange={updateField}
            InputProps={{
              startAdornment: <SearchIcon></SearchIcon>,
            }}
            InputLabelProps={{
              focused: 'true',

            }}
            variant="outlined"
          />
          <br/>
        </div>
        <Button 
          className={classes.searchButton}
          onClick={handleDrawerClose}
        >
          Search
        </Button>
      </Drawer>
    </div>
  );
}

export default withStyles(styles)(AdvancedSearch);
