import {
    Badge,
    Button,
    Container,
    Grid,
    Group,
    MantineGradient,
    ScrollArea,
    SimpleGrid,
    Stack,
    Text,
    Title
} from "@mantine/core";
import React, {useEffect, useState} from "react";
import {Dropzone, DropzoneStatus} from "@mantine/dropzone";
import {Upload} from "tabler-icons-react";
import {api_endpoint} from "./App";
import {showNotification} from "@mantine/notifications";

declare interface State {
    hosts: string;
    scripts: string[];
}

declare interface SttResponse {
    available: boolean;
    state_set?: { [key: string]: State };
}

declare interface CurrentObj {
    Name: string;
    Obj: State | null
}

export function StateTab() {
    const [stt, setStt] = useState<{ [key: string]: State } | null>(null);
    const [current, setCurrent] = useState<CurrentObj>({Name: "", Obj: null});

    useEffect(() => {
        checkState()
    }, [])

    function checkState() {
        fetch(api_endpoint + "/stt?full=true", {method: 'GET'})
            .then(r => r.json() as Promise<SttResponse>)
            .then(r => {
                if (r.available && r.state_set !== undefined) {
                    setStt(r.state_set)
                } else {
                    setStt(null)
                }
            })
            .catch(reason => {
                showNotification({
                    title: 'An error occurred!',
                    message: String(reason)
                })
                setStt(null)
            })
    }

    async function uploadStateFile(files: File[]) {
        const formData = new FormData()
        formData.append("stt", files[0])

        await fetch(
            api_endpoint + "/stt",
            {method: 'POST', body: formData}
        )
            .then(r => {
                if (r.status === 201) {
                    showNotification({
                        title: 'State file upload',
                        message: 'State set has been uploaded!'
                    })
                } else {
                    showNotification({
                        title: 'State file upload',
                        message: 'Failed to upload state set. Status: ' + r.status
                    })
                }
            })
            .catch(reason => console.log(reason))

        checkState()
    }

    function getStates() {
        const no_elems = <Text align={"center"}>No states</Text>

        if (stt == null)
            return no_elems

        const m = Object.entries(stt)

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
            ) : no_elems;
    }

    function showInfo(e: CurrentObj) {
        if (e.Obj == null) {
            return <Text>Select state</Text>
        } else {
            return <Stack>
                <Title order={2} align={"center"}>{e.Name}</Title>

                <Title order={5} align={"center"}>Data</Title>

                <SimpleGrid cols={2}>
                    <Text align={"right"} color={"green"}>Hosts:</Text>
                    <Text>{e.Obj.hosts}</Text>

                    <Text align={"right"} color={"green"}>Scripts:</Text>
                    <Text>{e.Obj.scripts.join(', ')}</Text>
                </SimpleGrid>
            </Stack>
        }
    }

    function getDeployStatus() {
        let status_text: string
        let status_gradient: MantineGradient

        if (stt != null) {
            status_text = 'Ready to deploy'
            status_gradient = {from: 'teal', to: 'blue'}
        } else {
            status_text = 'Not ready to deploy'
            status_gradient = {from: '#ed6ea0', to: '#ec8c69'}
        }

        return <Badge variant={"gradient"} gradient={status_gradient} fullWidth>
            {status_text}
        </Badge>
    }

    function DropzoneStatus(status: DropzoneStatus) {
        return <Group position={"center"}>
            <Upload size={20}/>
            <Text>
                Open state file
            </Text>
        </Group>;
    }

    return <Container>
        <Grid columns={3}>
            <Grid.Col xs={3} sm={3}>
                <SimpleGrid cols={2} sx={theme => ({
                    padding: theme.spacing.xs
                })}>
                    <Dropzone
                        onDrop={uploadStateFile}
                        onReject={files => console.log("Rejected:" + files[0].file.name)}
                        maxSize={1024 ** 2}
                        accept={[".toml"]}
                        multiple={false}
                    >
                        {status => DropzoneStatus(status)}
                    </Dropzone>

                    <Button size={"xl"}>Deploy State</Button>
                </SimpleGrid>
            </Grid.Col>

            <Grid.Col xs={3} sm={1}>
                <Stack style={{height: '65vh'}}>

                    <ScrollArea style={{flex: 1}}>
                        <Stack spacing={"xs"}>
                            <Badge color={"blue"} variant={"dot"}>States</Badge>
                            {getStates()}
                        </Stack>
                    </ScrollArea>
                </Stack>
            </Grid.Col>

            <Grid.Col xs={3} sm={2}>
                {showInfo(current)}
            </Grid.Col>

            <Grid.Col xs={3} sm={3}>
                {getDeployStatus()}
            </Grid.Col>
        </Grid>
    </Container>;
}