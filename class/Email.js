class Email {
  constructor({ recipient, subject, body }) {
    this.recipient = recipient;
    this.subject = subject;
    this.body = body;
  }
  static async sendEmail(data) {
    try {
      const newEmail = new Email(data);
      const message =
        "To:" +
        newEmail.recipient +
        "\r\n" +
        "Subject:" +
        newEmail.subject +
        "\r\n" +
        "Content-Type: text/html; charset=utf-8\r\n\r\n" +
        newEmail.body;
      const encodedMessage = btoa(message);
      let response = await gapi.client.gmail.users.messages.send({
        userId: "me",
        resource: {
          raw: encodedMessage,
        },
      });
      return response
    } catch (error) {
      console.error(error);
    }
  }
}

