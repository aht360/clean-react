export class UnexpectedError extends Error {
  constructor () {
    super('Something wrong occurred. Please try again later.')
    this.name = 'UnexpectedError'
  }
}
