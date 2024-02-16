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
    marginBottom: 32,
    alignItems: "center",
  },
  containerImage: {
    width: 60,
    height: 60,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#BDBDBD",
    marginRight: 8,
  },
  profilePicture: {
    width: 60,
    height: 60,
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
  noPosts: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    letterSpacing: 0.3,
    textAlign: "center",
    color: "#212121",
  },
  createdPost: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  userPost: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
  },
  imageProfileContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#BDBDBD",
    overflow: "hidden",
  },
  imageProfile: {
    width: "100%",
    height: "100%",
  },
  userLogin: {
    fontFamily: "Roboto-Regular",
    color: "#212121",
    fontSize: 16,
    marginLeft: 8,
  },
  createdAt: {
    fontFamily: "Roboto-Regular",
    color: "#212121",
  },
  imageContainer: {
    width: "100%",
    height: 249,
    backgroundColor: "gray",
    borderRadius: 8,
    marginBottom: 8,
    overflow: "hidden",
  },
  postPhoto: {
    width: "100%",
    height: "100%",
  },
  postTitle: {
    fontFamily: "Roboto-Medium",
    color: "#212121",
    fontSize: 18,
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
    textDecorationLine: "underline",
  },
});
