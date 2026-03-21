export default {
  providers: [
    {
      id: "password",
      type: "credentials",
      name: "Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
    },
  ],
};