import React from 'react';
import { Box } from '@material-ui/core';
import styled from "styled-components";

const CustomButton = ({str, width, height, color, bgcolor, fsize, fstyle, fweight, bradius, border, ...props }) => {
    return (
        <StyledComponent  width={width} height={height} color={color} bgcolor={bgcolor} fontSize={fsize} fweight={fweight} borderRadius={bradius} border={border} boxSizing={"border-box"} {...props}>
            {str}
        </StyledComponent>
    );
}

const StyledComponent = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
    white-space: nowrap;
    &:hover{
        box-shadow: 0 5px 5px rgb(0 0 0 / 30%);
        cursor: pointer;
        transition: .2s;
    }
    font-family: "Inter",sans-serif;
`

export default CustomButton;
