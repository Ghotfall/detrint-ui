import {Badge, Container, Grid} from "@mantine/core";
import React from "react";
import {Prism} from "@mantine/prism";

const logs = `
{"level":"info","ts":1651926054.277951,"caller":"state/base_structs.go:24","msg":"Starting state deployment","state":"Install web server"}
{"level":"info","ts":1651926054.2784572,"caller":"state/base_structs.go:27","msg":"Resolved host","hosts":{"server1":{"Address":"127.0.0.1","Username":"Test","Password":"Adm123","Variables":null}}}
{"level":"info","ts":1651926054.289967,"caller":"state/base_structs.go:97","msg":"Scripts to execute","scripts":["script1"]}
{"level":"info","ts":1651926054.2904816,"caller":"state/base_structs.go:99","msg":"Executing script","script":"script1"}
{"level":"warn","ts":1651926054.2920518,"caller":"reflect/value.go:556","msg":"Script 1 is started!"}
{"level":"info","ts":1651926054.4633517,"caller":"reflect/value.go:556","msg":"DESKTOP-RC0NMC0\\r\\n"}
`

export function DeployTab() {
    return <Container>
        <Grid columns={5}>
            <Grid.Col xs={5} sm={4}>
                <Badge fullWidth variant={"filled"}>
                    Running 'something'...
                </Badge>
            </Grid.Col>

            <Grid.Col xs={5} sm={1}>
                <Badge fullWidth variant={"filled"} color={"green"}>
                    5/14
                </Badge>
            </Grid.Col>

            <Grid.Col xs={5} sm={5}>
                <Prism language={"json"} withLineNumbers copyLabel={'Copy logs'} copiedLabel={'Logs copied'}>
                    {logs}
                </Prism>
            </Grid.Col>

        </Grid>
    </Container>;
}