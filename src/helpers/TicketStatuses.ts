export enum TicketStatus {
  SuccessLock = 'Ticket locked successfully.',
  SuccessUnlock = 'Ticket unlocked successfully.',
  AlreadyLocked = 'Ticket has already been locked.',
  AlreadyLockedAnotherOwner = 'The ticket has already been blocked by another owner.',
  NotLocked = 'The ticket is not blocked.',
  ServerError = 'Error during lock operation. Try again.',
}