import * as Yup from "yup";

export const validationSchema = Yup.object({
  title: Yup.string().required("Required!"),
  location: Yup.string().required("Required!"),
});
