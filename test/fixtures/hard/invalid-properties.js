import styled, { css } from 'styled-components';
import React from 'react'

export default props => {
  const CirclePrimitive = styled.div`
    // next line has wrong property
    widthh: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    ${props.rotate && css`
      -webkit-transform: rotate(${props.rotate}deg);
      -ms-transform: rotate(${props.rotate}deg);
      transform: rotate(${props.rotate}deg);
    `}

    &:before {
      content: '';
      display: block;
      margin: 0 auto;
      width: 15%;
      height: 15%;
      // next line has wrong property
      background-colorr: #333;
      border-radius: 100%;
      animation: ${animations.spinnerCircle} 1.2s infinite ease-in-out both;
      ${props.delay && css`
        -webkit-animation-delay: ${props.delay}s;
        animation-delay: ${props.delay}s;
      `}
    }
  `
  return React.createElement(CirclePrimitive)
}
