import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StatusBar,
  FlatList,
  Image,
  Animated,
  Text,
  View,
  Dimensions,
  StyleSheet,
  SafeAreaView,
} from "react-native";
const { width, height } = Dimensions.get("screen");

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const SPACING = 20;
const AVATAR_SIZE = 70;
const ITEM_SIZE = AVATAR_SIZE + SPACING * 3;

export default () => {
  const [JSON_DATA, setJSON_DATA] = useState("");

  const [showIndicator, setShowIndicator] = useState(true);

  useEffect(() => {
    async function fetchData() {
      fetch("https://shegerdha.ir/u/personnel.php")
        .then((response) => response.json())
        .then((responseJson) => {
          setJSON_DATA(responseJson);
          setShowIndicator(false);
        })
        .catch((error) => {
          console.error(error);
        });
    }
    fetchData();
  }, []);

  const scrollY = React.useRef(new Animated.Value(0)).current;
  return (
    <SafeAreaView style={styleSheet.MainContainer}>
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <StatusBar hidden />
        <View
          style={{
            borderBottomWidth: 1,
            padding: 25,
            borderBottomColor: "#rgba(0, 0, 0, 0.2)",
          }}
        >
          <Text style={{ fontSize: 24, color: "orange", fontWeight: "bold" }}>
            پرسنل شرکت
          </Text>
        </View>
        <ActivityIndicator
          size="large"
          color="red"
          animating={showIndicator}
          style={styleSheet.activityIndicator}
        />
        <AnimatedFlatList
          data={JSON_DATA}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          keyExtnacton={(item) => item.id}
          contentContainerStyle={{
            padding: SPACING,
            marginTop: StatusBar.currentHeight || 42,
          }}
          renderItem={({ item, index }) => {
            const inputRange = [
              -1,
              0,
              ITEM_SIZE * index,
              ITEM_SIZE * (index + 2),
            ];
            const opacityInputRange = [
              -1,
              0,
              ITEM_SIZE * index,
              ITEM_SIZE * (index + 1),
            ];
            const scale = scrollY.interpolate({
              inputRange,
              outputRange: [1, 1, 1, 0],
            });
            const opacity = scrollY.interpolate({
              inputRange: opacityInputRange,
              outputRange: [1, 1, 1, 0],
            });
            return (
              <Animated.View
                style={{
                  direction: "rtl",
                  display: "flex",
                  flexDirection: "row-reverse",
                  justifyContent: "space-between",
                  padding: SPACING,
                  marginBottom: SPACING,
                  backgroundColor: "#f2f2cc",
                  borderRadius: 12,
                  shadowColor: "#000000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.3,
                  shadowRadius: 5,
                  opacity,
                  transform: [{ scale }],
                }}
              >
                <Image
                  source={{ uri: item.image }}
                  style={{
                    width: AVATAR_SIZE,
                    height: AVATAR_SIZE,
                    borderRadius: AVATAR_SIZE / 2,
                    marginRight: SPACING / 2,
                  }}
                />

                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignContent: "flex-start",
                  }}
                >
                  <Text style={{ fontSize: 20, fontWeight: "700" }}>
                    {item.fullName}
                  </Text>
                  <Text
                    style={{ fontSize: 16, opacity: 0.8, color: "#197cab" }}
                  >
                    {item.role}
                  </Text>
                  <Text
                    style={{ fontSize: 14, opacity: 0.8, color: "#0099cc" }}
                  >
                    {item.email}
                  </Text>
                </View>
              </Animated.View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styleSheet = StyleSheet.create({
  MainContainer: {
    flex: 1,
  },

  listItem: {
    paddingLeft: 12,
    paddingTop: 10,
    paddingBottom: 10,
  },

  itemText: {
    fontSize: 24,
    color: "black",
  },

  activityIndicator: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});
