import {Badge, Button, Container, Grid, Group, ScrollArea, Stack, Text} from "@mantine/core";
import React from "react";
import {Upload} from "tabler-icons-react";
import {Dropzone, DropzoneStatus} from "@mantine/dropzone";

export function InventoryTab() {
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
            .then(r => r.json())
            .then(r => console.log(r))
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
                            <Button color={"gray"} variant={"subtle"}>test</Button>
                            <Button color={"gray"} variant={"subtle"}>test</Button>
                            <Button color={"gray"} variant={"subtle"}>test</Button>
                            <Button color={"gray"} variant={"subtle"}>test</Button>
                            <Button color={"gray"} variant={"subtle"}>test</Button>
                            <Button color={"gray"} variant={"subtle"}>test</Button>
                            <Button color={"gray"} variant={"subtle"}>test</Button>
                            <Button color={"gray"} variant={"subtle"}>test</Button>
                            <Button color={"gray"} variant={"subtle"}>test</Button>
                            <Button color={"gray"} variant={"subtle"}>test</Button>
                            <Button color={"gray"} variant={"subtle"}>test</Button>
                            <Button color={"gray"} variant={"subtle"}>test</Button>
                            <Button color={"gray"} variant={"subtle"}>test</Button>
                            <Button color={"gray"} variant={"subtle"}>test</Button>
                            <Button color={"gray"} variant={"subtle"}>test</Button>
                            <Button color={"gray"} variant={"subtle"}>test</Button>
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