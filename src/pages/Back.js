import { useNavigate } from "react-router-dom"
import styled from "styled-components"

export default  function Back(){
    const navigate = useNavigate();
    const route = window.location.href
    return(
        <BackContainer route={route}>
            <ion-icon data-test="go-home-header-btn" name="arrow-back-outline"
            onClick={() => navigate(-1)} />
        </BackContainer>
    )

}

const BackContainer = styled.div`
display: ${props => (props.route === "http://localhost:3000/" || props.route === "http://localhost:3000/sucesso") ? "none" : "flex"};  
align-items: center;
justify-content: center;
background-color: #C3CFD9;
position: fixed;
top: 3px;
z-index: 1;
ion-icon{
    width: 55px;
height: 61px;
}
`