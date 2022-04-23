import {Badge, Button, Container, Grid, Group, ScrollArea, Stack, Text} from "@mantine/core";
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

export function InventoryTab() {
    const [inv, setInv] = useState<Inventory>({Groups: {}, Machines: {}});

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

                    {/*<Button color={"green"} variant={"outline"} fullWidth leftIcon={<Upload size={20}/>}>*/}
                    {/*    Open inventory file*/}
                    {/*</Button>*/}

                    <ScrollArea style={{flex: 1}}>
                        <Stack spacing={"xs"}>
                            <Badge color={"green"} variant={"dot"}>Servers</Badge>
                            {
                                Object
                                    .entries(inv.Machines)
                                    .map(([key, value]) =>
                                        <Button
                                            key={key}
                                            color={"gray"}
                                            variant={"subtle"}
                                            onClick={() => console.log(value)}
                                        >
                                            {key}
                                        </Button>
                                    )
                            }
                            <Badge color={"blue"} variant={"dot"}>Groups</Badge>
                            <Button color={"gray"} variant={"subtle"}>test</Button>
                            <Button color={"gray"} variant={"subtle"}>test</Button>
                            <Button color={"gray"} variant={"subtle"}>test</Button>
                            <Button color={"gray"} variant={"subtle"}>test</Button>
                            <Button color={"gray"} variant={"subtle"}>test</Button>
                            <Button color={"gray"} variant={"subtle"}>test</Button>
                            <Button color={"gray"} variant={"subtle"}>test</Button>
                        </Stack>
                    </ScrollArea>
                </Stack>
            </Grid.Col>

            <Grid.Col xs={3} sm={2}>
                Inventory
            </Grid.Col>
        </Grid>
    </Container>;
}