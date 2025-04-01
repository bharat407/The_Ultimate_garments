import React from "react"
import { ServerURL } from "../../Services/NodeServices"
import { useNavigate } from "react-router"
export default function OneCardComponent(props) {
  var navigate = useNavigate()
  const handleClick = (scid, icon) => {
    navigate(`/${props.url}/${scid}/${icon}`)
  }

  return props.data.map((item) => {
    return (
      <div onClick={() => handleClick(item.subcategoryid, item.subcategoryicon)} style={{ padding: 2, margin: 3, position: 'relative', width: 1235, height: 'auto', cursor: 'pointer', marginBottom: 37 }}>
        <img title={item.categoryname} src={`${ServerURL}/images/${item.subcategoryicon}`} style={{ width: '100%', height: '100%' }} />
      </div>
    )
  })
}

