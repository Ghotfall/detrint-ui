import {Badge, Button, Container, Grid, Group, ScrollArea, SimpleGrid, Stack, Text, Title} from "@mantine/core";
import React, {useEffect, useState} from "react";
import {Upload} from "tabler-icons-react";
import {Dropzone, DropzoneStatus} from "@mantine/dropzone";
import {api_endpoint} from "./App";
import {showNotification} from "@mantine/notifications";

declare interface Inventory {
    machines: { [key: string]: Machine };
    groups: { [key: string]: Groups };
}

declare interface Machine {
    address: string;
    username: string;
    password: string;
    variables?: { [key: string]: any };
}

declare interface Groups {
    members: string[];
    variables?: { [key: string]: any };
}

declare interface InvResponse {
    available: boolean;
    inventory?: Inventory;
}

declare interface CurrentObj {
    Name: string;
    Obj: Machine | Groups | null
}

export function InventoryTab() {
    const [inv, setInv] = useState<Inventory>({groups: {}, machines: {}});
    const [current, setCurrent] = useState<CurrentObj>({Name: "", Obj: null});

    useEffect(() => {
        checkInventory()
    }, [])

    function checkInventory() {
        fetch(api_endpoint + "/inv?full=true", {method: 'GET'})
            .then(r => r.json() as Promise<InvResponse>)
            .then(r => {
                if (r.available && r.inventory !== undefined) {
                    setInv(r.inventory)
                } else {
                    setInv({groups: {}, machines: {}})
                }
            })
            .catch(reason => {
                showNotification({
                    title: 'An error occurred!',
                    message: String(reason)
                })
                setInv({groups: {}, machines: {}})
            })
    }

    function DropzoneStatus(status: DropzoneStatus) {
        return <Group position={"center"}>
            <Upload size={20}/>
            <Text>
                Open inventory file
            </Text>
        </Group>;
    }

    async function uploadInventory(files: File[]) {
        const formData = new FormData()
        formData.append("inv", files[0])

        await fetch(
            api_endpoint + "/inv",
            {method: 'POST', body: formData}
        )
            .then(r => {
                if (r.status === 201) {
                    showNotification({
                        title: 'Inventory upload',
                        message: 'Inventory has been uploaded!'
                    })
                } else {
                    showNotification({
                        title: 'Inventory upload',
                        message: 'Failed to upload inventory. Status: ' + r.status
                    })
                }
            })
            .catch(reason => console.log(reason))

        checkInventory()
    }

    function getMachines() {
        const m = Object.entries(inv.machines)

        return m.length ? m
            .map(([key, value]) =>
                <Button
                    key={key}
                    color={"gray"}
                    variant={"subtle"}
                    onClick={() => setCurrent({Name: key, Obj: value})}
                >
                    {key}
                </Button>
            ) : <Text align={"center"}>No servers</Text>;
    }

    function getGroups() {
        const m = Object.entries(inv.groups)

        return m.length ? m
            .map(([key, value]) =>
                <Button
                    key={key}
                    color={"gray"}
                    variant={"subtle"}
                    onClick={() => setCurrent({Name: key, Obj: value})}
                >
                    {key}
                </Button>
            ) : <Text align={"center"}>No groups</Text>;
    }

    function showInfo(e: CurrentObj) {
        if (e.Obj == null) {
            return <Text>Select server or group</Text>
        } else if ('address' in e.Obj) {
            return <Stack>
                <Title order={2} align={"center"}>{e.Name}</Title>

                <Title order={5} align={"center"}>Data</Title>

                <SimpleGrid cols={2}>
                    <Text align={"right"} color={"green"}>Address:</Text>
                    <Text>{e.Obj.address}</Text>

                    <Text align={"right"} color={"green"}>Username (reserved):</Text>
                    <Text>{e.Obj.username}</Text>

                    <Text align={"right"} color={"green"}>Password (reserved):</Text>
                    <Text>{e.Obj.password}</Text>
                </SimpleGrid>

                <Title order={5} align={"center"}>Variables</Title>

                <SimpleGrid cols={2}>
                    {e.Obj.variables !== undefined
                        ? Object.entries(e.Obj.variables).map(
                            ([key, value]) =>
                                <>
                                    <Text align={"right"} color={"green"}>{key}</Text>
                                    <Text>{String(value)}</Text>
                                </>)
                        : <Text>No variables</Text>}
                </SimpleGrid>
            </Stack>
        } else if ('members' in e.Obj) {
            return <Stack>
                <Title order={2} align={"center"}>{e.Name}</Title>

                <Title order={5} align={"center"}>Data</Title>

                <SimpleGrid cols={2}>
                    <Text align={"right"} color={"blue"}>Members</Text>
                    <Text>
                    {e.Obj.members.length !== 0
                        ? e.Obj.members.join(', ')
                        : 'No members'}
                    </Text>
                </SimpleGrid>

                <Title order={5} align={"center"}>Variables</Title>

                <SimpleGrid cols={2}>
                    {e.Obj.variables !== undefined
                        ? Object.entries(e.Obj.variables).map(
                            ([key, value]) =>
                                <>
                                    <Text align={"right"} color={"green"}>{key}</Text>
                                    <Text>{String(value)}</Text>
                                </>)
                        : <Text>No variables</Text>}
                </SimpleGrid>
            </Stack>
        }
    }

    return <Container>
        <Grid columns={3}>
            <Grid.Col xs={3} sm={1}>
                <Stack style={{height: '90vh'}}>
                    <Dropzone
                        onDrop={uploadInventory}
                        onReject={files => console.log("Rejected:" + files[0].file.name)}
                        maxSize={1024 ** 2}
                        accept={[".toml"]}
                        multiple={false}
                    >
                        {status => DropzoneStatus(status)}
                    </Dropzone>

                    <ScrollArea style={{flex: 1}}>
                        <Stack spacing={"xs"}>
                            <Badge color={"green"} variant={"dot"}>Servers</Badge>
                            {getMachines()}
                            <Badge color={"blue"} variant={"dot"}>Groups</Badge>
                            {getGroups()}
                        </Stack>
                    </ScrollArea>
                </Stack>
            </Grid.Col>

            <Grid.Col xs={3} sm={2}>
                {showInfo(current)}
            </Grid.Col>
        </Grid>
    </Container>;
}