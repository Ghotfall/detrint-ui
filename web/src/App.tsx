import React from 'react';
import './App.css';
import {Tabs} from "@mantine/core";
import {FileSettings, Package, Server2} from "tabler-icons-react";
import {InventoryTab} from "./InventoryTab";
import {StateTab} from "./StateTab";
import {DeployTab} from "./DeployTab";

export const api_endpoint = "http://127.0.0.1:7058"

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
                <StateTab/>
            </Tabs.Tab>

            <Tabs.Tab label={"Deployment"} color={"red"} icon={<Server2 size={20}/>}>
                <DeployTab/>
            </Tabs.Tab>
        </Tabs>
    );
}

export default App;
