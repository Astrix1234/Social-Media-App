import * as Yup from "yup";

export const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email format").required("Required!"),
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\^\$*.\[\]{}\(\)?\-\"!@#%&\/,><\':;|_~`])\S{8,}$/,
      "Min. 8 chars, incl. uppercase, number & symbol"
    )
    .required("Required!"),
});
