import React, { useEffect, useState } from "react";
import { Form, SectionHeading } from "./styles/Settings.styled";
import API from "../../api/api";

const Privacy = () => {
    const [askData, setAskData] = useState(false);

    useEffect(() => {
        API.get('/users/@me/harvest')
            .then((res) => {
                console.log('Harvested data:', res.data);
            })
            .catch((err) => {
                console.error('Failed to harvest data:', err);
            })
    }, []);

    return (
        <Form>
            <SectionHeading>Data Privacy</SectionHeading>
            <p>Here you can download all your data...</p>
        </Form>
    );
};

export default Privacy;
