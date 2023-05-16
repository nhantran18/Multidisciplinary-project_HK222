import { Pressable, Text, TextInput, View } from "react-native";
import tw from "twrnc";

export default function SignIn() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#00a2fe",
      }}
    >
      <View
        style={tw`flex bg-white w-4/12 h-2/6 border-transparent rounded-2xl m-0 justify-center`}
      >
        <Text style={tw`font-bold text-2xl p-4 text-left`}>Sign In</Text>
        <View style={tw`items-center`}>
          <TextInput
            placeholder="Username"
            style={tw`border-2 w-40 h-auto rounded-xl border-transparent bg-[#d9d9d9]`}
          />
          <TextInput
            placeholder="Password"
            secureTextEntry={true}
            style={tw`border-2 w-40 h-auto rounded-xl border-transparent bg-[#d9d9d9]`}
          />
        </View>
        <Pressable
          style={tw`items-center text-center bg-[#00a2fe] rounded-xl h-8 w-2/12`}
        >
          <Text style={tw`text-white text-center items-center`}>Login</Text>
        </Pressable>
      </View>
    </View>
  );
}
