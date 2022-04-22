import React from 'react';
import './App.css';
import {Container, Tabs} from "@mantine/core";
import {FileSettings, Package, Server2} from "tabler-icons-react";
import {InventoryTab} from "./InventoryTab";

function App() {
    return (
        <Tabs position={"center"} grow styles={theme => ({
            tabControl: {
                fontSize: theme.fontSizes.md
            }
        })}>
            <Tabs.Tab label={"Inventory"} color={"green"} icon={<Package size={20}/>}>
                <InventoryTab/>
            </Tabs.Tab>

            <Tabs.Tab label={"State"} color={"blue"} icon={<FileSettings size={20}/>}>
                <Container>
                    State
                </Container>
            </Tabs.Tab>

            <Tabs.Tab label={"Deployment"} color={"red"} icon={<Server2 size={20}/>}>
                <Container>
                    Deployment
                </Container>
            </Tabs.Tab>
        </Tabs>
    );
}

export default App;
