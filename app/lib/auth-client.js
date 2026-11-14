// UI-only placeholders. The Node backend isn't connected yet; when it is,
// these two functions are the only place the forms need to change.

export class NotConnectedError extends Error {
  constructor() {
    super("The backend isn't connected yet.");
    this.name = "NotConnectedError";
  }
}

export async function signIn({ email, password }) {
  void email;
  void password;
  throw new NotConnectedError();
}

export async function signUp({ name, email, password }) {
  void name;
  void email;
  void password;
  throw new NotConnectedError();
}
