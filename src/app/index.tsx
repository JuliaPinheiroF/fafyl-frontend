import Background from "@/components/layout/background"
import { Text, View } from "react-native"

export default function Index() {
    return (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
            <Background showUserIcon title="FAFYL">
                <Text>
                    Content
                </Text>
            </Background>
    </View>
    )
}