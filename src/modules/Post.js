export default class Post {
  constructor(title, picture) {
    this.title = title;
    this.date = new Date();
    this.picture = picture;
  }

  toString() {
    return JSON.stringify({
      title: this.title,
      date: this.date.toJSON(),
      picture: this.picture,
    }, null, 2);
  }
}
