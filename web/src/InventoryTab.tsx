import {Badge, Button, Container, Grid, ScrollArea, Stack} from "@mantine/core";
import React from "react";
import {Upload} from "tabler-icons-react";

export function InventoryTab() {
    return <Container>
        <Grid columns={3}>
            <Grid.Col xs={3} sm={1}>
                <Stack style={{height: '90vh'}}>
                    <Button color={"green"} variant={"outline"} fullWidth leftIcon={<Upload size={20}/>}>
                        Open inventory file
                    </Button>

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