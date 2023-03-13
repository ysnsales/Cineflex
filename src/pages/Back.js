import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import * as url from "../assets/arrow-back-outline.svg"

export default  function Back(){
    const navigate = useNavigate();
    const route = window.location.href;
    return(
        <BackContainer route={route}>
        <img src={url.default} data-test="go-home-header-btn"
            onClick={() => navigate(-1)} />
        </BackContainer>
    )

}

const BackContainer = styled.div`
display: ${props => (props.route.endsWith("/") || props.route.endsWith("sucesso")) ? "none" : "flex"};  
align-items: center;
justify-content: center;
background-color: #C3CFD9;
position: fixed;
top: 3px;
z-index: 1;
img{
    width: 55px;
    height: 61px;
}
`