import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import FormControlLabel from '@mui/material/FormControlLabel';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { FormControl, Radio, RadioGroup } from '@material-ui/core';
import { getData, postData } from '../../Services/NodeServices';

const AccordionStyle = {
  '&:before': {
    backgroundColor: 'transparent !important',
    border: 'none',

  },
};

export default function FilterComponent(props) {

  const fetchAllProduct = async (ch) => {
    var result
    if (ch == 1)
      result = await getData("userinterface/fetch_all_productLTH")
    else
      result = await getData("userinterface/fetch_all_productHTL")

    props.setProductList(result.data)
  }

  const handleRadioLTH = () => {
    fetchAllProduct(1)
  }
  const handleRadioHTL = () => {
    fetchAllProduct(2)
  }

  const fetchAllSize = async (size) => {
    var result = await postData("userinterface/fetch_all_size_by_size", { size: size })
    props.setProductList(result.data)

  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        '& > :not(style)': {
          m: 1,
          width: 500,
          height: 600,
        },
      }}
    >
      <Paper elevation={1}>

        <div style={{ fontSize: '18px', letterSpacing: '1px', fontWeight: 600, color: '#434343', textTransform: 'uppercase', marginLeft: '3%' }}>
          <p>FILTER</p>
        </div>


        <Accordion sx={AccordionStyle} elevation={0}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <div style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '1px', color: '#434343', textTransform: 'uppercase' }}>
              <p>SIZE</p>
            </div>

          </AccordionSummary>
          <AccordionDetails>

            <FormControl>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
              >
                <FormControlLabel value="S" control={<Radio onChange={() => fetchAllSize('S')} />} label="S" />
                <FormControlLabel value="M" control={<Radio onChange={() => fetchAllSize('M')} />} label="M" />
                <FormControlLabel value="L" control={<Radio onChange={() => fetchAllSize('L')} />} label="L" />
                <FormControlLabel value="XS" control={<Radio onChange={() => fetchAllSize('XS')} />} label="XS" />
                <FormControlLabel value="XL" control={<Radio onChange={() => fetchAllSize('XL')} />} label="XL" />
                <FormControlLabel value="XXL" control={<Radio onChange={() => fetchAllSize('XXL')} />} label="XXL" />
              </RadioGroup>
            </FormControl>

          </AccordionDetails>
        </Accordion>

        <Accordion sx={AccordionStyle} elevation={0}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >

            <div style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '1px', color: '#434343', textTransform: 'uppercase' }}>
              <p>PRICE</p>
            </div>

          </AccordionSummary>
          <AccordionDetails>
            <div>
              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  name="radio-buttons-group"
                >
                  <FormControlLabel value="LTH" control={<Radio onChange={() => handleRadioLTH()} />} label="Low to High" />
                  <FormControlLabel value="HTL" control={<Radio onChange={() => handleRadioHTL()} />} label="High to Low" />
                </RadioGroup>
              </FormControl>
            </div>
          </AccordionDetails>
        </Accordion>

      </Paper>
    </Box>
  );
}

