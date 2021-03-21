import React, {useState, useEffect}  from 'react';
import { withStyles } from '@material-ui/styles';
import { AppBar, Toolbar, Grid, FormControlLabel, Container, TextField, ButtonGroup, Button, Link, IconButton, Card, Typography } from '@material-ui/core';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Autocomplete from '@material-ui/lab/Autocomplete';
import axios from 'axios'

import useCommanders from '../../utils/useCommanders';
import { CommanderCard } from 'components';

import styles from './style';

type Props = {
    classes: Object,
  };
  
  const UploadList = ({ classes }: Props) => {
    // get authentication token. You can use the token to now POST to http://api.cdhrec.com/wp-json/wp/v2/decks &  http://api.cdhrec.com/wp-json/acf/v3/decks/[your deck id]
    const apiAuth = localStorage && localStorage.getItem && localStorage.getItem('apiCdhRec') ? JSON.parse(localStorage.getItem('apiCdhRec')) : false;

    // Initialize the state variables
    const[commanderSelected, setCommander] = useState({});
    const[partnerSelected, setPartner] = useState({});
    const[deckList, setDeck] = useState("");
    const[decktitle, setTitle] = useState("");

    // A collection of all the commanders in the cdh xml
    const { allWpCard } = useCommanders();

    // All the commanders flatened into an object used by the auto complete
    const flattenedList = allWpCard.edges.map(({node})=>{
      const flatObj = {
        name: node.cdhCards.name,
        muid: node.cdhCards.set.muid,
        coloridentity: node.cdhCards.prop.coloridentity,
        featuredImage: node.featuredImage ? node.featuredImage : node.cdhCards.set.picurl,
        flipCard: node.flipCard,
        cdhCards: node.cdhCards,
      };
      return flatObj;
    });

    const formattedDeckList = () => {
      const formatted = [];
      const deckItems = deckList.split('\n');
      deckItems.forEach((lineItem) => {
        // Validate the line item. Do we want a regex thing or do we want to assign it a thing?
        let splitItem = lineItem.split(' ');
        let cleanedFirst = parseInt(splitItem[0], 10);
        // Check the first segment
        if (cleanedFirst) {
          formatted.push({
            number: cleanedFirst,
            cardname: lineItem.replace(`${splitItem[0]} `, ''),
          });
        } else {
          // If there is no number at the beginning of the line time, assume 1
          formatted.push({
            number: 1,
            cardname: lineItem,
          });
        }
      });
      return formatted;
    };

    // Handle submitting the deck
    const submitList = async () => {
      const localData = localStorage.getItem('apiCdhRec', {});
      let cmdr = commanderSelected.name;
      if (partnerSelected.name) {
        cmdr = `${commanderSelected.name}//${partnerSelected.name}`
      }

      // Create the deck and save the ID for later
      const deckIdResp = await axios.post('http://api.cdhrec.com/wp-json/wp/v2/decks', {}, {headers: {'Authorization': `Bearer ${apiAuth.token}`}});

      const deckIdResp = { data: {id: 26702 }};

      let bodyData = {
        fields: {
          title: decktitle,
          commmander: cmdr,
          author: localData.user_nicename,
          deckList: formattedDeckList()
        }
      };

      console.log('Whats this look like ', JSON.stringify(bodyData));
      
      await axios.post(`http://api.cdhrec.com/wp-json/acf/v3/decks/${deckIdResp.data.id}`, JSON.stringify(bodyData), 
        {headers: {
          'Authorization': `Bearer ${apiAuth.token}`,
          'Content-Type': 'application/json'}
        })
      .then(response => {
        console.log('response data', response.data);
      });
    };
  
    const renderRecForm = ()=>(<>
      <form noValidate autoComplete="off" onSubmit={submitList}>
        <Grid 
          container
          direction="row"
        >     
          <Grid container direction="column" className={classes.mobileSpacerFlex}>
            {commanderSelected.name && (
              <CommanderCard card={commanderSelected}/>
            )}
            <Autocomplete
              className={classes.cardSelect}
              id="commander-select"
              name="commander-select"
              disableClearable={true}
              options={flattenedList}
              getOptionLabel={(c) => c.name}
              getOptionSelected={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  id="commander"
                  name="commander"
                  variant="outlined"
                  label="Select Commander"
                  placeholder="Kard, The Seeking"
                />
              )}
              onChange={(event, val)=>setCommander(val)}
            />
            <Autocomplete
              className={classes.cardSelect}
              id="partner-select" 
              name="partner-select"
              label="Partner (optional)" 
              placeholder='"Kard, The Seeking"'
              disableClearable={true}
              options={flattenedList}
              getOptionLabel={(c) => c.name}
              renderInput={(params) => 
                <TextField
                  {...params}
                  id="partner" 
                  label="Partner (optional)" 
                  variant="outlined" 
                />
              }
              onChange={(event, val)=>setPartner(val)}
            />
            <Typography className={classes.reminderText}>
              List must contain 100 cards (1 commander and 99 cards OR 2 commanders and 98 cards)<br/><br/>
              Accceptable formats:<br/>
              1x Counterspell<br/>
              1 Counterspell<br/>
              Counterspell<br/><br/>
              Don't forget your lands!
            </Typography>        
          </Grid>
          <Grid container direction="column" className={classes.mobileSpacerFlex}>
            <TextField 
              className={classes.cardSelect}
              name="title"
              label="Deck Title" 
              placeholder='"Visin and the Bird Gang"'
              onChange={(event)=>setTitle(event.target.value)}
              variant="outlined"
            />
            <TextareaAutosize
              className={classes.deckInput} 
              id="deck-list"
              name="deck-list"
              label="Deck List" 
              placeholder=''
              rowsMin={50}
              inputlabelprops={{
                focused: true,
                width: '500px',
                height: '800px',
              }}
              variant="outlined"
              onChange={(event)=>setDeck(event.target.value)}
            />
            <input type="button" className={classes.btn} onClick={submitList} value="Submit" />
          </Grid>
      </Grid>
    </form>
    </>)
  

    return (
      <Container className={classes.container} >
        <Card className={classes.toolbar}>
          <Typography variant='h1' className={classes.uploadTitle} color='textPrimary'>
            Upload a deck list Reccomendation
          </Typography>
          {renderRecForm()}
        </Card>
        
      </Container>
    );
  };
  
  export default withStyles(styles)(UploadList);