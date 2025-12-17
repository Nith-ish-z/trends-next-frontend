import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";

export default function Footer(){
    return (
        <footer className="bg-dark text-white">
            <Container fluid>
            <Row className="ps-5 pt-4">
                <Col xl={6} >
                    <div style={{}}>
                    <h4>Flapkart online Fashion store</h4>
                    <p>
                        123, street name, <br />
                        Area Name, <br />
                        City name, <br />
                        123 456.
                    </p>
                    </div>
                </Col>
                <Col xl={6} style={{alignContent:'center'}}>
                    <p>@All Rights reserved</p>
                </Col>
            </Row>
            </Container>
        </footer>
    )
}