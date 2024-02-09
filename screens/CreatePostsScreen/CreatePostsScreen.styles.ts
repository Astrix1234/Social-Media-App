import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  postContainer: {
    paddingRight: 16,
    paddingLeft: 16,
    marginTop: 32,
  },
  imageContainer: {
    width: "100%",
    height: 249,
    backgroundColor: "#BDBDBD",
    borderRadius: 8,
    marginBottom: 8,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    width: 60,
    height: 60,
    borderRadius: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#rgba(255, 255, 255, 0.3)",
  },
  editPhoto: {
    fontFamily: "Roboto-Regular",
    color: "#BDBDBD",
    fontSize: 16,
  },
  inputsContainer: {
    paddingRight: 16,
    paddingLeft: 16,
    marginTop: 32,
  },
  input: {
    marginBottom: 16,
    width: "100%",
    paddingVertical: 10,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#BDBDBD",
    backgroundColor: "transparent",
    color: "#212121",
    fontFamily: "Roboto-Medium",
    fontSize: 16,
  },

  error: {
    borderColor: "red",
  },
  focused: {
    borderColor: "blue",
  },
  inputContainer: {
    position: "relative",
  },
  errorText: {
    position: "absolute",
    right: 0,
    top: 50,
    color: "red",
    fontSize: 12,
  },
  btnLocation: {
    position: "absolute",
    left: 0,
    top: 12,
  },
  btn: {
    marginTop: 27,
    width: "100%",
    padding: 16,
    backgroundColor: "#FF6C00",
    borderRadius: 100,
    alignItems: "center",
    marginBottom: 16,
  },
  disabledBtn: {
    backgroundColor: "#BDBDBD",
  },
  btnText: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    color: "#FFF",
  },
  btnContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
});
