import React, { useState,useEffect } from 'react';
import { ShoppingCart } from '@mui/icons-material';
import { Button } from '@mui/material';
import { Avatar } from '@material-ui/core';

export default function PlusMinusComponent(props) {
    const [value, setValue] = useState(props.value)

    useEffect(function() {
      setValue(props.value)
    },[props.value]);
    
    const handleClick = () => {
        if(props.value!=null){ 
         var v = value + 1
         setValue(v)
        }
        props.onChange(v)
    }
    const handlePlus = () => {
        var v=value
        if(v<5){
         v++
         setValue(v)
         props.onChange(v)
        }
    }
    const handleMinus = () => {
        var v=value
        if(v>=1){
         v--
        setValue(v)
        props.onChange(v)
        }
    }

    return (
        <>
            {value == 0 || value==null ? 
                <span>
                    <Button onClick={handleClick} fullWidth variant="contained" style={{height:'100%',background: '#51cccc', color: '#000' }} startIcon={<ShoppingCart />}>Add To Cart</Button>
                </span>
                : 
                <span style={{display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:18,fontWeight:600,width:120}}>
                    <Avatar onClick={handleMinus} style={{ background: '#51cccc',color:'black',cursor:'pointer' }} variant="circular">
                        -
                    </Avatar>
                    <span>{value}</span>
                    <Avatar onClick={handlePlus} style={{ background: '#51cccc',color:'black',cursor:'pointer' }} variant="circular">
                        +
                    </Avatar>
                </span>
            }
        </>
    );
}
