import {Badge, Button, Container, Grid, Group, ScrollArea, SimpleGrid, Stack, Text} from "@mantine/core";
import React from "react";
import {Dropzone, DropzoneStatus} from "@mantine/dropzone";
import {Upload} from "tabler-icons-react";

export function StateTab() {
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
                        onDrop={files => console.log("Dropped: " + files[0].name)}
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
                            {/*{getMachines()}*/}
                        </Stack>
                    </ScrollArea>
                </Stack>
            </Grid.Col>

            <Grid.Col xs={3} sm={2}>
                {/*{showInfo(current)}*/}
            </Grid.Col>

            <Grid.Col xs={3} sm={3}>
                <Badge variant={"gradient"} gradient={{ from: 'teal', to: 'blue' }} fullWidth>
                    Ready to deploy
                </Badge>
            </Grid.Col>
        </Grid>
    </Container>;
}