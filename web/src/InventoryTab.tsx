import {Button, Container, Grid, ScrollArea} from "@mantine/core";
import React from "react";
import {Upload} from "tabler-icons-react";

export function InventoryTab() {
    return <Container>
        <Grid columns={3}>
            <Grid.Col xs={3} sm={1}>
                <Button color={"green"} variant={"outline"} fullWidth leftIcon={<Upload size={20}/>}>
                    Open inventory file
                </Button>
                <ScrollArea offsetScrollbars>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ut quam quis nisl viverra fermentum nec vel orci. Proin luctus purus eget felis facilisis laoreet. Nulla libero mauris, molestie eu ante et, elementum gravida enim. Pellentesque a ipsum nibh. Nam id blandit diam, ut lacinia odio. Praesent vel eros posuere, molestie tellus et, consectetur orci. In fringilla pellentesque ullamcorper. Cras pharetra molestie erat sit amet lacinia. Etiam ac velit suscipit, tempor nisi sed, volutpat orci. Nulla gravida congue tellus vel mattis. Donec hendrerit a massa sed imperdiet. Aenean pellentesque, justo eget dictum imperdiet, turpis dui ornare felis, sed ullamcorper justo sem et orci. Aenean ex mauris, eleifend vitae vestibulum vitae, pharetra aliquet eros. Quisque purus erat, feugiat vel magna id, molestie mattis eros. Suspendisse mi velit, consequat id sem sed, ullamcorper vestibulum odio.

                    Etiam felis ipsum, dignissim eget blandit vel, cursus sed dolor. Fusce finibus fermentum elit, non tincidunt dolor interdum in. Nulla at orci id justo rhoncus laoreet. Nunc a nibh sollicitudin, molestie odio vitae, consequat arcu. Interdum et malesuada fames ac ante ipsum primis in faucibus. Pellentesque posuere suscipit odio, sodales auctor nulla condimentum quis. Duis aliquam id metus id congue. Morbi in sollicitudin libero.

                    Quisque eu porttitor enim. Vestibulum vel neque efficitur, lacinia augue sit amet, feugiat mi. Fusce maximus fermentum metus, non finibus arcu vulputate eu. Pellentesque at justo eu elit egestas consectetur. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vitae accumsan libero. Nulla finibus, lacus vel mollis tristique, orci dolor lacinia mauris, vitae ultricies odio est et turpis.

                    Cras commodo molestie diam et ullamcorper. Ut ut dui sem. Suspendisse nec velit id sem ullamcorper egestas et sit amet erat. Donec pellentesque et libero ut ultrices. Vestibulum rutrum gravida urna id tincidunt. Nulla placerat accumsan fermentum. Integer molestie risus non leo imperdiet, nec volutpat ante fringilla. Aenean lacinia augue nec auctor commodo.

                    Aenean faucibus urna in arcu mollis, sit amet euismod ante malesuada. Cras non finibus purus, non pulvinar risus. Vestibulum malesuada massa id accumsan egestas. Aliquam fringilla nibh leo, eu semper nisi dictum vel. Praesent non malesuada libero. Fusce a justo laoreet justo porttitor viverra. Sed ultricies vulputate nisi. Nulla eu nunc congue, auctor nunc ac, aliquet mauris. Nullam at est at tellus tempor sollicitudin. Proin tristique ligula quis faucibus imperdiet. Sed vehicula tortor turpis, quis congue orci interdum eget. Duis eu tempus sem. In id dui sed neque laoreet semper nec eget sapien. Nullam sed nunc sem.

                    Interdum et malesuada fames ac ante ipsum primis in faucibus. Morbi commodo ipsum in molestie euismod. Etiam pulvinar maximus commodo. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Ut egestas metus at massa malesuada lacinia. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse risus est, tincidunt nec aliquam sit amet, tincidunt non turpis. Sed aliquet, nibh ut tempus sollicitudin, erat lectus faucibus tortor, eget sagittis urna quam varius eros. Phasellus sodales sapien sed ligula feugiat finibus. Praesent iaculis viverra felis non placerat.

                    Nunc et tincidunt diam. Curabitur imperdiet arcu id nisl facilisis aliquet. Nunc vehicula mauris in lorem commodo, id ullamcorper ligula commodo. Vivamus feugiat semper felis sed maximus. Integer venenatis scelerisque lectus vitae ultrices. Sed a pharetra orci. In vehicula felis ut elit imperdiet egestas. Curabitur vel commodo leo. Curabitur eget semper purus, a imperdiet enim. In hac habitasse platea dictumst. Integer vitae hendrerit arcu.

                    Proin ornare turpis et augue rutrum, eget tincidunt sapien varius. Sed in urna non quam interdum sagittis at sed tellus. Phasellus cursus enim risus, eu auctor velit mollis quis. Sed viverra semper magna, vel rutrum ante condimentum et. Vivamus a dolor eget elit porta malesuada. Integer quis tempor neque. Aenean imperdiet, elit eu rhoncus dignissim, sem odio iaculis metus, eget lacinia erat purus ut nunc. Phasellus luctus, felis at condimentum venenatis, nulla eros varius tellus, pellentesque semper lorem nulla ac lacus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Curabitur viverra maximus neque non fringilla. Praesent at justo porta, ultrices nibh placerat, feugiat mauris.

                    Nullam et nunc eget ligula semper maximus vel eget nunc. Pellentesque molestie ut turpis id tincidunt. Nulla quam nibh, iaculis sed dui vel, sagittis bibendum dui. Donec imperdiet blandit sapien in suscipit. Morbi quis est ex. Nunc elementum, massa eu posuere ullamcorper, lacus nisi efficitur elit, vitae consequat lectus nibh et enim. Morbi sed libero sit amet mi interdum malesuada. Aliquam vulputate accumsan suscipit. Pellentesque ipsum magna, varius eget ornare ac, vulputate vitae quam. Donec sit amet massa vel arcu ullamcorper volutpat.

                    Phasellus pulvinar est rhoncus, sagittis massa a, sodales eros. Nunc interdum, felis vitae aliquet tristique, enim turpis volutpat dolor, sed cursus magna lectus nec justo. Integer fermentum suscipit luctus. Sed tempus ornare tortor at suscipit. Suspendisse elementum felis ut pulvinar condimentum. Maecenas vel lacus sed purus fermentum viverra vitae at tellus. Aliquam sagittis at lorem ac sodales. Nunc ante magna, faucibus sit amet est vel, commodo vehicula massa. Nunc dignissim lectus sed augue malesuada, at tincidunt augue venenatis. Nunc nec lacus urna. Phasellus sollicitudin augue tellus, id rutrum sapien mattis sed. In arcu ex, scelerisque eu venenatis sit amet, tempus vitae ante. Donec sed purus sapien. Aenean pharetra, purus sit amet iaculis tincidunt, velit ex eleifend est, et suscipit quam velit sit amet dui.
                </ScrollArea>
            </Grid.Col>

            <Grid.Col xs={3} sm={2}>
                Inventory
            </Grid.Col>
        </Grid>
    </Container>;
}