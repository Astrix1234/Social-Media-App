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
    marginTop: 279,
  },
  title: {
    fontFamily: "Roboto-Medium",
    fontSize: 30,
    fontWeight: "500",
    letterSpacing: 0.3,
    textAlign: "center",
    marginTop: 32,
    marginBottom: 33,
  },
  input: {
    marginBottom: 16,
    marginLeft: 16,
    marginRight: 16,
    backgroundColor: "#F6F6F6",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    color: "#212121",
    fontFamily: "Roboto-Regular",
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
    right: 16,
    top: -16,
    color: "red",
    fontSize: 12,
  },
  btnShowPassword: {
    position: "absolute",
    right: 32,
    top: 12,
  },
  btnTextShowPassword: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    color: "#1B4371",
  },
  btn: {
    marginTop: 27,
    width: 343,
    padding: 16,
    backgroundColor: "#FF6C00",
    borderRadius: 100,
    alignItems: "center",
    marginBottom: 16,
  },
  disabledBtn: {
    backgroundColor: "rgba(255, 108, 0, 0.5)",
  },
  btnText: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    color: "#FFF",
  },
  btnContainer: {
    alignItems: "center",
  },
  btnRegisterContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  btnRegisterText: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    color: "#1B4371",
  },
});
