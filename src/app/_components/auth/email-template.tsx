import {
    Body,
    Button,
    Container,
    Column,
    Head,
    Heading,
    Html,
    Img,
    Preview,
    Row,
    Section,
    Text,
    Link
} from "@react-email/components";
import React from "react";

const EmailTemplate = async ({ verificationLink, emailText, preview, btnText }) => {

    return (
        <Html>
            <Head />
            <Preview>{preview}</Preview>
            <Body style={main}>
                <Container>

                    <Section style={content}>
                        <Section style={logo}>
                            <Img src={`https://app.kyndom.com/img/logo.png`} alt="logo" width={100} />
                        </Section>

                        <Row style={{ ...boxinfos1, paddingBottom: "0" }}>
                            <Column>
                                <Heading
                                    style={{
                                        fontSize: 32,
                                        fontWeight: "bold",
                                        textAlign: "center",
                                    }}
                                >
                                    Welcome to Kyndom!
                                </Heading>

                                <Text style={paragraph}>
                                    {emailText}
                                </Text>
                            </Column>
                        </Row>
                        <Row style={{ ...boxInfos, paddingTop: "0" }}>
                            <Column style={containerButton}>
                                <Link href={verificationLink} style={button}>{btnText}</Link>
                            </Column>
                        </Row>
                        <Row style={{ ...boxInfos, paddingTop: "0" }}>
                            <Column>
                                <Text style={paragraph}>
                                    For more information see our website <Link href="https://app.kyndom.com/">app.kyndom.com</Link>
                                </Text>
                            </Column>
                        </Row>
                    </Section>
                    <Text
                        style={{
                            textAlign: "center",
                            fontSize: 12,
                            color: "rgb(0,0,0, 0.7)",
                        }}
                    >
                        Copyright © 2024 Kyndom | Powered by Knydom | <Link href="https://app.kyndom.com/dashboard/privacy-policy">Privacy policy</Link> | <Link href="https://app.kyndom.com/dashboard/terms-and-conditions">Terms and Conditions</Link>
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

export default EmailTemplate;

const main = {
    backgroundColor: "#fff",
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const paragraph = {
    fontSize: 16,
};

const logo = {
    padding: "20px",
};

const containerButton = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
};

const button = {
    backgroundColor: "#005F31",
    borderRadius: 3,
    color: "#FFF",
    fontWeight: "bold",
    border: "1px solid #005F31",
    cursor: "pointer",
    padding: "12px 30px",
    display: "flex",
};

const content = {
    border: "1px solid rgb(0,0,0, 0.1)",
    borderRadius: "3px",
    overflow: "hidden",
};

const image = {
    maxWidth: "100%",
};

const boxinfos1 = {
    padding: "0 20px 20px 20px",
};

const boxInfos = {
    padding: "0 20px 20px 20px",
};

const containerImageFooter = {
    padding: "45px 0 0 0",
};