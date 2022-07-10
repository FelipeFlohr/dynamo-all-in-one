export default class DynamoBinary {
  private readonly _valueNonEncrypted: string
  private readonly _valueEncrypted: string

  public constructor (value: string) {
    this._valueNonEncrypted = value
    this._valueEncrypted = atob(value)
  }

  get value () {
    return this._valueEncrypted
  }

  public static encryptValue (val: string) {
    return atob(val)
  }

  public static decryptValue (val: string) {
    return btoa(val)
  }
}
