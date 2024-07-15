import { DateTime } from 'luxon'

export default class Person {
  public static table: string = 'locks_log'
  
  private id?: number
  private subject?: string
  private subjects?: object
  private owner: string
  private method: string
  private created_at?: DateTime
  private updated_at?: DateTime
  
  constructor(subjects: string[] | string, owner: string, method: string) {
    if (typeof(subjects) === 'string') {
      this.subject = subjects
    } else {
      this.subjects = subjects
    }
    this.owner = owner
    this.method = method
  }
}
