import {Badge, Container, Grid, MantineColor} from "@mantine/core";
import React, {useEffect, useState} from "react";
import {Prism} from "@mantine/prism";
import {api_endpoint} from "./App";
import {showNotification} from "@mantine/notifications";

declare interface DplResponse {
    logs: string;
    count: string;
}

export function DeployTab() {
    const default_status = "Deployment is not started"
    const completed_status = "Deployment is completed"
    const default_count = "0/0"
    const default_logs = `{"message": "No logs available"}`

    const [deploy_status, setDplStatus] = useState<string>(default_status);
    const [deploy_count, setDplCount] = useState<string>(default_count);
    const [deploy_logs, setDplLogs] = useState<string>(default_logs);

    useEffect(() => {
        checkDeploymentStatus()
    }, [])

    function checkDeploymentStatus() {
        fetch(api_endpoint + "/dpl", {method: 'GET'})
            .then(r => r.json() as Promise<DplResponse>)
            .then(r => {
                if (r.logs === '') {
                    setDplCount(default_count)
                    setDplStatus(default_status)
                    setDplLogs(default_logs)
                } else {
                    setDplCount(r.count)
                    setDplStatus(completed_status)
                    setDplLogs(r.logs)
                }
            })
            .catch(reason => {
                showNotification({
                    title: 'An error occurred!',
                    message: String(reason)
                })
                setDplCount(default_count)
                setDplStatus(default_status)
            })
    }

    function getCountElem() {
        let color: MantineColor
        if (deploy_count === default_count) {
            color = "red"
        } else {
            color = "green"
        }

        return <Badge fullWidth variant={"filled"} color={color}>
            {deploy_count}
        </Badge>;
    }

    function getStatusElem() {
        let color: MantineColor
        if (deploy_status === default_status) {
            color = "orange"
        } else {
            color = "blue"
        }

        return <Badge fullWidth variant={"filled"} color={color}>
            {deploy_status}
        </Badge>;
    }

    return <Container>
        <Grid columns={5}>
            <Grid.Col xs={5} sm={4}>
                {getStatusElem()}
            </Grid.Col>

            <Grid.Col xs={5} sm={1}>
                {getCountElem()}
            </Grid.Col>

            <Grid.Col xs={5} sm={5}>
                <Prism language={"json"} withLineNumbers copyLabel={'Copy logs'} copiedLabel={'Logs copied'}>
                    {deploy_logs}
                </Prism>
            </Grid.Col>

        </Grid>
    </Container>;
}