import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  containerProfile: {
    display: "flex",
    flexDirection: "row",
    marginTop: 32,
    alignItems: "center",
  },
  containerImage: {
    width: 60,
    height: 60,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "gray",
    marginRight: 8,
  },
  login: {
    fontFamily: "Roboto-Bold",
    color: "#212121",
    fontSize: 13,
  },
  email: {
    fontFamily: "Roboto-Regular",
    color: "#rgba(33, 33, 33, 0.80)",
    fontSize: 11,
  },
});
