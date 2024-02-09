import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    marginTop: 147,
    position: "relative",
  },
  photoContainer: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 16,
    backgroundColor: "#F6F6F6",
    overflow: "hidden",
    left: "50%",
    transform: [{ translateX: -60 }],
    top: -60,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontFamily: "Roboto-Medium",
    fontSize: 30,
    letterSpacing: 0.3,
    textAlign: "center",
    marginTop: 92,
    marginBottom: 33,
    color: "#212121",
  },
  postContainer: {
    paddingRight: 16,
    paddingLeft: 16,
  },
  imageContainer: {
    width: "100%",
    height: 249,
    backgroundColor: "gray",
    borderRadius: 8,
    marginBottom: 8,
  },
  postTitle: {
    fontFamily: "Roboto-Medium",
    color: "#212121",
    fontSize: 16,
  },
  linksContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 35,
    marginTop: 10,
  },
  comLikiesContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  comContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  likesContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 24,
  },
  locationContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  counter: {
    marginLeft: 6,
    fontFamily: "Roboto-Regular",
    color: "#212121",
    fontSize: 16,
  },
  place: {
    marginLeft: 6,
    fontFamily: "Roboto-Regular",
    color: "#212121",
    fontSize: 16,
  },
});
