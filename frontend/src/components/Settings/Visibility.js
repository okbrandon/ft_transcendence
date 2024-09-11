import React from "react";
import { Form, SectionHeading, SubSectionHeading } from "./styles/Settings.styled";

const Visibility = () => {
    return (
        <Form>
            <SectionHeading>Visibility</SectionHeading>
            <SubSectionHeading>Blocked Users</SubSectionHeading>
            <p>List of people you've blocked will appear here...</p>
        </Form>
    );
};

export default Visibility;
