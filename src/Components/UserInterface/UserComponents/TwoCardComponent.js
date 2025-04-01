import React from "react"
import { ServerURL } from "../../Services/NodeServices"
import { useNavigate } from "react-router"
export default function TwoCardComponent(props){
  var navigate = useNavigate()
  const handleClick = (scid, icon) => {
    navigate(`/${props.url}/${scid}/${icon}`)
  }
  return props.data.map((item)=>{

        return(
              <div onClick={() => handleClick(item.subcategoryid, 'twoimagebanner.webp')} style={{padding:2,margin:3,position:'relative', width:580,height:350,cursor: 'pointer',textAlign:'center'}}>
                <img title={item.categoryname} src={`${ServerURL}/images/${item.subcategoryicon}`} style={{width:'100%',height:'100%'}}/>
                <div style={{fontSize:20,fontWeight:'bold',position:'absolute',top:'92%',width:'99.3%',color:'#FFF',zIndex:1,background:'#0000002e'}}>{item.subcategoryname}</div>
              </div>      
        )})
       
}