import {Badge, Button, Container, Grid, Group, ScrollArea, Stack, Text, Title} from "@mantine/core";
import React, {useState} from "react";
import {Upload} from "tabler-icons-react";
import {Dropzone, DropzoneStatus} from "@mantine/dropzone";

declare interface Inventory {
    Machines: { [key: string]: Machine};
    Groups: { [key: string]: Groups};
}

declare interface Machine {
    Address: string;
    Username: string;
    Password: string;
    Variables: { [key: string]: any};
}

declare interface Groups {
    Members: string[];
    Variables: { [key: string]: any};
}

declare interface CurrentObj {
    Name: string;
    Obj: Machine | Groups | null
}

export function InventoryTab() {
    const [inv, setInv] = useState<Inventory>({Groups: {}, Machines: {}});
    const [current, setCurrent] = useState<CurrentObj>({Name: "", Obj: null});

    function DropzoneStatus(status: DropzoneStatus) {
        return <Group position={"center"}>
            <Upload size={20}/>
            <Text>
                Open inventory file
            </Text>
        </Group>;
    }

    function uploadInventory(files: File[]) {
        const formData = new FormData()
        formData.append("file", files[0])

        fetch(
            "http://127.0.0.1:7058/upload",
            {method: 'POST', body: formData}
        )
            .then(r => r.json() as Promise<Inventory>)
            .then(r => {
                setInv(r)
                console.log(r)
            })
            .catch(reason => console.log(reason))
    }

    function getMachines() {
        const m = Object.entries(inv.Machines)

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
        const m = Object.entries(inv.Groups)

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
        } else if ('Address' in e.Obj) {
            return <Stack>
                <Title>{e.Name}</Title>
                <Text>{e.Obj.Address}</Text>
                <Text>{e.Obj.Username}</Text>
                <Text>{e.Obj.Password}</Text>
                {Object.entries(e.Obj.Variables).map(([key, value]) => <Text>{key}</Text>)}
            </Stack>
        } else if ('Members' in e.Obj) {
            return <Stack>
                <Title>{e.Name}</Title>
                <Text>{e.Obj.Members}</Text>
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