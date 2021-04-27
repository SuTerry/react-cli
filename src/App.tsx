import React, { ReactElement } from 'react'

export default (): ReactElement => {
  return (<h1 onClick={() => { alert(1111) }}>1111</h1>)
}
