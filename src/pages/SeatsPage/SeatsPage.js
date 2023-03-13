import styled from "styled-components";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function SeatsPage() {

    const [sessionsInfo, setSessionsInfo] = useState(null);
    const { idSessao } = useParams();
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [nameSeats, setNameSeats] = useState([]);

    const [name, setName] = useState("");
    const [cpf, setcpf] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const promiseSeat = axios.get(`https://mock-api.driven.com.br/api/v8/cineflex/showtimes/${idSessao}/seats`);

        promiseSeat.then((response) => {
            setSessionsInfo(response.data)
        })
        promiseSeat.catch((response) => {
            console.log(response)
        })
    }, [])

    if (sessionsInfo === null || sessionsInfo.length === 0) {
        return (<div>"Carregando..."</div>)
    }

    function SelectSeat(isAvailable, id, name) {
        let newSelectedSeats = [...selectedSeats];
        let newNameSeats = [...nameSeats];
        if (!isAvailable) {
            alert("Esse assento não está disponível")

        } if (isAvailable && !selectedSeats.includes(id)) {
            setSelectedSeats([...selectedSeats, id]);
            setNameSeats([...nameSeats, Number(name)]);

        } if (isAvailable && selectedSeats.includes(id)) {
            newSelectedSeats.splice(newSelectedSeats.indexOf(id), 1);
            setSelectedSeats(newSelectedSeats);

            newNameSeats.splice(newSelectedSeats.indexOf(name), 1);
            setNameSeats(newNameSeats);

        }
    }

    function ReserveSeats(e) {
        e.preventDefault();
        if (selectedSeats.length != 0) {
            const ids = selectedSeats;
            const numbers = nameSeats;
            const post = { ids, name, cpf }
            const ordNumbers = numbers.sort(function (a, b) {
                if (a > b) { return 1 };
                if (a < b) { return -1 };
                return 0
            });

            const promisePost = axios.post("https://mock-api.driven.com.br/api/v8/cineflex/seats/book-many", post);
            promisePost.then(response => navigate("/sucesso", { state: { sessionsInfo: sessionsInfo, ordNumbers: ordNumbers, name: name, cpf: cpf, } }));

        } else {
            alert("Por favor, selecione o(s) assento(s).");
        }

    }

    return (
        <PageContainer>
            Selecione o(s) assento(s)

            <SeatsContainer>
                {sessionsInfo.seats.map((seat) => (
                    <SeatItem
                        data-test="seat" key={seat.id}
                        isAvailable={seat.isAvailable}
                        state={!seat.isAvailable ? "indisponivel" :
                            (selectedSeats.includes(seat.id) ? "selecionado" : "disponivel")}
                        onClick={() => SelectSeat(seat.isAvailable, seat.id, seat.name)}
                    >{seat.name}
                    </SeatItem>
                ))}
            </SeatsContainer>


            <CaptionContainer>
                <CaptionItem>
                    <CaptionCircle state="selecionado" />
                    Selecionado
                </CaptionItem>
                <CaptionItem>
                    <CaptionCircle state="disponivel" />
                    Disponível
                </CaptionItem>
                <CaptionItem>
                    <CaptionCircle state="indisponivel" />
                    Indisponível
                </CaptionItem>
            </CaptionContainer>

            <form onSubmit={ReserveSeats}>
                <FormContainer>


                    Nome do Comprador:
                    <input
                        data-test="client-name"
                        id="name"
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        placeholder="Digite seu nome..." />

                    CPF do Comprador:
                    <input
                        data-test="client-cpf"
                        id="cpf"
                        type="number"
                        value={cpf}
                        onChange={e => setcpf(e.target.value)}
                        required
                        placeholder="Digite seu CPF..." />

                    <button data-test="book-seat-btn" type="submit">Reservar Assento(s)</button>

                </FormContainer>
            </form>

            <FooterContainer data-test="footer">
                <div>
                    <img src={sessionsInfo.movie.posterURL} alt="poster" />
                </div>
                <div>
                    <p>{sessionsInfo.movie.title}</p>
                    <p>{sessionsInfo.day.weekday} - {sessionsInfo.name}</p>
                </div>
            </FooterContainer>

        </PageContainer>
    )
}

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Roboto';
    font-size: 24px;
    text-align: center;
    color: #293845;
    margin-top: 30px;
    padding-bottom: 120px;
    padding-top: 70px;
`
const SeatsContainer = styled.div`
    width: 330px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
`
const FormContainer = styled.div`
    width: calc(100vw - 40px); 
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 20px 0;
    font-size: 18px;
    button {
        align-self: center;
    }
    input {
        width: calc(100vw - 60px);
    }
`
const CaptionContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 300px;
    justify-content: space-between;
    margin: 20px;
`
const CaptionCircle = styled.div`
    border:${props => props.state === "selecionado" ? "1px solid #0E7D71;" :
        (props.state === "disponivel" ? "1px solid #7B8B99;" : "1px solid #F7C52B;")};

    background-color: ${props => props.state === "selecionado" ? "#1AAE9E;" :
        (props.state === "disponivel" ? "#C3CFD9;" : "#FBE192;")};

    height: 25px;
    width: 25px;
    border-radius: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px 3px;
`
const CaptionItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 12px;
`
const SeatItem = styled.div`

    
    border: ${props => {
        if (!props.isAvailable) {
            return ("1px solid #F7C52B;")
        } if (props.isAvailable && props.state === "disponivel") {
            return ("1px solid #808F9D;")
        } if (props.isAvailable && props.state === "selecionado") {
            return ("1px solid #0E7D71;")
        }
    }};
    background-color:  ${props => {
        if (!props.isAvailable) {
            return ("#FBE192;")
        } if (props.isAvailable && props.state === "disponivel") {
            return ("#C3CFD9;")
        } if (props.isAvailable && props.state === "selecionado") {
            return ("#1AAE9E;")
        }
    }};
    
    height: 25px;
    width: 25px;
    border-radius: 25px;
    font-family: 'Roboto';
    font-size: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px 3px;
`
const FooterContainer = styled.div`
    width: 100%;
    height: 120px;
    background-color: #C3CFD9;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 20px;
    position: fixed;
    bottom: 0;

    div:nth-child(1) {
        box-shadow: 0px 2px 4px 2px #0000001A;
        border-radius: 3px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: white;
        margin: 12px;
        img {
            width: 50px;
            height: 70px;
            padding: 8px;
        }
    }

    div:nth-child(2) {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        p {
            text-align: left;
            &:nth-child(2) {
                margin-top: 10px;
            }
        }
    }
`